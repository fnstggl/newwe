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
import AISearch from "@/components/AISearch";


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

  // Fetch properties from both rental tables
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
      badge: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border border-yellow-500/30',
      discountBg: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      hover: 'hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:border-yellow-400/40'
    };
  } else if (grade === 'A' || grade === 'A-') {
    return {
      badge: 'bg-gradient-to-r from-purple-500 to-purple-700 text-white border border-purple-500/30',
      discountBg: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      hover: 'hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:border-purple-400/40'
    };
  } else if (grade?.startsWith('B')) {
    return {
      badge: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white border border-blue-500/30',
      discountBg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      hover: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-blue-400/40'
    };
  } else {
    return {
      badge: 'bg-gradient-to-r from-gray-500 to-gray-700 text-white border border-gray-500/30',
      discountBg: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
      hover: 'hover:shadow-[0_0_20px_rgba(156,163,175,0.3)] hover:border-gray-400/40'
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
  <div className="flex-1">
    <AISearch 
      onResults={(results, interpretation) => {
        if (results.length > 0) {
          const mappedResults = results.map(property => ({
            ...property,
            images: Array.isArray(property.images) ? property.images : 
                   typeof property.images === 'string' ? JSON.parse(property.images || '[]') : [],
            property_type: property.property_type || (isRentMode ? 'rent' : 'buy'),
            table_source: property.table_source || (isRentMode ? 'undervalued_rentals' : 'undervalued_sales')
          }));
          
          setProperties(mappedResults);
          setOffset(mappedResults.length);
          setHasMore(false);
        }
      }}
      placeholder="Describe your dream home. We'll find it for you"
      className="w-full bg-gray-900/80 border border-gray-700/50 rounded-2xl pl-4 pr-12 py-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none text-base tracking-tight"
    />
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
  <span className={`px-2 py-1 rounded-full text-xs font-bold ${gradeColors.badge}`}>
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
    <span className={`${gradeColors.discountBg} px-2 py-1 rounded-full text-xs font-semibold`}>
      {Math.round(property.discount_percent || property.undervaluation_percent)}% below market
    </span>
  </div>
)}
                    </div>
                  </div>
                </div>

               {/* Simple blur overlay with click handler - NO TEXT */}
{isBlurred && (
  <div 
    className="absolute inset-0 cursor-pointer"
    onClick={() => {
      if (!user) {
        setSoftGateModal({
          isOpen: true,
          property: property,
          isLoggedOut: true
        });
      } else if (isFreeUser) {
        setSoftGateModal({
          isOpen: true,
          property: property,
          isLoggedOut: false
        });
      }
    }}
  />
)}

          
              </div>
            );
          })}

          {/* ADD THESE CENTERED CTAs HERE */}
          {!user && properties.length > 12 && (
            <div className="col-span-2 flex justify-center my-4">
              <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 text-center max-w-xs">
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

          {isFreeUser && properties.length > 24 && (
            <div className="col-span-2 flex justify-center my-4">
              <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 text-center max-w-xs">
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
    document.title = "Realer Estate - Your Unfair Advantage in NYC Real Estate | Find Undervalued Properties";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stop overpaying for NYC real estate. Our advanced algorithms find undervalued properties for sale and rent. Get your unfair advantage in the NYC real estate market.');
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Realer Estate - Your Unfair Advantage in NYC Real Estate');
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', 'Stop overpaying for NYC real estate. Our advanced algorithms find undervalued properties for sale and rent. Get your unfair advantage in the NYC real estate market.');
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', 'https://realerestate.org');

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', 'Realer Estate - Your Unfair Advantage in NYC Real Estate');
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', 'Stop overpaying for NYC real estate. Our advanced algorithms find undervalued properties for sale and rent.');
    
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute('content', 'https://realerestate.org');

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://realerestate.org');
  }, []);

  return (
    <div className="font-inter">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden px-0 pt-0">
        {/* Background Image with Full Width */}
        <div className="absolute inset-0 w-full h-full">
          {/* Background Image with Fade-in Effect */}
          <div 
            className="bg-cover bg-center bg-no-repeat min-h-[600px] absolute inset-0 animate-fade-in w-full h-full"
            style={{
              backgroundImage: `url('/lovable-uploads/2ff24928-306a-4305-9c27-9594098a543d.png')`,
              animationDuration: '3s',
              animationDelay: '0s',
              animationFillMode: 'both'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/30"></div>
          </div>
        </div>
          
        {/* Hero Content - Always Visible */}
        <div className="relative z-10 min-h-[600px] flex items-center justify-center">
          <div className="text-center px-4 py-20 max-w-none">
            <h1 className="text-5xl md:text-6xl font-inter font-semibold mb-4 tracking-[-0.075em] transform translate-y-[130px] text-white">
              Find your dream home. And actually afford it.
            </h1>
            <p className="text-lg md:text-xl mb-16 text-white opacity-80 font-inter font-medium transform translate-y-[130px] tracking-[-0.075em]">
              Your unfair advantage in finding below-market & rent-stabilized homes.
            </p>
            <Link to={user ? "/rent" : "/rent"} className="inline-block bg-white font-inter text-black px-10 py-4 rounded-full font-bold text-xl tracking-tighter transform translate-y-[110px] hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-300 shadow-xl">
              {user ? "See Deals" : "See Deals"}
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          
        </div>
      </section>

      {/* Product Mockup Section */}
      <section className="pt-6 pb-20 px-4 max-w-6xl mx-auto">
        <div className="text-center">
          <img 
            src="/lovable-uploads/rainbow-glow-mockup3.png" 
            alt="Realer Estate platform showing rental listings" 
            className="w-full max-w-5xl mx-auto rounded-2xl shadow-2xl"
          />
        </div>
      </section>
    
      {/* Problem Section */}
      <section className="pt-10 pb-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
            It shouldn't be this hard to find a home in the city.
          </h2>
          <p className="text-xl text-gray-400 tracking-tight max-w-3xl mx-auto">
          Using AI algorithms trained on market data to find you the best undervalued & rent-stabilized deals, saving you thousands.
          </p>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent my-8"></div>
      </section>

      {/* How It Works - Scroll Jacked Version */}
      <ScrollJackedSection />

      {/* Featured Neighborhoods */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
            Stop overpaying in every neighborhood.
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            <div className="p-6 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 hover:border-blue-500/40 transition-all">
              <h3 className="text-xl font-semibold mb-2 tracking-tight">SoHo</h3>
              <p className="text-gray-400 tracking-tight">Avg $2,100/sqft → Deals from $1,350/sqft</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 hover:border-blue-500/40 transition-all">
              <h3 className="text-xl font-semibold mb-2 tracking-tight">Bushwick</h3>
              <p className="text-gray-400 tracking-tight">Avg $930/sqft → Deals from $690/sqft</p>
            </div>
          </div>
          <Link to="/rent">
            <HoverButton className="text-white font-semibold tracking-tight hover:shadow-[0_0_10px_rgba(255,255,255,0.4)] transition-all duration-300">
              Explore Homes
            </HoverButton>
          </Link>
        </div>
      </section>
    
      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Final CTA */}
      <section className="py-20 pb-0 px-4 relative overflow-hidden">
        {/* Blue Gradient Blob Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/30 to-blue-800/40"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-blue-500/40 via-cyan-400/30 to-blue-600/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 w-[600px] h-[400px] bg-gradient-to-tl from-purple-500/30 via-blue-400/20 to-cyan-500/40 rounded-full blur-2xl"></div>        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
            Let the house hunt end here.
          </h2>
          <p className="text-xl text-gray-300 mb-12 tracking-tight">
            Join the platform that actually works for buyers.
          </p>
          <Link to="/join" className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold text-lg tracking-tight hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-300 shadow-xl">
            Join now.
          </Link>
          
          {/* Footer Links */}
          <div className="mt-16 mb-2">
            <div className="flex justify-center space-x-8 text-xs text-gray-400">
              <Link to="/privacy" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
              <Link to="/press" className="hover:text-gray-300 transition-colors">
                Press
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Main Index Component with Mobile Detection
const Index = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Render mobile version for mobile devices, desktop for larger screens
  if (isMobile) {
    return <MobileLanding />;
  }

  return <DesktopIndex />;
};

export default Index;