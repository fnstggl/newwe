
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const OpenDoor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, userProfile } = useAuth();
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
      // If not signed in, redirect to signup
      navigate('/join');
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
    if (!user) return "Unlock Free Access";
    if (userProfile?.subscription_plan === 'open_door_plan') return "Access Your Listings";
    return "Unlock Free Access";
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 tracking-tighter">
            The Open Door Plan
          </h1>
          
          <div className="max-w-3xl mx-auto space-y-6 leading-relaxed">
  <p className="text-2xl text-white font-semibold tracking-tight">
    We launched the Open Door Plan to ensure everyone has free access to more affordable homes.
  </p>
  
  <p className="text-lg text-gray-300">
    No paywalls. No ads. Just real listings — rent-stabilized, undervalued, and ready to help you stay rooted in the city.
  </p>
            
            <p className="text-white font-medium">
              If you found this page through a journalist, housing org, or public partner, you can unlock unlimited access for free below.
            </p>
          </div>
        </div>

        {/* Main CTA */}
        <div className="text-center mb-16">
          <button
            onClick={handleUnlockAccess}
            disabled={isLoading}
            className="group relative inline-flex items-center justify-center px-12 py-6 text-xl font-semibold bg-white text-black rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              boxShadow: '0 0 20px rgba(255, 193, 7, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 193, 7, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 193, 7, 0.3)';
            }}
          >
            <span className="relative z-10">
              {isLoading ? "Activating..." : getButtonText()}
            </span>
            <div className="absolute inset-0 rounded-full border-2 border-yellow-400 opacity-70"></div>
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
              💛 No credit card. No time limit. Just a better way to find hidden deals in NYC so you don't get squeezed.
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center">
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
      </div>
    </div>
  );
};

export default OpenDoor;
