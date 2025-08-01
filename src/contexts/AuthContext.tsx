
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  name?: string;
  email_address?: string;
  property_type?: string;
  bedrooms?: number;
  max_budget?: number;
  preferred_neighborhoods?: string[];
  must_haves?: string[];
  discount_threshold?: number;
  search_duration?: string;
  frustrations?: string[];
  searching_for?: string;
  onboarding_completed?: boolean;
  hasCompletedOnboarding?: boolean;
  subscription_plan?: string;
  subscription_renewal?: string;
  stripe_customer_id?: string;
  manual_unlimited?: boolean;
  is_canceled?: boolean;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name, 
          email_address,
          property_type,
          bedrooms,
          max_budget,
          preferred_neighborhoods,
          must_haves,
          discount_threshold,
          search_duration,
          frustrations,
          searching_for,
          subscription_plan,
          subscription_renewal,
          stripe_customer_id,
          manual_unlimited,
          is_canceled,
          onboarding_completed
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    
    const profile = await fetchUserProfile(user.id);
    if (profile) {
      // Check localStorage for onboarding completion
      const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true';
      
      // Determine subscription info
      let subscriptionInfo = {
        subscription_plan: profile.subscription_plan || 'free',
        subscription_renewal: profile.subscription_renewal || 'monthly',
        stripe_customer_id: profile.stripe_customer_id,
        manual_unlimited: profile.manual_unlimited || false,
        is_canceled: profile.is_canceled || false
      };

      if (profile.manual_unlimited) {
        subscriptionInfo.subscription_plan = 'unlimited';
      }

      const profileData: UserProfile = { 
        ...profile,
        hasCompletedOnboarding,
        onboarding_completed: profile.onboarding_completed || hasCompletedOnboarding,
        ...subscriptionInfo
      };
      
      setUserProfile(profileData);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await refreshProfile();
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await refreshProfile();
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Update refreshProfile to depend on user
  useEffect(() => {
    if (user) {
      refreshProfile();
    }
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('hasCompletedOnboarding');
    setUser(null);
    setUserProfile(null);
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
