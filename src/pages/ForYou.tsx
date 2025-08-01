
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import SwipeablePropertyCard from '../components/SwipeablePropertyCard';
import PropertyDetail from '../components/PropertyDetail';

interface Property {
  id: string;
  address: string;
  monthly_rent?: number;
  price?: number;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  images: any[];
  neighborhood: string;
  borough?: string;
  listing_url?: string;
  discount_percent: number;
  undervaluation_percent?: number;
  potential_monthly_savings?: number;
  potential_savings?: number;
  description?: string;
  property_type?: string;
  table_source: string;
  grade?: string;
  score?: number;
  reasoning?: string;
  videos?: any[];
  floorplans?: any[];
  amenities?: string[];
  no_fee?: boolean;
  days_on_market?: number;
  built_in?: number;
  rent_per_sqft?: number;
  price_per_sqft?: number;
  monthly_hoa?: number;
  monthly_tax?: number;
  listing_id?: string;
  status?: string;
  display_status?: string;
}

const ForYou = () => {
  const { user, userProfile } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && userProfile) {
      fetchPersonalizedProperties();
    }
  }, [user, userProfile]);

  const fetchPersonalizedProperties = async () => {
    if (!userProfile) return;

    setIsLoading(true);
    const allProperties: Property[] = [];

    try {
      // Check if user completed onboarding (either regular onboarding or pre-onboarding)
      const hasCompletedAnyOnboarding = userProfile.onboarding_completed || userProfile.hasCompletedOnboarding;
      
      if (!hasCompletedAnyOnboarding) {
        setIsLoading(false);
        return;
      }

      // Fetch from undervalued_rentals
      const { data: rentals, error: rentalsError } = await supabase
        .from('undervalued_rentals')
        .select('*')
        .eq('status', 'active')
        .order('discount_percent', { ascending: false })
        .limit(50);

      if (!rentalsError && rentals) {
        rentals.forEach(rental => {
          const propertyImages = Array.isArray(rental.images) ? rental.images : 
                               typeof rental.images === 'string' ? JSON.parse(rental.images) : 
                               [];
          
          const propertyVideos = Array.isArray(rental.videos) ? rental.videos : [];
          const propertyFloorplans = Array.isArray(rental.floorplans) ? rental.floorplans : [];
          const propertyAmenities = Array.isArray(rental.amenities) ? rental.amenities : [];
          
          allProperties.push({
            ...rental,
            images: propertyImages,
            property_type: 'rent',
            table_source: 'undervalued_rentals',
            videos: propertyVideos,
            floorplans: propertyFloorplans,
            amenities: propertyAmenities,
            no_fee: rental.no_fee || false
          });
        });
      }

      // Fetch from undervalued_rent_stabilized
      const { data: stabilized, error: stabilizedError } = await supabase
        .from('undervalued_rent_stabilized')
        .select('*')
        .eq('display_status', 'active')
        .order('undervaluation_percent', { ascending: false })
        .limit(50);

      if (!stabilizedError && stabilized) {
        stabilized.forEach(property => {
          const propertyImages = Array.isArray(property.images) ? property.images : 
                               typeof property.images === 'string' ? JSON.parse(property.images) : 
                               [];
          
          const propertyAmenities = Array.isArray(property.amenities) ? property.amenities : [];
          
          allProperties.push({
            ...property,
            images: propertyImages,
            property_type: 'rent',
            table_source: 'undervalued_rent_stabilized',
            discount_percent: property.undervaluation_percent || 0,
            videos: [],
            floorplans: [],
            amenities: propertyAmenities,
            no_fee: false
          });
        });
      }

      // Fetch from undervalued_sales
      const { data: sales, error: salesError } = await supabase
        .from('undervalued_sales')
        .select('*')
        .eq('status', 'active')
        .order('discount_percent', { ascending: false })
        .limit(50);

      if (!salesError && sales) {
        sales.forEach(sale => {
          const propertyImages = Array.isArray(sale.images) ? sale.images : 
                               typeof sale.images === 'string' ? JSON.parse(sale.images) : 
                               [];
          
          const propertyVideos = Array.isArray(sale.videos) ? sale.videos : [];
          const propertyFloorplans = Array.isArray(sale.floorplans) ? sale.floorplans : [];
          const propertyAmenities = Array.isArray(sale.amenities) ? sale.amenities : [];
          
          allProperties.push({
            ...sale,
            images: propertyImages,
            property_type: 'buy',
            table_source: 'undervalued_sales',
            videos: propertyVideos,
            floorplans: propertyFloorplans,
            amenities: propertyAmenities,
            no_fee: false
          });
        });
      }

      // Shuffle and set properties
      const shuffled = allProperties.sort(() => 0.5 - Math.random());
      setProperties(shuffled);
    } catch (error) {
      console.error('Error fetching personalized properties:', error);
      toast({
        title: "Error",
        description: "Failed to load your personalized properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipeLeft = () => {
    // Move to next property (discard current)
    if (currentIndex < properties.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast({
        title: "No More Properties",
        description: "You've reached the end of available properties.",
      });
    }
  };

  const handleSwipeRight = () => {
    // Property was saved, move to next
    if (currentIndex < properties.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast({
        title: "No More Properties",
        description: "You've reached the end of available properties.",
      });
    }
  };

  const handlePropertyClick = () => {
    const property = properties[currentIndex];
    if (property) {
      setSelectedProperty(property);
    }
  };

  const getTruncatedReasoning = (reasoning?: string) => {
    if (!reasoning) return "This property shows strong market fundamentals with potential for appreciation.";
    
    // Clean up the reasoning text and truncate to about 100 characters
    const cleaned = reasoning.replace(/['"]/g, '').trim();
    if (cleaned.length <= 100) return cleaned;
    
    // Find the last complete sentence within 100 characters
    const truncated = cleaned.substring(0, 100);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastPeriod > 50) {
      return truncated.substring(0, lastPeriod + 1);
    } else if (lastSpace > 50) {
      return truncated.substring(0, lastSpace) + '...';
    } else {
      return truncated + '...';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white font-inter flex justify-center items-center">
        <div className="text-xl">Loading your personalized properties...</div>
      </div>
    );
  }

  if (!userProfile || (!userProfile.onboarding_completed && !userProfile.hasCompletedOnboarding)) {
    return (
      <div className="min-h-screen bg-black text-white font-inter flex justify-center items-center">
        <div className="text-xl">Complete onboarding to see personalized properties.</div>
      </div>
    );
  }

  const property = properties[currentIndex];

  if (!property) {
    return (
      <div className="min-h-screen bg-black text-white font-inter flex flex-col items-center justify-center p-4 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">No More Deals</h1>
          <p className="text-gray-400 max-w-md">
            You've seen all available properties matching your criteria. Check back soon for new listings!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white font-inter flex flex-col items-center justify-center p-4">
        {/* Enhanced Header */}
        <div className="w-full max-w-md text-center mb-6 space-y-2">
          <h1 className="text-4xl font-bold mb-2 text-white">
            Your dream home. Found for you
          </h1>
          <p className="text-sm text-gray-400 mb-1">
            Curated deals matching your preferences
          </p>
          <p className="text-gray-500 text-sm">
            Property {currentIndex + 1} of {properties.length}
          </p>
        </div>

        {/* Swipeable Property Card */}
        <div className="mb-6">
          <SwipeablePropertyCard
            property={property}
            isRental={property.property_type === 'rent'}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onPropertyClick={handlePropertyClick}
          />
        </div>

        {/* AI Analysis Bio */}
        <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-800">
          <h3 className="text-sm font-semibold text-blue-400 mb-2">AI Analysis</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {getTruncatedReasoning(property.reasoning)}
          </p>
        </div>

        {/* Enhanced Instructions */}
        <div className="w-full max-w-md text-center space-y-3">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-400">Drag left to discard</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Drag right to save</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Tap property to view full details
          </p>
        </div>
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty as any}
          isRental={selectedProperty.property_type === 'rent'}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </>
  );
};

export default ForYou;
