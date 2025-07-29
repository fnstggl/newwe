
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import OnboardingPopup from "../components/OnboardingPopup";

const OpenDoor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user, userProfile, signUp, updateOnboardingStatus } = useAuth();
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
      // If not signed in, show signup form specifically for open door plan
      setShowOnboarding(true);
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

  const handleOpenDoorSignup = async (email: string, password: string, name: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name
          }
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Wait a moment for the user to be created, then update their plan
      setTimeout(async () => {
        const { data: { user: newUser } } = await supabase.auth.getUser();
        if (newUser) {
          await supabase
            .from('profiles')
            .update({ subscription_plan: 'open_door_plan' })
            .eq('id', newUser.id);

          toast({
            title: "Welcome to the Open Door Plan!",
            description: "Your free unlimited access has been activated.",
          });
          
          await updateOnboardingStatus(true);
          navigate('/');
        }
      }, 2000);

    } catch (error) {
      console.error("Open Door signup error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    navigate('/join');
  };

  const getButtonText = () => {
    if (!user) return "Unlock Free Access";
    if (userProfile?.subscription_plan === 'open_door_plan') return "Access Your Listings";
    return "Unlock Free Access";
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="relative text-center mb-12">
          {/* Soft glow behind heading */}
          <div className="absolute inset-0 -top-32 -bottom-32 left-1/2 transform -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-r from-amber-400/20 via-rose-400/15 to-blue-400/20 blur-[120px] rounded-full pointer-events-none"></div>

          <h1 className="relative text-5xl md:text-7xl font-bold mb-6 tracking-tighter z-10 animate-fade-in">
            Free access to Realer Estate.
          </h1>

          <p className="relative text-2xl md:text-3xl text-gray-300 mb-16 tracking-tight z-10">
            NYC's backdoor to hidden rent-stabilized deals
          </p>

          {/* Product Mockup */}
          <div className="relative mx-auto mb-16 max-w-5xl">
            <div className="relative rounded-3xl overflow-hidden border border-amber-400/30 shadow-2xl">
              <img 
                src="/lovable-uploads/4ca9f351-40a3-41f4-8f39-859aa3204f5d.png" 
                alt="Realer Estate App Interface"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/20 via-rose-400/20 to-blue-400/20 blur-xl -z-10"></div>
          </div>

          <h2 className="relative text-3xl md:text-4xl font-bold mb-12 tracking-tight z-10">
            Built for those who need it most.
          </h2>

          {/* Testimonial */}
          <div className="mb-16 flex justify-center">
            <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl px-6 py-5 max-w-xl shadow-xl">
              <p className="text-gray-100 text-sm md:text-base leading-snug tracking-tight">
                "I was about to sign a lease in Dumbo for $4,200. Found a stabilized one here for $2,550. Same block. No broker fee. Insane."
              </p>
              <p className="mt-3 text-sm text-gray-400 font-medium">– Sasha, Brooklyn renter</p>
            </div>
          </div>
        </div>

        {/* Open Door Description */}
        <div className="text-center mb-16">
          <div className="mx-auto text-lg text-gray-300 leading-relaxed px-4 md:px-6 lg:px-8 xl:px-12 max-w-4xl space-y-6">
            <p className="text-xl text-white font-medium tracking-tight">
              💛 We launched the Open Door Plan to ensure everyone has free access to more affordable homes.
            </p>

            <p className="text-lg text-gray-300">
              If you found this page through a journalist, housing org, or public partner, you can unlock unlimited access for free below.
            </p>
          </div>
        </div>

        {/* Main CTA */}
        <div className="text-center mb-16">
          <button
            onClick={handleUnlockAccess}
            disabled={isLoading}
            className="group relative inline-flex items-center justify-center px-12 py-6 text-xl font-semibold bg-white text-black rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
            style={{
              background: 'linear-gradient(135deg, #cd7f32 0%, #ffffff 50%, #87ceeb 100%)',
              boxShadow: '0 0 30px rgba(205, 127, 50, 0.4), 0 0 60px rgba(255, 255, 255, 0.2), 0 0 90px rgba(135, 206, 235, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 50px rgba(205, 127, 50, 0.6), 0 0 100px rgba(255, 255, 255, 0.4), 0 0 150px rgba(135, 206, 235, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(205, 127, 50, 0.4), 0 0 60px rgba(255, 255, 255, 0.2), 0 0 90px rgba(135, 206, 235, 0.3)';
            }}
          >
            <span className="relative z-10 text-black font-bold">
              {isLoading ? "Activating..." : getButtonText()}
            </span>
          </button>
        </div>

        {/* Description */}
        <div className="text-center mb-16">
          <div 
            className="max-w-2xl mx-auto p-8 rounded-2xl border border-white/10"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(10px)',
              boxShadow: 'inset 0 0 1px rgba(255,255,255,0.06)',
            }}
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Realer Estate is usually $3/month to help us stay independent—but we created Open Door Plan to make sure that all New Yorkers have access to affordable homes.
            </p>
            
            <p className="text-white text-lg font-medium">
              No credit card. No time limit. Just a better way to find hidden deals in NYC so you don't get squeezed. 💛
            </p>
          </div>
        </div>

        {/* Partner CTA */}
        <div className="text-center mb-16">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-12"></div>
          
          <p className="text-gray-400 text-base mb-4">
            Are you a journalist, housing org, or public partner?{" "}
            <a 
              href="mailto:info@realerestate.org"
              className="text-white hover:text-gray-300 transition-colors underline underline-offset-4"
            >
              Click here to offer the Open Door Plan to your audience.
            </a>
          </p>
        </div>

        {/* Final Footer */}
        <div className="text-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">
            You found the free way in.
          </h3>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-400/50 via-rose-400/50 via-blue-400/50 to-transparent"></div>
        </div>
      </div>

      <OpenboardingPopup
        isOpen={showOnboarding}
        isOpenDoorSignup={true}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
        onOpenDoorSignup={handleOpenDoorSignup}
      />
    </div>
  );
};

export default OpenDoor;
