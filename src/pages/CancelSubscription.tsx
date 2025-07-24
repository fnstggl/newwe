
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
  const [showConfirmation, setShowConfirmation] = useState(false);
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

  const handleLoseAccess = () => {
    setShowConfirmation(true);
  };

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
  };

  const handleCancelSubscription = async () => {
    if (!selectedReason) {
      toast({
        title: "Please select a reason",
        description: "Please tell us about your apartment hunt before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Open Stripe customer portal for subscription management
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
        // Open the Stripe customer portal where users can properly cancel their subscription
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/pricing');
  };

  if (!showConfirmation) {
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
                Click below to cancel your unlimited access and return to the free plan.
              </p>
            </div>

            <div className="space-y-4">
              {profileData?.subscription_plan === 'unlimited' && (
                <button
                  onClick={handleLoseAccess}
                  disabled={isLoading}
                  className="w-full bg-white text-black py-3 rounded-full font-medium tracking-tight transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Loading...' : 'Lose Access'}
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
  }

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
                onClick={() => handleReasonSelect("found")}
                className={`w-full py-3 rounded-full font-medium tracking-tight transition-all border ${
                  selectedReason === "found" 
                    ? "bg-white text-black border-white" 
                    : "bg-transparent text-white border-gray-600 hover:border-gray-400"
                }`}
              >
                Yes, I found my home below-market!
              </button>
              
              <button
                onClick={() => handleReasonSelect("traditional")}
                className={`w-full py-3 rounded-full font-medium tracking-tight transition-all border ${
                  selectedReason === "traditional" 
                    ? "bg-white text-black border-white" 
                    : "bg-transparent text-white border-gray-600 hover:border-gray-400"
                }`}
              >
                No, I'm going to search the old-fashioned way
              </button>
            </div>

            <div className="bg-blue-500/10 rounded-lg p-4 mb-6 border border-blue-500/20">
              <p className="text-sm text-blue-400 tracking-tight">
                Note: You'll maintain access to your unlimited plan until the end of your billing period, even after cancellation.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleCancelSubscription}
              disabled={isLoading || !selectedReason}
              className="w-full bg-gray-800 text-white py-3 rounded-full font-medium tracking-tight transition-all hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Opening Stripe Portal...' : 'Manage Subscription in Stripe'}
            </button>
            
            <button
              onClick={() => setShowConfirmation(false)}
              className="w-full bg-transparent text-gray-400 py-3 rounded-full font-medium tracking-tight transition-all hover:text-white border border-gray-600 hover:border-gray-400"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscription;
