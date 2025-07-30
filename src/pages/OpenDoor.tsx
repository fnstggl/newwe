import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import OpenDoorOnboarding from "../components/OpenDoorOnboarding";
import { Eye, EyeOff } from "lucide-react";

const OpenDoor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { user, userProfile, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Update meta tags to prevent indexing
    document.title = "Open Door Plan - Realer Estate";
    
    // Add noindex meta tag
    const metaRobots = document.querySelector('meta[name="robots"]');
    if (metaRobots) {
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex, nofollow';
      document.head.appendChild(meta);
    }

    // Clean up on unmount
    return () => {
      const metaRobots = document.querySelector('meta[name="robots"]');
      if (metaRobots && metaRobots.getAttribute('content') === 'noindex, nofollow') {
        metaRobots.remove();
      }
    };
  }, []);

  const handleUnlockAccess = async () => {
    if (!user) {
      // Show signup modal for non-logged in users
      setShowSignupModal(true);
      return;
    }

    // If already on open_door_plan, redirect to home
    if (userProfile?.subscription_plan === 'open_door_plan') {
      navigate('/');
      return;
    }

    setIsLoading(true);

    try {
      // Update user's subscription plan to open_door_plan
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_plan: 'open_door_plan' })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to activate Open Door Plan. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome to the Open Door Plan!",
          description: "You now have unlimited access to all listings.",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const { error, needsOnboarding } = await signUp(signupForm.email, signupForm.password, signupForm.name);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Upgrade to open_door_plan after successful signup
        if (needsOnboarding) {
          setShowSignupModal(false);
          setShowOnboarding(true);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setShowSignupModal(false);
        // The auth context will handle the rest
      }
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

  const getButtonText = () => {
    if (isProcessing) return "Processing...";
    if (!user) return "Unlock Free Access";
    if (userProfile?.subscription_plan === 'open_door_plan') return "Access Your Listings";
    return "Unlock Free Access";
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="max-w-4xl mx-auto px-8 py-20">
        {/* Header Section with Testimonial */}
        <div className="mb-16">
          <div className="flex items-start gap-6 mb-16">
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src="/lovable-uploads/67b6325c-fc2a-49c2-a472-e0195346acdc.png"
                alt="Sasha, Brooklyn renter"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <blockquote className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-4 font-playfair italic">
                "I was about to sign a lease in Dumbo for $4,200. Found a stabilized one here for $2,550. Same block. No broker fee. Insane."
              </blockquote>
              <cite className="text-sm text-gray-400 not-italic">
                — Sasha, Brooklyn renter
              </cite>
            </div>
            <div className="border border-gray-600 px-4 py-2 text-xs uppercase tracking-wider text-gray-300 bg-gray-900">
              <div className="text-center">
                <div className="font-semibold">PUBLIC ACCESS</div>
                <div className="italic">Made Possible by</div>
                <div className="font-semibold">Open Door Plan</div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-700 mb-12"></div>

          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold mb-6 text-white">
              Free access to NYC's<br />hidden rent-stabilized deals
            </h1>
            <p className="text-xl text-gray-100 mb-4 font-inter font-bold uppercase tracking-wide">Realer Estate. For the community.</p>
          </div>
        </div>

        {/* Product Mockup */}
        <div className="mb-16 flex justify-center">
          <div className="w-full max-w-5xl">
            <img 
              src="/lovable-uploads/1233d786-e326-481e-a83c-4aa83f18f28e.png" 
              alt="Realer Estate property listings interface"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-8 text-white">
            Built for those who need it most.
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              We launched the Open Door Plan so every New Yorker—no matter their budget—can find affordable homes. 
            </p>
            
            <p className="text-lg text-gray-300 mb-12 leading-relaxed">
              If you found this page through a journalist, housing org, or public partner, you can unlock unlimited access for free below.
            </p>
          </div>
        </div>

        {/* Main CTA */}
        <div className="text-center mb-16">
          <button
            onClick={handleUnlockAccess}
            disabled={isLoading || isProcessing}
            className="inline-flex items-center justify-center px-12 py-4 text-lg font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {getButtonText()}
          </button>
        </div>

        {/* Description Box */}
        <div className="text-center mb-16">
          <div className="max-w-3xl mx-auto p-8 bg-gray-900 border border-gray-700 rounded-lg shadow-sm">
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Realer Estate is usually $3/month to help us stay independent—but we created Open Door Plan to make sure that all New Yorkers have access to affordable homes.
            </p>
            
            <p className="text-white text-lg font-medium">
              No credit cards. No fine print. Just a better way to find below-market homes in NYC.
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center mb-16">
          <div className="w-full h-px bg-gray-700 mb-12"></div>
          
          <p className="text-gray-400 text-base mb-8">
            Are you a journalist, housing org, or public partner?{" "}
            <a 
              href="mailto:info@realerestate.org"
              className="text-white hover:text-gray-300 transition-colors underline"
            >
              Click here to offer the Open Door Plan to your audience.
            </a>
          </p>
        </div>

        {/* Final Footer */}
        <div className="text-center">
          <h3 className="text-4xl md:text-5xl font-playfair font-bold mb-8 text-white">
            You found the free way in.
          </h3>
          <div className="w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-full"></div>
        </div>
      </div>

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-playfair font-bold text-white mb-4">
                  Access the Community Database
                </h2>
                <p className="text-gray-400 text-lg">
                  Create your free account to unlock hidden rent-stabilized deals
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-4 font-mono">
                  Open Door Protocol — Community Access
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-6 mb-6">
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={isGoogleLoading}
                  className="w-full py-3 px-4 bg-gray-800 border-2 border-gray-600 text-white hover:bg-gray-700 rounded-full text-base font-medium transition-all flex items-center justify-center space-x-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>{isGoogleLoading ? "Signing in..." : "Continue with Google"}</span>
                </button>

                <div className="flex items-center space-x-4">
                  <div className="flex-1 h-px bg-gray-600"></div>
                  <span className="text-gray-500 text-sm">or</span>
                  <div className="flex-1 h-px bg-gray-600"></div>
                </div>

                <div>
                  <input
                    type="text"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    required
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-600 rounded-full text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-base"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    required
                    placeholder="Email Address"
                    className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-600 rounded-full text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-base"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    required
                    placeholder="Password"
                    className="w-full px-4 py-3 pr-12 bg-gray-800 border-2 border-gray-600 rounded-full text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 text-base font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-full transition-colors"
                >
                  {isProcessing ? "Creating Account..." : "Unlock Free Access"}
                </button>
              </form>

              <div className="flex justify-center">
                <button
                  onClick={() => setShowSignupModal(false)}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Open Door Onboarding */}
      <OpenDoorOnboarding 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => {
          setShowOnboarding(false);
          navigate('/');
        }}
      />
    </div>
  );
};

export default OpenDoor;