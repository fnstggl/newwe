import { Link, useNavigate } from "react-router-dom";
import { HoverButton } from "@/components/ui/hover-button";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Toggle, GooeyFilter } from "@/components/ui/liquid-toggle";
import { X, Check, Star, Unlock, Home } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";

const Pricing = () => {
  const navigate = useNavigate();
  const { user, userProfile, session } = useAuth();
  const { toast } = useToast();
  const [isAnnual, setIsAnnual] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
const [successStep, setSuccessStep] = useState(1);
const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
const [refinedBedrooms, setRefinedBedrooms] = useState<number | undefined>();
const [refinedMaxBudget, setRefinedMaxBudget] = useState<number | undefined>();
const [refinedDiscountThreshold, setRefinedDiscountThreshold] = useState<number | undefined>();
const [showRefineFilters, setShowRefineFilters] = useState(false);
  const isMobile = useIsMobile();


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
  setShowSuccessPopup(true);
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

  const handleSubscribe = async (billingCycle: 'annual' | 'monthly' = 'annual') => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          billing_cycle: billingCycle
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) {
        console.error('Checkout error:', error);
        toast({
          title: "Error",
          description: "Failed to create checkout session. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        // Open Stripe hosted checkout in same tab
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to start subscription. Please try again.",
        variant: "destructive",
      });
    }
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

// REPLACE THE RETURN STATEMENT (around line 120) with this mobile-responsive version:
return (
  <div className={`font-inter min-h-screen bg-black text-white ${isMobile ? 'pb-20' : ''}`}>
    <GooeyFilter />
    
    {/* Pricing Section */}
    <section className={`${isMobile ? 'py-8 px-4' : 'py-20 px-4'} bg-gray-900/30`}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center ${isMobile ? 'mb-8' : 'mb-16'}`}>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl md:text-5xl'} font-semibold ${isMobile ? 'mb-3' : 'mb-6'} tracking-tighter`}>
            Ready to finally find a home you can afford?
          </h1>
          <p className={`${isMobile ? 'text-base' : 'text-xl'} text-gray-400 tracking-tight`}>
            These deals don't wait. People grab them before you even know they exist.
          </p>
          
          {/* Testimonial - Mobile responsive */}
          <div className={`${isMobile ? 'mt-6' : 'mt-10'} flex justify-center`}>
            <div className={`bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl ${isMobile ? 'px-4 py-3 max-w-sm' : 'px-6 py-5 max-w-xl'} shadow-xl`}>
              <p className={`text-gray-100 ${isMobile ? 'text-xs' : 'text-sm md:text-base'} leading-snug tracking-tight`}>
                "I was about to sign a lease in Dumbo for $4,200. Found a stabilized one here for $2,550. Same block. No broker fee. Insane."
              </p>
              <p className={`${isMobile ? 'mt-2 text-xs' : 'mt-3 text-sm'} text-blue-400 font-medium`}>– Sasha, Brooklyn renter</p>
            </div>
          </div>

          {/* Billing Toggle - Mobile responsive */}
          <div className={`${isMobile ? 'mt-6' : 'mt-10'} flex items-center justify-center gap-4`}>
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium transition-colors ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
              Annual
            </span>
            <Toggle 
              checked={!isAnnual} 
              onCheckedChange={(checked) => setIsAnnual(!checked)}
              variant="default"
            />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium transition-colors ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </span>
          </div>
        </div>
        
     {/* Pricing Cards - Mobile: side by side, Desktop: unchanged */}
        <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'grid md:grid-cols-2 gap-8'} max-w-4xl mx-auto`}>
          {/* Free Plan - Mobile responsive */}
          <div className={`bg-black/50 rounded-2xl ${isMobile ? 'p-4' : 'p-8'} border border-gray-800 flex flex-col h-full`}>
            <h3 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-semibold ${isMobile ? 'mb-2' : 'mb-4'} tracking-tight`}>Free</h3>
            <p className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-semibold ${isMobile ? 'mb-3' : 'mb-6'} tracking-tight`}>$0</p>
            <p className="text-gray-400 mb-4 tracking-tight"> </p>
            <ul className={`space-y-2 ${isMobile ? 'mb-8 text-xs' : 'mb-24'} text-gray-300 flex-grow`}>
              <li className="flex items-center tracking-tight">
                <span className="text-blue-400 mr-2">•</span>
                {isMobile ? '24 deals/day' : '24 deals per day'}
              </li>
              <li className="flex items-center tracking-tight">
                <span className="text-blue-400 mr-2">•</span>
                {isMobile ? 'Deal analysis' : 'Advanced deal analysis'}
              </li>
              <li className="flex items-center tracking-tight">
                <span className="text-blue-400 mr-2">•</span>
                {isMobile ? 'Neighborhood data' : 'Neighborhood data'}
              </li>
              <li className="flex items-center tracking-tight">
                <span className="text-blue-400 mr-2">•</span>
                {isMobile ? 'Search & filter' : 'Search and filter'}
              </li>
            </ul>
            {isOnUnlimitedPlan ? (
              <button 
                onClick={handleCancelSubscription}
                className={`w-full bg-gray-800 text-white ${isMobile ? 'py-2 text-xs' : 'py-3'} rounded-full font-medium tracking-tight transition-all hover:bg-gray-700`}
              >
                {isCanceled ? 'Renew' : 'Lose Access'}
              </button>
            ) : (
              <button 
                className={`w-full bg-gray-800 text-white ${isMobile ? 'py-2 text-xs' : 'py-3'} rounded-full font-medium tracking-tight cursor-not-allowed`}
                disabled
              >
                Current Plan
              </button>
            )}
          </div>

{/* Unlimited Plan - Mobile responsive */}
<div className="relative flex flex-col h-full">
  {/* Rotating gradient border */}
  <div className="relative overflow-hidden rounded-2xl p-[3px] h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:300%_300%] animate-spin-slow">
    
    <div className={`relative bg-black rounded-2xl ${isMobile ? 'p-4' : 'p-8'} flex flex-col h-full overflow-hidden`}>
    
    <div className={`relative bg-black rounded-2xl ${isMobile ? 'p-4' : 'p-8'} flex flex-col h-full overflow-hidden`}>
      {/* Background gradient image */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-80"
        style={{
          backgroundImage: "url('/lovable-uploads/pricing-gradient.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
    
      
      <div className="relative z-10 flex flex-col h-full">
                  <div className={`${isMobile ? 'mb-2' : 'mb-4'} flex items-center justify-between`}>
                    <h3 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-semibold tracking-tight`}>Unlimited</h3>
                  </div>
                  <div className={`${isMobile ? 'mb-3' : 'mb-6'} flex items-center justify-between`}>
                    <div>
                      {isAnnual ? (
                        <>
                          <p className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-semibold tracking-tight`}>
                            $1.50<span className={`${isMobile ? 'text-sm' : 'text-lg'} text-gray-400`}>/mo</span>
                          </p>
                          <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-[#7D66EE] font-medium mt-1 tracking-tight`}>
                            Save 83% vs monthly
                          </p>
                          <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-500 mt-1 tracking-tight`}>
                            $18/yr • billed annually
                          </p>
                        </>
                      ) : (
                        <p className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-semibold tracking-tight`}>
                          $9<span className={`${isMobile ? 'text-sm' : 'text-lg'} text-gray-400`}>/mo</span>
                        </p>
                      )}
                    </div>
                    {!isMobile && (
                      <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full border border-blue-500 bg-blue-900/30 text-blue-400 text-xs font-medium tracking-tight">
                        Compared to ~$3,600 broker avg
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mb-4 tracking-tight"> </p>
                  <ul className={`space-y-2 ${isMobile ? 'mb-8 text-xs' : 'mb-24'} text-gray-300 flex-grow`}>
                    <li className="flex items-center tracking-tight">
                      <span className="text-blue-400 mr-2">•</span>
                      <strong className="text-white">{isMobile ? 'ALL deals' : 'Unlock ALL rental & sale deals'}</strong>
                    </li>
                    <li className="flex items-center tracking-tight">
                      <span className="text-blue-400 mr-2">•</span>
                      {isMobile ? 'Personal deals' : 'Personalized deals found for you'}
                    </li>
                    <li className="flex items-center tracking-tight">
                      <span className="text-blue-400 mr-2">•</span>
                      {isMobile ? 'Instant alerts' : 'Instant alerts on new deals'}
                    </li>
                    <li className="flex items-center tracking-tight">
                      <span className="text-blue-400 mr-2">•</span>
                      {isMobile ? '6000+ users' : 'Thousands of New Yorkers already saving'}
                    </li>
                  </ul>
                  
                  {isOnUnlimitedPlan ? (
                    <button
                      className={`w-full bg-blue-600 text-white ${isMobile ? 'py-2 text-xs' : 'py-3'} rounded-full font-medium tracking-tight cursor-not-allowed`}
                      disabled
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(isAnnual ? 'annual' : 'monthly')}
                      className={`w-full bg-white text-black ${isMobile ? 'py-2 text-xs' : 'py-3'} rounded-full font-medium tracking-tight transition-all hover:bg-gray-200`}
                    >
                      {isAnnual ? 'Try for Free' : 'Subscribe Now'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className={`text-center ${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 ${isMobile ? 'mt-2' : 'mt-4'} tracking-tight`}>
          {isAnnual 
            ? "3-day free trial • Cancel anytime"
            : "Find the best deal in the city • Cancel anytime"
          }
        </p>
        
        {/* Subscription status display */}
        {isOnUnlimitedPlan && (
          <div className={`${isMobile ? 'mt-4' : 'mt-8'} text-center`}>
            <div className={`inline-flex items-center gap-2 ${isCanceled ? 'bg-red-500/10 border-red-500/20' : 'bg-blue-500/10 border-blue-500/20'} rounded-full ${isMobile ? 'px-3 py-1' : 'px-4 py-2'}`}>
              <div className={`w-2 h-2 ${isCanceled ? 'bg-red-500' : 'bg-blue-500'} rounded-full`}></div>
              <span className={`${isCanceled ? 'text-red-400' : 'text-blue-400'} font-medium ${isMobile ? 'text-xs' : ''}`}>
                {isCanceled ? (
                  `Losing early access ${userProfile?.subscription_end ? formatSubscriptionEndDate(userProfile.subscription_end) : ''}`
                ) : (
                  `Active ${userProfile?.subscription_plan === 'unlimited' ? 'Unlimited' : userProfile?.subscription_plan} Subscription (${userProfile?.subscription_renewal || 'annual'})`
                )}
              </span>
            </div>
          </div>
        )}

        {/* Email Notification Mockup - Mobile responsive */}
        <div className={`${isMobile ? 'mt-8' : 'mt-16'} flex justify-center`}>
          <div className={`${isMobile ? 'max-w-sm' : 'max-w-3xl'} w-full`}>
            <img 
              src="/lovable-uploads/998ab199-d0b6-406e-890c-9cdc289f4a6d.png" 
              alt="Email notification preview" 
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>

    {/* Final CTA - Mobile responsive */}
    <section className={`${isMobile ? 'py-8 px-4' : 'py-20 px-4'} bg-gradient-to-r from-blue-600/10 to-purple-600/10`}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl md:text-5xl'} font-semibold ${isMobile ? 'mb-3' : 'mb-6'} tracking-tighter`}>
          Don't overpay. Ever again.
        </h2>
        <p className={`${isMobile ? 'text-base mb-6' : 'text-xl text-gray-300 mb-12'} tracking-tight`}>
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
            onClick={() => handleSubscribe(isAnnual ? 'annual' : 'monthly')}
            className={`bg-white text-black ${isMobile ? 'px-6 py-3 text-sm' : 'px-8 py-4'} rounded-full font-semibold tracking-tight transition-all hover:bg-gray-200`}
          >
            {isAnnual ? 'Try for Free' : 'Subscribe Now'}
          </button>
        ) : (
          <div className={`text-blue-400 font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
            You're all set! Enjoy unlimited access to all deals.
          </div>
        )}
      </div>
    </section>

    {/* iOS-Style Footer - Mobile Only */}
    {isMobile && (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-3xl">
        <div className="flex items-center justify-around py-3 px-6">
          <button 
            onClick={() => navigate('/buy')}
            className="flex flex-col items-center py-1 min-w-0 flex-1 active:scale-95 transition-all duration-100"
          >
            <div className="w-7 h-7 mb-1 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">Buy</span>
          </button>

          <button 
            onClick={() => navigate('/rent')}
            className="flex flex-col items-center py-1 min-w-0 flex-1 active:scale-95 transition-all duration-100"
          >
            <div className="w-7 h-7 mb-1 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">Rent</span>
          </button>

          <button 
            onClick={() => navigate('/pricing')}
            className="flex flex-col items-center py-1 min-w-0 flex-1 active:scale-95 transition-all duration-100"
          >
            <div className="w-7 h-7 mb-1 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-[10px] text-blue-400 font-medium">Upgrade</span>
          </button>

          <button 
            onClick={() => navigate('/mission')}
            className="flex flex-col items-center py-1 min-w-0 flex-1 active:scale-95 transition-all duration-100"
          >
            <div className="w-7 h-7 mb-1 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">About</span>
          </button>
        </div>
      </div>
    )}

    {/* SUCCESS POPUP - unchanged */}
    <SuccessPopup
      showSuccessPopup={showSuccessPopup}
      setShowSuccessPopup={setShowSuccessPopup}
      successStep={successStep}
      setSuccessStep={setSuccessStep}
      selectedNeighborhoods={selectedNeighborhoods}
      setSelectedNeighborhoods={setSelectedNeighborhoods}
      refinedBedrooms={refinedBedrooms}
      setRefinedBedrooms={setRefinedBedrooms}
      refinedMaxBudget={refinedMaxBudget}
      setRefinedMaxBudget={setRefinedMaxBudget}
      refinedDiscountThreshold={refinedDiscountThreshold}
      setRefinedDiscountThreshold={setRefinedDiscountThreshold}
      showRefineFilters={showRefineFilters}
      setShowRefineFilters={setShowRefineFilters}
    />
  </div>
);
};

interface SuccessPopupProps {
  showSuccessPopup: boolean;
  setShowSuccessPopup: (show: boolean) => void;
  successStep: number;
  setSuccessStep: (step: number) => void;
  selectedNeighborhoods: string[];
  setSelectedNeighborhoods: (neighborhoods: string[]) => void;
  refinedBedrooms: number | undefined;
  setRefinedBedrooms: (bedrooms: number | undefined) => void;
  refinedMaxBudget: number | undefined;
  setRefinedMaxBudget: (budget: number | undefined) => void;
  refinedDiscountThreshold: number | undefined;
  setRefinedDiscountThreshold: (threshold: number | undefined) => void;
  showRefineFilters: boolean;
  setShowRefineFilters: (show: boolean) => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({
  showSuccessPopup,
  setShowSuccessPopup,
  successStep,
  setSuccessStep,
  selectedNeighborhoods,
  setSelectedNeighborhoods,
  refinedBedrooms,
  setRefinedBedrooms,
  refinedMaxBudget,
  setRefinedMaxBudget,
  refinedDiscountThreshold,
  setRefinedDiscountThreshold,
  showRefineFilters,
  setShowRefineFilters
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [confettiVisible, setConfettiVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const neighborhoods = [
    // Manhattan
    "Upper East Side", "Upper West Side", "Midtown", "Midtown East", "Midtown West", 
    "Chelsea", "Greenwich Village", "West Village", "SoHo", "Tribeca", 
    "Lower East Side", "East Village", "NoLita", "NoHo", "Little Italy",
    "Financial District", "Battery Park City", "Civic Center", "Hudson Square",
    "Two Bridges", "Chinatown", "Harlem", "Central Harlem", "Washington Heights", 
    "Inwood", "Morningside Heights", "Hamilton Heights", "Manhattan Valley",
    "Hell's Kitchen", "Hudson Yards", "NoMad", "Kips Bay", "Murray Hill",
    "Gramercy Park", "Roosevelt Island",

    // Brooklyn
    "Williamsburg", "DUMBO", "Brooklyn Heights", "Park Slope", "Prospect Heights",
    "Crown Heights", "Bed-Stuy", "Bedford-Stuyvesant", "Bushwick", "Red Hook", 
    "Carroll Gardens", "Cobble Hill", "Boerum Hill", "Gowanus", "Fort Greene",
    "Clinton Hill", "Downtown Brooklyn", "Columbia St Waterfront District",
    "Greenpoint", "Sunset Park", "Prospect Lefferts Gardens", "Vinegar Hill",
    "Windsor Terrace", "Ditmas Park",

    // Queens
    "Long Island City", "LIC", "Astoria", "Sunnyside", "Jackson Heights",
    "Flushing", "Forest Hills", "Ridgewood", "Corona", "Maspeth", "Rego Park",
    "Bayside", "Ditmars Steinway", "Woodside", "Briarwood", "Fresh Meadows",
    "Elmhurst",

    // Bronx
    "Kingsbridge", "Norwood", "Melrose", "Mott Haven", "South Bronx", "Concourse"
  ];

  useEffect(() => {
    if (showSuccessPopup && successStep === 1) {
      setConfettiVisible(true);
      const timer = setTimeout(() => setConfettiVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup, successStep]);

  const handleNeighborhoodToggle = (neighborhood: string) => {
    setSelectedNeighborhoods(prev => 
      prev.includes(neighborhood) 
        ? prev.filter(n => n !== neighborhood)
        : [...prev, neighborhood]
    );
  };

  const savePreferences = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const updateData: any = {
        neighborhood_preferences: selectedNeighborhoods
      };

      // Only save refined filters if they were actually set
      if (showRefineFilters) {
        if (refinedBedrooms !== undefined) updateData.bedrooms = refinedBedrooms;
        if (refinedMaxBudget !== undefined) updateData.max_budget = refinedMaxBudget;
        if (refinedDiscountThreshold !== undefined) updateData.discount_threshold = refinedDiscountThreshold;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Preferences saved!",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
  if (successStep === 4) {
    await savePreferences();
    setShowSuccessPopup(false);
    // Keep users on the pricing page instead of redirecting
  } else if (successStep === 2 && selectedNeighborhoods.length > 0) {
    await savePreferences();
    setSuccessStep(successStep + 1);
  } else {
    setSuccessStep(successStep + 1);
  }
};

  const handleClose = () => {
    setShowSuccessPopup(false);
    setSuccessStep(1);
    setSelectedNeighborhoods([]);
    setShowRefineFilters(false);
  };

  if (!showSuccessPopup) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Static Confetti Emoji */}
{confettiVisible && successStep === 1 && (
  <div className="absolute -top-4 -right-4 text-4xl animate-pulse">
    🎉
  </div>
)}

     <div className="bg-black/95 backdrop-blur-2xl border border-white/10 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="p-8">
       {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              {successStep === 1 && (
                <div className="bg-blue-500/20 p-2 rounded-full">
                  <Unlock className="w-6 h-6 text-blue-400" />
                </div>
              )}
              <h2 className="text-2xl font-bold text-white tracking-tighter">
                {successStep === 1 && "Welcome to Unlimited!"}
                {successStep === 2 && "Set Your Alerts"}
                {successStep === 3 && "Personalize Your Experience"}
                {successStep === 4 && "You're All Set!"}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-white/70 hover:text-white transition-colors p-2"
            >
              <X size={24} />
            </button>
          </div>

          {/* Step 1: Welcome */}
          {successStep === 1 && (
            <div className="space-y-8 text-center">
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl relative overflow-hidden">
  <div className="absolute top-2 right-2 text-2xl">🎉</div>
  <h3 className="text-xl font-bold text-white tracking-tighter leading-tight">
    You now have unlimited access to the best deals in NYC
  </h3>
</div>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 text-white/80">
                    <Check className="w-5 h-5 text-blue-400" />
                    <span>See ALL undervalued listings, not just 24/day</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Check className="w-5 h-5 text-blue-400" />
                    <span>Get instant alerts for new deals</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Check className="w-5 h-5 text-blue-400" />
                    <span>Personalized deal recommendations</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Check className="w-5 h-5 text-blue-400" />
                    <span>Advanced filtering and search</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Alert Setup */}
          {successStep === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tighter">
                  You'll also be the first to know whenever new deals get listed
                </h3>
                <p className="text-white/70 text-sm">
                  Select neighborhoods to get instant email alerts
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {neighborhoods.map((neighborhood) => (
                    <button
                      key={neighborhood}
                      onClick={() => handleNeighborhoodToggle(neighborhood)}
                     className={`p-3 rounded-full border transition-all text-sm tracking-tight ${
  selectedNeighborhoods.includes(neighborhood)
    ? "border-white bg-white text-black"
    : "border-white/30 text-white hover:border-white/60"
}`}
                    >
                      {neighborhood}
                    </button>
                  ))}
                </div>

                {selectedNeighborhoods.length > 0 && (
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowRefineFilters(!showRefineFilters)}
                      className="w-full p-3 border border-white/30 text-white rounded-full hover:border-white/60 transition-all"
                    >
                      {showRefineFilters ? 'Hide' : 'Refine'} Email Filters (Optional)
                    </button>

                    {showRefineFilters && (
                      <div className="space-y-4 p-4 bg-white/5 rounded-xl">
                        <div className="space-y-2">
                          <label className="text-sm text-white/80">Bedrooms</label>
                          <div className="flex gap-2">
                            {[0, 1, 2, 3, 4, '5+'].map((bed) => (
                              <button
                                key={bed}
                                onClick={() => setRefinedBedrooms(bed === '5+' ? 5 : bed as number)}
                                className={`px-3 py-2 rounded-full border text-sm ${
                                  refinedBedrooms === (bed === '5+' ? 5 : bed)
                                    ? 'border-white bg-white text-black'
                                    : 'border-white/30 text-white'
                                }`}
                              >
                                {bed}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm text-white/80">Max Budget</label>
                          <Slider
                            value={[refinedMaxBudget || 3000]}
                            onValueChange={(value) => setRefinedMaxBudget(value[0])}
                            max={8000}
                            min={1000}
                            step={100}
                            className="w-full"
                          />
                          <p className="text-center text-sm text-white">
                            ${(refinedMaxBudget || 3000).toLocaleString()}/month
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm text-white/80">Min Discount</label>
                          <Slider
                            value={[refinedDiscountThreshold || 20]}
                            onValueChange={(value) => setRefinedDiscountThreshold(value[0])}
                            max={50}
                            min={10}
                            step={5}
                            className="w-full"
                          />
                          <p className="text-center text-sm text-white">
                            {refinedDiscountThreshold || 20}% below market
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Personalization */}
          {successStep === 3 && (
            <div className="space-y-8 text-center">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-white tracking-tighter leading-tight">
                    You can even personalize deals you want to see in the "For You" page
                  </h3>
                </div>
                <p className="text-white/70 text-lg">
                  Just describe your dream home, and we'll find it for you. Below-market.
                </p>
                <div className="bg-white/5 p-4 rounded-xl text-left">
                  <div className="flex items-center gap-3 text-white/80 mb-2">
                    <Star className="w-5 h-5 text-blue-400" />
                    <span>Advanced matching to your preferences</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Home className="w-5 h-5 text-blue-400" />
                    <span>Curated deals based on your lifestyle</span>
                  </div>
                </div>
              </div>
            </div>
          )}

         {/* Step 4: Final */}
{successStep === 4 && (
  <div className="space-y-8 text-center">
    <div className="space-y-6">
      {/* Lock Unlocking Animation */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
            <Unlock className="w-8 h-8 text-blue-400 animate-bounce" />
          </div>
          <div className="absolute -inset-2 bg-blue-500/10 rounded-full animate-ping"></div>
        </div>
      </div>
      
      <h3 className="text-3xl font-bold text-white tracking-tighter">
        You're all set! 
      </h3>
      <p className="text-white/70 text-lg tracking-tight">
        Welcome to unlimited access to NYC's best deals
      </p>
      
      <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
        <div className="space-y-3">
          <div className="w-3 h-3 bg-blue-400 rounded-full mx-auto animate-pulse"></div>
          <p className="text-blue-400 font-medium text-lg">
            Unlimited access activated
          </p>
          <p className="text-white/60 text-sm">
            Start browsing thousands of undervalued properties
          </p>
        </div>
      </div>
    </div>
  </div>
)}

          {/* Next Button */}
          <div className="mt-8">
            <button
              onClick={handleNext}
              disabled={successStep === 2 && selectedNeighborhoods.length === 0}
              className="w-full bg-white text-black py-4 rounded-full font-bold text-lg tracking-tighter hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                "Saving..."
              ) : successStep === 1 ? (
                "Next"
              ) : successStep === 2 ? (
                selectedNeighborhoods.length > 0 ? "Save & Continue" : "Select neighborhoods to continue"
              ) : successStep === 3 ? (
                "Last Step"
              ) : (
                "Find your home!"
              )}
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-2 rounded-full transition-all ${
                  step === successStep 
                    ? "w-6 bg-white" 
                    : step < successStep
                    ? "w-2 bg-blue-400"
                    : "w-2 bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


export default Pricing;
