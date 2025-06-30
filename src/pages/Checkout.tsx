
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ArrowLeft } from 'lucide-react';
import CheckoutForm from '@/components/CheckoutForm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef'); // You'll need to add your publishable key

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);

  const billingCycle = searchParams.get('billing') as 'monthly' | 'annual' || 'monthly';
  const price = billingCycle === 'annual' ? '$19/year' : '$3/month';
  const amount = billingCycle === 'annual' ? 19 : 3;

  useEffect(() => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to subscribe.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    // Create payment intent for subscription
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            billing_cycle: billingCycle,
            amount: billingCycle === 'annual' ? 1900 : 300, // in cents
          }),
        });

        const { client_secret } = await response.json();
        setClientSecret(client_secret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        toast({
          title: "Error",
          description: "Failed to initialize checkout. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [user, billingCycle, navigate, toast]);

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

  const options = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
        <div className="text-xl tracking-tight">Loading checkout...</div>
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
                Join Realer Estate
              </h1>
              <p className="text-xl text-gray-400 tracking-tight">
                Get early access to the best NYC real estate deals.
              </p>
            </div>

            {/* Reference image */}
            <div className="relative">
              <img
                src="/lovable-uploads/f3955d1d-5ae6-4636-a28f-14650db0b254.png"
                alt="NYC Real Estate Platform"
                className="w-full max-w-md rounded-xl border border-gray-800"
              />
            </div>

            {/* Plan details */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-3 tracking-tight">Unlimited Plan</h3>
              <div className="text-3xl font-semibold mb-4 tracking-tight">{price}</div>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-3">•</span>
                  Access to ALL deals
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
            </div>
          </div>

          {/* Right side - Checkout form */}
          <div className="bg-gray-900/30 rounded-2xl p-8 border border-gray-800">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 tracking-tight">Complete your subscription</h2>
              <p className="text-gray-400 tracking-tight">
                Secure payment powered by Stripe
              </p>
            </div>

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
