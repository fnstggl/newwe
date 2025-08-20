
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from '@stripe/react-stripe-js';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface CheckoutFormProps {
  billingCycle: 'monthly' | 'annual';
  amount: number;
}

const CheckoutForm = ({ billingCycle, amount }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Get the payment element to check the payment method type
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      // Confirm payment with conditional return_url for payment methods that require it
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/pricing?success=true`,
        },
        redirect: 'if_required',
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || 'An error occurred.');
        } else {
          setMessage("An unexpected error occurred.");
        }
        
        toast({
          title: "Payment failed",
          description: error.message || 'An error occurred during payment.',
          variant: "destructive",
        });
      } else if (paymentIntent) {
        // Handle different payment intent statuses
        if (paymentIntent.status === 'succeeded') {
           // ✅ Google Ads Conversion Tracking
          (window as any).gtag?.('event', 'conversion', {
            send_to: 'AW-17439586946/XQoxCP-nnIAbEIL16_tA', // ← Replace with your actual conversion label
            value: amount,
            currency: 'USD',
          });
          // Immediate success - activate subscription
          await activateSubscription(paymentIntent.id);
        } else if (paymentIntent.status === 'processing') {
          // Payment is processing (e.g., Cash App) - show success message
          // The webhook will handle activation when payment completes
          toast({
            title: "Payment processing",
            description: "Your payment is being processed. You'll be upgraded once it's complete.",
          });
          
          navigate('/pricing?processing=true');
          
          // Poll for subscription activation
          pollForSubscriptionActivation();
        } else if (paymentIntent.status === 'requires_action') {
          // Payment requires additional action - let Stripe handle it
          toast({
            title: "Payment requires action",
            description: "Please complete the payment process.",
          });
        } else {
          // Handle other statuses
          toast({
            title: "Payment status: " + paymentIntent.status,
            description: "Your payment is being processed.",
          });
          
          navigate('/pricing?processing=true');
          pollForSubscriptionActivation();
        }
      }
    } catch (confirmError) {
      console.error('Payment confirmation error:', confirmError);
      setMessage("An unexpected error occurred during payment confirmation.");
      toast({
        title: "Payment failed",
        description: 'An unexpected error occurred during payment confirmation.',
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const activateSubscription = async (paymentIntentId: string) => {
    try {
      const { error: subscriptionError } = await supabase.functions.invoke('activate-subscription', {
        body: {
          payment_intent_id: paymentIntentId,
          billing_cycle: billingCycle,
        },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (subscriptionError) {
        console.error('Subscription activation error:', subscriptionError);
        toast({
          title: "Payment succeeded but subscription activation failed",
          description: "Please contact support.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Subscription successful!",
          description: "Welcome to the Unlimited plan.",
        });
        
        // Navigate to pricing page and force refresh to show updated plan
        navigate('/pricing?success=true');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (activationError) {
      console.error('Error activating subscription:', activationError);
      toast({
        title: "Payment succeeded but subscription activation failed",
        description: "Please contact support.",
        variant: "destructive",
      });
    }
  };

  const pollForSubscriptionActivation = () => {
    let attempts = 0;
    const maxAttempts = 30; // Poll for 5 minutes (10 second intervals)
    
    const checkSubscription = async () => {
      attempts++;
      
      try {
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
        });

        if (!error && data?.subscribed) {
          toast({
            title: "Subscription activated!",
            description: "Welcome to the Unlimited plan.",
          });
          
          // Force refresh to show updated plan
          window.location.reload();
          return;
        }

        if (attempts < maxAttempts) {
          setTimeout(checkSubscription, 10000); // Check every 10 seconds
        } else {
          toast({
            title: "Subscription pending",
            description: "Your payment is still processing. Please check back in a few minutes.",
          });
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        if (attempts < maxAttempts) {
          setTimeout(checkSubscription, 10000);
        }
      }
    };

    setTimeout(checkSubscription, 10000); // Start checking after 10 seconds
  };

return (
  <form onSubmit={handleSubmit} className="space-y-4">  {/* tighter vertical spacing */}
    {/* Payment Element */}
    <div className="-mt-1">
      <PaymentElement
        options={{
          layout: 'tabs',
          defaultValues: {
            billingDetails: { email: user?.email || '' },
          },
          paymentMethodOrder: ['google_pay', 'apple_pay', 'card', 'cashapp', 'amazon_pay'], // wallets first
          wallets: { applePay: 'auto', googlePay: 'auto' },
        }}
      />
    </div>

    {/* Error message */}
    {message && (
      <div className="text-red-400 text-sm tracking-tight p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg">
        {message}
      </div>
    )}

    {/* Submit button */}
    <button
      type="submit"
      disabled={loading || !stripe || !elements}
      className="w-full bg-white text-black py-3.5 rounded-full font-semibold tracking-tight transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      aria-label={billingCycle === 'monthly' ? 'Subscribe for $9 today' : 'Subscribe for $18 today'}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          Processing...
        </>
      ) : (
        `Subscribe for ${billingCycle === 'monthly' ? '$9 today' : '$18 today'}`
      )}
    </button>

    {/* Urgency line */}
    <p className="text-[11px] text-gray-400 text-center leading-tight -mt-1">
      Deals move fast—get alerts today. Don’t risk missing tomorrow’s deals.
    </p>

    {/* Extra trust line */}
    <p className="text-[11px] text-gray-500 text-center tracking-tight leading-tight flex items-center justify-center gap-1">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
        <path d="M12 1a5 5 0 00-5 5v3H5a1 1 0 00-1 1v11a1 1 0 001 1h14a1 1 0 001-1V10a1 1 0 00-1-1h-2V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z"/>
      </svg>
      100% secure, encrypted payment • Powered by Stripe
    </p>

    {/* Legal/clarity (kept tiny) */}
    <p className="text-[11px] text-gray-500 text-center tracking-tight leading-tight">
      {billingCycle === 'monthly'
        ? 'You’ll be charged $9 today and then $9/month. Cancel anytime.'
        : 'You’ll be charged $18 today (just $1.50/mo), billed annually. Cancel anytime.'}
    </p>
  </form>
);
};

export default CheckoutForm;
