
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Heart, X, Settings, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../components/ui/button';
import { useSavedProperties } from '../hooks/useSavedProperties';

interface Property {
  id: string;
  address: string;
  monthly_rent?: number;
  price?: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: any[];
  neighborhood: string;
  borough: string;
  discount_percent: number;
  property_type: string;
  listing_url?: string;
  table_source: 'undervalued_rentals' | 'undervalued_sales' | 'undervalued_rent_stabilized';
}

const ForYou = () => {
  const { user, userProfile } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const { saveProperty } = useSavedProperties();

  const isPremium = userProfile?.subscription_plan === 'unlimited' || 
                   userProfile?.subscription_plan === 'open_door_plan' || 
                   userProfile?.subscription_plan === 'staff';

  useEffect(() => {
    if (user && userProfile?.onboarding_completed) {
      fetchPersonalizedProperties();
    }
  }, [user, userProfile]);

  const fetchPersonalizedProperties = async () => {
    setIsLoading(true);
    try {
      const allProperties: Property[] = [];

      // Build filters based on user preferences
      const filters: any = {};
      
      if (userProfile?.bedrooms) filters.bedrooms = userProfile.bedrooms;
      if (userProfile?.max_budget && userProfile.property_type === 'rent') {
        filters.monthly_rent = `lte.${userProfile.max_budget}`;
      }
      if (userProfile?.max_budget && userProfile.property_type === 'buy') {
        filters.price = `lte.${userProfile.max_budget}`;
      }
      if (userProfile?.preferred_neighborhoods?.length) {
        filters.neighborhood = `in.(${userProfile.preferred_neighborhoods.join(',')})`;
      }
      if (userProfile?.discount_threshold) {
        filters.discount_percent = `gte.${userProfile.discount_threshold}`;
      }

      // Fetch from appropriate tables based on user preferences
      if (!userProfile?.property_type || userProfile.property_type === 'rent') {
        // Fetch rentals
        const { data: rentals, error: rentalsError } = await supabase
          .from('undervalued_rentals')
          .select('*')
          .match(filters)
          .eq('status', 'active')
          .order('discount_percent', { ascending: false })
          .limit(20);

        if (!rentalsError && rentals) {
          allProperties.push(...rentals.map(p => ({ ...p, table_source: 'undervalued_rentals' as const })));
        }

        // Fetch rent stabilized
        const { data: stabilized, error: stabilizedError } = await supabase
          .from('undervalued_rent_stabilized')
          .select('*')
          .match(filters)
          .eq('display_status', 'active')
          .order('undervaluation_percent', { ascending: false })
          .limit(20);

        if (!stabilizedError && stabilized) {
          allProperties.push(...stabilized.map(p => ({ 
            ...p, 
            discount_percent: p.undervaluation_percent,
            table_source: 'undervalued_rent_stabilized' as const 
          })));
        }
      }

      if (!userProfile?.property_type || userProfile.property_type === 'buy') {
        // Fetch sales
        const { data: sales, error: salesError } = await supabase
          .from('undervalued_sales')
          .select('*')
          .match(filters)
          .eq('status', 'active')
          .order('discount_percent', { ascending: false })
          .limit(20);

        if (!salesError && sales) {
          allProperties.push(...sales.map(p => ({ ...p, table_source: 'undervalued_sales' as const })));
        }
      }

      // Shuffle and limit properties
      const shuffled = allProperties.sort(() => Math.random() - 0.5);
      setProperties(shuffled);
    } catch (error) {
      console.error('Error fetching personalized properties:', error);
      toast({
        title: "Error",
        description: "Failed to load personalized properties.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (currentIndex >= properties.length) return;

    setSwipeDirection(direction);
    
    if (direction === 'right') {
      // Save property
      const property = properties[currentIndex];
      try {
        await saveProperty(property.id, property.table_source === 'undervalued_sales' ? 'sale' : 'rental');
        toast({
          title: "Saved!",
          description: "Property saved to your favorites.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save property.",
          variant: "destructive",
        });
      }
    }

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 300);
  };

  const currentProperty = properties[currentIndex];
  const visibleProperties = isPremium ? properties : properties.slice(0, 3);
  const showUpgrade = !isPremium && currentIndex >= 3;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your personalized properties...</p>
        </div>
      </div>
    );
  }

  if (showUpgrade) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">You've seen your free properties!</h1>
            <p className="text-gray-400">
              Upgrade to unlimited to see all {properties.length} personalized listings.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Unlock Everything</h3>
            <p className="text-sm mb-4">$3/month • Cancel anytime</p>
            <Button 
              onClick={() => window.location.href = '/pricing'} 
              className="w-full bg-white text-black hover:bg-gray-100"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentIndex >= visibleProperties.length) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-3xl font-bold">You've seen all your matches!</h1>
          <p className="text-gray-400">
            We'll notify you when new properties matching your criteria become available.
          </p>
          <Button 
            onClick={() => {
              setCurrentIndex(0);
              fetchPersonalizedProperties();
            }} 
            className="bg-white text-black hover:bg-gray-100"
          >
            Refresh Properties
          </Button>
        </div>
      </div>
    );
  }

  if (!currentProperty) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No properties found</h1>
          <p className="text-gray-400 mb-6">
            Try adjusting your preferences or check back later.
          </p>
          <Button onClick={() => setShowPreferences(true)}>
            Update Preferences
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (property: Property) => {
    if (property.table_source === 'undervalued_sales') {
      return property.price ? `$${(property.price / 1000000).toFixed(1)}M` : 'N/A';
    }
    return property.monthly_rent ? `$${property.monthly_rent.toLocaleString()}/mo` : 'N/A';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">For You</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreferences(true)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Property Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className={`max-w-sm w-full transition-all duration-300 ${
            swipeDirection === 'left' ? 'transform -translate-x-full opacity-0 bg-red-500/20' : 
            swipeDirection === 'right' ? 'transform translate-x-full opacity-0 bg-green-500/20' : ''
          }`}
        >
          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
            {/* Image */}
            <div className="h-96 bg-gray-700 relative overflow-hidden">
              {currentProperty.images && currentProperty.images.length > 0 ? (
                <img 
                  src={currentProperty.images[0].url || currentProperty.images[0]} 
                  alt={currentProperty.address}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
              
              {/* Discount Badge */}
              <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {Math.round(currentProperty.discount_percent)}% below market
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-1">{formatPrice(currentProperty)}</h2>
                  <p className="text-gray-400">{currentProperty.address}</p>
                  <p className="text-sm text-gray-500">{currentProperty.neighborhood}, {currentProperty.borough}</p>
                </div>
              </div>

              <div className="flex gap-4 text-sm text-gray-400 mb-4">
                <span>{currentProperty.bedrooms} bed</span>
                <span>{currentProperty.bathrooms} bath</span>
                {currentProperty.sqft && <span>{currentProperty.sqft} sqft</span>}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleSwipe('left')}
                  className="flex-1 flex items-center justify-center gap-2 p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                  Pass
                </button>
                <button
                  onClick={() => handleSwipe('right')}
                  className="flex-1 flex items-center justify-center gap-2 p-4 bg-green-600 rounded-xl hover:bg-green-500 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="p-4 border-t border-gray-800">
        <div className="max-w-sm mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what you're looking for..."
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:border-white focus:outline-none"
            />
            <button className="p-3 bg-white text-black rounded-full hover:bg-gray-100 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2">
        <div className="bg-gray-800 rounded-full px-4 py-2 text-sm">
          {currentIndex + 1} / {visibleProperties.length}
        </div>
      </div>
    </div>
  );
};

export default ForYou;
