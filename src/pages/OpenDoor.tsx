
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const OpenDoor = () => {
  const { user, userProfile, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Update meta tags for SEO - make it non-indexable
    document.title = "Open Door Plan - Realer Estate";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Free unlimited access to Realer Estate through our Open Door Plan for press and community partners.');
    }

    // Add noindex meta tag
    const noIndex = document.createElement('meta');
    noIndex.name = 'robots';
    noIndex.content = 'noindex, nofollow';
    document.head.appendChild(noIndex);

    return () => {
      // Clean up noindex when leaving page
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) robotsMeta.remove();
    };
  }, []);

  const handleUnlockAccess = async () => {
    if (!user) {
      // If not signed in, show signup form
      setShowSignup(true);
      return;
    }

    // If signed in, upgrade directly
    await upgradeToOpenDoor();
  };

  const upgradeToOpenDoor = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_plan: 'open_door_plan' })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error upgrading to open door plan:', error);
        toast({
          title: "Error",
          description: "Failed to upgrade your plan. Please try again.",
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
      console.error('Error upgrading to open door plan:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signUp(email, password, name);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // After successful signup, upgrade to open door plan
        setTimeout(async () => {
          await upgradeToOpenDoor();
        }, 1000);
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

  if (showSignup && !user) {
    return (
      <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 tracking-tighter">
              Create Your Free Account
            </h1>
            <p className="text-gray-400 text-lg tracking-tight">
              Sign up to unlock unlimited access through the Open Door Plan.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
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
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-4 bg-gray-900/50 border-2 border-gray-700 rounded-full text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all tracking-tight text-lg"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors border-2 border-yellow-400 hover:shadow-[0_0_20px_rgba(255,255,0,0.3)] transition-shadow tracking-tight"
            >
              {isLoading ? "Creating Account..." : "Unlock Free Access"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setShowSignup(false)}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              ← Back to Open Door Plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 tracking-tighter">
            The Open Door Plan
          </h1>
          
          <div className="max-w-2xl mx-auto space-y-6 text-xl text-gray-300 leading-relaxed tracking-tight">
            <p>
              We launched the Open Door Plan to make Realer Estate free for those who need it most.
            </p>
            
            <p>
              No paywalls. No ads. Just real listings — rent-stabilized, undervalued, and ready to help you stay rooted in the city.
            </p>
            
            <p>
              If you found this page through a journalist, housing org, or public partner, you can unlock unlimited access for free below.
            </p>
          </div>
        </div>

        <div className="text-center mb-16">
          <button
            onClick={handleUnlockAccess}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-12 py-4 bg-white text-black rounded-full font-semibold text-xl hover:bg-gray-100 transition-all border-2 border-yellow-400 hover:shadow-[0_0_30px_rgba(255,255,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed tracking-tight"
          >
            {isLoading ? "Unlocking Access..." : "Unlock Free Access"}
          </button>
        </div>

        <div className="max-w-2xl mx-auto space-y-6 text-lg text-gray-400 leading-relaxed tracking-tight text-center">
          <p>
            Realer Estate is usually $3/month to help us stay independent—but we created Open Door Plan to make sure that all New Yorkers have access to affordable homes.
          </p>
          
          <div className="flex items-center justify-center space-x-3 text-yellow-400">
            <span>💛</span>
            <span>No credit card. No time limit. Just a better way to find hidden deals in NYC so you don't get squeezed.</span>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-gray-800">
          <div className="text-center">
            <p className="text-gray-500 text-lg tracking-tight mb-4">
              Are you a journalist, housing org, or public partner?{" "}
              <a 
                href="mailto:info@realerestate.org" 
                className="text-blue-400 hover:text-blue-300 transition-colors underline"
              >
                Click here to offer the Open Door Plan to your audience.
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenDoor;
