
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Heart, X, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '@/components/PropertyCard';

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
  rent_per_sqft?: number;
  price_per_sqft?: number;
  reasoning?: string;
  isRentStabilized?: boolean;
}

const ForYou = () => {
  const { user, userProfile } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
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
              discount_percent: property.undervaluation_percent || 0,
              isRentStabilized: true
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

  const handleSave = async (property: Property) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .insert([{
          user_id: user.id,
          property_id: property.id,
          property_type: property.property_type || 'rent',
          table_source: property.table_source
        }]);

      if (error) {
        console.error('Error saving property:', error);
        toast({
          title: "Error",
          description: "Failed to save the property. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Property Saved",
          description: "This property has been saved to your profile.",
        });
      }
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSkip = () => {
    if (currentIndex < properties.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast({
        title: "No More Properties",
        description: "You've reached the end of available properties.",
      });
    }
  };

  const handlePropertyClick = (property: Property) => {
    const propertyType = property.property_type === 'buy' ? 'buy' : 'rent';
    navigate(`/${propertyType}/${property.id}`);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading properties...</div>;
  }

  if (!userProfile || (!userProfile.onboarding_completed && !userProfile.hasCompletedOnboarding)) {
    return <div className="flex justify-center items-center h-screen text-white">Complete onboarding to see personalized properties.</div>;
  }

  const property = properties[currentIndex];

  if (!property) {
    return <div className="flex justify-center items-center h-screen text-white">No properties found matching your criteria.</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white font-inter flex flex-col">
      {/* Property Card - Enlarged */}
      <div className="relative w-full max-w-2xl mx-auto mt-8 px-4">
        <PropertyCard
          property={{
            id: property.id,
            address: property.address,
            grade: property.grade || 'B',
            score: property.score || 85,
            price: property.price,
            monthly_rent: property.monthly_rent,
            price_per_sqft: property.price_per_sqft,
            rent_per_sqft: property.rent_per_sqft,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            sqft: property.sqft,
            neighborhood: property.neighborhood,
            discount_percent: property.discount_percent,
            reasoning: property.reasoning,
            images: property.images,
            isRentStabilized: property.isRentStabilized
          }}
          isRental={property.property_type === 'rent'}
          onClick={() => handlePropertyClick(property)}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-around p-8 max-w-md mx-auto w-full">
        <button 
          onClick={() => handleSkip()} 
          className="px-8 py-4 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <button 
          onClick={() => handleSave(property)} 
          className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors"
        >
          <Heart className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Input */}
      <div className="mt-8 w-full max-w-2xl mx-auto px-4 pb-8">
        <div className="flex rounded-full overflow-hidden border border-gray-700 bg-gray-900">
          <input
            type="text"
            placeholder="Send a message..."
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            className="w-full px-4 py-3 bg-transparent text-white focus:outline-none"
          />
          <button className="px-4 py-3 bg-blue-600 text-white hover:bg-blue-500 transition-colors">
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForYou;
