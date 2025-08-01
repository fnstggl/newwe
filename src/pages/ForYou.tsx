
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

      // Fetch from undervalued_rentals if looking to rent
      if (!userProfile.property_type || userProfile.property_type === 'rent') {
        let query = supabase
          .from('undervalued_rentals')
          .select('*')
          .eq('status', 'active')
          .order('discount_percent', { ascending: false })
          .limit(50);

        const { data: rentals, error: rentalsError } = await query;

        if (!rentalsError && rentals) {
          rentals.forEach(rental => {
            const propertyImages = Array.isArray(rental.images) ? rental.images : 
                                 typeof rental.images === 'string' ? JSON.parse(rental.images) : 
                                 [];
            
            allProperties.push({
              ...rental,
              images: propertyImages,
              property_type: 'rent',
              table_source: 'undervalued_rentals'
            });
          });
        }

        // Also fetch from undervalued_rent_stabilized
        let stabilizedQuery = supabase
          .from('undervalued_rent_stabilized')
          .select('*')
          .eq('display_status', 'active')
          .order('undervaluation_percent', { ascending: false })
          .limit(50);

        const { data: stabilized, error: stabilizedError } = await stabilizedQuery;

        if (!stabilizedError && stabilized) {
          stabilized.forEach(property => {
            const propertyImages = Array.isArray(property.images) ? property.images : 
                                 typeof property.images === 'string' ? JSON.parse(property.images) : 
                                 [];
            
            allProperties.push({
              ...property,
              images: propertyImages,
              property_type: 'rent',
              table_source: 'undervalued_rent_stabilized',
              discount_percent: property.undervaluation_percent || 0
            });
          });
        }
      }

      // Fetch from undervalued_sales if looking to buy
      if (!userProfile.property_type || userProfile.property_type === 'buy') {
        let query = supabase
          .from('undervalued_sales')
          .select('*')
          .eq('status', 'active')
          .order('discount_percent', { ascending: false })
          .limit(50);

        const { data: sales, error: salesError } = await query;

        if (!salesError && sales) {
          sales.forEach(sale => {
            const propertyImages = Array.isArray(sale.images) ? sale.images : 
                                 typeof sale.images === 'string' ? JSON.parse(sale.images) : 
                                 [];
            
            allProperties.push({
              ...sale,
              images: propertyImages,
              property_type: 'buy',
              table_source: 'undervalued_sales'
            });
          });
        }
      }

      // Apply filters
      let filteredProperties = allProperties;

      // Filter by bedrooms
      if (userProfile.bedrooms !== undefined && userProfile.bedrooms !== null) {
        filteredProperties = filteredProperties.filter(p => p.bedrooms === userProfile.bedrooms);
      }

      // Filter by budget
      if (userProfile.max_budget) {
        filteredProperties = filteredProperties.filter(p => {
          if (p.property_type === 'rent' && p.monthly_rent) {
            return p.monthly_rent <= userProfile.max_budget!;
          } else if (p.property_type === 'buy' && p.price) {
            return p.price <= userProfile.max_budget!;
          }
          return true;
        });
      }

      // Filter by neighborhoods - fixed logic
      if (userProfile.preferred_neighborhoods && userProfile.preferred_neighborhoods.length > 0) {
        const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
        const selectedBoroughs = userProfile.preferred_neighborhoods.filter(n => boroughs.includes(n));
        const selectedNeighborhoods = userProfile.preferred_neighborhoods.filter(n => !boroughs.includes(n) && n !== 'Anywhere with a train');
        
        filteredProperties = filteredProperties.filter(p => {
          // If "Anywhere with a train" is selected, show all properties
          if (userProfile.preferred_neighborhoods!.includes('Anywhere with a train')) {
            return true;
          }
          
          // Check if property matches selected boroughs
          if (selectedBoroughs.length > 0 && p.borough) {
            if (selectedBoroughs.includes(p.borough)) return true;
          }
          
          // Check if property matches selected neighborhoods
          if (selectedNeighborhoods.length > 0 && p.neighborhood) {
            if (selectedNeighborhoods.some(neighborhood => 
              p.neighborhood?.toLowerCase().includes(neighborhood.toLowerCase())
            )) return true;
          }
          
          // If no boroughs or neighborhoods selected, but other areas selected, exclude
          if (selectedBoroughs.length === 0 && selectedNeighborhoods.length === 0) {
            return true;
          }
          
          return false;
        });
      }

      // Filter by discount threshold
      if (userProfile.discount_threshold) {
        filteredProperties = filteredProperties.filter(p => 
          p.discount_percent >= userProfile.discount_threshold!
        );
      }

      // Filter by must-haves for rentals
      if (userProfile.property_type === 'rent' && userProfile.must_haves && userProfile.must_haves.length > 0) {
        filteredProperties = filteredProperties.filter(p => {
          if (userProfile.must_haves!.includes('No broker fee') && p.table_source === 'undervalued_rentals') {
            return (p as any).no_fee === true;
          }
          if (userProfile.must_haves!.includes('Rent-stabilized')) {
            return p.table_source === 'undervalued_rent_stabilized';
          }
          return true;
        });
      }

      // Shuffle and set properties
      const shuffled = filteredProperties.sort(() => 0.5 - Math.random());
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
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            For You
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
          property={selectedProperty}
          isRental={selectedProperty.property_type === 'rent'}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </>
  );
};

export default ForYou;
