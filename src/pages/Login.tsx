import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { HoverButton } from "../components/ui/hover-button";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Update meta tags for SEO
    document.title = "Login to Realer Estate - Access Your NYC Real Estate Advantage";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Login to Realer Estate to access undervalued NYC properties, market insights, and your unfair advantage in real estate.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Login to Realer Estate to access undervalued NYC properties, market insights, and your unfair advantage in real estate.';
      document.head.appendChild(meta);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Login to Realer Estate - Access Your NYC Real Estate Advantage');
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', 'Login to access undervalued NYC properties and market insights.');
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', 'https://realerestate.org/login');

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', 'Login to Realer Estate - Access Your NYC Real Estate Advantage');
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', 'Login to access undervalued NYC properties and market insights.');
    
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute('content', 'https://realerestate.org/login');

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://realerestate.org/login');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });
        navigate('/');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 tracking-tighter">
            Already got access?
          </h1>
          <p className="text-gray-400 text-lg tracking-tight">
            Welcome back to your unfair advantage.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            className="w-full py-4 text-lg font-semibold tracking-tight text-white"
          >
            {isLoading ? "Logging In..." : "Log In"}
          </HoverButton>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 tracking-tight">
            No account yet?{" "}
            <Link 
              to="/join" 
              className="text-white hover:text-white transition-colors"
              style={{
                textShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
              }}
            >
              Join now →
            </Link>
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link 
            to="/search" 
            className="text-gray-500 hover:text-gray-400 transition-colors text-sm tracking-tight"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
