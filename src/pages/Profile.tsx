import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, X } from "lucide-react";
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

  // Upgrade prompt modal
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedNeighborhoodForUpgrade, setSelectedNeighborhoodForUpgrade] = useState("");

  // Refine filters modal
  const [showRefineFiltersModal, setShowRefineFiltersModal] = useState(false);

  // Helper to normalize neighborhood keys
  const slugifyNeighborhood = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-");

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Load user's profile data including subscription info
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error loading user profile:", error);
          return;
        }

        if (data) {
          setProfileData(data);

          if (data.neighborhood_preferences) {
            // Normalize whatever is stored into slugs
            const normalized = data.neighborhood_preferences.map((n: string) =>
              slugifyNeighborhood(n)
            );
            setSelectedNeighborhoods(normalized);
          }
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };

    loadUserProfile();
  }, [user]);

  // Fetch neighborhoods from the database
  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const [salesResponse, rentalsResponse] = await Promise.all([
          supabase
            .from("undervalued_sales")
            .select("neighborhood")
            .not("neighborhood", "is", null),
          supabase
            .from("undervalued_rentals")
            .select("neighborhood")
            .not("neighborhood", "is", null),
        ]);

        const allNeighborhoods = new Set<string>();

        if (salesResponse.data) {
          salesResponse.data.forEach((item) => {
            if (item.neighborhood) allNeighborhoods.add(item.neighborhood);
          });
        }

        if (rentalsResponse.data) {
          rentalsResponse.data.forEach((item) => {
            if (item.neighborhood) allNeighborhoods.add(item.neighborhood);
          });
        }

        setNeighborhoods(Array.from(allNeighborhoods).sort());
      } catch (error) {
        console.error("Error fetching neighborhoods:", error);
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
    navigate("/");
  };

  // Check if user is on free plan
  const isFreePlan =
    !profileData?.subscription_plan ||
    profileData.subscription_plan === "free" ||
    (profileData.subscription_plan !== "unlimited" &&
      profileData.subscription_plan !== "open_door_plan" &&
      !profileData.manual_unlimited &&
      profileData.subscription_plan !== "staff");

  const saveNeighborhoodPreferences = async (preferences: string[]) => {
    if (!user) return;

    setIsSavingPreferences(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          neighborhood_preferences: preferences,
          preferred_neighborhoods: preferences, // ✅ keep both in sync
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error saving neighborhood preferences:", error);
        toast({
          title: "Error",
          description:
            "Failed to save neighborhood preferences. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Preferences saved",
          description: "Your neighborhood email preferences have been updated.",
        });
      }
    } catch (error) {
      console.error("Error saving neighborhood preferences:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const toggleNeighborhood = async (neighborhood: string) => {
    // Gate free plan
    if (isFreePlan) {
      setSelectedNeighborhoodForUpgrade(neighborhood);
      setShowUpgradeModal(true);
      return;
    }

    const slug = slugifyNeighborhood(neighborhood);

    const newSelectedNeighborhoods = selectedNeighborhoods.includes(slug)
      ? selectedNeighborhoods.filter((n) => n !== slug)
      : [...selectedNeighborhoods, slug];

    setSelectedNeighborhoods(newSelectedNeighborhoods);
    await saveNeighborhoodPreferences(newSelectedNeighborhoods);
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    if (
      profileData?.subscription_plan !== "unlimited" &&
      !profileData.manual_unlimited &&
      profileData?.subscription_plan !== "open_door_plan" &&
      profileData?.subscription_plan !== "staff"
    ) {
      navigate("/checkout");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");

      if (error) {
        console.error("Customer portal error:", error);
        toast({
          title: "Error",
          description:
            "Failed to open subscription management. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Customer portal error:", error);
      toast({
        title: "Error",
        description:
          "Failed to open subscription management. Please contact support.",
        variant: "destructive",
      });
    }
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(false);
    navigate("/checkout");
  };

  const handleCloseModal = () => {
    setShowUpgradeModal(false);
    setSelectedNeighborhoodForUpgrade("");
  };

  const filteredNeighborhoods = neighborhoods.filter((neighborhood) =>
    neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || !userProfile || !profileData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 tracking-tighter">Profile</h1>
          <p className="text-gray-400 text-lg tracking-tight">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-8">
          {/* Account Information */}
          <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold mb-6 tracking-tight">
              Account Information
            </h2>

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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Email Preferences
                </h2>
                <p className="text-gray-400 text-sm tracking-tight">
                  Select the neighborhoods you want to receive deal alerts for:
                </p>
              </div>

              {/* Refine filters button – Unlimited / Open Door / manual_unlimited / staff */}
              {profileData.subscription_plan === "unlimited" ||
              profileData.subscription_plan === "open_door_plan" ||
              profileData.subscription_plan === "manual_unlimited" ||
              profileData.subscription_plan === "staff" ||
              profileData.manual_unlimited ? (
                <button
                  onClick={() => setShowRefineFiltersModal(true)}
                  className="px-4 py-2 rounded-full text-xs font-medium tracking-tight
                    bg-white/5 border border-white/20 text-white
                    hover:bg-white/10 hover:border-white/40
                    backdrop-blur-md transition-all duration-200
                    shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                >
                  Refine filters
                </button>
              ) : null}
            </div>

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
                      selectedNeighborhoods.includes(
                        slugifyNeighborhood(neighborhood)
                      ) && !isFreePlan
                        ? "bg-blue-500 text-white"
                        : isFreePlan
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700 cursor-pointer"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    } ${
                      isSavingPreferences
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {neighborhood}
                  </button>
                ))}
              </div>
            </div>

            {selectedNeighborhoods.length > 0 && !isFreePlan && (
              <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-sm text-blue-400 tracking-tight">
                  You'll receive email notifications for deals in{" "}
                  {selectedNeighborhoods.length} neighborhood
                  {selectedNeighborhoods.length !== 1 ? "s" : ""}.
                </p>
              </div>
            )}
          </div>

          {/* Subscription Plan */}
          <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold mb-6 tracking-tight">
              Subscription Plan
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium tracking-tight capitalize">
                  {profileData.subscription_plan === "open_door_plan"
                    ? "Open Door Plan"
                    : (profileData.subscription_plan || "Free") + " Plan"}
                </p>
                <p className="text-gray-400 text-sm tracking-tight">
                  {profileData.subscription_plan === "unlimited" ||
                  profileData.manual_unlimited
                    ? `Access to all deals and features (${
                        profileData.subscription_renewal || "monthly"
                      } billing)`
                    : profileData.subscription_plan === "open_door_plan"
                    ? "Free unlimited access"
                    : "Unlimited deals per day"}
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

      {/* Refine Filters Modal */}
      <RefineFiltersModal
        open={showRefineFiltersModal}
        onClose={() => setShowRefineFiltersModal(false)}
        neighborhoods={neighborhoods}
        slugifyNeighborhood={slugifyNeighborhood}
      />

      {/* Glassmorphic Upgrade Modal */}
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
                Upgrade to unlimited to be notified for new deals in{" "}
                {selectedNeighborhoodForUpgrade}
              </h3>

              <p className="text-gray-300 mb-8 text-lg tracking-tight">
                The best deals in NYC are gone before most people ever see them.
                You won't be most people.
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
    </div>
  );
};

interface RefineFiltersModalProps {
  open: boolean;
  onClose: () => void;
  neighborhoods: string[];
  slugifyNeighborhood: (name: string) => string;
}

const RefineFiltersModal: React.FC<RefineFiltersModalProps> = ({
  open,
  onClose,
  neighborhoods,
  slugifyNeighborhood,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [propertyType, setPropertyType] = useState<"buy" | "rent">("rent");
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [maxBudget, setMaxBudget] = useState<number | null>(null);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(
    []
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    // Reset when opened – you can preload from profile later if you want
    setPropertyType("rent");
    setBedrooms(null);
    setMaxBudget(null);
    setSelectedNeighborhoods([]);
  }, [open]);

  if (!open) return null;

  const toggleNeighborhood = (name: string) => {
    const slug = slugifyNeighborhood(name);
    setSelectedNeighborhoods((prev) =>
      prev.includes(slug) ? prev.filter((n) => n !== slug) : [...prev, slug]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const updateData: any = {
        property_type: propertyType,
        bedrooms: bedrooms ?? null,
        max_budget: maxBudget ?? null,
        preferred_neighborhoods: selectedNeighborhoods,
        neighborhood_preferences: selectedNeighborhoods,
      };

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Filters saved",
        description: "We’ll only email you deals that match these filters.",
      });

      onClose();
    } catch (err) {
      console.error("Error saving refined filters:", err);
      toast({
        title: "Error",
        description: "We couldn’t save your filters. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-black/95 border border-white/12 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.9)]">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tighter">
                Refine email filters
              </h2>
              <p className="text-xs md:text-sm text-gray-400 tracking-tight mt-1">
                We’ll only send alerts for deals that match what you choose
                here.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Buy or Rent */}
            <div>
              <label className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-2 block">
                Buy or rent
              </label>
              <div className="inline-flex rounded-full bg-white/5 border border-white/15 p-1 backdrop-blur-md">
                {(["rent", "buy"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setPropertyType(type)}
                    className={`px-4 py-1.5 text-xs md:text-sm rounded-full font-medium tracking-tight transition-all ${
                      propertyType === type
                        ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {type === "rent" ? "Rent" : "Buy"}
                  </button>
                ))}
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-2 block">
                Minimum bedrooms
              </label>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3, 4, "5+"] as const].map((b) => {
                  const value = b === "5+" ? 5 : b;
                  const active = bedrooms === value;
                  return (
                    <button
                      key={b}
                      onClick={() =>
                        setBedrooms(active ? null : (value as number))
                      }
                      className={`px-3 py-1.5 rounded-full text-xs md:text-sm border transition-all tracking-tight ${
                        active
                          ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                          : "border-white/25 text-gray-200 hover:border-white/60"
                      }`}
                    >
                      {b === 0 ? "Studio" : b === "5+" ? "5+ bed" : `${b} bed`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Max price */}
            <div>
              <label className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-2 block">
                Max price
              </label>
              <div className="bg-white/5 border border-white/12 rounded-2xl p-3 flex items-center gap-2">
                <span className="text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  className="bg-transparent flex-1 text-white text-sm md:text-base outline-none placeholder:text-gray-500"
                  placeholder={
                    propertyType === "rent"
                      ? "e.g. 3200 / month"
                      : "e.g. 900000"
                  }
                  value={maxBudget ?? ""}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    if (!val) {
                      setMaxBudget(null);
                    } else {
                      const num = parseInt(val, 10);
                      setMaxBudget(Number.isNaN(num) ? null : num);
                    }
                  }}
                />
              </div>
              <p className="mt-1 text-[11px] text-gray-500 tracking-tight">
                Leave blank if you don’t want a max.
              </p>
            </div>

            {/* Neighborhoods */}
            <div>
              <label className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-2 block">
                Neighborhoods
              </label>
              <p className="text-[11px] text-gray-500 mb-2 tracking-tight">
                Pick all the areas where you’d seriously consider living. We’ll
                prioritize deals there.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                {neighborhoods.map((n) => {
                  const slug = slugifyNeighborhood(n);
                  const active = selectedNeighborhoods.includes(slug);
                  return (
                    <button
                      key={n}
                      onClick={() => toggleNeighborhood(n)}
                      className={`px-3 py-2 rounded-full text-xs text-left border transition-all tracking-tight ${
                        active
                          ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                          : "bg-white/5 border-white/20 text-gray-200 hover:border-white/60"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-white text-black py-3 rounded-full font-semibold text-sm md:text-base tracking-tight hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSaving ? "Saving..." : "Save filters"}
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-full text-xs md:text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
