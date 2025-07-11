
import { useAuth } from "@/contexts/AuthContext";
import { HoverButton } from "@/components/ui/hover-button";

const SubscriptionStatus = () => {
  const { userProfile } = useAuth();

  const isSubscribed = userProfile?.subscription_plan === 'unlimited';

  const handleManageSubscription = () => {
    window.location.href = '/manage-subscription';
  };

  return (
    <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
      <h2 className="text-2xl font-semibold mb-6 tracking-tight">Subscription Plan</h2>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-medium tracking-tight">
            {isSubscribed ? `${userProfile?.subscription_plan} Plan` : 'Free Plan'}
          </p>
          <p className="text-gray-400 text-sm tracking-tight">
            {isSubscribed 
              ? 'Access to all deals and features' 
              : 'Limited to 3 deals per day'
            }
          </p>
        </div>
        
        {isSubscribed ? (
          <button
            onClick={handleManageSubscription}
            className="px-6 py-2 bg-white text-black rounded-full font-medium tracking-tight transition-colors hover:bg-gray-200"
          >
            Manage Subscription
          </button>
        ) : (
          <HoverButton 
            className="text-white font-semibold tracking-tight"
            onClick={() => window.location.href = '/pricing'}
          >
            Upgrade Plan
          </HoverButton>
        )}
      </div>
    </div>
  );
};

export default SubscriptionStatus;
