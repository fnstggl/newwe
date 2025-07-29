
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import OpenDoorOnboarding from "../components/OpenDoorOnboarding";

const OpenDoor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, userProfile, signUp } = useAuth();
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
      // If not signed in, create a temporary signup flow for Open Door
      setIsProcessing(true);
      
      // For demo purposes, we'll simulate a signup that goes directly to open_door_plan
      // In a real implementation, you'd want to redirect to a signup page with a special parameter
      // or create a modal signup form here
      const email = prompt("Enter your email to get free access:");
      if (!email) {
        setIsProcessing(false);
        return;
      }
      
      const password = prompt("Create a password:");
      if (!password) {
        setIsProcessing(false);
        return;
      }
      
      try {
        const { error, needsOnboarding } = await signUp(email, password, "Open Door User");
        
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          // After successful signup, we need to update the user's plan to open_door_plan
          // This will be handled by the auth context, but we can also trigger the onboarding
          if (needsOnboarding) {
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

  const getButtonText = () => {
    if (isProcessing) return "Processing...";
    if (!user) return "Unlock Free Access";
    if (userProfile?.subscription_plan === 'open_door_plan') return "Access Your Listings";
    return "Unlock Free Access";
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header with fade-in animation */}
        <div className="relative text-center mb-16">
          {/* Soft background glow */}
          <div className="absolute inset-0 -top-32 -bottom-32 left-1/2 transform -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-amber-400/20 via-purple-400/10 to-transparent blur-[120px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter">
              Free access to Realer Estate.
            </h1>

            <p className="text-2xl md:text-3xl text-gray-300 mb-12 tracking-tight">
              NYC's backdoor to hidden rent-stabilized deals
            </p>
          </div>
        </div>

        {/* Product Mockup */}
        <div className="mb-16 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-purple-400/20 to-blue-400/20 blur-2xl rounded-3xl"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <img 
                src="/lovable-uploads/bb4c7d31-b631-48f0-8d0c-736acd4c9827.png" 
                alt="Realer Estate property listings"
                className="w-full h-auto max-w-4xl rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* Subheader */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">
            Built for those who need it most.
          </h2>
        </div>

        {/* Review Section */}
        <div className="mt-10 flex justify-center mb-16">
          <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl px-6 py-5 max-w-xl shadow-xl">
            <p className="text-gray-100 text-sm md:text-base leading-snug tracking-tight">
              "I was about to sign a lease in Dumbo for $4,200. Found a stabilized one here for $2,550. Same block. No broker fee. Insane."
            </p>
            <p className="mt-3 text-sm text-gray-400 font-medium">– Sasha, Brooklyn renter</p>
          </div>
        </div>

        {/* Description with heart emoji */}
        <div className="text-center mb-16">
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-lg text-white font-medium">
              💛 We launched the Open Door Plan to ensure everyone has free access to more affordable homes.
            </p>
            
            <p className="text-gray-300 text-lg leading-relaxed">
              If you found this page through a journalist, housing org, or public partner, you can unlock unlimited access for free below.
            </p>
          </div>
        </div>

        {/* Main CTA with enhanced styling */}
        <div className="text-center mb-16">
          <button
            onClick={handleUnlockAccess}
            disabled={isLoading || isProcessing}
            className="group relative inline-flex items-center justify-center px-12 py-6 text-xl font-semibold bg-white text-black rounded-full transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: '0 0 0 2px transparent, 0 0 30px rgba(205, 127, 50, 0.4), 0 0 60px rgba(147, 51, 234, 0.2), 0 0 90px rgba(59, 130, 246, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(205, 127, 50, 0.6), 0 0 50px rgba(205, 127, 50, 0.6), 0 0 80px rgba(147, 51, 234, 0.4), 0 0 120px rgba(59, 130, 246, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 2px transparent, 0 0 30px rgba(205, 127, 50, 0.4), 0 0 60px rgba(147, 51, 234, 0.2), 0 0 90px rgba(59, 130, 246, 0.1)';
            }}
          >
            <span className="relative z-10 animate-pulse">
              {getButtonText()}
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

        {/* Footer CTA */}
        <div className="text-center mb-16">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-12"></div>
          
          <p className="text-gray-400 text-base mb-8">
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
          <h3 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
            You found the free way in.
          </h3>
          <div className="w-full h-1 bg-gradient-to-r from-amber-400 via-purple-400 to-blue-400 rounded-full"></div>
        </div>
      </div>

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
