
import { Link, useSearchParams } from "react-router-dom";
import { HoverButton } from "@/components/ui/hover-button";
import { Toggle, GooeyFilter } from "@/components/ui/liquid-toggle";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { subscribed, subscriptionTier, createCheckout, openCustomerPortal, isLoading, checkSubscription } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    // Update meta tags for SEO
    document.title = "Pricing - Realer Estate | Find NYC Real Estate Deals Early";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get early access to the best NYC real estate deals. Free plan available. Unlimited access to undervalued properties starting at $3/month.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Get early access to the best NYC real estate deals. Free plan available. Unlimited access to undervalued properties starting at $3/month.';
      document.head.appendChild(meta);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Pricing - Realer Estate | Find NYC Real Estate Deals Early');
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', 'Get early access to the best NYC real estate deals. Free plan available. Unlimited access starting at $3/month.');
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', 'https://realerestate.org/pricing');

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', 'Pricing - Realer Estate | Find NYC Real Estate Deals Early');
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', 'Get early access to the best NYC real estate deals. Free plan available. Unlimited access starting at $3/month.');
    
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute('content', 'https://realerestate.org/pricing');

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://realerestate.org/pricing');
  }, []);

  // Handle success/cancel from Stripe
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true') {
      toast({
        title: "Payment Successful!",
        description: "Welcome to the Unlimited plan! Your subscription is now active.",
      });
      // Refresh subscription status
      checkSubscription();
    } else if (canceled === 'true') {
      toast({
        title: "Payment Canceled",
        description: "Your payment was canceled. You can try again anytime.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast, checkSubscription]);

  const handleSubscribe = async (billingType: 'monthly' | 'annual') => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to subscribe.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCheckout(billingType);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please try again.",
        variant: "destructive",
      });
    }
  };

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
            <div className="bg-black/50 rounded-2xl p-8 border border-gray-800 flex flex-col">
              <h3 className="text-2xl font-semibold mb-4 tracking-tight">Free</h3>
              <p className="text-4xl font-semibold mb-6 tracking-tight">$0</p>
              <ul className="space-y-3 mb-12 text-gray-300 flex-grow">
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
              <button 
                className="w-full bg-gray-800 text-white py-3 rounded-full font-medium tracking-tight hover:bg-gray-700 transition-all mt-8"
                disabled
              >
                Current Plan
              </button>
            </div>

            {/* Unlimited Plan */}
            <div className="relative flex flex-col">
              {/* Card with animated border */}
              <div className="relative overflow-hidden rounded-2xl p-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:300%_300%] animate-[gradient_6s_ease_infinite]">
                {/* Card content with black background */}
                <div className="relative bg-black rounded-2xl p-8 flex flex-col h-full">
                  {/* Header with title only */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-semibold tracking-tight">
                      Unlimited
                      {subscribed && subscriptionTier && (
                        <span className="ml-2 text-sm bg-green-600 text-white px-2 py-1 rounded-full">
                          Active - {subscriptionTier}
                        </span>
                      )}
                    </h3>
                  </div>
                  <p className="text-4xl font-semibold mb-6 tracking-tight">
                    {isAnnual ? (
                      <>$19<span className="text-lg text-gray-400">/yr</span></>
                    ) : (
                      <>$3<span className="text-lg text-gray-400">/mo</span></>
                    )}
                  </p>
                  <ul className="space-y-3 mb-12 text-gray-300 flex-grow">
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
                  
                  {subscribed ? (
                    <button 
                      onClick={handleManageSubscription}
                      disabled={isLoading}
                      className="w-full bg-blue-600 text-white py-3 rounded-full font-medium tracking-tight transition-all mt-8 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isLoading ? "Loading..." : "Manage Subscription"}
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleSubscribe(isAnnual ? 'annual' : 'monthly')}
                      disabled={isLoading}
                      className="w-full bg-white text-black py-3 rounded-full font-medium tracking-tight transition-all mt-8 hover:bg-gray-200 disabled:opacity-50"
                    >
                      {isLoading ? "Loading..." : `Subscribe ${isAnnual ? "Annually" : "Monthly"}`}
                    </button>
                  )}
                </div>
              </div>
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
          <Link to="/join">
            <HoverButton className="text-white font-semibold tracking-tight">
              Join now.
            </HoverButton>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
