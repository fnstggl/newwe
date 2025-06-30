import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import SavedPropertiesSection from '@/components/SavedPropertiesSection';
import { useSubscription } from '@/contexts/SubscriptionContext';

export default function Profile() {
  const { user, signOut } = useAuth();
  const { subscribed, subscriptionTier, subscriptionEnd, openCustomerPortal, isLoading } = useSubscription();
  const [profile, setProfile] = useState<{ name: string | null; } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile({ name: data?.name || null });
        }
      }
    };

    getProfile();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open subscription management.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Profile */}
          <div className="md:w-1/2">
            <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
              <h1 className="text-3xl font-bold mb-8 tracking-tight">Profile</h1>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profile?.name || ''}
                    onChange={(e) => setProfile(prev => prev ? {...prev, name: e.target.value} : null)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subscription Plan
                  </label>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      subscribed 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {subscribed ? `${subscriptionTier} Plan` : 'Free Plan'}
                    </span>
                    {subscribed && subscriptionEnd && (
                      <span className="text-sm text-gray-400">
                        Renews {new Date(subscriptionEnd).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {subscribed && (
                    <button
                      onClick={handleManageSubscription}
                      disabled={isLoading}
                      className="mt-2 text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50"
                    >
                      {isLoading ? "Loading..." : "Manage Subscription"}
                    </button>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <button
                    onClick={handleSignOut}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Saved Properties */}
          <div className="md:w-1/2">
            <SavedPropertiesSection />
          </div>
        </div>
      </div>
    </div>
  );
}
