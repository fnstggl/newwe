import { Link, useNavigate } from "react-router-dom";
import { ArrowDown, Search, Filter, ChevronDown, ChevronUp, X, Heart, ArrowUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { HoverButton } from "@/components/ui/hover-button";
import { useEffect, useRef, useState } from "react";
import TestimonialsSection from "@/components/TestimonialsSection";
import { useAuth } from "@/contexts/AuthContext";
import { useScroll, useTransform, motion } from 'framer-motion';
import { Toggle, GooeyFilter } from "@/components/ui/liquid-toggle";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetail from "@/components/PropertyDetail";
import SoftGateModal from "@/components/SoftGateModal";

const ScrollJackedSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const text1Y = useTransform(scrollYProgress, [0, 0.33], [0, -100]);
  const text2Y = useTransform(scrollYProgress, [0, 0.33, 0.66], [100, 0, -100]);
  const text3Y = useTransform(scrollYProgress, [0.33, 0.66, 1], [200, 100, 0]);

  const text1Opacity = useTransform(scrollYProgress, [0, 0.25, 0.33], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.25, 0.58, 0.66], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.58, 0.75, 1], [0, 1, 1]);

  const textContent = [
    {
      title: "We scan 30,000+ listings a week",
      subtitle: "Real-time analysis of thousands of data points to identify true value of each listing.",
      opacity: text1Opacity,
      y: text1Y
    },
    {
      title: "We flag listings up to 60% below-market", 
      subtitle: "We only show you the best below-market & rent-stabilized listings, so you never overpay again.",
      opacity: text2Opacity,
      y: text2Y
    },
    {
      title: "Save $925/mo on rent, $101k when buying",
      subtitle: "Based on average savings data. Join 6000+ New Yorkers finding the best deals in the city.",
      opacity: text3Opacity,
      y: text3Y
    }
  ];

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen flex flex-col">
        <div className="w-full text-center py-8 px-4">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter text-white">
            The real estate market is rigged. Now you can win.
          </h2>
        </div>

        <div className="flex-1 flex items-center px-8">
          <div className="w-full max-w-none mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center h-full">
              
              <div className="relative order-2 lg:order-1">
                <img 
                  src="/lovable-uploads/desk5.png" 
                  alt="Realer Estate desktop platform showing NYC property scan" 
                  className="w-full rounded-2xl shadow-2xl"
                />
              </div>

              <div className="order-1 lg:order-2 relative min-h-[300px] overflow-hidden">
                {textContent.map((content, index) => (
                  <motion.div
                    key={index}
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{ 
                      opacity: content.opacity,
                      y: content.y
                    }}
                  >
                    <div className="space-y-6">
                      <h3 className="text-3xl md:text-4xl font-inter font-semibold tracking-tighter text-white">
                        {content.title}
                      </h3>
                      <p className="text-xl text-gray-300 font-inter tracking-tight leading-relaxed">
                        {content.subtitle}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Mobile Landing Component
const MobileLanding = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isRentMode, setIsRentMode] = useState(true);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState([]);
  const [minGrade, setMinGrade] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [softGateModal, setSoftGateModal] = useState({
    isOpen: false,
    property: null,
    isLoggedOut: false
  });

  const ITEMS_PER_PAGE = 24;
  const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-'];
  const neighborhoods = [
    'Upper East Side', 'Upper West Side', 'Midtown', 'Chelsea', 'Greenwich Village',
    'SoHo', 'Tribeca', 'Lower East Side', 'East Village', 'Hell\'s Kitchen',
    'Financial District', 'Harlem', 'Washington Heights', 'Williamsburg', 
    'DUMBO', 'Brooklyn Heights', 'Park Slope', 'Prospect Heights',
    'Crown Heights', 'Bed-Stuy', 'Bushwick', 'Long Island City', 'Astoria'
  ];

  // Fetch properties from both rental tables (like your Rent.tsx)
  const fetchProperties = async (reset = false) => {
    setLoading(true);
    const currentOffset = reset ? 0 : offset;

    try {
      let allProperties = [];

      if (isRentMode) {
        // Fetch from both rental tables
        let regularQuery = supabase
          .from('undervalued_rentals')
          .select('*')
          .eq('status', 'active');

        let stabilizedQuery = supabase
          .from('undervalued_rent_stabilized')
          .select('*')
          .eq('display_status', 'active');

        // Apply filters to both queries
        if (maxPrice.trim()) {
          const priceValue = parseInt(maxPrice.trim());
          if (!isNaN(priceValue) && priceValue > 0) {
            regularQuery = regularQuery.lte('monthly_rent', priceValue);
            stabilizedQuery = stabilizedQuery.lte('monthly_rent', priceValue);
          }
        }

        if (bedrooms.trim()) {
          const bedroomValue = parseInt(bedrooms.trim());
          if (!isNaN(bedroomValue)) {
            if (bedroomValue === 0) {
              regularQuery = regularQuery.eq('bedrooms', 0);
              stabilizedQuery = stabilizedQuery.eq('bedrooms', 0);
            } else {
              regularQuery = regularQuery.gte('bedrooms', bedroomValue);
              stabilizedQuery = stabilizedQuery.gte('bedrooms', bedroomValue);
            }
          }
        }

        if (selectedNeighborhoods.length > 0) {
          regularQuery = regularQuery.in('neighborhood', selectedNeighborhoods);
          stabilizedQuery = stabilizedQuery.in('neighborhood', selectedNeighborhoods);
        }

        if (minGrade.trim()) {
          const gradeIndex = gradeOptions.indexOf(minGrade);
          if (gradeIndex !== -1) {
            const allowedGrades = gradeOptions.slice(0, gradeIndex + 1);
            regularQuery = regularQuery.in('grade', allowedGrades);
          }
        }

        // Order both queries
        regularQuery = regularQuery.order('score', { ascending: false });
        stabilizedQuery = stabilizedQuery.order('deal_quality_score', { ascending: false });

        // Fetch both
        const [regularResult, stabilizedResult] = await Promise.all([
          regularQuery.range(0, 50),
          stabilizedQuery.range(0, 50)
        ]);

        // Combine results
        const regularProperties = (regularResult.data || []).map(property => ({
          ...property,
          isRentStabilized: false
        }));

        const rentStabilizedProperties = (stabilizedResult.data || []).map(property => ({
          ...property,
          isRentStabilized: true,
          grade: 'A+',
          score: property.deal_quality_score || 95,
          discount_percent: property.undervaluation_percent,
          images: property.images || [],
          zipcode: property.zip_code
        }));

        allProperties = [...regularProperties, ...rentStabilizedProperties];
        
        // Sort by score/discount
        allProperties.sort((a, b) => {
          const aScore = a.score || a.deal_quality_score || 0;
          const bScore = b.score || b.deal_quality_score || 0;
          return bScore - aScore;
        });

      } else {
        // Buy mode - fetch from sales table
        let query = supabase
          .from('undervalued_sales')
          .select('*')
          .eq('status', 'active')
          .order('score', { ascending: false });

        // Apply filters
        if (maxPrice.trim()) {
          const priceValue = parseInt(maxPrice.trim());
          if (!isNaN(priceValue) && priceValue > 0) {
            query = query.lte('price', priceValue);
          }
        }

        if (bedrooms.trim()) {
          const bedroomValue = parseInt(bedrooms.trim());
          if (!isNaN(bedroomValue)) {
            if (bedroomValue === 0) {
              query = query.eq('bedrooms', 0);
            } else {
              query = query.gte('bedrooms', bedroomValue);
            }
          }
        }

        if (selectedNeighborhoods.length > 0) {
          query = query.in('neighborhood', selectedNeighborhoods);
        }

        if (minGrade.trim()) {
          const gradeIndex = gradeOptions.indexOf(minGrade);
          if (gradeIndex !== -1) {
            const allowedGrades = gradeOptions.slice(0, gradeIndex + 1);
            query = query.in('grade', allowedGrades);
          }
        }

        const { data, error } = await query.range(0, 100);
        allProperties = data || [];
      }

      // Take only what we need for this page
      const startIndex = reset ? 0 : currentOffset;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const pageProperties = allProperties.slice(startIndex, endIndex);
      
      if (reset) {
        setProperties(pageProperties);
        setOffset(ITEMS_PER_PAGE);
      } else {
        setProperties(prev => [...prev, ...pageProperties]);
        setOffset(prev => prev + ITEMS_PER_PAGE);
      }
      
      setHasMore(endIndex < allProperties.length);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // AI Search with auto-trigger
  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearchLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-search', {
        body: { query: searchQuery }
      });

      if (!error && data?.filters) {
        if (data.filters.max_budget) setMaxPrice(data.filters.max_budget.toString());
        if (data.filters.bedrooms !== undefined) setBedrooms(data.filters.bedrooms.toString());
        if (data.filters.neighborhoods) setSelectedNeighborhoods(data.filters.neighborhoods);
        if (data.filters.property_type) setIsRentMode(data.filters.property_type === 'rent');
        
        await fetchProperties(true);
      }
    } catch (error) {
      console.error('AI Search error:', error);
    } finally {
      setIsSearchLoading(false);
    }
  };

  // Auto-trigger search when typing
  useEffect(() => {
    if (!searchQuery.trim()) return;
    
    const debounceTimer = setTimeout(() => {
      handleAISearch();
    }, 800);
    
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Load initial properties
  useEffect(() => {
    fetchProperties(true);
  }, [isRentMode]);

  // Refetch when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProperties(true);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [maxPrice, bedrooms, selectedNeighborhoods, minGrade]);

  // Visibility limits
  const getVisibilityLimit = () => {
    if (!user) return 12;
    if (userProfile?.subscription_plan === 'unlimited' || userProfile?.subscription_plan === 'open_door_plan') {
      return Infinity;
    }
    return 24;
  };

  const visibilityLimit = getVisibilityLimit();
  const isFreeUser = user && userProfile?.subscription_plan !== 'unlimited' && userProfile?.subscription_plan !== 'open_door_plan';

  const handlePropertyClick = (property, index) => {
    if (index >= visibilityLimit) return;

    if (!user && index >= 12) {
      setSoftGateModal({
        isOpen: true,
        property: property,
        isLoggedOut: true
      });
      return;
    }

    if (isFreeUser && index >= 24) {
      setSoftGateModal({
        isOpen: true,
        property: property,
        isLoggedOut: false
      });
      return;
    }

    const route = isRentMode ? `/rent/${property.listing_id}` : `/buy/${property.listing_id}`;
    navigate(route);
    setSelectedProperty(property);
  };

  const getGradeColors = (grade) => {
    if (grade === 'A+') {
      return {
        badge: 'bg-white text-black',
        hover: 'hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]'
      };
    } else if (grade === 'A' || grade === 'A-') {
      return {
        badge: 'bg-white text-black',
        hover: 'hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]'
      };
    } else {
      return {
        badge: 'bg-white text-black',
        hover: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'
      };
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter pb-24">
      <GooeyFilter />
      
      {/* Header with AI Search */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-b border-gray-800/50">
        <div className="px-4 py-4">
          {/* AI Search Bar with Toggle */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe your dream home. We'll find it for you"
                className="w-full bg-gray-900/80 border border-gray-700/50 rounded-2xl pl-4 pr-12 py-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none text-base tracking-tight"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isSearchLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search size={16} className="text-gray-400" />
                )}
              </div>
            </div>
            
            {/* Buy/Rent Toggle */}
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold tracking-tight ${!isRentMode ? 'text-white' : 'text-gray-400'}`}>
                Buy
              </span>
              <Toggle 
                checked={isRentMode} 
                onCheckedChange={setIsRentMode}
                className="scale-90"
              />
              <span className={`text-sm font-semibold tracking-tight ${isRentMode ? 'text-white' : 'text-gray-400'}`}>
                Rent
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Button */}
      <div className="px-4 mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center gap-2 bg-gray-900/60 border border-gray-700/50 rounded-2xl p-4 text-white hover:border-gray-600/70 transition-all"
        >
          <Filter className="h-5 w-5" />
          <span className="font-semibold tracking-tight">Filters</span>
          {showFilters ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="px-4 mb-6">
          <div className="bg-gray-900/80 border border-gray-700/50 rounded-2xl p-4 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-tight">
                Max {isRentMode ? '/month' : 'Price'}
              </label>
              <input
                type="text"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder={isRentMode ? "$4,000" : "$1,500,000"}
                className="w-full px-4 py-3 bg-black/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none tracking-tight"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-tight">
                Bedrooms
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-gray-600/50 rounded-xl text-white focus:border-blue-500 focus:outline-none tracking-tight"
              >
                <option value="">Any</option>
                <option value="0">Studio</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-tight">
                Neighborhoods
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {neighborhoods.map((neighborhood) => (
                  <button
                    key={neighborhood}
                    onClick={() => {
                      setSelectedNeighborhoods(prev => 
                        prev.includes(neighborhood) 
                          ? prev.filter(n => n !== neighborhood)
                          : [...prev, neighborhood]
                      );
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium tracking-tight transition-all ${
                      selectedNeighborhoods.includes(neighborhood)
                        ? 'bg-white text-black'
                        : 'bg-gray-700/60 text-gray-300 border border-gray-600/50'
                    }`}
                  >
                    {neighborhood}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-tight">
                Min Grade
              </label>
              <select
                value={minGrade}
                onChange={(e) => setMinGrade(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-gray-600/50 rounded-xl text-white focus:border-blue-500 focus:outline-none tracking-tight"
              >
                <option value="">Any Grade</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Properties Grid - 2 per row */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-3 mb-8">
          {properties.map((property, index) => {
            const gradeColors = getGradeColors(property.grade);
            const isBlurred = index >= visibilityLimit;
            
            return (
              <div key={`${property.id}-${index}`} className="relative">
                <div className={isBlurred ? 'filter blur-sm' : ''}>
                  <div
                    onClick={() => handlePropertyClick(property, index)}
                    className={`bg-gray-900/60 border border-gray-700/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${gradeColors.hover}`}
                  >
                    {/* Property Image */}
                    <div className="aspect-square bg-gray-800 relative overflow-hidden">
                      {property.images?.[0] ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.address}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                      
                      {/* Grade Badge */}
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${gradeColors.badge}`}>
                          {property.grade}
                        </span>
                      </div>
                      
                      {/* Heart Icon */}
                      <div className="absolute top-2 right-2">
                        <Heart className="h-5 w-5 text-white/80" />
                      </div>
                    </div>

                    {/* Property Info */}
                    <div className="p-3">
                      <div className="text-lg font-bold text-white mb-1 tracking-tight">
                        ${isRentMode ? 
                          property.monthly_rent?.toLocaleString() : 
                          property.price?.toLocaleString()
                        }
                        {isRentMode && <span className="text-sm font-normal">/mo</span>}
                      </div>
                      
                      <div className="text-sm text-gray-300 mb-1 tracking-tight">
                        {property.bedrooms} bed • {property.bathrooms || property.baths} bath
                      </div>
                      
                      <div className="text-xs text-gray-400 tracking-tight truncate">
                        {property.neighborhood}
                      </div>
                      
                      {/* Discount Badge */}
                      {(property.discount_percent || property.undervaluation_percent) && (
                        <div className="mt-2">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-semibold">
                            {Math.round(property.discount_percent || property.undervaluation_percent)}% below market
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Blurred overlay CTAs */}
                {!user && isBlurred && (
                  <div 
                    className="absolute inset-0 cursor-pointer flex items-center justify-center"
                    onClick={() => setSoftGateModal({
                      isOpen: true,
                      property: property,
                      isLoggedOut: true
                    })}
                  >
                    <div className="bg-black/60 backdrop-blur-sm rounded-xl p-3 text-center">
                      <div className="text-white text-sm font-semibold mb-1 tracking-tight">Sign up to view</div>
                      <div className="text-xs text-gray-300">Free account</div>
                    </div>
                  </div>
                )}

                {isFreeUser && isBlurred && (
                  <div 
                    className="absolute inset-0 cursor-pointer flex items-center justify-center"
                    onClick={() => setSoftGateModal({
                      isOpen: true,
                      property: property,
                      isLoggedOut: false
                    })}
                  >
                    <div className="bg-black/60 backdrop-blur-sm rounded-xl p-3 text-center">
                      <div className="text-white text-sm font-semibold mb-1 tracking-tight">Upgrade to view</div>
                      <div className="text-xs text-gray-300">Try free</div>
                    </div>
                  </div>
                )}

                {/* Main CTAs at specific positions */}
                {!user && index === 13 && properties.length > 13 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none col-span-2">
                    <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 text-center max-w-xs pointer-events-auto">
                      <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                        See all the best deals
                      </h3>
                      <p className="text-sm text-gray-300 mb-3">Only 12 of 4,193 deals shown</p>
                      <button
                        onClick={() => navigate('/join')}
                        className="bg-white text-black px-6 py-2 rounded-full font-semibold text-sm tracking-tight"
                      >
                        Join Free
                      </button>
                    </div>
                  </div>
                )}

                {isFreeUser && index === 25 && properties.length > 25 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none col-span-2">
                    <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 text-center max-w-xs pointer-events-auto">
                      <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                        Unlock all deals
                      </h3>
                      <p className="text-sm text-gray-300 mb-3">Only 24 of 4,193 deals shown</p>
                      <button
                        onClick={() => navigate('/pricing')}
                        className="bg-white text-black px-6 py-2 rounded-full font-semibold text-sm tracking-tight"
                      >
                        Try Free
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Load More */}
        {!loading && hasMore && properties.length > 0 && (
          <div className="text-center py-6">
            <button
              onClick={() => fetchProperties(false)}
              className="bg-gray-800/60 border border-gray-600/50 text-white px-8 py-3 rounded-full font-semibold tracking-tight hover:bg-gray-700/60 transition-all"
            >
              Load More
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-gray-400 tracking-tight">Loading properties...</div>
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          isRental={isRentMode}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      {/* Soft Gate Modal */}
      <SoftGateModal
        isOpen={softGateModal.isOpen}
        onClose={() => setSoftGateModal({ isOpen: false, property: null, isLoggedOut: false })}
        property={softGateModal.property}
        isRental={isRentMode}
        isLoggedOut={softGateModal.isLoggedOut}
      />
    </div>
  );
};

// Desktop Index Component (COMPLETELY UNCHANGED)
const DesktopIndex = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Update meta tags for SEO - Home page
    document.title = "Realer Estate - Your