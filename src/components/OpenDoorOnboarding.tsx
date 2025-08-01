
import { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OpenDoorOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const OpenDoorOnboarding = ({ isOpen, onClose, onComplete }: OpenDoorOnboardingProps) => {
  const [step, setStep] = useState(1);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [hasUpgraded, setHasUpgraded] = useState(false);
  const { user, updateOnboardingStatus, forceRefreshProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && user && !hasUpgraded) {
      // Immediately upgrade user to open_door_plan when onboarding starts
      upgradeToOpenDoorPlan();
    }
  }, [isOpen, user, hasUpgraded]);

  const upgradeToOpenDoorPlan = async () => {
    if (!user || hasUpgraded) return;

    setIsUpgrading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_plan: 'open_door_plan' })
        .eq('id', user.id);

      if (error) {
        console.error('Error upgrading to open door plan:', error);
        toast({
          title: "Error",
          description: "Failed to activate Open Door Plan. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log('Successfully upgraded to open_door_plan');
        setHasUpgraded(true);
        
        // Clear cached subscription state and force refresh profile
        console.log('Clearing cache and forcing profile refresh');
        await forceRefreshProfile();
      }
    } catch (error) {
      console.error('Error upgrading user:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      await updateOnboardingStatus(true);
      onComplete();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 backdrop-blur-xl border border-white/20 ring-1 ring-amber-400/20 shadow-2xl shadow-amber-400/20 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              🔓 Access Granted
            </h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-2"
            >
              <X size={24} />
            </button>
          </div>

         {step === 1 && (
  <div className="space-y-8 text-center">
    {/* REMOVE the rainbow gradient background, keep just the checkmark */}
    <div className="relative">
      <CheckCircle className="w-20 h-20 mx-auto text-white-500 relative z-10" />
    </div>
    
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-white tracking-tight leading-tight">
        Welcome to free housing access.
      </h3>
      
      <p className="text-white/70 text-lg tracking-tight leading-relaxed max-w-md mx-auto">
        You now have unlimited access to NYC's hidden rent-stabilized deals.
      </p>
      
      {/* Better status messaging */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        {(isUpgrading || !hasUpgraded) ? (
          <div className="flex items-center justify-center space-x-3">
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-orange-400 text-sm font-medium">
              Activating your Open Door access...
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-green-400 text-sm font-medium">
              Open Door access activated!
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
)}

          {step === 2 && (
            <div className="space-y-6 text-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Made free for the community. No paywalls. Just more affordable homes.
                </h3>
                <p className="text-white/70 text-lg tracking-tight leading-relaxed">
                  While others pay $3/month, you got in free. Use this access to find deals that can save you thousands.
                </p>
              </div>
              
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3 text-white/70">
                  <span>🏠</span>
                  <span className="tracking-tight">Unlimited rent-stabilized listings</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <span>💰</span>
                  <span className="tracking-tight">Below-market deals updated daily</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <span>🎯</span>
                  <span className="tracking-tight">Instant email notifications on new deals</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <span>⚡</span>
                  <span className="tracking-tight">Never get priced out again</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 text-center">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-white tracking-tight">
                  Time to find your home.
                </h3>
                <p className="text-white/70 text-lg tracking-tight">
                  Your Housing Access plan is now active. Start browsing the best deals in the city.
                </p>
              </div>
              
            <div className="p-6 bg-white/10 rounded-2xl border border-white/10">
                <p className="text-white text-sm tracking-tight font-medium">
                  💛 Remember: This free access is our gift to ensure housing remains accessible to all New Yorkers.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-8">
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
                    i === step 
                      ? "w-6 bg-white"
                      : "w-2 bg-gray-600"
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={handleNext}
              className="px-8 py-3 rounded-full font-semibold tracking-tight bg-white text-black hover:bg-gray-100 transition-all duration-300"
            >
              {step === 3 ? "Start Browsing" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenDoorOnboarding;
