
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { HoverButton } from "../components/ui/hover-button";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import OnboardingPopup from "../components/OnboardingPopup";
import { useIsMobile } from "@/hooks/use-mobile";


const Join = () => {
  const [name, setName] = useState("");
    const isMobile = useIsMobile();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { signUp, signInWithGoogle, updateOnboardingStatus } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Update meta tags for SEO
    document.title = "Join Realer Estate - Get Your Unfair Advantage in NYC Real Estate";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Join Realer Estate to find undervalued NYC properties before they hit the market. Get exclusive access to the best real estate deals.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Join Realer Estate to find undervalued NYC properties before they hit the market. Get exclusive access to the best real estate deals.';
      document.head.appendChild(meta);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Join Realer Estate - Get Your Unfair Advantage in NYC Real Estate');
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', 'Join to find undervalued NYC properties before they hit the market. Get exclusive access to the best deals.');
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', 'https://realerestate.org/join');

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', 'Join Realer Estate - Get Your Unfair Advantage in NYC Real Estate');
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', 'Join to find undervalued NYC properties before they hit the market. Get exclusive access to the best deals.');
    
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute('content', 'https://realerestate.org/join');

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://realerestate.org/join');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error, needsOnboarding } = await signUp(email, password, name);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome!",
          description: "Your account has been created successfully.",
        });
        
        // Show onboarding for new users
        if (needsOnboarding) {
          setShowOnboarding(true);
        } else {
          navigate('/');
        }
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

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleOnboardingComplete = async (data: any) => {
    console.log('Onboarding data:', data);
    await updateOnboardingStatus(true);
    setShowOnboarding(false);
    navigate('/');
  };

  return (
    <div className={`min-h-screen bg-black text-white font-inter flex items-center justify-center ${isMobile ? 'pb-20' : ''}`}>
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
            You’re seconds away from NYC’s hidden deals.
          </h1>
          <p className="text-gray-400 text-lg tracking-tight">
            Up to 60% below-market. 6,000+ New Yorkers already inside.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-4 px-4 bg-black border-2 border-white text-white hover:bg-gray-900 rounded-full text-lg font-semibold tracking-tight transition-all flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>{isGoogleLoading ? "Signing in..." : "Sign in with Google"}</span>
          </button>

          <div className="flex items-center space-x-4">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-400 text-sm tracking-tight">or</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

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
              className="w-full px-4 py-3 md:py-4 bg-gray-900/50 border-2 border-gray-700 rounded-full text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all tracking-tight text-base md:text-lg"
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
      </div>

      <OnboardingPopup
        isOpen={showOnboarding}
        onClose={() => {
          setShowOnboarding(false);
          navigate('/');
        }}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
};

export default Join;
