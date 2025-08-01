import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Heart, X, MessageCircle, Sparkles, Home, Search, MapPin, CheckCircle, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '@/components/PropertyCard';
import PropertyDetail from '@/components/PropertyDetail';
import UpdateFiltersModal from '@/components/UpdateFiltersModal';
import EndOfMatchesScreen from '@/components/EndOfMatchesScreen';
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

const LoadingSequence = () => {
  const [currentPhase, setCurrentPhase] = useState<'typewriter' | 'scanning' | 'found'>('typewriter');
  const [typewriterText, setTypewriterText] = useState('');
  const [scanningTexts, setScanningTexts] = useState([
    'Analyzing NYC listings...',
    'Scanning 4,219 rent-stabilized units...',
    'Checking for 2BRs in Carroll Gardens...',
    'Evaluating market discounts...',
    'Cross-referencing neighborhood data...'
  ]);
  const [currentScanIndex, setCurrentScanIndex] = useState(0);

  const fullTypewriterText = "Finding your dream home...";

  useEffect(() => {
  let timer: NodeJS.Timeout;

  if (currentPhase === 'typewriter') {
    if (typewriterText.length < fullTypewriterText.length) {
      timer = setTimeout(() => {
        setTypewriterText(fullTypewriterText.slice(0, typewriterText.length + 1));
      }, 120);
    } else {
      // Typewriter done, move to scanning after brief pause
      timer = setTimeout(() => setCurrentPhase('scanning'), 500);
    }
  } else if (currentPhase === 'scanning') {
    if (currentScanIndex < scanningTexts.length - 1) {
      timer = setTimeout(() => {
        setCurrentScanIndex(currentScanIndex + 1);
      }, 600);
    } else {
      // Scanning done, move to found
      timer = setTimeout(() => setCurrentPhase('found'), 300);
    }
  }

  return () => {
    if (timer) clearTimeout(timer);
  };
}, [typewriterText.length, currentPhase, currentScanIndex]);

  return (
    <div className="min-h-screen bg-black text-white font-inter flex flex-col items-center justify-center space-y-8">
      <AnimatePresence mode="wait">
        {currentPhase === 'typewriter' && (
          <motion.div
            key="typewriter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="text-3xl font-light tracking-wide">
              {typewriterText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="ml-1"
              >
                |
              </motion.span>
            </div>
          </motion.div>
        )}

        {currentPhase === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center space-y-6"
          >
            {/* Radar Animation */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-blue-500/30 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-4 border border-blue-400/50 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-8 border border-blue-300/70 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            {/* Scanning Text Feed */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScanIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-xl text-blue-300 font-light tracking-wide"
              >
                {scanningTexts[currentScanIndex]}
              </motion.div>
            </AnimatePresence>

            {/* Progress indicators */}
            <div className="flex justify-center space-x-2">
              {scanningTexts.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentScanIndex ? 'bg-blue-400' : 'bg-gray-600'
                  }`}
                  animate={index === currentScanIndex ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.6, repeat: index === currentScanIndex ? Infinity : 0 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {currentPhase === 'found' && (
          <motion.div
            key="found"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
            >
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-light text-green-300"
            >
              ✅ Dream homes found
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-sm text-gray-400"
            >
              Preparing your personalized matches...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ForYou = () => {
  const { user, userProfile, forceRefreshProfile } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showLoadingTeaser, setShowLoadingTeaser] = useState(false);
  const [showUpdateFilters, setShowUpdateFilters] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
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

  // Single master timer for the entire loading sequence
useEffect(() => {
  if (properties.length > 0) {
    const masterTimer = setTimeout(() => {
      setIsLoading(false);
      setIsRevealing(true);
    }, 6000);
    
    return () => clearTimeout(masterTimer);
  }
}, [properties]);

  // Rotate headers when swiping to new properties
  useEffect(() => {
    setCurrentHeaderIndex(Math.floor(Math.random() * personalizedHeaders.length));
  }, [currentIndex]);

  const fetchPersonalizedProperties = async () => {
    if (!userProfile) return;

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
  setIsLoading(false); // Only set loading false on error
}
// Remove the finally block entirely
  };

  const handleSave = async (property: Property) => {
    if (!user) return;

    try {
      // Use the actual UUID property ID, not the listing_id
      const propertyId = property.id;
      
      const { error } = await supabase
        .from('saved_properties')
        .insert({
          user_id: user.id,
          property_id: propertyId,
          property_type: property.property_type === 'buy' ? 'sale' : 'rental'
        });

      if (error) {
        // Check if it's a duplicate error
        if (error.code === '23505') {
          toast({
            title: "Already Saved",
            description: "This property is already in your saved list.",
          });
        } else {
          console.error('Error saving property:', error);
          toast({
            title: "Error",
            description: "Failed to save the property. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Property Saved",
          description: "Added to your saved properties!",
        });
        // Don't call handleSwipeRight here as it will be called by the button click
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

  const handleSwipeRight = () => {
    setSwipeDirection('right');
    toast({
      title: "✅ Saved",
      description: "Added to your saved properties.",
    });
    
    if (currentIndex < properties.length - 1) {
      setIsRevealing(false);
      setShowLoadingTeaser(true);
      
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setSwipeDirection(null);
        setShowLoadingTeaser(false);
        setTimeout(() => setIsRevealing(true), 50);
      }, 500); // Reduced from 750ms to 500ms for faster transitions
    } else {
      // Show end screen instead of toast
      setShowEndScreen(true);
    }
  };

  const handleSwipeLeft = () => {
    setSwipeDirection('left');
    
    if (currentIndex < properties.length - 1) {
      setIsRevealing(false);
      setShowLoadingTeaser(true);
      
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setSwipeDirection(null);
        setShowLoadingTeaser(false);
        setTimeout(() => setIsRevealing(true), 50);
      }, 500); // Reduced from 750ms to 500ms for faster transitions
    } else {
      // Show end screen instead of toast
      setShowEndScreen(true);
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
    setShowEndScreen(false);
    fetchPersonalizedProperties();
  };

  const handleFiltersUpdated = async () => {
    // Refresh user profile to get updated filters
    await forceRefreshProfile();
    // Refresh properties with new filters
    handleRefresh();
  };

  const handleRestartMatches = () => {
    setCurrentIndex(0);
    setShowEndScreen(false);
    setIsRevealing(false);
    setTimeout(() => setIsRevealing(true), 100);
  };

  if (isLoading) {
    return <LoadingSequence />;
  }

  // Don't show the "Complete onboarding" message - let the loading animation play and then show properties
  if (!userProfile || (!userProfile.onboarding_completed && !userProfile.hasCompletedOnboarding)) {
    if (properties.length === 0) {
      return <LoadingSequence />;
    }
  }

  // Show end screen if no more properties and user has reached the end
  if (showEndScreen) {
    return (
      <EndOfMatchesScreen 
        onRestart={handleRestartMatches}
        onUpdateFilters={() => setShowUpdateFilters(true)}
      />
    );
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
        {/* Update Filters Button - Top Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-8 left-6 z-10"
        >
          <button
            onClick={() => setShowUpdateFilters(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-full hover:bg-gray-700/80 transition-colors"
          >
            <Settings className="w-4 h-4 text-gray-300" />
            <span className="text-sm text-gray-300">Update Dream Home filters</span>
          </button>
        </motion.div>

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

        {/* Property Card - Made thinner/longer with swipe animations */}
        <div className="flex-1 flex items-center justify-center px-6 relative overflow-hidden">
          {/* Loading Teaser Overlay */}
          <AnimatePresence>
            {showLoadingTeaser && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
              >
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-400 rounded-full mx-auto"
                  />
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-blue-300 text-lg font-light"
                  >
                    {Math.random() > 0.66 ? "Refining matches…" : Math.random() > 0.33 ? "Scanning for your dream home…" : "Found one"}
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isRevealing && (
              <motion.div
                key={property.id}
                initial={{ 
                  opacity: 0, 
                  x: swipeDirection === 'left' ? -100 : swipeDirection === 'right' ? 100 : 0,
                  y: 30, 
                  scale: 0.95 
                }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={{ 
                  opacity: 0, 
                  x: swipeDirection === 'left' ? -400 : swipeDirection === 'right' ? 400 : 0,
                  y: swipeDirection === 'left' ? -10 : swipeDirection === 'right' ? -10 : -30,
                  scale: 0.98
                }}
                transition={{ 
                  duration: 0.25, // Reduced from 0.35 for faster card transitions
                  ease: "easeInOut"
                }}
                className="w-full max-w-lg mx-auto relative"
              >
                {/* Glow effect based on swipe direction */}
                {swipeDirection && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 rounded-3xl blur-xl ${
                      swipeDirection === 'right' 
                        ? 'bg-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.3)]' 
                        : 'bg-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.3)]'
                    } -z-10`}
                  />
                )}
                
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
                    transition={{ delay: 0.5 }} // Reduced delay from 0.8 to 0.5
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
          transition={{ delay: 0.7 }} // Reduced delay from 1 to 0.7
          className="flex justify-center space-x-8 pb-8 mt-32"
        >
          <motion.button 
            onClick={() => {
              setSwipeDirection('left');
              handleSwipeLeft();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 transition-colors border border-gray-600/50 flex items-center space-x-2"
          >
            <X className="w-6 h-6 text-red-400" />
            <span className="text-red-300">Not for me</span>
          </motion.button>
          
          <motion.button 
            onClick={() => {
              setSwipeDirection('right');
              handleSave(property);
            }}
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

      {/* Update Filters Modal */}
      <UpdateFiltersModal
        isOpen={showUpdateFilters}
        onClose={() => setShowUpdateFilters(false)}
        onFiltersUpdated={handleFiltersUpdated}
      />
    </>
  );
};

export default ForYou;
