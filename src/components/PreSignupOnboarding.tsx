
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OnboardingData {
  searchDuration: string;
  frustrations: string[];
  searchingFor: string;
  propertyType: string;
  bedrooms: number;
  maxBudget: number;
  preferredNeighborhoods: string[];
  mustHaves: string[];
  discountThreshold: number;
}

interface PreSignupOnboardingProps {
  isOpen: boolean;
  onComplete: (data: OnboardingData) => void;
  onClose: () => void;
}

const PreSignupOnboarding = ({ isOpen, onComplete, onClose }: PreSignupOnboardingProps) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    searchDuration: "",
    frustrations: [],
    searchingFor: "",
    propertyType: "",
    bedrooms: 1,
    maxBudget: 3000,
    preferredNeighborhoods: [],
    mustHaves: [],
    discountThreshold: 20
  });
  const [matchCount] = useState(9);
  const [isScanning, setIsScanning] = useState(false);
  const [scanningStep, setScanningStep] = useState(0);

  const neighborhoods = [
    "Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island",
    "Williamsburg", "Park Slope", "Carroll Gardens", "DUMBO",
    "Lower East Side", "Upper East Side", "Upper West Side",
    "East Village", "West Village", "Chelsea", "SoHo",
    "Tribeca", "Hell's Kitchen", "Midtown", "Financial District"
  ];

  const mustHaveOptions = [
    "Rent-stabilized", "No broker fee", "Pet-friendly", 
    "Outdoor space", "Laundry in building", "Doorman",
    "Elevator", "Gym", "Rooftop access"
  ];

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 6) {
      // Start scanning animation
      setIsScanning(true);
      setScanningStep(0);
      
      const scanningSteps = [
        "Analyzing market trends...",
        `Looking for ${data.bedrooms}BRs under $${data.maxBudget.toLocaleString()}...`,
        "Scanning for rent-stabilized units...",
        "Cross-referencing your wishlist...",
        `✅ Found ${matchCount} matching listings`
      ];

      scanningSteps.forEach((_, index) => {
        setTimeout(() => {
          setScanningStep(index);
          if (index === scanningSteps.length - 1) {
            setTimeout(() => {
              setStep(step + 1);
              setIsScanning(false);
            }, 1500);
          }
        }, index * 1200);
      });
    } else if (step < 9) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 1 && !isScanning) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return data.searchDuration !== "";
      case 2: return data.frustrations.length > 0;
      case 3: return data.searchingFor !== "";
      case 4: return data.propertyType !== "";
      case 5: return data.preferredNeighborhoods.length > 0;
      case 6: return true;
      default: return true;
    }
  };

  const toggleFrustration = (frustration: string) => {
    setData(prev => ({
      ...prev,
      frustrations: prev.frustrations.includes(frustration)
        ? prev.frustrations.filter(f => f !== frustration)
        : [...prev.frustrations, frustration]
    }));
  };

  const toggleNeighborhood = (neighborhood: string) => {
    setData(prev => ({
      ...prev,
      preferredNeighborhoods: prev.preferredNeighborhoods.includes(neighborhood)
        ? prev.preferredNeighborhoods.filter(n => n !== neighborhood)
        : [...prev.preferredNeighborhoods, neighborhood]
    }));
  };

  const toggleMustHave = (mustHave: string) => {
    setData(prev => ({
      ...prev,
      mustHaves: prev.mustHaves.includes(mustHave)
        ? prev.mustHaves.filter(m => m !== mustHave)
        : [...prev.mustHaves, mustHave]
    }));
  };

  const getScanningSteps = () => [
    "Analyzing market trends...",
    `Looking for ${data.bedrooms}BRs under $${data.maxBudget.toLocaleString()}...`,
    "Scanning for rent-stabilized units...",
    "Cross-referencing your wishlist...",
    `✅ Found ${matchCount} matching listings`
  ];

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto px-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {Array.from({ length: 9 }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-500 ease-out ${
                  i + 1 <= step ? 'bg-blue-500 scale-110' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 p-8 min-h-[500px] transition-all duration-700 ease-out">
          {step === 1 && (
            <div className="text-center space-y-8 transform transition-all duration-700 ease-out">
              <h2 className="text-4xl font-bold text-white mb-8 transform translate-y-0 transition-all duration-500 delay-100">
                How long have you been searching?
              </h2>
              <div className="space-y-4">
                {["Just started", "1–3 months", "3–6 months", "Over 6 months"].map((option, index) => (
                  <button
                    key={option}
                    onClick={() => setData(prev => ({ ...prev, searchDuration: option }))}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-xl font-medium hover:scale-[1.02] active:scale-[0.98] transform ${
                      data.searchDuration === option
                        ? "border-blue-500 bg-blue-500/20 text-white shadow-lg shadow-blue-500/25"
                        : "border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-800/30"
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideUp 0.6s ease-out forwards'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-8 transform transition-all duration-700 ease-out">
              <h2 className="text-4xl font-bold text-white mb-8 transform translate-y-0 transition-all duration-500 delay-100">
                What's been the most frustrating part?
              </h2>
              <p className="text-gray-400 mb-8 transform translate-y-0 transition-all duration-500 delay-200">Select all that apply</p>
              <div className="space-y-4">
                {[
                  "Every listing's already gone",
                  "I can't find anything under my budget",
                  "Broker fees and scams",
                  "Rent keeps going up",
                  "I don't even know where to look anymore"
                ].map((option, index) => (
                  <button
                    key={option}
                    onClick={() => toggleFrustration(option)}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-xl font-medium hover:scale-[1.02] active:scale-[0.98] transform ${
                      data.frustrations.includes(option)
                        ? "border-blue-500 bg-blue-500/20 text-white shadow-lg shadow-blue-500/25"
                        : "border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-800/30"
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideUp 0.6s ease-out forwards'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-8 transform transition-all duration-700 ease-out">
              <h2 className="text-4xl font-bold text-white mb-8 transform translate-y-0 transition-all duration-500 delay-100">
                Who are you searching for?
              </h2>
              <div className="space-y-4">
                {["Just me", "Me + partner", "Me + family", "Other"].map((option, index) => (
                  <button
                    key={option}
                    onClick={() => setData(prev => ({ ...prev, searchingFor: option }))}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-xl font-medium hover:scale-[1.02] active:scale-[0.98] transform ${
                      data.searchingFor === option
                        ? "border-blue-500 bg-blue-500/20 text-white shadow-lg shadow-blue-500/25"
                        : "border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-800/30"
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideUp 0.6s ease-out forwards'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-8 transform transition-all duration-700 ease-out">
              <h2 className="text-4xl font-bold text-white mb-8 transform translate-y-0 transition-all duration-500 delay-100">
                Are you looking to buy or rent?
              </h2>
              <div className="grid grid-cols-2 gap-8">
                {["Buy", "Rent"].map((option, index) => (
                  <button
                    key={option}
                    onClick={() => setData(prev => ({ ...prev, propertyType: option.toLowerCase() }))}
                    className={`p-12 rounded-2xl border-2 transition-all duration-300 text-2xl font-bold hover:scale-[1.05] active:scale-[0.95] transform ${
                      data.propertyType === option.toLowerCase()
                        ? "border-blue-500 bg-blue-500/20 text-white shadow-xl shadow-blue-500/30"
                        : "border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-800/30"
                    }`}
                    style={{
                      animationDelay: `${index * 200}ms`,
                      animation: 'scaleIn 0.8s ease-out forwards'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-8 transform transition-all duration-700 ease-out">
              <h2 className="text-4xl font-bold text-white text-center mb-8 transform translate-y-0 transition-all duration-500 delay-100">
                Describe your dream deal
              </h2>
              
              <div className="space-y-6">
                {/* Bedrooms */}
                <div className="transform translate-y-0 transition-all duration-500 delay-200">
                  <label className="block text-xl font-medium text-white mb-4">Bedrooms</label>
                  <div className="flex gap-3">
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => setData(prev => ({ ...prev, bedrooms: num }))}
                        className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 font-medium hover:scale-110 active:scale-95 ${
                          data.bedrooms === num
                            ? "border-blue-500 bg-blue-500/20 text-white shadow-lg shadow-blue-500/25"
                            : "border-gray-600 text-gray-300 hover:border-gray-500"
                        }`}
                      >
                        {num === 5 ? "5+" : num === 0 ? "Studio" : num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Budget */}
                <div className="transform translate-y-0 transition-all duration-500 delay-300">
                  <label className="block text-xl font-medium text-white mb-4">
                    Max Budget: ${data.maxBudget.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="10000"
                    step="100"
                    value={data.maxBudget}
                    onChange={(e) => setData(prev => ({ ...prev, maxBudget: parseInt(e.target.value) }))}
                    className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer transition-all duration-200 hover:bg-gray-600"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((data.maxBudget - 1000) / (10000 - 1000)) * 100}%, #374151 ${((data.maxBudget - 1000) / (10000 - 1000)) * 100}%, #374151 100%)`
                    }}
                  />
                </div>

                {/* Neighborhoods */}
                <div className="transform translate-y-0 transition-all duration-500 delay-400">
                  <label className="block text-xl font-medium text-white mb-4">Preferred Neighborhoods</label>
                  <div className="grid grid-cols-3 gap-3 max-h-32 overflow-y-auto">
                    {neighborhoods.map((neighborhood) => (
                      <button
                        key={neighborhood}
                        onClick={() => toggleNeighborhood(neighborhood)}
                        className={`px-3 py-2 rounded-lg border transition-all duration-200 text-sm hover:scale-105 active:scale-95 ${
                          data.preferredNeighborhoods.includes(neighborhood)
                            ? "border-blue-500 bg-blue-500/20 text-white shadow-md shadow-blue-500/25"
                            : "border-gray-600 text-gray-300 hover:border-gray-500"
                        }`}
                      >
                        {neighborhood}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Must Haves */}
                <div className="transform translate-y-0 transition-all duration-500 delay-500">
                  <label className="block text-xl font-medium text-white mb-4">Must-haves</label>
                  <div className="grid grid-cols-3 gap-3">
                    {mustHaveOptions.map((mustHave) => (
                      <button
                        key={mustHave}
                        onClick={() => toggleMustHave(mustHave)}
                        className={`px-3 py-2 rounded-lg border transition-all duration-200 text-sm hover:scale-105 active:scale-95 ${
                          data.mustHaves.includes(mustHave)
                            ? "border-blue-500 bg-blue-500/20 text-white shadow-md shadow-blue-500/25"
                            : "border-gray-600 text-gray-300 hover:border-gray-500"
                        }`}
                      >
                        {mustHave}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="text-center space-y-8 transform transition-all duration-700 ease-out">
              <h2 className="text-4xl font-bold text-white mb-8 transform translate-y-0 transition-all duration-500 delay-100">
                How good of a deal do you want?
              </h2>
              <p className="text-gray-400 mb-8 transform translate-y-0 transition-all duration-500 delay-200">How far below market do you want to go?</p>
              
              <div className="space-y-6 transform translate-y-0 transition-all duration-500 delay-300">
                <div className="text-2xl font-bold text-white transition-all duration-300">
                  {data.discountThreshold}% below market
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={data.discountThreshold}
                  onChange={(e) => setData(prev => ({ ...prev, discountThreshold: parseInt(e.target.value) }))}
                  className="w-full h-4 bg-gray-700 rounded-lg appearance-none cursor-pointer transition-all duration-200 hover:bg-gray-600"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((data.discountThreshold - 10) / (50 - 10)) * 100}%, #374151 ${((data.discountThreshold - 10) / (50 - 10)) * 100}%, #374151 100%)`
                  }}
                />
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>10%</span>
                  <span>20%</span>
                  <span>30%</span>
                  <span>40%+</span>
                </div>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="text-center space-y-8">
              <h2 className="text-4xl font-bold text-white mb-8 transform translate-y-0 transition-all duration-500">
                Scanning NYC listings...
              </h2>
              
              <div className="space-y-4">
                {getScanningSteps().map((stepText, index) => (
                  <div
                    key={index}
                    className={`text-xl transition-all duration-700 transform ${
                      index <= scanningStep 
                        ? index === scanningStep 
                          ? "text-white font-medium scale-105 translate-x-0" 
                          : "text-green-400 translate-x-2" 
                        : "text-gray-600 translate-x-0"
                    }`}
                    style={{
                      transitionDelay: `${index * 200}ms`
                    }}
                  >
                    {stepText}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="text-center space-y-8 transform transition-all duration-700 ease-out">
              <h2 className="text-4xl font-bold text-white mb-8 transform scale-100 transition-all duration-500 delay-100">
                We found {matchCount} listings that match your dream.
              </h2>
              
              <div className="space-y-6">
                {/* Featured listing preview */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 transform scale-100 hover:scale-[1.02] transition-all duration-500 delay-200">
                  <div className="w-full h-48 bg-gray-700 rounded-xl mb-4 flex items-center justify-center">
                    <span className="text-gray-400">Property Image</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {data.bedrooms}BR in {data.preferredNeighborhoods[0] || "Brooklyn"} for ${(data.maxBudget * 0.7).toLocaleString()}
                  </h3>
                  <div className="flex gap-2">
                    {data.mustHaves.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Blurred previews */}
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="bg-gray-800 rounded-xl p-3 opacity-30 blur-sm transform scale-95 transition-all duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="w-full h-24 bg-gray-700 rounded-lg mb-2"></div>
                      <div className="h-4 bg-gray-600 rounded mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 9 && (
            <div className="text-center space-y-8 transform transition-all duration-700 ease-out">
              <h2 className="text-4xl font-bold text-white mb-8 transform scale-100 transition-all duration-500 delay-100">
                Sign up to unlock your full list
              </h2>
              
              <div className="bg-gray-800 rounded-2xl p-8 max-w-md mx-auto transform scale-100 transition-all duration-500 delay-200">
                <div className="space-y-4">
                  <button className="w-full py-4 px-6 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                  
                  <button className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] text-white rounded-full font-semibold text-lg transition-all duration-200">
                    Continue with Email
                  </button>
                  
                  <button className="text-gray-400 hover:text-white transition-colors duration-200">
                    Already have an account? Log in
                  </button>
                </div>
                
                <p className="text-gray-500 text-sm mt-4">
                  No spam. Cancel anytime.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          {step !== 7 && step !== 9 && (
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${
                  step === 1 
                    ? "text-gray-600 cursor-not-allowed" 
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                <ChevronLeft size={20} />
                <span>Back</span>
              </button>
              
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center space-x-2 px-8 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                  canProceed()
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                <span>Next</span>
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {step === 9 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-105 active:scale-95"
              >
                Maybe later
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default PreSignupOnboarding;
