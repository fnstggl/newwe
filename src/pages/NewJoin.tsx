
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { HoverButton } from "../components/ui/hover-button";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PreSignupOnboarding from "../components/PreSignupOnboarding";
import OnboardingPopup from "../components/OnboardingPopup";

const NewJoin = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showPostSignupOnboarding, setShowPostSignupOnboarding] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signUp, signInWithGoogle, signIn, user, updateOnboardingStatus } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Join Realer Estate - Get Your Unfair Advantage in NYC Real Estate";
  }, []);

  const handleOnboardingComplete = (data: any) => {
    setOnboardingData(data);
    setShowOnboarding(false);
    setShowAuth(true);
  };

  const saveOnboardingData = async (userId: string, data: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          search_duration: data.searchDuration,
          frustrations: data.frustrations,
          searching_for: data.searchingFor,
          property_type: data.propertyType,
          bedrooms: data.bedrooms,
          max_budget: data.maxBudget,
          preferred_neighborhoods: data.preferredNeighborhoods,
          must_haves: data.mustHaves,
          discount_threshold: data.discountThreshold,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error saving onboarding data:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
      toast({
        title: "Warning",
        description: "Your preferences couldn't be saved, but your account was created successfully.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === 'signup') {
        const { error, needsOnboarding } = await signUp(email, password, name);
        
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome!",
            description: "Your account has been created successfully.",
          });
          
          // Save onboarding data immediately after signup
          if (onboardingData && user?.id) {
            await saveOnboardingData(user.id, onboardingData);
          }
          
          if (needsOnboarding) {
            setShowPostSignupOnboarding(true);
          } else {
            navigate('/foryou');
          }
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          navigate('/foryou');
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
      // Google auth will handle redirect through auth state change
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePostSignupOnboardingComplete = async (data: any) => {
    console.log('Post-signup onboarding data:', data);
    await updateOnboardingStatus(true);
    setShowPostSignupOnboarding(false);
    navigate('/foryou');
  };

  if (showOnboarding) {
    return (
      <PreSignupOnboarding
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onClose={() => navigate('/')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
      {showAuth && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl max-w-md w-full p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">
                {authMode === 'signup' ? 'Create your account' : 'Welcome back'}
              </h1>
              <p className="text-gray-400 text-lg">
                {authMode === 'signup' 
                  ? 'Sign up to unlock your personalized listings'
                  : 'Sign in to see your For You page'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full py-4 px-4 bg-white text-black hover:bg-gray-100 rounded-full text-lg font-semibold transition-all flex items-center justify-center space-x-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>{isGoogleLoading ? "Signing in..." : `Continue with Google`}</span>
              </button>

              <div className="flex items-center space-x-4">
                <div className="flex-1 h-px bg-gray-700"></div>
                <span className="text-gray-400 text-sm">or</span>
                <div className="flex-1 h-px bg-gray-700"></div>
              </div>

              {authMode === 'signup' && (
                <div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Full Name"
                    className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-700 rounded-full text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-lg"
                  />
                </div>
              )}

              <div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email Address"
                  className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-700 rounded-full text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-lg"
                />
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                    className="w-full px-4 py-4 pr-12 bg-gray-800 border-2 border-gray-700 rounded-full text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <HoverButton
                type="submit"
                disabled={isLoading}
                className="w-full py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading 
                  ? (authMode === 'signup' ? "Creating Account..." : "Signing In...")
                  : (authMode === 'signup' ? "Create Account" : "Sign In")
                }
              </HoverButton>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {authMode === 'signup' 
                    ? "Already have an account? Sign in"
                    : "Need an account? Sign up"
                  }
                </button>
              </div>
            </form>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => {
                  setShowAuth(false);
                  navigate('/');
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <OnboardingPopup
        isOpen={showPostSignupOnboarding}
        onClose={() => {
          setShowPostSignupOnboarding(false);
          navigate('/foryou');
        }}
        onComplete={handlePostSignupOnboardingComplete}
      />
    </div>
  );
};

export default NewJoin;
