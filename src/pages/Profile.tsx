import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HoverButton } from "@/components/ui/hover-button";

const Profile = () => {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Load user's profile data including subscription info
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error loading user profile:', error);
          return;
        }
        
        if (data) {
          setProfileData(data);
          if (data.neighborhood_preferences) {
            setSelectedNeighborhoods(data.neighborhood_preferences);
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, [user]);

  // Fetch neighborhoods from the database
  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        // Get unique neighborhoods from both sales and rental tables
        const [salesResponse, rentalsResponse] = await Promise.all([
          supabase
            .from('undervalued_sales')
            .select('neighborhood')
            .not('neighborhood', 'is', null),
          supabase
            .from('undervalued_rentals')
            .select('neighborhood')
            .not('neighborhood', 'is', null)
        ]);

        const allNeighborhoods = new Set<string>();
        
        if (salesResponse.data) {
          salesResponse.data.forEach(item => {
            if (item.neighborhood) allNeighborhoods.add(item.neighborhood);
          });
        }
        
        if (rentalsResponse.data) {
          rentalsResponse.data.forEach(item => {
            if (item.neighborhood) allNeighborhoods.add(item.neighborhood);
          });
        }

        setNeighborhoods(Array.from(allNeighborhoods).sort());
      } catch (error) {
        console.error('Error fetching neighborhoods:', error);
      }
    };

    fetchNeighborhoods();
  }, []);

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    
    setIsResettingPassword(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/`,
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password reset email sent",
          description: "Check your email for password reset instructions.",
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleNeighborhood = async (neighborhood: string) => {
    const newSelectedNeighborhoods = selectedNeighborhoods.includes(neighborhood) 
      ? selectedNeighborhoods.filter(n => n !== neighborhood)
      : [...selectedNeighborhoods, neighborhood];
    
    setSelectedNeighborhoods(newSelectedNeighborhoods);
    await saveNeighborhoodPreferences(newSelectedNeighborhoods);
  };

  const saveNeighborhoodPreferences = async (preferences: string[]) => {
    if (!user) return;
    
    setIsSavingPreferences(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ neighborhood_preferences: preferences })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error saving neighborhood preferences:', error);
        toast({
          title: "Error",
          description: "Failed to save neighborhood preferences. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Preferences saved",
          description: "Your neighborhood email preferences have been updated.",
        });
      }
    } catch (error) {
      console.error('Error saving neighborhood preferences:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const filteredNeighborhoods = neighborhoods.filter(neighborhood =>
    neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || !userProfile || !profileData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 tracking-tighter">
            Profile
          </h1>
          <p className="text-gray-400 text-lg tracking-tight">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-8">
          {/* Account Information */}
          <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold mb-6 tracking-tight">Account Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                  Name
                </label>
                <div className="w-full px-4 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-full text-white tracking-tight text-lg">
                  {profileData.name || userProfile.name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                  Email Address
                </label>
                <div className="w-full px-4 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-full text-white tracking-tight text-lg">
                  {user.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                  Password
                </label>
                <div className="relative">
                  <div className="w-full px-4 py-4 pr-12 bg-gray-800/50 border-2 border-gray-700 rounded-full text-white tracking-tight text-lg">
                    {showPassword ? "password123" : "••••••••"}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <button
                  onClick={handlePasswordReset}
                  disabled={isResettingPassword}
                  className="mt-2 text-blue-400 hover:text-blue-300 transition-colors text-sm tracking-tight"
                >
                  {isResettingPassword ? "Sending..." : "Reset Password"}
                </button>
              </div>
            </div>
          </div>

          {/* Email Preferences */}
          <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold mb-6 tracking-tight">Email Preferences</h2>
            <p className="text-gray-400 mb-6 tracking-tight">
              Select the neighborhoods you want to receive deal alerts for:
            </p>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search neighborhoods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-full text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all tracking-tight"
                disabled={isSavingPreferences}
              />
            </div>

            <div className="max-h-60 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {filteredNeighborhoods.map((neighborhood) => (
                  <button
                    key={neighborhood}
                    onClick={() => toggleNeighborhood(neighborhood)}
                    disabled={isSavingPreferences}
                    className={`px-4 py-2 rounded-full text-sm tracking-tight transition-all ${
                      selectedNeighborhoods.includes(neighborhood)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    } ${isSavingPreferences ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {neighborhood}
                  </button>
                ))}
              </div>
            </div>

            {selectedNeighborhoods.length > 0 && (
              <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-sm text-blue-400 tracking-tight">
                  You'll receive email notifications for deals in {selectedNeighborhoods.length} neighborhood{selectedNeighborhoods.length !== 1 ? 's' : ''}.
                </p>
              </div>
            )}
          </div>

          {/* Subscription Plan */}
          <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold mb-6 tracking-tight">Subscription Plan</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium tracking-tight capitalize">
                  {profileData.subscription_plan || 'Free'} Plan
                </p>
                <p className="text-gray-400 text-sm tracking-tight">
                  {profileData.subscription_plan === 'unlimited' 
                    ? `Access to all deals and features (${profileData.subscription_renewal || 'monthly'} billing)` 
                    : 'Limited to 3 deals per day'
                  }
                </p>
              </div>
              
              <Link to="/pricing">
                <HoverButton className="text-white font-semibold tracking-tight">
                  Manage Subscription
                </HoverButton>
              </Link>
            </div>
          </div>

          {/* Sign Out */}
          <div className="flex justify-center pt-8">
            <button
              onClick={handleSignOut}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium tracking-tight transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
