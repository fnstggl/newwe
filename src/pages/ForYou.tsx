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
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import AISearch from '@/components/AISearch';

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

const LoadingSequence = ({ isLoggedOut = false }: { isLoggedOut?: boolean }) => {
  const navigate = useNavigate();
  const [currentPhase, setCurrentPhase] = useState<'typewriter' | 'scanning' | 'found'>('typewriter');
  const [typewriterText, setTypewriterText] = useState('');
  const [scanningTexts, setScanningTexts] = useState([
    'Analyzing NYC listings...',
    'Scanning 4,219 rent-stabilized units...',
    'Finding the best deals in the city...',
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
        timer = setTimeout(() => setCurrentPhase('scanning'), 500);
      }
    } else if (currentPhase === 'scanning') {
      if (currentScanIndex < scanningTexts.length - 1) {
        timer = setTimeout(() => {
          setCurrentScanIndex(currentScanIndex + 1);
        }, 750);
      } else {
        timer = setTimeout(() => setCurrentPhase('found'), 1300);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [typewriterText.length, currentPhase, currentScanIndex]);

  useEffect(() => {
    if (currentPhase === 'found' && isLoggedOut) {
      const redirectTimer = setTimeout(() => {
        navigate('/join');
      }, 2000);

      return () => clearTimeout(redirectTimer);
    }
  }, [currentPhase, isLoggedOut, navigate]);

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
            <div className="text-3xl font-semibold tracking-tighter">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8"
          >
            <div className="w-80 mx-auto">
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ 
                    width: `${((currentScanIndex + 1) / scanningTexts.length) * 100}%` 
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentScanIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-lg font-semibold tracking-tighter text-white"
              >
                {scanningTexts[currentScanIndex]}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center space-x-6">
              {scanningTexts.map((_, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-center"
                >
                  {index <= currentScanIndex ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.6 }}
                      className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 text-black" />
                    </motion.div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-600 rounded-full" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {currentPhase === 'found' && (
          <motion.div
            key="found"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                bounce: 0.3, 
                delay: 0.2,
                duration: 1.2
              }}
              className="relative mx-auto w-24 h-24"
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="absolute inset-0 border-4 border-white rounded-full"
              />
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 0.6, 
                  type: "spring", 
                  bounce: 0.4,
                  duration: 0.8
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <motion.path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                  />
                </svg>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="space-y-3"
            >
              <h2 className="text-3xl font-semibold tracking-tighter text-white">
                Your dream homes await
              </h2>
              <p className="text-lg font-medium tracking-tight text-gray-300">
                {isLoggedOut 
                  ? "Let's get you signed up to see your matches"
                  : "We found properties perfectly matched to your preferences"
                }
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="text-sm font-medium tracking-tight text-gray-400"
            >
              {isLoggedOut 
                ? "Redirecting you to sign up..."
                : "Preparing your personalized matches..."
              }
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
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showLoadingTeaser, setShowLoadingTeaser] = useState(false);
  const [showUpdateFilters, setShowUpdateFilters] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
    // ADD THE SCROLL HOOKS HERE:
  const { scrollY, scrollYProgress } = useScroll();
  const scrollYTransform = useTransform(scrollY, [0, 1000], [0, -200]);
  const scrollProgressValue = scrollYProgress.get();

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

  useEffect(() => {
    if (isLoading) {
      const masterTimer = setTimeout(() => {
        setIsLoading(false);
        setIsRevealing(true);
        
        // Show paywall for free users after loading
        if (userProfile?.subscription_plan === 'free') {
          setShowPaywall(true);
        }
      }, 11000);
      
      return () => clearTimeout(masterTimer);
    }
  }, [isLoading, userProfile?.subscription_plan]);

  useEffect(() => {
    setCurrentHeaderIndex(Math.floor(Math.random() * personalizedHeaders.length));
  }, [currentIndex]);

  const fetchPersonalizedProperties = async () => {
    if (!userProfile) return;

    const allProperties: Property[] = [];

    try {
      const hasCompletedAnyOnboarding = userProfile.onboarding_completed || userProfile.hasCompletedOnboarding;
      
      if (!hasCompletedAnyOnboarding) {
        return;
      }

      if (!userProfile.property_type || userProfile.property_type === 'rent') {
        let query = supabase
          .from('undervalued_rentals')
          .select('*')
          .eq('status', 'active')
          .order('discount_percent', { ascending: false });

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

        let stabilizedQuery = supabase
          .from('undervalued_rent_stabilized')
          .select('*')
          .eq('display_status', 'active')
          .order('undervaluation_percent', { ascending: false });

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

      if (!userProfile.property_type || userProfile.property_type === 'buy') {
        let query = supabase
          .from('undervalued_sales')
          .select('*')
          .eq('status', 'active')
          .order('discount_percent', { ascending: false });

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

      let filteredProperties = allProperties;

      if (userProfile.bedrooms !== undefined && userProfile.bedrooms !== null) {
        filteredProperties = filteredProperties.filter(p => p.bedrooms === userProfile.bedrooms);
      }

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

      if (userProfile.preferred_neighborhoods && userProfile.preferred_neighborhoods.length > 0) {
        const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
        const selectedBoroughs = userProfile.preferred_neighborhoods.filter(n => boroughs.includes(n));
        const selectedNeighborhoods = userProfile.preferred_neighborhoods.filter(n => !boroughs.includes(n) && n !== 'Anywhere with a train');
        
        filteredProperties = filteredProperties.filter(p => {
          if (userProfile.preferred_neighborhoods!.includes('Anywhere with a train')) {
            return true;
          }
          
          if (selectedBoroughs.length > 0 && p.borough) {
            if (selectedBoroughs.includes(p.borough)) return true;
          }
          
          if (selectedNeighborhoods.length > 0 && p.neighborhood) {
            const propertyNeighborhood = p.neighborhood.toLowerCase();
            
            for (const selectedNeighborhood of selectedNeighborhoods) {
              const selected = selectedNeighborhood.toLowerCase();
              
              if (propertyNeighborhood.includes(selected)) {
                return true;
              }
              
              const cleanPropertyName = propertyNeighborhood.replace(/['\s-]/g, '');
              const cleanSelectedName = selected.replace(/['\s-]/g, '');
              if (cleanPropertyName.includes(cleanSelectedName) || cleanSelectedName.includes(cleanPropertyName)) {
                return true;
              }
              
              const variations = [
                selected.replace(/'/g, ''),
                selected.replace(/\s+/g, '-'),
                selected.replace(/-/g, ' ')
              ];
              
              for (const variation of variations) {
                if (propertyNeighborhood.includes(variation)) {
                  return true;
                }
              }
            }
          }
          
          if (selectedBoroughs.length === 0 && selectedNeighborhoods.length === 0) {
            return true;
          }
          
          return false;
        });
      }

      if (userProfile.discount_threshold) {
        filteredProperties = filteredProperties.filter(p => 
          p.discount_percent >= userProfile.discount_threshold!
        );
      }

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

      const shuffled = filteredProperties.sort(() => 0.5 - Math.random());
      setProperties(shuffled);
    } catch (error) {
      console.error('Error fetching personalized properties:', error);
      toast({
        title: "Error",
        description: "Failed to load your personalized properties. Please try again.",
        variant: "destructive",
      });
      setProperties([]);
    }
  };

  const getPreloadImages = () => {
    if (currentIndex + 1 < properties.length) {
      const nextProperty = properties[currentIndex + 1];
      if (nextProperty && nextProperty.images) {
        if (Array.isArray(nextProperty.images)) {
          return nextProperty.images.slice(0, 3);
        } else if (typeof nextProperty.images === 'string') {
          return [nextProperty.images];
        }
      }
    }
    return [];
  };

  const getSavingsText = (property: Property) => {
    if (property.property_type === 'buy' && property.potential_savings) {
      return `$${Math.round(property.potential_savings).toLocaleString()}`;
    } else if (property.property_type === 'rent' && property.potential_annual_savings) {
      const monthlySavings = Math.round(property.potential_annual_savings / 12);
      return `$${monthlySavings}/mo`;
    }
    return `${Math.round(property.discount_percent)}%`;
  };

  const handleUnlockMatch = async () => {
    if (!user) return;
    
    setIsProcessingCheckout(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { billing_cycle: 'annual' }
      });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to create checkout session. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const handleSave = async (property: Property) => {
    if (!user) return;

    try {
      const propertyId = property.id;
      
      const { error } = await supabase
        .from('saved_properties')
        .insert({
          user_id: user.id,
          property_id: propertyId,
          property_type: property.property_type === 'buy' ? 'sale' : 'rental'
        });

      if (error) {
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
        
        handleSwipeRight();
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
    
    if (currentIndex < properties.length - 1) {
      setIsRevealing(false);
      setShowLoadingTeaser(true);
      
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setSwipeDirection(null);
        setShowLoadingTeaser(false);
        setTimeout(() => setIsRevealing(true), 50);
      }, 300);
    } else {
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
      }, 300);
    } else {
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
    await forceRefreshProfile();
    handleRefresh();
  };

  const handleRestartMatches = () => {
    setCurrentIndex(0);
    setShowEndScreen(false);
    setIsRevealing(false);
    setTimeout(() => setIsRevealing(true), 100);
  };

  if (isLoading) {
    return <LoadingSequence isLoggedOut={!user} />;
  }

  if (!userProfile || (!userProfile.onboarding_completed && !userProfile.hasCompletedOnboarding)) {
    if (properties.length === 0) {
      return <LoadingSequence isLoggedOut={!user} />;
    }
  }

  if (showEndScreen) {
    return (
      <div className="min-h-screen bg-black text-white font-inter flex flex-col items-center justify-center space-y-8 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
            className="w-24 h-24 mx-auto"
          >
            <img 
              src="/lovable-uploads/6779d8c3-0363-44cb-b0c3-498ba44a369e.png" 
              alt="Dream Home Logo" 
              className="w-full h-full object-contain"
            />
          </motion.div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">You've reached the end of your dream-home matches</h1>
            <p className="text-white/70 text-lg">
              No more properties match your current criteria.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 w-full max-w-md"
        >
          <motion.button
            onClick={handleRestartMatches}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-4 bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-500/30 text-white rounded-full transition-all duration-200 flex items-center justify-center space-x-3 font-medium shadow-lg"
          >
            <span>See them again</span>
          </motion.button>
          
          <motion.button
            onClick={() => setShowUpdateFilters(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-4 bg-gray-800/20 backdrop-blur-md border border-gray-600/30 hover:bg-gray-700/30 text-white rounded-full transition-all duration-200 flex items-center justify-center space-x-3 font-medium shadow-lg"
          >
            <Settings className="w-5 h-5" />
            <span>Change your filters</span>
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-white/50 text-center max-w-md"
        >
          New listings appear daily. We'll keep watching the market for you and notify you when new matches are found.
        </motion.p>

        <UpdateFiltersModal
          isOpen={showUpdateFilters}
          onClose={() => setShowUpdateFilters(false)}
          onFiltersUpdated={handleFiltersUpdated}
        />
      </div>
    );
  }

  const property = properties[currentIndex];

  if (!property && properties.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white font-inter flex flex-col items-center justify-center space-y-8 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
            className="w-24 h-24 mx-auto"
          >
            <img 
              src="/lovable-uploads/de1bfef4-cfe1-4af5-a773-d64ad8a646b5.png" 
              alt="Dream Home Logo" 
              className="w-full h-full object-contain"
            />
          </motion.div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">Your dream home isn't on the market yet.</h1>
            <p className="text-white/70 text-lg">
              No properties match your current criteria. Try adjusting your filters to see more options.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 w-full max-w-md"
        >
          <motion.button
            onClick={() => setShowUpdateFilters(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 text-white rounded-full transition-all duration-200 flex items-center justify-center space-x-3 font-medium shadow-lg"
          >
            <Settings className="w-5 h-5" />
            <span>Adjust filters?</span>
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-white/50 text-center max-w-md"
        >
          New listings appear daily. We'll keep watching the market for you and notify you when new matches are found.
        </motion.p>

        <UpdateFiltersModal
          isOpen={showUpdateFilters}
          onClose={() => setShowUpdateFilters(false)}
          onFiltersUpdated={handleFiltersUpdated}
        />
      </div>
    );
  }

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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-8 left-6 z-10"
        >
          <button
            onClick={() => !showPaywall && setShowUpdateFilters(true)}
            disabled={showPaywall}
            className={`flex items-center space-x-2 px-4 py-2 bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-full transition-colors ${
              showPaywall ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700/80'
            }`}
          >
            <Settings className="w-4 h-4 text-gray-300" />
            <span className="text-sm text-gray-300">Update Dream Home filters</span>
          </button>
        </motion.div>

        <motion.div 
          key={currentHeaderIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-8 pb-4"
        >
          <p className="text-xl font-inter font-semibold tracking-tighter text-white/90">
            {personalizedHeaders[currentHeaderIndex]}
          </p>
        </motion.div>

        <div className="flex-1 flex items-center justify-center px-6 relative overflow-hidden">
          <AnimatePresence>
            {showLoadingTeaser && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
              >
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto"
                  />
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white font-semibold tracking-tighter text-lg"
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
                initial={{ opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ 
                  opacity: 1, 
                  x: swipeDirection === 'left' ? -400 : swipeDirection === 'right' ? 400 : 0,
                  y: swipeDirection === 'left' ? -10 : swipeDirection === 'right' ? -10 : -30
                }}
                transition={{ 
                  duration: 0.2,
                  ease: "easeOut"
                }}
                className="w-full max-w-lg mx-auto relative"
              >
                {swipeDirection && !showPaywall && (
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
                  <div className={showPaywall ? 'pointer-events-none' : ''}>
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
                        isRentStabilized: property.isRentStabilized,
                        preloadImages: getPreloadImages()
                      }}
                      isRental={property.property_type === 'rent'}
                      onClick={() => !showPaywall && handlePropertyClick(property)}
                    />
                  </div>
                  
                  {showPaywall && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="absolute inset-0 backdrop-blur-sm bg-black/30 flex flex-col items-center justify-center z-30 border border-white/20 overflow-hidden rounded-2xl"
    style={{
      backdropFilter: 'blur(8px) saturate(180%)',
      WebkitBackdropFilter: 'blur(8px) saturate(180%)',
    }}
  >
                      <div className="text-center space-y-4 px-8">
                        <h2 className="text-2xl font-semibold tracking-tighter text-white">
                          We found your dream home
                        </h2>
                        <p className="text-lg font-medium tracking-tighter text-white">
                          And it's {getSavingsText(property)} below-market
                        </p>
                        
                        <div className="space-y-3 pt-4">
                          <motion.button
                            onClick={handleUnlockMatch}
                            disabled={isProcessingCheckout}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-3 bg-white text-black rounded-full font-semibold tracking-tight transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isProcessingCheckout ? 'Processing...' : 'Reveal your match'}
                          </motion.button>
                          
                          <p className="text-sm text-gray-400 tracking-tight">
                            $18/year — billed annually<br />
                            Cancel anytime • Less than $1.50/month
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center space-x-6 pb-6 mt-8 z-[10]"
        >
          <motion.button 
            onClick={!showPaywall ? handleSwipeLeft : undefined}
            disabled={showPaywall}
            whileHover={!showPaywall ? { scale: 1.03 } : {}}
            whileTap={!showPaywall ? { scale: 0.97 } : {}}
            className={`w-40 py-3 rounded-full bg-black/80 backdrop-blur border border-white/30 transition-all duration-200 shadow-sm flex items-center justify-center space-x-2 ${
              showPaywall ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/50 hover:shadow-md'
            }`}
          >
            <X className="w-4 h-4 text-white/80" /> 
            <span className="text-white text-sm font-medium tracking-tight">Not for me</span>
          </motion.button>

          <motion.button 
            onClick={!showPaywall ? () => handleSave(property) : undefined}
            disabled={showPaywall}
            whileHover={!showPaywall ? { scale: 1.03 } : {}}
            whileTap={!showPaywall ? { scale: 0.97 } : {}}
            className={`w-40 py-3 rounded-full bg-white text-black border border-white/10 transition-all duration-200 shadow-sm flex items-center justify-center space-x-2 ${
              showPaywall ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/90 hover:shadow-md'
            }`}
          >
            <Heart className="w-4 h-4 text-black/80" />
            <span className="text-sm font-medium tracking-tight">Save this one</span>
          </motion.button>
        </motion.div>

 <div className="relative">
  <div 
    className={showPaywall ? 'relative' : ''}
    onClick={showPaywall ? (e) => e.stopPropagation() : undefined}
    onKeyDown={showPaywall ? (e) => e.preventDefault() : undefined}
  >
    <AISearch 
      onResults={(results, interpretation) => {
        if (!showPaywall) {
          if (results.length > 0) {
            setProperties(results);
            setCurrentIndex(0);
            setIsRevealing(true);
            toast({
              title: "🎯 AI Search Complete",
              description: `Found ${results.length} matches!`,
            });
          } else {
            toast({
              title: "No matches found",
              description: interpretation,
              variant: "destructive",
            });
          }
        }
      }}
    />
    {showPaywall && (
      <div 
        className="absolute inset-0 cursor-not-allowed" 
        onClick={(e) => e.stopPropagation()}
        onFocus={(e) => e.preventDefault()}
      />
    )}
  </div>
          
          <div className={`absolute top-1/2 -translate-y-1/2 right-2 group ${showPaywall ? 'opacity-50' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gray-700/80 flex items-center justify-center cursor-help border border-gray-600/50 hover:bg-gray-600/80 transition-colors">
              <span className="text-gray-300 text-sm font-bold">?</span>
            </div>
            
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 w-80 p-4 bg-black/90 backdrop-blur-md border border-white/30 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60] shadow-2xl">
              <p className="text-white text-sm font-inter tracking-tighter leading-relaxed">
                Just describe your dream home in natural language, and we'll find you it. Be specific to get better results, like: 1BR in a safe neighborhood, by the water, under $3.9k
              </p>
            </div>
          </div>
        </div>
      </div>

{/* Scroll-jacking marketing images - only for paywall users */}
{showPaywall && (
  <div className="relative h-[300vh] w-full">
    {/* Sticky container that stays in place */}
    <div className="sticky top-0 h-screen w-full flex items-center justify-center bg-black overflow-hidden">
      <div className="relative w-full max-w-6xl mx-auto px-6">
        {/* First Image */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          <img 
            src="/lovable-uploads/marketing-image-1.jpg" 
            alt="The best deals in the city" 
            className="w-full h-auto object-contain max-h-[80vh]"
          />
        </motion.div>

        {/* Second Image */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.1, margin: "-99% 0px -99% 0px" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <img 
            src="/lovable-uploads/marketing-image-2.jpg" 
            alt="Just describe your dream home" 
            className="w-full h-auto object-contain max-h-[80vh]"
          />
        </motion.div>
      </div>
    </div>

    {/* Invisible trigger at the very bottom */}
    <div className="absolute bottom-0 w-full h-10" />
  </div>
)}
      
      <AnimatePresence>
        {selectedProperty && !showPaywall && (
          <PropertyDetail
            property={selectedProperty as any}
            isRental={selectedProperty.property_type === 'rent'}
            onClose={closePropertyDetail}
          />
        )}
      </AnimatePresence>

      {!showPaywall && (
        <UpdateFiltersModal
          isOpen={showUpdateFilters}
          onClose={() => setShowUpdateFilters(false)}
          onFiltersUpdated={handleFiltersUpdated}
        />
      )}
    </>
  );
};

export default ForYou;
