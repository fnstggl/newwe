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
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded, now activate subscription
        try {
          const { error: subscriptionError } = await supabase.functions.invoke('activate-subscription', {
            body: {
              payment_intent_id: paymentIntent.id,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <div>
        <PaymentElement 
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {/* Address Element */}
      <div>
        <AddressElement 
          options={{
            mode: 'billing',
            allowedCountries: ['US'],
          }}
        />
      </div>

      {/* Error message */}
      {message && (
        <div className="text-red-400 text-sm tracking-tight p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          {message}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading || !stripe || !elements}
        className="w-full bg-white text-black py-4 rounded-full font-semibold tracking-tight transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            Processing...
          </>
        ) : (
          `Subscribe for ${billingCycle === 'annual' ? '$19/year' : '$3/month'}`
        )}
      </button>

      {/* Security notice only */}
      <p className="text-xs text-gray-500 text-center tracking-tight">
        Your payment information is secure and encrypted. Powered by Stripe.
      </p>
    </form>
  );
};

export default CheckoutForm;
