
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const CancelSubscription = () => {
  const navigate = useNavigate();
  const { openCustomerPortal } = useSubscription();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

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

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      await openCustomerPortal();
    } catch (error) {
      console.error('Customer portal error:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/pricing');
  };

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
              <button
                onClick={handleCancelSubscription}
                disabled={isLoading}
                className="w-full bg-white text-black py-3 rounded-full font-medium tracking-tight transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Opening...' : 'Manage Subscription'}
              </button>
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
