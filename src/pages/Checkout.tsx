import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ArrowLeft, Lock } from 'lucide-react';
import CheckoutForm from '@/components/CheckoutForm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Add this component after your imports, before const Checkout = () => {
const PricingTestimonials = ({ isMobile }: { isMobile: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const successTestimonials = [
    {
      quote: "I was about to sign a lease in Dumbo for $4,200. Found a stabilized one here for $2,550. Same block. No broker fee too.",
      author: "Sasha K.",
      detail: "Brooklyn resident since March 2024",
      highlight: "$1,650"
    },
    {
      quote: "Found my dream 1BR in Williamsburg through this. Saved me $925/month compared to what I was looking at on StreetEasy.",
      author: "Mike T.", 
      detail: "Williamsburg resident since August 2024",
      highlight: "$925"
    },
    {
      quote: "Almost paid $3,800 for a studio in Manhattan. Got alerts for a $2,400 one-bedroom in the same area. Life-changing.",
      author: "Jessica L.",
      detail: "Manhattan resident since July 2024", 
      highlight: "$1,400"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % successTestimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const current = successTestimonials[currentIndex];

  return (
    <div className="relative text-center h-full flex flex-col w-full">
      <div className="absolute top-1 right-3">
        <div className="bg-blue-500/15 border border-blue-500/30 rounded-full px-3 py-1.5 backdrop-blur-sm">
          <span className="text-blue-400 font-semibold text-sm">
            {current.highlight}/mo saved
          </span>
        </div>
      </div>

      <div className="transition-all duration-500 ease-in-out flex-1 flex flex-col justify-center pt-10">
        <div className="px-4">
          <p className="text-white text-base leading-relaxed tracking-tighter mb-4 font-semibold">
            "{current.quote}"
          </p>
        </div>
        
        <div className="space-y-1 mt-auto mb-2">
          <p className="text-base text-blue-400 font-semibold tracking-tight">
            {current.author}
          </p>
          <p className="text-xs text-gray-400 font-normal tracking-tight">
            {current.detail}
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-3 space-x-2">
        {successTestimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`rounded-full transition-all duration-700 ease-out ${
              index === currentIndex 
                ? 'bg-white w-6 h-1.5 shadow-sm' 
                : 'bg-gray-600 hover:bg-gray-500 w-1.5 h-1.5'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Use your live Stripe publishable key
const stripePromise = loadStripe('pk_live_51QiJekP1c6FHzSEkDcrfm4WjGhxpqkZK8T6pyWWeH61H5VPMRW9d37HVi2F1VIzRuUElclZVkRlHJh9O8iHhaGgr00D1tOSeNi');

const Checkout = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);

  // Get billing cycle from URL params, default to annual
  const billingCycle = searchParams.get('billing') === 'monthly' ? 'monthly' : 'annual';
  const amount = billingCycle === 'monthly' ? 9 : 18;

  useEffect(() => {
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to subscribe.',
        variant: 'destructive',
      });
      navigate('/pricing');
      return;
    }

    const createPaymentIntent = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: {
            billing_cycle: billingCycle,
            amount: billingCycle === 'monthly' ? 900 : 1800, // cents
          },
          headers: { Authorization: `Bearer ${session?.access_token}` },
        });

        if (error) throw error;
        if (!data?.client_secret) throw new Error('No client secret returned from payment intent');

        setClientSecret(data.client_secret);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        toast({
          title: 'Error',
          description: 'Failed to initialize checkout. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (session) createPaymentIntent();
  }, [user, session, navigate, toast, billingCycle]);

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#3b82f6',
      colorBackground: '#000000',
      colorText: '#ffffff',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
    rules: {
      '.Input': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '12px',
        fontSize: '16px',
        letterSpacing: '-0.025em',
      },
      '.Input:focus': {
        border: '1px solid #3b82f6',
        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
      },
      '.Label': {
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '500',
        letterSpacing: '-0.025em',
      },
    },
  };

  const options = { clientSecret, appearance };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
        <div className="text-xl tracking-tight">Loading checkout...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/pricing')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors tracking-tight text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pricing
          </button>
        </div>

        {/* Two-column layout: fixed compact checkout width */}
        <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
          {/* Left: value proof (trimmed) */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold mb-2 tracking-tighter">
                Find the best deal in the city. Unlock your unfair advantage.
              </h1>
              <p className="text-lg text-gray-400 tracking-tight">
                Most New Yorkers overpay on their apartment. You don't have to be most New Yorkers.{' '}
                {billingCycle === 'monthly'
                  ? ' '
                  : ' '}
              </p>
            </div>

            <div className="relative">
              <img
                src="/lovable-uploads/447e6b63-12c7-4df7-80df-9b403b88b587.png"
                alt="NYC Real Estate Platform"
                className="w-full max-w-[260px] rounded-xl"
              />
            </div>

         <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800 max-w-md">
              <h3 className="text-lg font-semibold mb-2 tracking-tight">Unlimited Plan</h3>
              <div className="text-2xl font-semibold mb-3 tracking-tight">
                {billingCycle === 'monthly' ? '$9 today' : '$18 today'}
                <span className="text-gray-400 text-base font-normal">
                  {billingCycle === 'monthly' ? ' • billed monthly' : ' • billed annually ($1.50/mo)'}
                </span>
              </div>
              <ul className="space-y-1.5 text-gray-300 mb-3 text-[15px]">
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-2">•</span>Access to ALL deals
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-2">•</span>Your dream home, found for you
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-2">•</span>Instant alerts for new deals
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-2">•</span>Be first to the best deals
                </li>
              </ul>
              <p className="text-xs text-gray-500 tracking-tight">
                {billingCycle === 'monthly' ? 'Monthly' : 'Annual'} subscription • Cancel anytime
              </p>
            </div>

            {/* Add social proof testimonials below the plan card */}
            <div className="mt-6">
              <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-xl px-4 py-4 shadow-xl relative min-h-[140px] flex items-start max-w-md">
                <PricingTestimonials isMobile={false} />
              </div>
            </div>

          </div>

          {/* Right: Checkout card — compact */}
          <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-800">
 {/* Social proof number */}
            <div className="text-center mb-4">
              <p className="text-gray-400 text-sm">
                Join <span className="text-white font-semibold">10,247 New Yorkers</span> already saving thousands
              </p>
            </div>
            
            <h2 className="text-xl font-semibold tracking-tight mb-1">Complete your subscription</h2>
            <p className="text-gray-400 tracking-tight text-sm flex items-center gap-1.5 mb-2">
              <Lock className="w-4 h-4 text-gray-500" />
              Secure payment powered by Stripe
            </p>
            <p className="text-sm text-white tracking-tight mb-4">
              {billingCycle === 'monthly'
                ? ' $9 today. 30-day money-back guarantee. Cancel anytime.'
                : ' $18 today (just $1.50/mo, billed annually). 30-day money-back guarantee. Cancel anytime.'}
            </p>

            {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm billingCycle={billingCycle} amount={amount} />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;