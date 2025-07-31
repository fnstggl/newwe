import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Heart, X, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  potential_monthly_savings?: number;
  potential_savings?: number;
  description?: string;
  property_type?: string;
  table_source: string;
}

const ForYou = () => {
  const { user, userProfile } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const { toast } = useToast();

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
      // Check if user completed onboarding
      if (!userProfile.onboarding_completed && !userProfile.hasCompletedOnboarding) {
        setIsLoading(false);
        return;
      }

      // Build filters based on user preferences
      let bedroomFilter = '';
      if (userProfile.bedrooms !== undefined && userProfile.bedrooms !== null) {
        bedroomFilter = userProfile.bedrooms === 0 ? '>= 0' : `= ${userProfile.bedrooms}`;
      }

      let budgetFilter = '';
      if (userProfile.max_budget && userProfile.property_type === 'rent') {
        budgetFilter = `<= ${userProfile.max_budget}`;
      } else if (userProfile.max_budget && userProfile.property_type === 'buy') {
        budgetFilter = `<= ${userProfile.max_budget}`;
      }

      let discountFilter = '';
      if (userProfile.discount_threshold) {
        discountFilter = `>= ${userProfile.discount_threshold}`;
      }

      // Fetch from undervalued_rentals if looking to rent
      if (!userProfile.property_type || userProfile.property_type === 'rent') {
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
            
            allProperties.push({
              ...rental,
              images: propertyImages,
              property_type: 'rent',
              table_source: 'undervalued_rentals'
            });
          });
        }

        // Also fetch from undervalued_rent_stabilized
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
            
            allProperties.push({
              ...property,
              images: propertyImages,
              property_type: 'rent',
              table_source: 'undervalued_rent_stabilized'
            });
          });
        }
      }

      // Fetch from undervalued_sales if looking to buy
      if (!userProfile.property_type || userProfile.property_type === 'buy') {
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

      // Filter by neighborhoods
      if (userProfile.preferred_neighborhoods && userProfile.preferred_neighborhoods.length > 0) {
        filteredProperties = filteredProperties.filter(p => 
          userProfile.preferred_neighborhoods!.some(neighborhood => 
            p.neighborhood?.toLowerCase().includes(neighborhood.toLowerCase()) ||
            p.borough?.toLowerCase().includes(neighborhood.toLowerCase())
          )
        );
      }

      // Filter by discount threshold
      if (userProfile.discount_threshold) {
        filteredProperties = filteredProperties.filter(p => 
          p.discount_percent >= userProfile.discount_threshold!
        );
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
          property_type: property.property_type,
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

  const handleChatSubmit = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('property_chats')
        .insert([{
          user_id: user.id,
          property_id: properties[currentIndex].id,
          message: chatMessage,
        }]);

      if (error) {
        console.error('Error submitting chat message:', error);
        toast({
          title: "Error",
          description: "Failed to send your message. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Message Sent",
          description: "Your message has been sent.",
        });
        setChatMessage(''); // Clear the input field
      }
    } catch (error) {
      console.error('Error submitting chat message:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while sending your message. Please try again.",
        variant: "destructive",
      });
    }
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
      {/* Property Card */}
      <div className="relative w-full max-w-md mx-auto mt-16 rounded-3xl shadow-lg overflow-hidden">
        {/* Image Carousel */}
        <div className="relative h-80">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.address}
              className="absolute w-full h-full object-cover"
            />
          ) : (
            <div className="absolute w-full h-full bg-gray-700 flex items-center justify-center">
              No Image Available
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">{property.address}</h2>
          <p className="text-gray-400">
            {property.property_type === 'rent' ? `$${property.monthly_rent?.toLocaleString()}` : `$${property.price?.toLocaleString()}`}
          </p>
          <div className="flex space-x-4">
            <span>{property.bedrooms} Beds</span>
            <span>{property.bathrooms} Baths</span>
            {property.sqft && <span>{property.sqft} SqFt</span>}
          </div>
          <p className="text-gray-500">{property.description}</p>
          {property.discount_percent && (
            <div className="text-green-500 font-semibold">
              {property.discount_percent}% Below Market Value
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-around p-4 border-t border-gray-700">
          <button onClick={() => handleSkip()} className="px-6 py-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
          <button onClick={() => handleSave(property)} className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Input */}
      <div className="mt-8 w-full max-w-md mx-auto px-4">
        <div className="flex rounded-full overflow-hidden border border-gray-700 bg-gray-900">
          <input
            type="text"
            placeholder="Send a message..."
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            className="w-full px-4 py-3 bg-transparent text-white focus:outline-none"
          />
          <button onClick={handleChatSubmit} className="px-4 py-3 bg-blue-600 text-white hover:bg-blue-500 transition-colors">
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForYou;
