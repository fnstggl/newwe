
import React, { useState, useEffect } from 'react';
import OnboardingStep from './OnboardingStep';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { ArrowLeft } from 'lucide-react';

interface OnboardingData {
  search_duration?: string;
  frustrations?: string[];
  searching_for?: string;
  property_type?: string;
  bedrooms?: number;
  max_budget?: number;
  preferred_neighborhoods?: string[];
  must_haves?: string[];
  discount_threshold?: number;
}

interface PreSignupOnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

const PreSignupOnboarding: React.FC<PreSignupOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [scanningProgress, setScanningProgress] = useState(0);
  const [scanningStage, setScanningStage] = useState(0);
  const [matchedListings, setMatchedListings] = useState(0);

  const totalSteps = 9;

  const scanningStages = [
    "Analyzing market trends...",
    "Looking for properties in your budget...",
    "Scanning for rent-stabilized units...",
    "Cross-referencing your wishlist...",
    "✅ Found matching listings"
  ];

  const neighborhoods = [
    "Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island",
    "Carroll Gardens", "Bed-Stuy", "Williamsburg", "Astoria", 
    "Long Island City", "Park Slope", "Greenpoint", "Bushwick",
    "Crown Heights", "Sunset Park", "Red Hook", "Dumbo",
    "Fort Greene", "Prospect Heights", "Chelsea", "SoHo",
    "East Village", "West Village", "Lower East Side", "Tribeca",
    "Financial District", "Midtown", "Upper East Side", "Upper West Side",
    "Harlem", "Washington Heights", "Inwood", "Jackson Heights",
    "Elmhurst", "Forest Hills", "Flushing", "Anywhere with a train"
  ];

  const mustHaveOptions = [
    "Rent-stabilized", "No broker fee", "Pet-friendly", "Outdoor space",
    "In-unit laundry", "Doorman", "Gym", "Rooftop access"
  ];

  useEffect(() => {
    if (currentStep === 7) {
      // Simulate scanning process
      const interval = setInterval(() => {
        setScanningProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress <= 20) setScanningStage(0);
          else if (newProgress <= 40) setScanningStage(1);
          else if (newProgress <= 60) setScanningStage(2);
          else if (newProgress <= 80) setScanningStage(3);
          else if (newProgress <= 100) {
            setScanningStage(4);
            // Calculate matched listings based on user preferences
            const baseListings = 15;
            const budgetFactor = onboardingData.max_budget ? Math.min(onboardingData.max_budget / 3000, 1) : 0.5;
            const calculated = Math.floor(baseListings * budgetFactor * (Math.random() * 0.5 + 0.5));
            setMatchedListings(Math.max(3, calculated));
          }
          
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => setCurrentStep(8), 1500);
          }
          return Math.min(newProgress, 100);
        });
      }, 80);
      
      return () => clearInterval(interval);
    }
  }, [currentStep, onboardingData]);

  const updateData = (key: keyof OnboardingData, value: any) => {
    setOnboardingData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(onboardingData);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleArrayToggle = (key: keyof OnboardingData, value: string) => {
    const currentArray = (onboardingData[key] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateData(key, newArray);
  };

  const ChoiceButton = ({ 
    children, 
    selected, 
    onClick, 
    delay = 0 
  }: { 
    children: React.ReactNode; 
    selected?: boolean; 
    onClick: () => void;
    delay?: number;
  }) => (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 animate-slide-up ${
        selected
          ? 'border-white bg-white text-black'
          : 'border-gray-600 bg-transparent text-white hover:border-gray-400'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </button>
  );

  const TagButton = ({ 
    children, 
    selected, 
    onClick, 
    delay = 0 
  }: { 
    children: React.ReactNode; 
    selected?: boolean; 
    onClick: () => void;
    delay?: number;
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full border transition-all duration-300 hover:scale-105 ${
        selected
          ? 'border-white bg-white text-black'
          : 'border-gray-600 bg-transparent text-white hover:border-gray-400'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </button>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingStep
            step={currentStep}
            totalSteps={totalSteps}
            title="How long have you been searching?"
          >
            <div className="space-y-4">
              {['Just started', '1–3 months', '3–6 months', 'Over 6 months'].map((option, index) => (
                <ChoiceButton
                  key={option}
                  selected={onboardingData.search_duration === option}
                  onClick={() => {
                    updateData('search_duration', option);
                    setTimeout(nextStep, 300);
                  }}
                  delay={index * 100}
                >
                  {option}
                </ChoiceButton>
              ))}
            </div>
          </OnboardingStep>
        );

      case 2:
        return (
          <OnboardingStep
            step={currentStep}
            totalSteps={totalSteps}
            title="What's been the most frustrating part?"
            subtitle="Select all that apply"
          >
            <div className="flex flex-wrap gap-3">
              {[
                'Every listing\'s already gone',
                'I can\'t find anything under my budget',
                'Broker fees and scams',
                'Rent keeps going up',
                'I don\'t even know where to look anymore'
              ].map((option, index) => (
                <TagButton
                  key={option}
                  selected={onboardingData.frustrations?.includes(option)}
                  onClick={() => handleArrayToggle('frustrations', option)}
                  delay={index * 100}
                >
                  {option}
                </TagButton>
              ))}
            </div>
            <button
              onClick={nextStep}
              disabled={!onboardingData.frustrations?.length}
              className="mt-8 w-full p-4 bg-white text-black rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300"
            >
              Next
            </button>
          </OnboardingStep>
        );

      case 3:
        return (
          <OnboardingStep
            step={currentStep}
            totalSteps={totalSteps}
            title="Who are you searching for?"
          >
            <div className="space-y-4">
              {['Just me', 'Me + partner', 'Me + family', 'Other'].map((option, index) => (
                <ChoiceButton
                  key={option}
                  selected={onboardingData.searching_for === option}
                  onClick={() => {
                    updateData('searching_for', option);
                    setTimeout(nextStep, 300);
                  }}
                  delay={index * 100}
                >
                  {option}
                </ChoiceButton>
              ))}
            </div>
          </OnboardingStep>
        );

      case 4:
        return (
          <OnboardingStep
            step={currentStep}
            totalSteps={totalSteps}
            title="Are you looking to buy or rent?"
          >
            <div className="flex gap-4">
              {['rent', 'buy'].map((option, index) => (
                <ChoiceButton
                  key={option}
                  selected={onboardingData.property_type === option}
                  onClick={() => {
                    updateData('property_type', option);
                    setTimeout(nextStep, 300);
                  }}
                  delay={index * 200}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </ChoiceButton>
              ))}
            </div>
          </OnboardingStep>
        );

      case 5:
        return (
          <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
            {/* Back Button */}
            <div className="fixed top-8 left-8 z-50">
              <button
                onClick={prevStep}
                className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="fixed top-8 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gray-800 rounded-full overflow-hidden z-40">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pt-24 pb-8">
              <div className="max-w-lg w-full mx-auto px-4 text-center space-y-8">
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Describe your dream deal
                  </h1>
                </div>
                
                <div className="space-y-8">
                  {/* Bedrooms */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Bedrooms</h3>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {[0, 1, 2, 3, 4, '5+'].map((bed, index) => (
                        <button
                          key={bed}
                          onClick={() => updateData('bedrooms', bed === '5+' ? 5 : bed)}
                          className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                            onboardingData.bedrooms === (bed === '5+' ? 5 : bed)
                              ? 'border-white bg-white text-black'
                              : 'border-gray-600 bg-transparent text-white hover:border-gray-400'
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {bed}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Max Budget</h3>
                    <input
                      type="number"
                      placeholder="$3,000"
                      value={onboardingData.max_budget || ''}
                      onChange={(e) => updateData('max_budget', parseInt(e.target.value) || 0)}
                      className="w-full p-4 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:border-white focus:outline-none"
                    />
                  </div>

                  {/* Neighborhoods */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Neighborhoods</h3>
                    <div className="max-h-48 overflow-y-auto border border-gray-600 rounded-xl p-4 bg-gray-900 overscroll-contain">
                      <div className="flex flex-wrap gap-2">
                        {neighborhoods.map((neighborhood, index) => (
                          <TagButton
                            key={neighborhood}
                            selected={onboardingData.preferred_neighborhoods?.includes(neighborhood)}
                            onClick={() => handleArrayToggle('preferred_neighborhoods', neighborhood)}
                            delay={index * 20}
                          >
                            {neighborhood}
                          </TagButton>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Must-haves */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Must-haves</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {mustHaveOptions.map((option, index) => (
                        <TagButton
                          key={option}
                          selected={onboardingData.must_haves?.includes(option)}
                          onClick={() => handleArrayToggle('must_haves', option)}
                          delay={index * 50}
                        >
                          {option}
                        </TagButton>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={nextStep}
                    className="w-full p-4 bg-white text-black rounded-2xl font-semibold hover:scale-105 transition-all duration-300 animate-scale-in"
                  >
                    Find my deals →
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <OnboardingStep
            step={currentStep}
            totalSteps={totalSteps}
            title="How good of a deal do you want?"
            subtitle="How far below market do you want to go?"
          >
            <div className="space-y-8">
              <div className="space-y-6">
                <Slider
                  value={[onboardingData.discount_threshold || 20]}
                  onValueChange={(value) => updateData('discount_threshold', value[0])}
                  max={50}
                  min={10}
                  step={5}
                  className="w-full animate-slide-in-left"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>10%</span>
                  <span>20%</span>
                  <span>30%</span>
                  <span>40%+</span>
                </div>
                <p className="text-center text-xl font-semibold">
                  {onboardingData.discount_threshold || 20}% below market
                </p>
              </div>

              <button
                onClick={nextStep}
                className="w-full p-4 bg-white text-black rounded-2xl font-semibold hover:scale-105 transition-all duration-300"
              >
                Continue
              </button>
            </div>
          </OnboardingStep>
        );

      case 7:
        return (
          <OnboardingStep
            step={currentStep}
            totalSteps={totalSteps}
            title="Scanning NYC listings..."
          >
            <div className="space-y-8">
              <Progress value={scanningProgress} className="w-full h-2" />
              
              <div className="space-y-4">
                {scanningStages.map((stage, index) => (
                  <div
                    key={stage}
                    className={`text-left transition-all duration-500 ${
                      index <= scanningStage 
                        ? index === scanningStage 
                          ? 'text-white opacity-100' 
                          : 'text-green-400 opacity-100'
                        : 'text-gray-600 opacity-50'
                    }`}
                  >
                    {index === 4 && scanningStage >= 4 
                      ? `✅ Found ${matchedListings} matching listings` 
                      : stage}
                  </div>
                ))}
              </div>
            </div>
          </OnboardingStep>
        );

      case 8:
        return (
          <OnboardingStep
            step={currentStep}
            totalSteps={totalSteps}
            title={`We found ${matchedListings} listings that match your dream home.`}
          >
            <div className="space-y-8">
              {/* Sample listing preview */}
              <div className="bg-gray-900 rounded-xl p-4 animate-scale-in">
                <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
                <h3 className="text-lg font-semibold">2BR in Carroll Gardens for $1,750</h3>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-green-600 text-xs rounded">No fee</span>
                  <span className="px-2 py-1 bg-blue-600 text-xs rounded">Rent-stabilized</span>
                </div>
              </div>

              {/* Blurred previews */}
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="opacity-30 blur-sm pointer-events-none">
                    <div className="bg-gray-700 h-24 rounded-lg"></div>
                  </div>
                ))}
              </div>

              <button
                onClick={nextStep}
                className="w-full p-4 bg-white text-black rounded-2xl font-semibold animate-pulse hover:scale-105 transition-all duration-300"
              >
                Sign up to unlock your full list
              </button>
            </div>
          </OnboardingStep>
        );

      case 9:
        return (
          <OnboardingStep
            step={currentStep}
            totalSteps={totalSteps}
            title="Almost there!"
          >
            <div className="backdrop-blur-xl">
              <div className="bg-neutral-950 rounded-xl shadow-lg px-8 py-12 animate-scale-in">
                <div className="space-y-6">
                  <button className="w-full py-4 px-4 bg-black border-2 border-white text-white hover:bg-gray-900 rounded-full text-lg font-semibold tracking-tight transition-all flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="flex items-center space-x-4">
                    <div className="flex-1 h-px bg-gray-700"></div>
                    <span className="text-gray-400 text-sm">or</span>
                    <div className="flex-1 h-px bg-gray-700"></div>
                  </div>

                  <button
                    onClick={() => onComplete(onboardingData)}
                    className="w-full py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all duration-300"
                  >
                    Continue with Email
                  </button>

                  <p className="text-center text-gray-500 text-sm">
                    No spam. Cancel anytime.
                  </p>
                </div>
              </div>
            </div>
          </OnboardingStep>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {currentStep !== 5 && currentStep > 1 && (
        <div className="fixed top-8 left-8 z-50">
          <button
            onClick={prevStep}
            className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      )}
      {renderStep()}
    </div>
  );
};

export default PreSignupOnboarding;
