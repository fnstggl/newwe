
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const CancelSubscription = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
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

  const handleGoBack = () => {
    navigate('/pricing');
  };

  const handleLoseAccess = () => {
    setShowWarningDialog(true);
  };

  const handleCancelSubscription = async () => {
    if (!selectedReason) {
      toast({
        title: "Please select a reason",
        description: "Please tell us why you're cancelling before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('cancel-subscription', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
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

      setShowWarningDialog(false);
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

      <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              Are you sure you want to lose access to all of the undervalued listings in NYC?
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-lg mt-4">
              Is the apartment hunt over?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-6">
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="reason"
                  value="found_home"
                  checked={selectedReason === "found_home"}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-4 h-4 text-white"
                />
                <span className="text-white">Yes, I found my home below-market!</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="reason"
                  value="old_fashioned"
                  checked={selectedReason === "old_fashioned"}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-4 h-4 text-white"
                />
                <span className="text-white">No, I'm going to search the old-fashioned way</span>
              </label>
            </div>

            <button
              onClick={handleCancelSubscription}
              disabled={isLoading || !selectedReason}
              className="w-full bg-gray-600 text-white py-3 rounded-full font-medium tracking-tight transition-all hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? 'Cancelling...' : 'Cancel Subscription'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CancelSubscription;
