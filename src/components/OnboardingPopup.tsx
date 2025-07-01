
import { useState } from "react";
import { X } from "lucide-react";
import { HoverButton } from "./ui/hover-button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface OnboardingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingData) => void;
}

interface OnboardingData {
  lookingDuration: string;
  experience: string;
  neighborhoods: string[];
  emailNotifications: boolean;
}

const OnboardingPopup = ({ isOpen, onClose, onComplete }: OnboardingPopupProps) => {
  const [step, setStep] = useState(1);
  const [lookingDuration, setLookingDuration] = useState("");
  const [experience, setExperience] = useState("");
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const neighborhoodList = [
    "Upper East Side", "Upper West Side", "Midtown", "Chelsea", "Greenwich Village",
    "SoHo", "Tribeca", "Lower East Side", "East Village", "NoLita",
    "Williamsburg", "DUMBO", "Brooklyn Heights", "Park Slope", "Prospect Heights",
    "Crown Heights", "Bushwick", "Red Hook", "Long Island City", "Astoria",
    "Sunnyside", "Jackson Heights", "Flushing", "Forest Hills", "Ridgewood"
  ];

  const handleNeighborhoodToggle = (neighborhood: string) => {
    setNeighborhoods(prev => 
      prev.includes(neighborhood) 
        ? prev.filter(n => n !== neighborhood)
        : [...prev, neighborhood]
    );
  };

  const savePreferencesToDatabase = async () => {
    if (!user) return;

    try {
      // Save neighborhood preferences if email notifications are enabled
      const preferencesToSave = emailNotifications ? neighborhoods : [];
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          neighborhood_preferences: preferencesToSave
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving onboarding preferences:', error);
        toast({
          title: "Error",
          description: "Failed to save your preferences. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving onboarding preferences:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save preferences to database before completing
      const saved = await savePreferencesToDatabase();
      if (saved) {
        onComplete({
          lookingDuration,
          experience,
          neighborhoods,
          emailNotifications
        });
        onClose();
      }
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return lookingDuration !== "";
      case 2: return experience !== "";
      case 3: return neighborhoods.length > 0;
      default: return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Welcome to NYC's best deals
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white tracking-tight">
                How long have you been looking for a home in NYC?
              </h3>
              <div className="space-y-3">
                {[
                  "5+ years",
                  "1 to 5 years", 
                  "Under a year",
                  "Just started"
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => setLookingDuration(option)}
                    className={`w-full p-4 rounded-full border-2 transition-all tracking-tight ${
                      lookingDuration === option
                        ? "border-white bg-white text-black"
                        : "border-gray-700 text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white tracking-tight">
                How has your experience been while looking for a home in NYC?
              </h3>
              <div className="space-y-3">
                {[
                  "Exhausting. Too many wasted hours scrolling on streeteasy to find a good deal",
                  "Frustrating. Every home looks overpriced",
                  "Cutthroat. Too much competition for every listing",
                  "Chill. (I just started looking today)"
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => setExperience(option)}
                    className={`w-full p-4 rounded-full border-2 transition-all text-left tracking-tight ${
                      experience === option
                        ? "border-white bg-white text-black"
                        : "border-gray-700 text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white tracking-tight">
                What neighborhoods are you looking to buy/rent in?
              </h3>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {neighborhoodList.map((neighborhood) => (
                  <button
                    key={neighborhood}
                    onClick={() => handleNeighborhoodToggle(neighborhood)}
                    className={`p-3 rounded-full border-2 transition-all text-sm tracking-tight ${
                      neighborhoods.includes(neighborhood)
                        ? "border-white bg-white text-black"
                        : "border-gray-700 text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    {neighborhood}
                  </button>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-white tracking-tight">
                    Get email notifications for new undervalued deals
                  </span>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                      emailNotifications ? "bg-white border-white" : "bg-gray-700 border-gray-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${
                        emailNotifications 
                          ? "translate-x-5 bg-black" 
                          : "translate-x-0 bg-white"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-8">
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i <= step ? "bg-white" : "bg-gray-700"
                  }`}
                />
              ))}
            </div>
            
            <HoverButton
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-8 py-3 rounded-full font-semibold tracking-tight ${
                canProceed()
                  ? "bg-white text-black hover:bg-gray-100"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              {step === 3 ? "Complete" : "Next"}
            </HoverButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPopup;
