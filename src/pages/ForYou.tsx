
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Heart, X, MessageCircle, Sparkles, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '@/components/PropertyCard';
import PropertyDetail from '@/components/PropertyDetail';
import { motion, AnimatePresence } from 'framer-motion';

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
  // Add missing fields for PropertyDetail component
  videos?: any[];
  floorplans?: any[];
  amenities?: string[];
  no_fee?: boolean;
  days_on_market?: number;
  built_in?: number;
  listing_id?: string;
  status?: string;
  display_status?: string;
  annual_savings?: number;
  monthly_hoa?: number;
  monthly_tax?: number;
  undervaluation_analysis?: any;
  rent_stabilization_analysis?: any;
  rent_stabilized_confidence?: number;
  potential_annual_savings?: number;
  // Additional fields needed for complete property details
  zipcode?: string;
  listed_at?: string;
  analysis_date?: string;
  created_at?: string;
  property_type_display?: string;
  pet_friendly?: boolean;
  laundry_available?: boolean;
  gym_available?: boolean;
  doorman_building?: boolean;
  elevator_building?: boolean;
  rooftop_access?: boolean;
  agents?: any[];
  building_info?: any;
  likely_sold?: boolean;
  likely_rented?: boolean;
  last_seen_in_search?: string;
  reliability_score?: number;
  category_confidence?: number;
  amenity_count?: number;
}

const ForYou = () => {
  const { user, userProfile } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Personalized headers that rotate
  const personalizedHeaders = [
    `We found one you're going to love, ${userProfile?.name?.split(' ')[0] || 'there'}.`,
    "This one feels like home.",
    "Could this be the one?",
    `${properties[currentIndex]?.borough || 'NYC'} just got a little more affordable.`,
    "Here's something special we discovered.",
  ];

  const [currentHeaderIndex, setCurrentHeaderIndex] = useState(0);

  useEffect(() => {
    if (user && userProfile) {
      fetchPersonalizedProperties();
    }
  }, [user, userProfile]);

  // Add loading simulation and reveal animation
  useEffect(() => {
    if (properties.length > 0) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
        setIsRevealing(true);
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [properties]);

  // Rotate headers when swiping to new properties
  useEffect(() => {
    setCurrentHeaderIndex(Math.floor(Math.random() * personalizedHeaders.length));
  }, [currentIndex]);

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
              table_source: 'undervalued_rentals',
              videos: (rental as any).videos || [],
              floorplans: (rental as any).floorplans || [],
              amenities: Array.isArray(rental.amenities) ? rental.amenities : 
                        typeof rental.amenities === 'string' ? JSON.parse(rental.amenities || '[]') : [],
              agents: (rental as any).agents || [],
              building_info: (rental as any).building_info || {}
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
              isRentStabilized: true,
              videos: (property as any).videos || [],
              floorplans: (property as any).floorplans || [],
              amenities: Array.isArray(property.amenities) ? property.amenities : 
                        typeof property.amenities === 'string' ? JSON.parse(property.amenities || '[]') : [],
              agents: (property as any).agents || [],
              building_info: (property as any).building_info || {}
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
              table_source: 'undervalued_sales',
              videos: (sale as any).videos || [],
              floorplans: (sale as any).floorplans || [],
              amenities: Array.isArray(sale.amenities) ? sale.amenities : 
                        typeof sale.amenities === 'string' ? JSON.parse(sale.amenities || '[]') : [],
              agents: (sale as any).agents || [],
              building_info: (sale as any).building_info || {}
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
      setIsRevealing(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsRevealing(true);
      }, 200);
    } else {
      toast({
        title: "No More Properties",
        description: "You've reached the end of available properties.",
      });
    }
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const closePropertyDetail = () => {
    setSelectedProperty(null);
  };

  const getWhyWePickedThis = (property: Property) => {
    const reasons = [];
    if (property.discount_percent > 30) {
      reasons.push(`Priced ${Math.round(property.discount_percent)}% below market`);
    }
    if (property.isRentStabilized) {
      reasons.push("Likely rent-stabilized");
    }
    if (userProfile?.preferred_neighborhoods?.includes(property.neighborhood)) {
      reasons.push("In your preferred neighborhood");
    }
    if (property.bedrooms === userProfile?.bedrooms) {
      reasons.push("Matches your bedroom preference");
    }
    return reasons[0] || "Great deal in your area";
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setIsRevealing(false);
    setCurrentIndex(0);
    fetchPersonalizedProperties();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white font-inter flex flex-col items-center justify-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-3">
            <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
            <span className="text-2xl font-semibold animate-pulse">Scanning the market...</span>
            <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
          </div>
          <span className="text-lg text-white/70 flex items-center justify-center space-x-2">
            <span>Finding your dream home</span>
            <Home className="w-5 h-5" />
          </span>
        </motion.div>
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!userProfile || (!userProfile.onboarding_completed && !userProfile.hasCompletedOnboarding)) {
    return <div className="flex justify-center items-center h-screen text-white">Complete onboarding to see personalized properties.</div>;
  }

  const property = properties[currentIndex];

  if (!property) {
    return (
      <div className="min-h-screen bg-black text-white font-inter flex flex-col items-center justify-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <p className="text-2xl font-semibold">That's all we've found for now!</p>
          <p className="text-white/60 text-lg">New listings appear daily. We'll keep watching the market for you.</p>
          <motion.button 
            onClick={handleRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 transition-colors border border-white/20"
          >
            Refresh now
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white font-inter flex flex-col relative overflow-hidden">
        {/* Personalized Header */}
        <motion.div 
          key={currentHeaderIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-8 pb-4"
        >
          <p className="text-xl font-medium text-white/90">
            {personalizedHeaders[currentHeaderIndex]}
          </p>
        </motion.div>

        {/* Property Card - Made thinner/longer */}
        <div className="flex-1 flex items-center justify-center px-6">
          <AnimatePresence mode="wait">
            {isRevealing && (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 1.05 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-lg mx-auto"
              >
                <div className="relative">
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
                  
                  {/* Why We Picked This - Positioned above buttons with proper spacing */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2"
                  >
                    <p className="text-sm text-blue-300 flex items-center space-x-2">
                      <span>💡</span>
                      <span>{getWhyWePickedThis(property)}</span>
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Swipe Actions with Subtle Animations - Positioned below "Why We Picked This" with increased margin */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex justify-center space-x-8 pb-8 mt-20"
        >
          <motion.button 
            onClick={() => handleSkip()} 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 transition-colors border border-gray-600/50 flex items-center space-x-2"
          >
            <X className="w-6 h-6 text-red-400" />
            <span className="text-red-300">Not for me</span>
          </motion.button>
          
          <motion.button 
            onClick={() => handleSave(property)} 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 transition-colors border border-gray-600/50 flex items-center space-x-2"
          >
            <Heart className="w-6 h-6 text-green-400" />
            <span className="text-green-300">Save this one</span>
          </motion.button>
        </motion.div>

        {/* Chat Input */}
        <div className="w-full max-w-lg mx-auto px-6 pb-8">
          <div className="flex rounded-full overflow-hidden border border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
            <input
              type="text"
              placeholder="Send a message..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="w-full px-4 py-3 bg-transparent text-white focus:outline-none"
            />
            <button className="px-4 py-3 bg-blue-600/80 text-white hover:bg-blue-500/80 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Property Detail Popup - Using the same component as Buy/Rent pages */}
      <AnimatePresence>
        {selectedProperty && (
          <PropertyDetail
            property={selectedProperty as any}
            isRental={selectedProperty.property_type === 'rent'}
            onClose={closePropertyDetail}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ForYou;
