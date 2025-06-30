
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

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/pricing?success=true`,
        receipt_email: user?.email || '',
      },
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
    } else {
      toast({
        title: "Subscription successful!",
        description: "Welcome to the Unlimited plan.",
      });
      navigate('/pricing?success=true');
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

      {/* Security notice */}
      <p className="text-xs text-gray-500 text-center tracking-tight">
        Your payment information is secure and encrypted. Powered by Stripe.
        <br />
        {billingCycle === 'annual' ? 'Annual recurring subscription' : 'Monthly recurring subscription'}, cancel any time.
      </p>
    </form>
  );
};

export default CheckoutForm;
