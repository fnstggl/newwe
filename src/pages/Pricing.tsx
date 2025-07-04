
import { Link, useNavigate } from "react-router-dom";
import { HoverButton } from "@/components/ui/hover-button";
import { Toggle, GooeyFilter } from "@/components/ui/liquid-toggle";
import { useState, useEffect } from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const navigate = useNavigate();
  const { subscribed, subscriptionTier, subscriptionRenewal, openCustomerPortal } = useSubscription();
  const { user } = useAuth();
  const { toast } = useToast();

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

  useEffect(() => {
    // Update meta tags for SEO
    document.title = "Pricing - Realer Estate | Find NYC Real Estate Deals Early";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get early access to the best NYC real estate deals. Free plan available. Unlimited access to undervalued properties starting at $3/month.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Get early access to the best NYC real estate deals. Free plan available. Unlimited access starting at $3/month.';
      document.head.appendChild(meta);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Pricing - Realer Estate | Find NYC Real Estate Deals Early');
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', 'Get early access to the best NYC real estate deals. Free plan available. Unlimited access starting at $3/month.');
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', 'https://realerestate.org/pricing');

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', 'Pricing - Realer Estate | Find NYC Real Estate Deals Early');
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', 'Get early access to the best NYC real estate deals. Free plan available. Unlimited access starting at $3/month.');
    
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute('content', 'https://realerestate.org/pricing');

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://realerestate.org/pricing');

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast({
        title: "Subscription successful!",
        description: "Welcome to the Unlimited plan. You now have access to all deals.",
      });
      window.history.replaceState({}, document.title, '/pricing');
    } else if (urlParams.get('canceled') === 'true') {
      toast({
        title: "Subscription canceled",
        description: "No worries! You can subscribe anytime.",
        variant: "destructive",
      });
      window.history.replaceState({}, document.title, '/pricing');
    }
  }, [toast]);

  const handleSubscribe = (billingCycle: 'monthly' | 'annual') => {
    if (!user) {
      navigate('/login');
      return;
    }

    navigate(`/checkout?billing=${billingCycle}`);
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      console.error('Customer portal error:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelSubscription = () => {
    navigate('/cancel-subscription');
  };

  // Check if user is on unlimited plan using profiles table
  const isOnUnlimitedPlan = profileData?.subscription_plan === 'unlimited';

  return (
    <div className="font-inter min-h-screen bg-black text-white">
      <GooeyFilter />

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
              Real estate is all about being early.
            </h1>
            <p className="text-xl text-gray-400 tracking-tight">
              The best deals disappear in days. Get notified first.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-lg ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>
                Monthly
              </span>
              <Toggle
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                variant="default"
              />
              <span className={`text-lg ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
                Annual
              </span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-black/50 rounded-2xl p-8 border border-gray-800 flex flex-col h-full">
              <h3 className="text-2xl font-semibold mb-4 tracking-tight">Free</h3>
              <p className="text-4xl font-semibold mb-6 tracking-tight">$0</p>
              <ul className="space-y-3 mb-24 text-gray-300 flex-grow">
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-3">•</span>
                  See up to 3 deals per day (all for now)
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-3">•</span>
                  Basic deal scores
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-3">•</span>
                  Neighborhood data
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-3">•</span>
                  Search and filter
                </li>
              </ul>
              {isOnUnlimitedPlan ? (
                <button 
                  onClick={handleCancelSubscription}
                  className="w-full bg-gray-800 text-white py-3 rounded-full font-medium tracking-tight transition-all hover:bg-gray-700"
                >
                  Lose Access
                </button>
              ) : (
                <button 
                  className="w-full bg-gray-800 text-white py-3 rounded-full font-medium tracking-tight cursor-not-allowed"
                  disabled
                >
                  Current Plan
                </button>
              )}
            </div>

            {/* Unlimited Plan */}
            <div className="relative flex flex-col h-full">
              {/* Card with animated border */}
              <div className={`relative overflow-hidden rounded-2xl p-[3px] h-full ${
                isOnUnlimitedPlan
                  ? 'bg-gradient-to-r from-green-500 via-blue-500 to-green-500 bg-[length:300%_300%] animate-[gradient_6s_ease_infinite]'
                  : 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:300%_300%] animate-[gradient_6s_ease_infinite]'
              }`}>
                {/* Card content with black background */}
                <div className="relative bg-black rounded-2xl p-8 flex flex-col h-full">
                  {/* Header with subscription status badge */}
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-2xl font-semibold tracking-tight">Unlimited</h3>
                    {isOnUnlimitedPlan && (
                      <span className="bg-green-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                        Current Plan
                      </span>
                    )}
                  </div>
                  <p className="text-4xl font-semibold mb-6 tracking-tight">
                    {isAnnual ? (
                      <>$19<span className="text-lg text-gray-400">/yr</span></>
                    ) : (
                      <>$3<span className="text-lg text-gray-400">/mo</span></>
                    )}
                  </p>
                  <ul className="space-y-3 mb-24 text-gray-300 flex-grow">
                    <li className="flex items-center tracking-tight">
                      <span className="text-blue-400 mr-3">•</span>
                      <strong className="text-white">Access to ALL deals</strong>
                    </li>
                    <li className="flex items-center tracking-tight">
                      <span className="text-blue-400 mr-3">•</span>
                      Email alerts for new deals
                    </li>
                    <li className="flex items-center tracking-tight">
                      <span className="text-blue-400 mr-3">•</span>
                      Select areas to be notified in
                    </li>
                    <li className="flex items-center tracking-tight">
                      <span className="text-blue-400 mr-3">•</span>
                      Advanced deal analysis
                    </li>
                  </ul>
                  
                  {isOnUnlimitedPlan ? (
                    <button
                      className="w-full bg-blue-600 text-white py-3 rounded-full font-medium tracking-tight cursor-not-allowed"
                      disabled
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(isAnnual ? 'annual' : 'monthly')}
                      className="w-full bg-white text-black py-3 rounded-full font-medium tracking-tight transition-all hover:bg-gray-200"
                    >
                      {`Subscribe ${isAnnual ? 'Annually' : 'Monthly'}`}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Subscription status display */}
          {isOnUnlimitedPlan && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400 font-medium">
                  Active {profileData?.subscription_plan === 'unlimited' ? 'Unlimited' : profileData?.subscription_plan} Subscription ({profileData?.subscription_renewal || 'monthly'})
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
            Don't overpay. Ever again.
          </h2>
          <p className="text-xl text-gray-300 mb-12 tracking-tight">
            Join the platform that actually works for buyers.
          </p>
          {!user ? (
            <Link to="/join">
              <HoverButton className="text-white font-semibold tracking-tight">
                Join now.
              </HoverButton>
            </Link>
          ) : !isOnUnlimitedPlan ? (
            <button
              onClick={() => handleSubscribe('monthly')}
              className="bg-white text-black px-8 py-4 rounded-full font-semibold tracking-tight transition-all hover:bg-gray-200"
            >
              Start Your Subscription
            </button>
          ) : (
            <div className="text-green-400 font-semibold text-lg">
              You're all set! Enjoy unlimited access to all deals.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Pricing;
