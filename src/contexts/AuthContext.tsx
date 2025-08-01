
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  name?: string;
  email_address?: string;
  onboarding_completed?: boolean;
  hasCompletedOnboarding?: boolean;
  subscription_plan?: string;
  subscription_renewal?: string;
  subscription_end?: string;
  stripe_customer_id?: string;
  manual_unlimited?: boolean;
  is_canceled?: boolean;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  session: any;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  refreshProfile: () => Promise<void>;
  updateOnboardingStatus: (completed: boolean) => Promise<void>;
  forceRefreshProfile: () => Promise<void>;
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
  const [session, setSession] = useState<any>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name, 
          email_address,
          subscription_plan,
          subscription_renewal,
          stripe_customer_id,
          manual_unlimited,
          is_canceled
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
        onboarding_completed: hasCompletedOnboarding,
        ...subscriptionInfo
      };
      
      setUserProfile(profileData);
    }
  };

  const forceRefreshProfile = async () => {
    await refreshProfile();
  };

  const updateOnboardingStatus = async (completed: boolean) => {
    localStorage.setItem('hasCompletedOnboarding', completed.toString());
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        hasCompletedOnboarding: completed,
        onboarding_completed: completed
      });
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/foryou`
      }
    });
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
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
      setSession(session);
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
    setSession(null);
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    session,
    signOut,
    signUp,
    signIn,
    signInWithGoogle,
    refreshProfile,
    updateOnboardingStatus,
    forceRefreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
