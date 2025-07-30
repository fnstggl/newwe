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
      setShowSignupModal(true);
      return;
    }

    if (userProfile?.subscription_plan === 'open_door_plan') {
      navigate('/');
      return;
    }

    setIsLoading(true);

    try {
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
    <div className="min-h-screen bg-gray-900 text-white font-inter">
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Small editorial badge */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <span className="text-xs font-mono text-amber-400 tracking-widest uppercase">Open Door Plan</span>
          </div>
        </div>

        {/* Main headline - editorial style */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Free access to Realer Estate.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 font-serif italic">
            NYC's backdoor to hidden rent-stabilized deals
          </p>
        </div>

        {/* Renter quote section with public access badge */}
        <div className="relative mb-16">
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 max-w-3xl mx-auto">
            {/* Public Access Badge */}
            <div className="absolute -top-3 right-6">
              <div className="px-3 py-1 bg-amber-500 text-black rounded-full text-xs font-medium">
                Public Access via Open Door Plan
              </div>
            </div>
            
            <blockquote className="text-lg md:text-xl text-gray-200 italic leading-relaxed mb-4">
              "I was about to sign a lease in Dumbo for $4,200. Found a stabilized one here for $2,550. Same block. No broker fee. Insane."
            </blockquote>
            <cite className="text-gray-400 not-italic">— Sasha, Brooklyn renter</cite>
          </div>
        </div>

        {/* Product mockup with amber border treatment */}
        <div className="mb-16">
          <div className="relative mx-auto max-w-4xl">
            <div className="relative">
              {/* Subtle amber glow border */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-3xl blur-sm"></div>
              <div className="relative border-2 border-amber-500/30 rounded-3xl overflow-hidden">
                <img 
                  src="/lovable-uploads/1bb60a7c-e91d-4fd0-8100-f3eafb2af436.png" 
                  alt="Realer Estate property listings interface"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mission statement */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Built for those who need it most.
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            We made this plan so you don't get priced out before you even get a shot. 💛
          </p>
        </div>

        {/* Main CTA */}
        <div className="text-center mb-16">
          <button
            onClick={handleUnlockAccess}
            disabled={isLoading || isProcessing}
            className="group relative inline-flex items-center justify-center px-12 py-6 text-xl font-semibold bg-white text-black rounded-full transition-all duration-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              boxShadow: '0 0 0 2px transparent, 0 0 20px rgba(245, 158, 11, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.4), 0 0 30px rgba(245, 158, 11, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 2px transparent, 0 0 20px rgba(245, 158, 11, 0.3)';
            }}
          >
            <span className="relative z-10">
              {getButtonText()}
            </span>
          </button>
        </div>

        {/* Description box */}
        <div className="text-center mb-16">
          <div className="max-w-2xl mx-auto p-8 bg-gray-800/30 border border-gray-700 rounded-2xl">
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Realer Estate is usually $3/month to help us stay independent—but we created Open Door Plan to make sure that all New Yorkers have access to affordable homes.
            </p>
            
            <p className="text-white text-lg font-medium">
              No credit card. No catch. Just a better way to find a home.
            </p>
          </div>
        </div>

        {/* Footer contact info */}
        <div className="text-center mb-16">
          <div className="w-full h-px bg-gray-700 mb-12"></div>
          
          <p className="text-gray-400 text-base mb-8">
            Are you a journalist, housing org, or public partner?{" "}
            <a 
              href="mailto:info@realerestate.org"
              className="text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-4"
            >
              Click here to offer the Open Door Plan to your audience.
            </a>
          </p>
        </div>

        {/* Final footer with gradient line */}
        <div className="text-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
            You found the free way in.
          </h3>
          <div className="w-full h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-blue-400 rounded-full"></div>
        </div>
      </div>

      {/* Signup Modal - unchanged functionality */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-block px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4">
                  <span className="text-xs font-mono text-amber-400 tracking-widest uppercase">Open Door Access</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Create Your Free Account
                </h2>
                <p className="text-gray-300 text-base">
                  Get unlimited access to NYC's hidden rent-stabilized deals
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-6 mb-6">
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={isGoogleLoading}
                  className="w-full py-4 px-4 bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 rounded-full text-lg font-medium transition-all flex items-center justify-center space-x-3"
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
                  <span className="text-gray-400 text-sm">or</span>
                  <div className="flex-1 h-px bg-gray-600"></div>
                </div>

                <div>
                  <input
                    type="text"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    required
                    placeholder="Full Name"
                    className="w-full px-4 py-4 bg-gray-800 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-lg"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    required
                    placeholder="Email Address"
                    className="w-full px-4 py-4 bg-gray-800 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-lg"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    required
                    placeholder="Password"
                    className="w-full px-4 py-4 pr-12 bg-gray-800 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 text-lg font-semibold bg-white text-black hover:bg-gray-100 rounded-full transition-colors"
                >
                  {isProcessing ? "Creating Account..." : "Unlock Free Access"}
                </button>
              </form>

              <div className="flex justify-center">
                <button
                  onClick={() => setShowSignupModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
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
