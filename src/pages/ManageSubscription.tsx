
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const ManageSubscription = () => {
  const navigate = useNavigate();
  const { user, userProfile, openCustomerPortal } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // If user is not on unlimited plan, redirect to pricing
    if (userProfile && userProfile.subscription_plan !== 'unlimited') {
      navigate('/pricing');
    }
  }, [user, userProfile, navigate]);

  const handleOpenStripePortal = async () => {
    setIsLoading(true);
    try {
      await openCustomerPortal();
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

  if (!userProfile) {
    return (
      <div className="font-inter min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-inter min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
            Manage Your Subscription
          </h1>
          <p className="text-xl text-gray-400 tracking-tight">
            Access your Stripe customer portal to manage your subscription.
          </p>
        </div>

        <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-blue-400 font-medium">
                Active Unlimited Subscription ({userProfile?.subscription_renewal || 'monthly'})
              </span>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4 tracking-tight">
              Stripe Customer Portal
            </h2>
            <p className="text-gray-300 tracking-tight">
              You'll be redirected to Stripe's secure customer portal where you can cancel your subscription, update payment methods, or view billing history.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleOpenStripePortal}
              disabled={isLoading}
              className="w-full bg-white text-black py-3 rounded-full font-medium tracking-tight transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Opening Portal...' : 'Open Stripe Portal'}
            </button>
            
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

export default ManageSubscription;
