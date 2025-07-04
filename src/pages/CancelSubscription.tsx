
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const CancelSubscription = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");

  // Load user's profile data to check subscription plan
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
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, [user]);

  const handleManageSubscription = () => {
    navigate('/manage-subscription');
  };

  const handleLoseAccess = () => {
    setShowWarning(true);
  };

  const handleCancelSubscription = async () => {
    if (!selectedReason) {
      toast({
        title: "Please select a reason",
        description: "We'd like to know why you're leaving.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('cancel-subscription', {
        headers: {
          Authorization: `Bearer ${user?.session?.access_token}`,
        },
      });
      
      if (error) {
        console.error('Cancel subscription error:', error);
        toast({
          title: "Error",
          description: "Failed to cancel subscription. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled and you've been moved to the free plan.",
      });

      // Redirect to pricing page
      navigate('/pricing');
    } catch (error) {
      console.error('Cancel subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/pricing');
  };

  if (showWarning) {
    return (
      <div className="font-inter min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
              Are you sure you want to lose access to all of the undervalued listings in NYC?
            </h1>
          </div>

          <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-6 tracking-tight">
                Is the apartment hunt over?
              </h2>
              
              <div className="space-y-4 mb-8">
                <button
                  onClick={() => setSelectedReason("found_home")}
                  className={`w-full py-3 rounded-full font-medium tracking-tight transition-all ${
                    selectedReason === "found_home"
                      ? "bg-white text-black"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  Yes, I found my home below-market!
                </button>
                
                <button
                  onClick={() => setSelectedReason("old_fashioned")}
                  className={`w-full py-3 rounded-full font-medium tracking-tight transition-all ${
                    selectedReason === "old_fashioned"
                      ? "bg-white text-black"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  No, I'm going to search the old-fashioned way
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleCancelSubscription}
                disabled={isLoading || !selectedReason}
                className="w-full bg-gray-600 text-white py-3 rounded-full font-medium tracking-tight transition-all hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
              
              <button
                onClick={() => setShowWarning(false)}
                className="w-full bg-gray-800 text-white py-3 rounded-full font-medium tracking-tight transition-all hover:bg-gray-700"
              >
                Keep My Subscription
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-inter min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
            Cancel Your Subscription
          </h1>
          <p className="text-xl text-gray-400 tracking-tight">
            We're sorry to see you go. You can manage your subscription below.
          </p>
        </div>

        <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4 tracking-tight">
              Manage Your Subscription
            </h2>
            <p className="text-gray-300 tracking-tight">
              You'll be redirected to Stripe's secure customer portal where you can cancel your subscription, update payment methods, or view billing history.
            </p>
          </div>

          <div className="space-y-4">
            {profileData?.subscription_plan === 'unlimited' && (
              <>
                <button
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                  className="w-full bg-white text-black py-3 rounded-full font-medium tracking-tight transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Opening...' : 'Manage Subscription'}
                </button>
                
                <button
                  onClick={handleLoseAccess}
                  className="w-full bg-red-600 text-white py-3 rounded-full font-medium tracking-tight transition-all hover:bg-red-700"
                >
                  Lose Access
                </button>
              </>
            )}
            
            <button
              onClick={handleGoBack}
              className="w-full bg-gray-800 text-white py-3 rounded-full font-medium tracking-tight transition-all hover:bg-gray-700"
            >
              Go Back to Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscription;
