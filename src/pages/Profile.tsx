
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, userProfile, signOut } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [allNeighborhoods, setAllNeighborhoods] = useState<string[]>([]);

  useEffect(() => {
    fetchNeighborhoods();
  }, []);

  const fetchNeighborhoods = async () => {
    try {
      // Fetch unique neighborhoods from both sales and rentals tables
      const { data: salesNeighborhoods } = await supabase
        .from('undervalued_sales')
        .select('neighborhood')
        .not('neighborhood', 'is', null);

      const { data: rentalsNeighborhoods } = await supabase
        .from('undervalued_rentals')
        .select('neighborhood')
        .not('neighborhood', 'is', null);

      const allNeighborhoodsSet = new Set<string>();
      
      salesNeighborhoods?.forEach(item => {
        if (item.neighborhood) allNeighborhoodsSet.add(item.neighborhood);
      });
      
      rentalsNeighborhoods?.forEach(item => {
        if (item.neighborhood) allNeighborhoodsSet.add(item.neighborhood);
      });

      setAllNeighborhoods(Array.from(allNeighborhoodsSet).sort());
    } catch (error) {
      console.error('Error fetching neighborhoods:', error);
    }
  };

  const filteredNeighborhoods = allNeighborhoods.filter(neighborhood =>
    neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleNeighborhood = (neighborhood: string) => {
    setSelectedNeighborhoods(prev =>
      prev.includes(neighborhood)
        ? prev.filter(n => n !== neighborhood)
        : [...prev, neighborhood]
    );
  };

  const handlePasswordReset = async () => {
    if (user?.email) {
      try {
        await supabase.auth.resetPasswordForEmail(user.email);
        alert('Password reset email sent!');
      } catch (error) {
        console.error('Error sending password reset:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 tracking-tighter">Account Settings</h1>
        
        {/* Account Information */}
        <Card className="bg-gray-900/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white tracking-tight">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
              <Input
                type="text"
                value={userProfile?.name || ''}
                readOnly
                className="bg-black/50 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <Input
                type="email"
                value={user.email || ''}
                readOnly
                className="bg-black/50 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="flex space-x-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  value="••••••••••••"
                  readOnly
                  className="bg-black/50 border-gray-700 text-white flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={handlePasswordReset}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Reset Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Preferences */}
        <Card className="bg-gray-900/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white tracking-tight">Email Preferences</CardTitle>
            <p className="text-gray-400 text-sm">Select neighborhoods to receive deal alerts for</p>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search neighborhoods..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/50 border-gray-700 text-white"
                />
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {filteredNeighborhoods.map((neighborhood) => (
                  <Badge
                    key={neighborhood}
                    variant={selectedNeighborhoods.includes(neighborhood) ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      selectedNeighborhoods.includes(neighborhood)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-transparent text-gray-300 border-gray-600 hover:border-blue-500'
                    }`}
                    onClick={() => toggleNeighborhood(neighborhood)}
                  >
                    {neighborhood}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plan */}
        <Card className="bg-gray-900/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white tracking-tight">Subscription Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-white capitalize">
                  {userProfile?.subscription_plan || 'Free'} Plan
                </p>
                <p className="text-gray-400 text-sm">
                  {userProfile?.subscription_renewal === 'annual' ? 'Billed annually' : 'Billed monthly'}
                </p>
              </div>
              <Link to="/pricing">
                <Button className="bg-white text-black hover:bg-gray-200 font-semibold">
                  Manage Subscription
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <div className="text-center">
          <Button
            onClick={signOut}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-2"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
