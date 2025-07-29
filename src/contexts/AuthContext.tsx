import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any; needsOnboarding?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  userProfile: { 
    name: string; 
    hasCompletedOnboarding?: boolean;
    subscription_plan?: string;
    subscription_renewal?: string;
    subscription_end?: string;
    is_canceled?: boolean;
  } | null;
  updateOnboardingStatus: (completed: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<{ 
    name: string; 
    hasCompletedOnboarding?: boolean;
    subscription_plan?: string;
    subscription_renewal?: string;
    subscription_end?: string;
    is_canceled?: boolean;
  } | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  
  // Track if this is an actual login vs tab switch
  const isInitialLoadRef = useRef(true);
  const hasEverFetchedProfileRef = useRef(false);

  // Get cached subscription state from localStorage
  const getCachedSubscriptionState = (userId: string) => {
    try {
      const cached = localStorage.getItem(`subscription_state_${userId}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  // Cache subscription state to localStorage
  const cacheSubscriptionState = (userId: string, subscriptionData: any) => {
    try {
      localStorage.setItem(`subscription_state_${userId}`, JSON.stringify(subscriptionData));
    } catch {
      // Ignore localStorage errors
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Only fetch profile on actual login/signup or initial load - NOT on tab switches
          if (event === 'SIGNED_IN' && !hasEverFetchedProfileRef.current) {
            console.log('Actual login/signup detected, fetching profile');
            fetchUserProfile(session.user.id);
            hasEverFetchedProfileRef.current = true;
          } else if (event === 'SIGNED_IN' && hasEverFetchedProfileRef.current) {
            // This is a tab switch SIGNED_IN event - use cached state
            console.log('Tab switch detected, using cached subscription state');
            const cachedState = getCachedSubscriptionState(session.user.id);
            if (cachedState) {
              setUserProfile(prev => prev ? { ...prev, ...cachedState } : cachedState);
            }
          } else if (event === 'TOKEN_REFRESHED') {
            // For token refresh, use cached state if available
            const cachedState = getCachedSubscriptionState(session.user.id);
            if (cachedState) {
              console.log('Using cached subscription state for token refresh');
              setUserProfile(prev => prev ? { ...prev, ...cachedState } : cachedState);
            }
          }
        } else if (!session) {
          setUserProfile(null);
          hasEverFetchedProfileRef.current = false;
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user && isInitialLoadRef.current) {
        // This is the initial load - fetch profile
        fetchUserProfile(session.user.id);
        hasEverFetchedProfileRef.current = true;
        isInitialLoadRef.current = false;
      } else if (session?.user) {
        // Use cached state for non-initial loads
        const cachedState = getCachedSubscriptionState(session.user.id);
        if (cachedState) {
          setUserProfile(prev => prev ? { ...prev, ...cachedState } : cachedState);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      
      // Get cached state before making database call
      const cachedState = getCachedSubscriptionState(userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('name, subscription_plan, subscription_renewal')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        // On error, preserve existing cached state instead of defaulting to free
        if (cachedState) {
          console.log('Using cached subscription state due to database error');
          setUserProfile(prev => prev ? { ...prev, ...cachedState } : cachedState);
        }
        return;
      }
      
      console.log('Fetched profile data:', data);
      
      if (data) {
        // Check if user has completed onboarding (for now, we'll use localStorage)
        const hasCompletedOnboarding = localStorage.getItem(`onboarding_${userId}`) === 'completed';
        
        // Skip subscription check for staff and manual_unlimited plans
        const isStaffOrManualUnlimited = data.subscription_plan === 'open_door_plan' || data.subscription_plan === 'staff';
        
        let subscriptionInfo = {
          subscription_plan: data.subscription_plan || cachedState?.subscription_plan || userProfile?.subscription_plan,
          subscription_renewal: data.subscription_renewal || cachedState?.subscription_renewal || userProfile?.subscription_renewal,
          subscription_end: null,
          is_canceled: false
        };
        
        // Only check subscription status via edge function for regular unlimited plans
        if (!isStaffOrManualUnlimited) {
          const { data: subscriptionData, error: subscriptionError } = await supabase.functions.invoke('check-subscription');
          
          if (!subscriptionError && subscriptionData) {
            subscriptionInfo = {
              subscription_plan: subscriptionData.subscription_tier || subscriptionInfo.subscription_plan,
              subscription_renewal: subscriptionData.subscription_renewal || subscriptionInfo.subscription_renewal,
              subscription_end: subscriptionData.subscription_end,
              is_canceled: subscriptionData.is_canceled || false
            };
          }
        }
        
        const profileData = { 
          name: data.name || '',
          hasCompletedOnboarding,
          ...subscriptionInfo
        };
        
        // Cache the successful subscription state
        if (subscriptionInfo.subscription_plan) {
          cacheSubscriptionState(userId, subscriptionInfo);
        }
        
        console.log('Setting user profile:', profileData);
        setUserProfile(profileData);
        setLastFetchTime(Date.now());
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // On catch, preserve existing cached state
      const cachedState = getCachedSubscriptionState(userId);
      if (cachedState) {
        console.log('Using cached subscription state due to fetch error');
        setUserProfile(prev => prev ? { ...prev, ...cachedState } : cachedState);
      }
    }
  };

  const updateOnboardingStatus = async (completed: boolean) => {
    if (user) {
      localStorage.setItem(`onboarding_${user.id}`, completed ? 'completed' : 'pending');
      setUserProfile(prev => prev ? { ...prev, hasCompletedOnboarding: completed } : null);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: name
        }
      }
    });
    
    // If signup is successful, indicate that onboarding is needed
    if (!error) {
      return { error, needsOnboarding: true };
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    // Reset the fetch tracking for actual login
    hasEverFetchedProfileRef.current = false;
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signInWithGoogle = async () => {
    // Reset the fetch tracking for actual login
    hasEverFetchedProfileRef.current = false;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    
    return { error };
  };

  const signOut = async () => {
    // Clear cached subscription state on sign out
    if (user?.id) {
      try {
        localStorage.removeItem(`subscription_state_${user.id}`);
      } catch {
        // Ignore localStorage errors
      }
    }
    hasEverFetchedProfileRef.current = false;
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    userProfile,
    updateOnboardingStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
