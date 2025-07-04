
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  subscribed: boolean;
  subscriptionTier: string | null;
  subscriptionRenewal: string | null;
  subscriptionEnd: string | null;
  loading: boolean;
  checkSubscription: () => Promise<void>;
  createCheckout: (billingCycle: 'monthly' | 'annual') => Promise<string | null>;
  openCustomerPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionRenewal, setSubscriptionRenewal] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkSubscription = async () => {
    if (!user || !session) {
      setSubscribed(false);
      setSubscriptionTier(null);
      setSubscriptionRenewal(null);
      setSubscriptionEnd(null);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }

      setSubscribed(data.subscribed || false);
      setSubscriptionTier(data.subscription_tier || 'free');
      setSubscriptionRenewal(data.subscription_renewal || 'monthly');
      setSubscriptionEnd(data.subscription_end || null);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async (billingCycle: 'monthly' | 'annual'): Promise<string | null> => {
    if (!user || !session) {
      throw new Error('User must be logged in to create checkout');
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { billing_cycle: billingCycle },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error creating checkout:', error);
        throw error;
      }

      return data.url;
    } catch (error) {
      console.error('Error creating checkout:', error);
      throw error;
    }
  };

  const openCustomerPortal = async () => {
    if (!user || !session) {
      throw new Error('User must be logged in to access customer portal');
    }

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error opening customer portal:', error);
        throw error;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Error opening customer portal:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user && session) {
      checkSubscription();
    } else {
      setSubscribed(false);
      setSubscriptionTier(null);
      setSubscriptionRenewal(null);
      setSubscriptionEnd(null);
    }
  }, [user, session]);

  const value = {
    subscribed,
    subscriptionTier,
    subscriptionRenewal,
    subscriptionEnd,
    loading,
    checkSubscription,
    createCheckout,
    openCustomerPortal
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
