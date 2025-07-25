
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { HoverButton } from '@/components/ui/hover-button';
import { toast } from 'sonner';

const Pricing = () => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to upgrade your plan');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) {
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to create checkout session');
    } finally {
      setLoading(false);
    }
  };

  const handleRenewSubscription = async () => {
    if (!user) {
      toast.error('Please sign in to renew your subscription');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (error) {
      console.error('Portal error:', error);
      toast.error('Failed to open customer portal');
    } finally {
      setLoading(false);
    }
  };

  const isSubscribed = userProfile?.subscription_plan === 'unlimited';
  const isCanceled = userProfile?.is_canceled || false;

  // Format the subscription end date
  const formatSubscriptionEndDate = (endDate: string) => {
    try {
      const date = new Date(endDate);
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return 'End of current billing period';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get access to the best real estate deals in NYC
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="relative bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-2">Free Plan</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
              <p className="text-gray-400">Perfect for getting started</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                3 deals per day
              </li>
              <li className="flex items-center">
                <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Basic neighborhood filters
              </li>
              <li className="flex items-center">
                <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Email support
              </li>
            </ul>

            <HoverButton 
              className="w-full text-white font-semibold"
              variant="secondary"
              disabled={!isSubscribed}
            >
              {isSubscribed && isCanceled ? 'Renew Subscription' : 'Current Plan'}
            </HoverButton>
          </div>

          {/* Unlimited Plan */}
          <div className="relative bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-2">Unlimited Plan</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold">$7.99</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
              <p className="text-gray-400">Everything you need to find great deals</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Unlimited deals
              </li>
              <li className="flex items-center">
                <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Advanced filters
              </li>
              <li className="flex items-center">
                <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Save unlimited properties
              </li>
              <li className="flex items-center">
                <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Priority support
              </li>
            </ul>

            <HoverButton 
              className="w-full text-white font-semibold"
              onClick={isSubscribed && isCanceled ? handleRenewSubscription : handleCheckout}
              disabled={loading || (isSubscribed && !isCanceled)}
            >
              {loading 
                ? 'Processing...' 
                : isSubscribed && isCanceled 
                  ? 'Renew Subscription'
                  : isSubscribed && !isCanceled 
                    ? 'Current Plan' 
                    : 'Get Started'
              }
            </HoverButton>
          </div>
        </div>

        {/* Subscription Status */}
        {isSubscribed && (
          <div className="mt-12 text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              isCanceled 
                ? 'bg-red-900/50 text-red-400 border border-red-800' 
                : 'bg-blue-900/50 text-blue-400 border border-blue-800'
            }`}>
              <span className={`w-2 h-2 ${isCanceled ? 'bg-red-400' : 'bg-blue-400'} rounded-full mr-2`}></span>
              {isCanceled 
                ? `Losing early access ${userProfile?.subscription_end ? formatSubscriptionEndDate(userProfile.subscription_end) : 'at end of billing period'}`
                : `Active Unlimited Subscription (${userProfile?.subscription_renewal || 'monthly'})`
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;
