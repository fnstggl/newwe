
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [stripePromise, setStripePromise] = useState<any>(null);

  // Get billing cycle from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const billingCycle = urlParams.get('billing') === 'monthly' ? 'monthly' : 'annual';
  
  const price = billingCycle === 'monthly' ? '$9/month' : '$18/year';
  const subtitle = billingCycle === 'monthly' ? 'Billed monthly' : 'Billed annually';
  const amount = billingCycle === 'monthly' ? 900 : 1800; // in cents
  
  useEffect(() => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to subscribe.",
        variant: "destructive",
      });
      navigate('/pricing');
      return;
    }

    const initializeCheckout = async () => {
      try {
        console.log(`Creating payment intent for ${billingCycle} plan`);
        
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: {
            billing_cycle: billingCycle,
            amount: amount
          },
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });

        if (error) {
          console.error('Supabase function error:', error);
          throw error;
        }

        console.log('Payment intent response:', data);
        
        if (data?.client_secret) {
          setClientSecret(data.client_secret);
          
          // Initialize Stripe with publishable key
          const publishableKey = 'pk_live_51QO1RdEoqR7PBYumz4GJuWl4cAuKUd1S8FJdvGdqAhg8KGDr3AO0BYcG8V5zNOHUdlNj08J5xYO2OYmH3VwSwJyP00D7PVhzqT';
          const stripe = await loadStripe(publishableKey);
          setStripePromise(stripe);
        } else {
          throw new Error('No client secret returned from payment intent');
        }
      } catch (error) {
        console.error('Error creating payment intent:', error);
        toast({
          title: "Error",
          description: "Failed to initialize checkout. Please try again.",
          variant: "destructive",
        });
        navigate('/pricing');
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [user, session, billingCycle, amount, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
        <div className="text-xl tracking-tight">Loading checkout...</div>
      </div>
    );
  }

  if (!clientSecret || !stripePromise) {
    return (
      <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
        <div className="text-xl tracking-tight">Failed to load checkout</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/pricing')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors tracking-tight"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Pricing
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Image and branding */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-semibold mb-4 tracking-tighter">
                Find the best deal in the city. Save thousands.
              </h1>
              <p className="text-xl text-gray-400 tracking-tight">
                Start saving today. Cancel anytime.
              </p>
            </div>

            {/* Reference image */}
            <div className="relative">
              <img
                src="/lovable-uploads/447e6b63-12c7-4df7-80df-9b403b88b587.png"
                alt="NYC Real Estate Platform"
                className="w-full max-w-md rounded-xl"
              />
            </div>

            {/* Plan details */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-3 tracking-tight">Unlimited Plan</h3>
              <div className="text-3xl font-semibold mb-2 tracking-tight">{price}</div>
              <div className="text-lg text-gray-400 mb-4 tracking-tight">{subtitle}</div>
              <ul className="space-y-2 text-gray-300 mb-4">
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-3">•</span>
                  Access to ALL deals
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-3">•</span>
                  Your dream home, found for you
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-3">•</span>
                  Instant alerts for new deals
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-3">•</span>
                  Be first to the best deals
                </li>
              </ul>
              
              {/* Billing info */}
              <p className="text-xs text-gray-500 tracking-tight">
                {billingCycle === 'monthly' ? 'Billed monthly' : 'Billed annually'} • Cancel anytime
              </p>
            </div>
          </div>

          {/* Right side - Embedded checkout form */}
          <div className="bg-gray-900/30 rounded-2xl p-8 border border-gray-800">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 tracking-tight">Complete Your Subscription</h2>
              <p className="text-gray-400 tracking-tight">
                Secure payment • Cancel anytime
              </p>
            </div>

            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm billingCycle={billingCycle as 'monthly' | 'annual'} amount={amount} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
