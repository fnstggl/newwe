
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Always use annual pricing at $18/year with 3-day free trial
  const price = 'Try Free for 3 Days';
  const subtitle = 'Then $18/year';

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
  }, [user, navigate, toast]);

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to subscribe.",
        variant: "destructive",
      });
      navigate('/pricing');
      return;
    }

    setLoading(true);

    try {
      console.log('Creating checkout session for annual $18/year plan with 3-day trial');
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          billing_cycle: 'annual'
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Checkout session response:', data);
      
      if (data?.url) {
        // Redirect to Stripe hosted checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned from payment intent');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to initialize checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
        <div className="text-xl tracking-tight">Redirecting to checkout...</div>
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
                Start your free trial today. No commitment for 3 days.
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
              
              {/* Free trial info */}
              <p className="text-xs text-gray-500 tracking-tight">
                3-day free trial, then $18/year • Cancel anytime during trial
              </p>
            </div>
          </div>

          {/* Right side - Subscribe button */}
          <div className="bg-gray-900/30 rounded-2xl p-8 border border-gray-800">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 tracking-tight">Start Your Free Trial</h2>
              <p className="text-gray-400 tracking-tight">
                3 days free, no commitment. Cancel anytime.
              </p>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-white text-black py-4 rounded-full font-semibold tracking-tight transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  Starting Trial...
                </>
              ) : (
                'Start Free Trial'
              )}
            </button>

            {/* Security notice */}
            <p className="text-xs text-gray-500 text-center mt-4 tracking-tight">
              Secure payment powered by Stripe. No charge for 3 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
