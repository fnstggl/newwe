
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SavedPropertiesSection from '@/components/SavedPropertiesSection';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchNeighborhoods();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNeighborhoods = async () => {
    try {
      // Get unique neighborhoods from both sales and rentals
      const { data: salesData } = await supabase
        .from('undervalued_sales')
        .select('neighborhood')
        .not('neighborhood', 'is', null);

      const { data: rentalsData } = await supabase
        .from('undervalued_rentals')
        .select('neighborhood')
        .not('neighborhood', 'is', null);

      const allNeighborhoods = [
        ...(salesData || []).map(item => item.neighborhood),
        ...(rentalsData || []).map(item => item.neighborhood)
      ];

      const uniqueNeighborhoods = [...new Set(allNeighborhoods)].filter(Boolean).sort();
      setNeighborhoods(uniqueNeighborhoods);
    } catch (error) {
      console.error('Error fetching neighborhoods:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handlePasswordReset = async () => {
    if (profile?.email_address) {
      await supabase.auth.resetPasswordForEmail(profile.email_address);
      alert('Password reset email sent!');
    }
  };

  const toggleNeighborhood = (neighborhood: string) => {
    setSelectedNeighborhoods(prev => 
      prev.includes(neighborhood)
        ? prev.filter(n => n !== neighborhood)
        : [...prev, neighborhood]
    );
  };

  const filteredNeighborhoods = neighborhoods.filter(neighborhood =>
    neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 tracking-tighter">Account Settings</h1>
        
        <div className="space-y-8">
          {/* Saved Properties Section */}
          <SavedPropertiesSection />

          {/* Account Information */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-400">Name</Label>
                <Input 
                  value={profile?.name || ''} 
                  disabled 
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Email</Label>
                <Input 
                  value={profile?.email_address || ''} 
                  disabled 
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Password</Label>
                <div className="flex gap-2">
                  <Input 
                    type="password"
                    value="••••••••" 
                    disabled 
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  <Button 
                    onClick={handlePasswordReset}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Preferences */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Email Preferences</CardTitle>
              <p className="text-gray-400 text-sm">
                Select neighborhoods you want to receive email updates for
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  placeholder="Search neighborhoods..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-500"
                />
              </div>
              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                {filteredNeighborhoods.map(neighborhood => (
                  <Badge
                    key={neighborhood}
                    variant={selectedNeighborhoods.includes(neighborhood) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      selectedNeighborhoods.includes(neighborhood)
                        ? 'bg-blue-600 text-white'
                        : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                    }`}
                    onClick={() => toggleNeighborhood(neighborhood)}
                  >
                    {neighborhood}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subscription Plan */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Subscription Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold capitalize">
                    {profile?.subscription_plan || 'Free'} Plan
                  </p>
                  <p className="text-gray-400 text-sm">
                    {profile?.subscription_renewal ? `Renews ${profile.subscription_renewal}` : 'No renewal'}
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/pricing')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sign Out */}
          <div className="pt-8">
            <Button 
              onClick={handleSignOut}
              variant="destructive"
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
