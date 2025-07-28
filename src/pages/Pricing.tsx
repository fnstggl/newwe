
import { Link, useNavigate } from "react-router-dom";
import { HoverButton } from "@/components/ui/hover-button";
import { Toggle, GooeyFilter } from "@/components/ui/liquid-toggle";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

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

  const handleManageSubscription = () => {
    navigate('/manage-subscription');
  };

  const handleCancelSubscription = () => {
    navigate('/cancel-subscription');
  };

  // Check if user is on unlimited plan using userProfile from AuthContext
  const isOnUnlimitedPlan = userProfile?.subscription_plan === 'unlimited';
  const isCanceled = userProfile?.is_canceled || false;

  // Format subscription end date for display
  const formatSubscriptionEndDate = (endDate: string) => {
    const date = new Date(endDate);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="font-inter min-h-screen bg-black text-white">
      <GooeyFilter />

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
              Ready to finally find a home you can afford?
            </h1>
            <p className="text-xl text-gray-400 tracking-tight">
              These deals don’t wait. People grab them before you even know they exist.
            </p>
        <div className="mt-10 flex justify-center">
  <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl px-6 py-5 max-w-xl shadow-xl">
    <p className="text-gray-100 text-sm md:text-base leading-snug tracking-tight">
      “I was about to sign a lease in Dumbo for $4,200. Found a stabilized one here for $2,550. Same block. No broker fee. Insane.”
    </p>
    <p className="mt-3 text-sm text-blue-400 font-medium">– Sasha, Brooklyn renter</p>
  </div>
</div>
            </div>

          <div className="text-center mb-16">
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
                  9 deals per day
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-3">•</span>
                  Advanced deal analysis
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
                  {isCanceled ? 'Renew Subscription' : 'Lose Access'}
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
              <div className="relative overflow-hidden rounded-2xl p-[3px] h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:300%_300%] animate-[gradient_6s_ease_infinite]">
                {/* Card content with black background */}
                <div className="relative bg-black rounded-2xl p-8 flex flex-col h-full">
                  {/* Header without subscription status badge for unlimited users */}
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-2xl font-semibold tracking-tight">Unlimited</h3>
                  </div>
                 <div className="mb-6 flex items-center justify-between">
    <p className="text-4xl font-semibold tracking-tight">
    {isAnnual ? (
      <>$19<span className="text-lg text-gray-400">/yr</span></>
    ) : (
      <>$3<span className="text-lg text-gray-400">/mo</span></>
    )}
  </p>
  <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full border border-blue-500 bg-blue-900/30 text-blue-400 text-xs font-medium tracking-tight">
    Compared to ~$3,600 broker avg
  </span>
</div>
                  <ul className="space-y-3 mb-24 text-gray-300 flex-grow">
                    <li className="flex items-center tracking-tight">
                      <span className="text-blue-400 mr-3">•</span>
                      <strong className="text-white">Unlock ALL deals</strong>
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
                      Get deals before they're gone
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

<p className="text-center text-sm text-gray-500 mt-4 tracking-tight">
  Cancel anytime. No risk, just better rent.
</p>
          
          {/* Subscription status display */}
          {isOnUnlimitedPlan && (
            <div className="mt-8 text-center">
              <div className={`inline-flex items-center gap-2 ${isCanceled ? 'bg-red-500/10 border-red-500/20' : 'bg-blue-500/10 border-blue-500/20'} rounded-full px-4 py-2`}>
                <div className={`w-2 h-2 ${isCanceled ? 'bg-red-500' : 'bg-blue-500'} rounded-full`}></div>
                <span className={`${isCanceled ? 'text-red-400' : 'text-blue-400'} font-medium`}>
                  {isCanceled ? (
                    `Losing early access ${userProfile?.subscription_end ? formatSubscriptionEndDate(userProfile.subscription_end) : ''}`
                  ) : (
                    `Active ${userProfile?.subscription_plan === 'unlimited' ? 'Unlimited' : userProfile?.subscription_plan} Subscription (${userProfile?.subscription_renewal || 'monthly'})`
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Email Notification Mockup */}
          <div className="mt-16 flex justify-center">
            <div className="max-w-3xl w-full">
              <img 
                src="/lovable-uploads/998ab199-d0b6-406e-890c-9cdc289f4a6d.png" 
                alt="Email notification preview" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
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
              Join 6000+ New Yorkers
            </button>
          ) : (
            <div className="text-blue-400 font-semibold text-lg">
              You're all set! Enjoy unlimited access to all deals.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Pricing;
