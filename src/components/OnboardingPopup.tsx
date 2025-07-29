import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

interface OnboardingData {
  name: string;
  email: string;
  password: string;
  lookingFor: string;
  priceRange: string;
  neighborhoods: string[];
  bedrooms: string;
  moveInDate: string;
  hasAgentBroker: boolean;
}

interface OnboardingPopupProps {
  isOpen: boolean;
  isOpenDoorSignup?: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingData) => void;
  onOpenDoorSignup?: (email: string, password: string, name: string) => void;
}

const OnboardingPopup = ({ 
  isOpen, 
  isOpenDoorSignup = false,
  onClose, 
  onComplete, 
  onOpenDoorSignup 
}: OnboardingPopupProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    email: "",
    password: "",
    lookingFor: "",
    priceRange: "",
    neighborhoods: [],
    bedrooms: "",
    moveInDate: "",
    hasAgentBroker: false,
  });

  const totalSteps = isOpenDoorSignup ? 3 : 6; // Fewer steps for Open Door signup

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      if (isOpenDoorSignup && onOpenDoorSignup) {
        onOpenDoorSignup(data.email, data.password, data.name);
      } else {
        onComplete(data);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const getStepContent = () => {
    if (isOpenDoorSignup) {
      // Custom Open Door signup flow
      switch (currentStep) {
        case 1:
          return (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold text-white">Welcome to the backdoor</h2>
                <p className="text-gray-400">You've been granted free unlimited access to Realer Estate through our Open Door Plan.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => updateData("name", e.target.value)}
                    className="bg-gray-900/50 border-gray-700 text-white"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => updateData("email", e.target.value)}
                    className="bg-gray-900/50 border-gray-700 text-white"
                    placeholder="your.email@domain.com"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={data.password}
                      onChange={(e) => updateData("password", e.target.value)}
                      className="bg-gray-900/50 border-gray-700 text-white pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        case 2:
          return (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold text-white">What brings you here?</h2>
                <p className="text-gray-400">Help us understand your housing needs so we can surface the best deals.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["Apartment to rent", "Apartment to buy", "Room in shared apt", "Just browsing"].map((option) => (
                  <button
                    key={option}
                    onClick={() => updateData("lookingFor", option)}
                    className={`p-4 rounded-xl text-sm font-medium transition-all ${
                      data.lookingFor === option
                        ? "bg-blue-600 text-white border-blue-500"
                        : "bg-gray-900/50 text-gray-300 border-gray-700 hover:bg-gray-800/50"
                    } border`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          );
        case 3:
          return (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold text-white">🎉 You're all set!</h2>
                <p className="text-gray-400">Your Open Door Plan access is now active. You have unlimited access to all rent-stabilized and undervalued listings.</p>
                <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-xl">
                  <p className="text-green-400 font-medium">✨ Free unlimited access activated</p>
                  <p className="text-gray-400 text-sm mt-1">No credit card required • No time limit • Full access</p>
                </div>
              </div>
            </div>
          );
      }
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-white">Let's get you set up</h2>
              <p className="text-gray-400">Create your account to access NYC's hidden real estate deals</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Full Name</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => updateData("name", e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => updateData("email", e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white"
                  placeholder="your.email@domain.com"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={(e) => updateData("password", e.target.value)}
                    className="bg-gray-900/50 border-gray-700 text-white pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-white">What are you looking for?</h2>
              <p className="text-gray-400">Help us understand your housing needs</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["Apartment to rent", "Apartment to buy", "Room in shared apt", "Just browsing"].map((option) => (
                <button
                  key={option}
                  onClick={() => updateData("lookingFor", option)}
                  className={`p-4 rounded-xl text-sm font-medium transition-all ${
                    data.lookingFor === option
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-gray-900/50 text-gray-300 border-gray-700 hover:bg-gray-800/50"
                  } border`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-white">What's your budget?</h2>
              <p className="text-gray-400">We'll prioritize deals within your range</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["Under $2,000", "$2,000-3,000", "$3,000-4,000", "$4,000-5,000", "$5,000+", "Flexible"].map((range) => (
                <button
                  key={range}
                  onClick={() => updateData("priceRange", range)}
                  className={`p-4 rounded-xl text-sm font-medium transition-all ${
                    data.priceRange === range
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-gray-900/50 text-gray-300 border-gray-700 hover:bg-gray-800/50"
                  } border`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-white">Which neighborhoods?</h2>
              <p className="text-gray-400">Select your top 3 preferences</p>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {["East Village", "West Village", "SoHo", "TriBeCa", "Lower East Side", "Chinatown", "Financial District", "Brooklyn Heights", "DUMBO", "Williamsburg", "Greenpoint", "Park Slope", "Carroll Gardens", "Red Hook", "Sunset Park", "Bay Ridge", "Astoria", "Long Island City", "Sunnyside", "Jackson Heights"].map((neighborhood) => (
                <label key={neighborhood} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={data.neighborhoods.includes(neighborhood)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        if (data.neighborhoods.length < 3) {
                          updateData("neighborhoods", [...data.neighborhoods, neighborhood]);
                        }
                      } else {
                        updateData("neighborhoods", data.neighborhoods.filter(n => n !== neighborhood));
                      }
                    }}
                    className="border-gray-600 data-[state=checked]:bg-blue-600"
                  />
                  <span className="text-sm text-gray-300">{neighborhood}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-white">How many bedrooms?</h2>
              <p className="text-gray-400">We'll filter results to match your needs</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["Studio", "1 bedroom", "2+ bedrooms"].map((option) => (
                <button
                  key={option}
                  onClick={() => updateData("bedrooms", option)}
                  className={`p-4 rounded-xl text-sm font-medium transition-all ${
                    data.bedrooms === option
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-gray-900/50 text-gray-300 border-gray-700 hover:bg-gray-800/50"
                  } border`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-white">Ready to unlock NYC's best deals?</h2>
              <p className="text-gray-400">Get unlimited access to rent-stabilized apartments and undervalued properties</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6">
              <div className="text-center space-y-4">
                <div className="text-3xl font-bold text-white">$3<span className="text-lg text-gray-400">/month</span></div>
                <p className="text-sm text-gray-300">Cancel anytime • 7-day free trial</p>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Unlimited property access</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Real-time deal alerts</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Rent-stabilized listings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    if (isOpenDoorSignup) {
      switch (currentStep) {
        case 1:
          return data.name && data.email && data.password;
        case 2:
          return data.lookingFor;
        case 3:
          return true;
        default:
          return false;
      }
    }

    switch (currentStep) {
      case 1:
        return data.name && data.email && data.password;
      case 2:
        return data.lookingFor;
      case 3:
        return data.priceRange;
      case 4:
        return data.neighborhoods.length > 0;
      case 5:
        return data.bedrooms;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const getButtonText = () => {
    if (isOpenDoorSignup && currentStep === 3) {
      return "Access Your Listings";
    }
    if (currentStep === totalSteps) {
      return isOpenDoorSignup ? "Complete Setup" : "Start Free Trial";
    }
    return "Continue";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md bg-black/95 border-gray-800 text-white backdrop-blur-xl"
        style={{
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'inset 0 0 1px rgba(255,255,255,0.1)',
        }}
      >
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>

          {/* Step content */}
          {getStepContent()}

          {/* Navigation */}
          <div className="flex justify-between space-x-4">
            {currentStep > 1 && (
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 ${
                currentStep === 1 ? 'w-full' : ''
              }`}
            >
              {getButtonText()}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingPopup;
