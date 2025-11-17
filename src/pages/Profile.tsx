import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
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
  
  // NEW: Modal state for upgrade prompt
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // NEW: Refine Filters modal state
  const [showRefineFilters, setShowRefineFilters] = useState(false);
  const [refinedPropertyType, setRefinedPropertyType] = useState<string>('');
  const [refinedBedrooms, setRefinedBedrooms] = useState<number | undefined>(undefined);
  const [refinedMaxBudget, setRefinedMaxBudget] = useState<number | undefined>(undefined);
  const [refinedNeighborhoods, setRefinedNeighborhoods] = useState<string[]>([]);
  const [selectedNeighborhoodForUpgrade, setSelectedNeighborhoodForUpgrade] = useState("");

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
          // Load refined filter preferences
          if (data.property_type) setRefinedPropertyType(data.property_type);
          if (data.bedrooms) setRefinedBedrooms(data.bedrooms);
          if (data.max_budget) setRefinedMaxBudget(data.max_budget);
          if (data.preferred_neighborhoods) setRefinedNeighborhoods(data.preferred_neighborhoods);
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

  // MODIFIED: Check if user is on free plan before allowing neighborhood selection
  const toggleNeighborhood = async (neighborhood: string) => {
    // Check if user is on free plan
    const isFreePlan = !profileData?.subscription_plan || 
                      profileData.subscription_plan === 'free' || 
                      (profileData.subscription_plan !== 'unlimited' && 
                       profileData.subscription_plan !== 'open_door_plan');

    if (isFreePlan) {
      // Show upgrade modal instead of toggling
      setSelectedNeighborhoodForUpgrade(neighborhood);
      setShowUpgradeModal(true);
      return;
    }

    // Original logic for paid users
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

  const saveRefinedFilters = async () => {
    if (!user) return;
    
    setIsSavingPreferences(true);
    try {
      const updateData: any = {};
      
      if (refinedPropertyType) updateData.property_type = refinedPropertyType;
      if (refinedBedrooms !== undefined) updateData.bedrooms = refinedBedrooms;
      if (refinedMaxBudget !== undefined) updateData.max_budget = refinedMaxBudget;
      
      // Update both preferred_neighborhoods and neighborhood_preferences
      if (refinedNeighborhoods.length > 0) {
        const normalizedNeighborhoods = refinedNeighborhoods.map(n => 
          n.toLowerCase().replace(/\s+/g, '-')
        );
        updateData.preferred_neighborhoods = normalizedNeighborhoods;
        updateData.neighborhood_preferences = normalizedNeighborhoods;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Filters saved!",
        description: "Your refined email filters have been updated.",
      });
      
      setShowRefineFilters(false);
    } catch (error) {
      console.error('Error saving refined filters:', error);
      toast({
        title: "Error",
        description: "Failed to save filters. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    
    // Check if user is on free plan - redirect to checkout
    if (profileData?.subscription_plan !== 'unlimited') {
      navigate('/checkout');
      return;
    }
    
    // For unlimited plan users, open billing portal
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        console.error('Customer portal error:', error);
        toast({
          title: "Error",
          description: "Failed to open subscription management. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (error) {
      console.error('Customer portal error:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please contact support.",
        variant: "destructive",
      });
    }
  };

  // NEW: Handle upgrade modal actions
  const handleUpgradeClick = () => {
    setShowUpgradeModal(false);
    navigate('/checkout');
  };

  const handleCloseModal = () => {
    setShowUpgradeModal(false);
    setSelectedNeighborhoodForUpgrade("");
  };

  const filteredNeighborhoods = neighborhoods.filter(neighborhood =>
    neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // NEW: Check if user is on free plan
  const isFreePlan = !profileData?.subscription_plan || 
                    profileData.subscription_plan === 'free' || 
                    (profileData.subscription_plan !== 'unlimited' && 
                     profileData.subscription_plan !== 'open_door_plan');

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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold tracking-tight">Email Preferences</h2>
              {!isFreePlan && (
                <button
                  onClick={() => setShowRefineFilters(true)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium tracking-tight transition-all border border-white/20"
                >
                  Refine Filters
                </button>
              )}
            </div>
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
                      selectedNeighborhoods.includes(neighborhood) && !isFreePlan
                        ? 'bg-blue-500 text-white'
                        : isFreePlan
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 cursor-pointer'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    } ${isSavingPreferences ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {neighborhood}
                  </button>
                ))}
              </div>
            </div>

            {selectedNeighborhoods.length > 0 && !isFreePlan && (
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
                  {profileData.subscription_plan === 'open_door_plan' 
                    ? 'Open Door Plan' 
                    : (profileData.subscription_plan || 'Free') + ' Plan'
                  }
                </p>
                <p className="text-gray-400 text-sm tracking-tight">
                  {profileData.subscription_plan === 'unlimited' 
                    ? `Access to all deals and features (${profileData.subscription_renewal || 'monthly'} billing)` 
                    : profileData.subscription_plan === 'open_door_plan'
                    ? 'Free unlimited access'
                    : 'Unlimited deals per day'
                  }
                </p>
              </div>
                        
              <HoverButton 
                className="text-white font-semibold tracking-tight"
                onClick={handleManageSubscription}
              >
                Manage Subscription
              </HoverButton>
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

           {/* NEW: Glassmorphic Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          
          {/* Modal */}
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl">
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Content */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                Upgrade to unlimited to be notified for new deals in {selectedNeighborhoodForUpgrade}
              </h3>
              
              <p className="text-gray-300 mb-8 text-lg tracking-tight">
                The best deals in NYC are gone before most people ever see them. You won't be most people.
              </p>
              
              <button
                onClick={handleUpgradeClick}
                className="w-full bg-white text-black px-8 py-4 rounded-full font-semibold text-lg tracking-tight hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                Get Alerts Today
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Refine Filters Modal */}
      {showRefineFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowRefineFilters(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-black/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tighter">
                Refine Email Filters
              </h2>
              <button
                onClick={() => setShowRefineFilters(false)}
                className="text-white/70 hover:text-white transition-colors p-2"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Property Type */}
              <div className="space-y-3">
                <label className="text-sm text-white/80 font-medium tracking-tight">
                  Looking to buy or rent?
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setRefinedPropertyType('buy')}
                    className={`flex-1 px-6 py-3 rounded-full border text-sm font-medium tracking-tight transition-all ${
                      refinedPropertyType === 'buy'
                        ? 'border-white bg-white text-black'
                        : 'border-white/30 text-white hover:border-white/60'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setRefinedPropertyType('rent')}
                    className={`flex-1 px-6 py-3 rounded-full border text-sm font-medium tracking-tight transition-all ${
                      refinedPropertyType === 'rent'
                        ? 'border-white bg-white text-black'
                        : 'border-white/30 text-white hover:border-white/60'
                    }`}
                  >
                    Rent
                  </button>
                </div>
              </div>

              {/* Bedrooms */}
              <div className="space-y-3">
                <label className="text-sm text-white/80 font-medium tracking-tight">
                  Bedrooms
                </label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, '5+'].map((bed) => (
                    <button
                      key={bed}
                      onClick={() => setRefinedBedrooms(bed === '5+' ? 5 : bed as number)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium tracking-tight transition-all ${
                        refinedBedrooms === (bed === '5+' ? 5 : bed)
                          ? 'border-white bg-white text-black'
                          : 'border-white/30 text-white hover:border-white/60'
                      }`}
                    >
                      {bed}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Budget */}
              <div className="space-y-3">
                <label className="text-sm text-white/80 font-medium tracking-tight">
                  Max Budget: ${refinedMaxBudget?.toLocaleString() || '3,000'}
                </label>
                <Slider
                  value={[refinedMaxBudget || 3000]}
                  onValueChange={(value) => setRefinedMaxBudget(value[0])}
                  max={8000}
                  min={1000}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-white/60">
                  <span>$1,000</span>
                  <span>$8,000</span>
                </div>
              </div>

              {/* Neighborhoods */}
              <div className="space-y-3">
                <label className="text-sm text-white/80 font-medium tracking-tight">
                  Neighborhoods
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2">
                  {neighborhoods.map((neighborhood) => (
                    <button
                      key={neighborhood}
                      onClick={() => {
                        setRefinedNeighborhoods(prev =>
                          prev.includes(neighborhood)
                            ? prev.filter(n => n !== neighborhood)
                            : [...prev, neighborhood]
                        );
                      }}
                      className={`p-3 rounded-full border transition-all text-sm tracking-tight ${
                        refinedNeighborhoods.includes(neighborhood)
                          ? 'border-white bg-white text-black'
                          : 'border-white/30 text-white hover:border-white/60'
                      }`}
                    >
                      {neighborhood}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={saveRefinedFilters}
                disabled={isSavingPreferences}
                className="w-full bg-white text-black px-8 py-4 rounded-full font-semibold text-lg tracking-tight hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingPreferences ? 'Saving...' : 'Save Filters'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
