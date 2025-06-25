import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { HoverButton } from "../components/ui/hover-button";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Join = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { signUp, updateOnboardingStatus } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error, isNewUser } = await signUp(email, password, name);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else if (isNewUser) {
        toast({
          title: "Welcome!",
          description: "Your account has been created successfully.",
        });
        // Show onboarding for new users only
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async (data: any) => {
    console.log('Onboarding data:', data);
    await updateOnboardingStatus(true);
    setShowOnboarding(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        {!showOnboarding ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
                NYC's best deals don't stay online for long.
              </h1>
              <p className="text-gray-400 text-lg tracking-tight">
                Get exclusive access to undervalued listings before they hit the market.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your full name"
                  className="w-full px-4 py-4 bg-gray-900/50 border-2 border-gray-700 rounded-full text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all tracking-tight text-lg"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@domain.com"
                  className="w-full px-4 py-4 bg-gray-900/50 border-2 border-gray-700 rounded-full text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all tracking-tight text-lg"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-4 pr-12 bg-gray-900/50 border-2 border-gray-700 rounded-full text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all tracking-tight text-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <HoverButton
                type="submit"
                disabled={isLoading}
                className="w-full py-4 text-lg font-semibold tracking-tight bg-white text-black hover:bg-gray-100"
              >
                {isLoading ? "Creating Account..." : "Join Now"}
              </HoverButton>

              <p className="text-center text-gray-500 text-sm tracking-tight">
                Early access. Zero spam. Unsubscribe anytime.
              </p>
            </form>

            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold mb-4 tracking-tight">
                What you'll get:
              </h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-blue-400">•</span>
                  <span className="tracking-tight">First access to undervalued listings</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-blue-400">•</span>
                  <span className="tracking-tight">Real-time deal alerts</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-blue-400">•</span>
                  <span className="tracking-tight">Market insights and data</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-blue-400">•</span>
                  <span className="tracking-tight">No broker fees or commissions</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <OnboardingPopup
            isOpen={true}
            onClose={() => setShowOnboarding(false)}
            onComplete={handleOnboardingComplete}
          />
        )}
      </div>
    </div>
  );
};

export default Join;
