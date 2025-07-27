
import { useState } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
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
    if (step < 7) {
      setStep(step + 1);
    } else {
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
      case 1: return true; // Emotional hook - no input required
      case 2: return true; // Proof of value - no input required
      case 3: return lookingDuration !== "";
      case 4: return experience !== "";
      case 5: return neighborhoods.length > 0;
      case 6: return true; // Email alerts - no input required
      case 7: return true; // Final step
      default: return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tighter">
              Welcome to NYC's best deals
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
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white tracking-tighter leading-tight">
                  Still hunting for a place that isn't wildly overpriced?
                </h3>
                <p className="text-white/70 text-lg tracking-tighter">
                  NYC rents are insane. We know. That's why we built Realer Estate.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 text-center">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="/lovable-uploads/bb4c7d31-b631-48f0-8d0c-736acd4c9827.png" 
                  alt="Realer Estate property listings"
                  className="w-full h-auto"
                />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white tracking-tighter">
                  These are just a few of the deals we've found this week.
                </h3>
                <p className="text-white/70 text-sm tracking-tighter">
                  20–50% below market. Rent-stabilized. Gone in days.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white tracking-tighter text-center">
                How long have you been searching for a home in NYC?
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
                    className={`w-full p-4 rounded-full border-2 transition-all tracking-tighter ${
                      lookingDuration === option
                        ? "border-blue-400 bg-blue-400/20 text-white"
                        : "border-white/20 text-white/70 hover:border-gray-600"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white tracking-tighter text-center">
                What's been the hardest part?
              </h3>
              <div className="space-y-3">
                {[
                  "Wasting hours on overpriced listings",
                  "Losing deals to faster applicants",
                  "Rent-stabilized apartments are impossible to find",
                  "Just getting started, exploring"
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => setExperience(option)}
                    className={`w-full p-4 rounded-full border-2 transition-all text-left tracking-tighter ${
                      experience === option
                        ? "border-blue-400 bg-blue-400/20 text-white"
                        : "border-white/20 text-white/70 hover:border-gray-600"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tighter">
                  Which neighborhoods are you most interested in?
                </h3>
                <p className="text-white/70 text-sm tracking-tighter">
                  We'll prioritize deals in these areas first.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {neighborhoodList.map((neighborhood) => (
                  <button
                    key={neighborhood}
                    onClick={() => handleNeighborhoodToggle(neighborhood)}
                    className={`p-3 rounded-full border-2 transition-all text-sm tracking-tighter ${
                      neighborhoods.includes(neighborhood)
                        ? "border-blue-400 bg-blue-400/20 text-white"
                        : "border-white/20 text-white/70 hover:border-gray-600"
                    }`}
                  >
                    {neighborhood}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6 text-center">
              <h3 className="text-xl font-bold text-white tracking-tighter">
                Want to get notified the moment a hidden deal hits the market?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-white tracking-tighter">Email alerts</span>
                  <button
                    disabled
                    className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed rounded-full border-2 bg-gray-700 border-white/20 opacity-50"
                  >
                    <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out translate-x-0 bg-gray-400" />
                  </button>
                </div>
                
                <p className="text-white/70 text-sm tracking-tighter">
                  Instant email alerts = highest chance to lock it in before it's gone.
                </p>
                
                <Link 
                  to="/pricing"
                  className="inline-block w-full py-4 px-6 bg-white text-black rounded-full font-semibold tracking-tighter hover:bg-gray-100 transition-colors"
                >
                  🔓 Unlock alerts for $3/month
                </Link>
                
                <div className="space-y-2">
                  <p className="text-gray-500 text-xs tracking-tighter">
                    Cancel anytime · Helping 6,000+ New Yorkers · As seen on CBS & AP News
                  </p>
                  <button
                    onClick={handleNext}
                    className="text-blue-400 hover:text-blue-300 text-sm tracking-tighter underline transition-colors"
                  >
                    No thanks — continue for free
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-8 text-center">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-white tracking-tighter">
                  You're in. Time to find you a home.
                </h3>
                <p className="text-white/70 text-lg tracking-tighter">
                  Now you can find the best deals first. They don't stick around for long.
                </p>
              </div>
              
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3 text-white/70">
                  <span>📍</span>
                  <span className="tracking-tighter">Rent · Buy · Search by neighborhood</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <span>🧠</span>
                  <span className="tracking-tighter">AI-powered deal scoring so you don't overpay</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <span>📬</span>
                  <span className="tracking-tighter">New undervalued listings found daily</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleNext}
                  className="w-full py-4 px-6 bg-white text-black rounded-full font-bold text-lg tracking-tighter hover:bg-gray-100 transition-colors"
                >
                  🔍 Start Browsing Listings
                </button>
                <p className="text-gray-500 text-sm tracking-tighter">
                  You'll start with 9 free listings. Upgrade anytime for unlimited access.
                </p>
              </div>
            </div>
          )}

          {step < 7 && (
            <div className="flex justify-between items-center mt-8">
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div
  key={i}
  className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
    i === step 
      ? "w-6 bg-blue-500" 
      : "w-2 bg-gray-600"
  }`}
/>
                ))}
              </div>
              
              {step !== 6 && (
                <HoverButton
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`px-8 py-3 rounded-full font-semibold tracking-tighter ${
                    canProceed()
                      ? "bg-white text-black hover:bg-gray-100"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Next
                </HoverButton>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPopup;
