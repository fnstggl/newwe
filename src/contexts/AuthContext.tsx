
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any; needsOnboarding?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  userProfile: { 
    name: string; 
    hasCompletedOnboarding?: boolean;
    subscription_plan?: string;
    subscription_renewal?: string;
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
  } | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user profile when user logs in (but not on signup)
        if (session?.user && event !== 'SIGNED_UP') {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else if (!session) {
          setUserProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, subscription_plan, subscription_renewal')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      if (data) {
        // Check if user has completed onboarding (for now, we'll use localStorage)
        const hasCompletedOnboarding = localStorage.getItem(`onboarding_${userId}`) === 'completed';
        setUserProfile({ 
          name: data.name || '',
          hasCompletedOnboarding,
          subscription_plan: data.subscription_plan || 'free',
          subscription_renewal: data.subscription_renewal || 'monthly'
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
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
