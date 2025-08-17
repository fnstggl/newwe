import React from "react";
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
            The housing market in NYC is rigged. Now you can beat it.
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
  const [loadedImageIndex, setLoadedImageIndex] = useState(-1);
const [isImageLoading, setIsImageLoading] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);


  const ITEMS_PER_PAGE = 24;
  const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-'];
 const neighborhoods = [
  'upper-east-side', 'upper-west-side', 'midtown', 'chelsea', 'greenwich-village',
  'soho', 'tribeca', 'lower-east-side', 'east-village', 'hells-kitchen',
  'financial-district', 'harlem', 'washington-heights', 'williamsburg', 
  'dumbo', 'brooklyn-heights', 'park-slope', 'prospect-heights',
  'crown-heights', 'bed-stuy', 'bushwick', 'long-island-city', 'astoria'
];

  // Fetch properties from both rental tables
  const fetchProperties = async (reset = false) => {
    setLoading(true);
    const currentOffset = reset ? 0 : offset;

    try {
      let allProperties = [];

if (isRentMode) {
  // Get a strategic mix of grades
  // Fetch A+ properties first
  let highGradeQuery = supabase
    .from('undervalued_rentals')
    .select('*')
    .eq('status', 'active')
    .eq('likely_rented', false)
    .in('grade', ['A+', 'A', 'A-'])
    .order('score', { ascending: false });

  // Fetch regular mixed properties
let mixedQuery = supabase
  .from('undervalued_rentals')
  .select('*')
  .eq('status', 'active')
  .eq('likely_rented', false)
  .order('created_at', { ascending: false });

let stabilizedQuery = supabase
  .from('undervalued_rent_stabilized')
  .select('*')
  .eq('display_status', 'active')
  .eq('likely_rented', false)
  .order('created_at', { ascending: false });

  // Apply filters to all queries
  if (maxPrice.trim()) {
    const priceValue = parseInt(maxPrice.trim());
    if (!isNaN(priceValue) && priceValue > 0) {
      highGradeQuery = highGradeQuery.lte('monthly_rent', priceValue);
      mixedQuery = mixedQuery.lte('monthly_rent', priceValue);
      stabilizedQuery = stabilizedQuery.lte('monthly_rent', priceValue);
    }
  }

  if (bedrooms.trim()) {
    const bedroomValue = parseInt(bedrooms.trim());
    if (!isNaN(bedroomValue)) {
      if (bedroomValue === 0) {
        highGradeQuery = highGradeQuery.eq('bedrooms', 0);
        mixedQuery = mixedQuery.eq('bedrooms', 0);
        stabilizedQuery = stabilizedQuery.eq('bedrooms', 0);
      } else {
        highGradeQuery = highGradeQuery.gte('bedrooms', bedroomValue);
        mixedQuery = mixedQuery.gte('bedrooms', bedroomValue);
        stabilizedQuery = stabilizedQuery.gte('bedrooms', bedroomValue);
      }
    }
  }

  if (selectedNeighborhoods.length > 0) {
    highGradeQuery = highGradeQuery.in('neighborhood', selectedNeighborhoods);
    mixedQuery = mixedQuery.in('neighborhood', selectedNeighborhoods);
    stabilizedQuery = stabilizedQuery.in('neighborhood', selectedNeighborhoods);
  }

  if (minGrade.trim()) {
    const gradeIndex = gradeOptions.indexOf(minGrade);
    if (gradeIndex !== -1) {
      const allowedGrades = gradeOptions.slice(0, gradeIndex + 1);
      highGradeQuery = highGradeQuery.in('grade', allowedGrades);
      mixedQuery = mixedQuery.in('grade', allowedGrades);
    }
  }

  // Fetch with strategic distribution
  const [highGradeResult, mixedResult, stabilizedResult] = await Promise.all([
    highGradeQuery.range(0, 40), // Get more A+ and A properties
    mixedQuery.range(0, 60),     // Get mixed properties
    stabilizedQuery.range(0, 30) // Get rent-stabilized
  ]);

  // Combine with priority to A+ properties
  const highGradeProperties = (highGradeResult.data || []).map(property => ({
    ...property,
    isRentStabilized: false
  }));

  const mixedProperties = (mixedResult.data || []).map(property => ({
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

  // Mix them strategically - 50% high grade, 30% mixed, 20% stabilized
  allProperties = [
    ...highGradeProperties,
    ...rentStabilizedProperties,
    ...mixedProperties
  ];

  // Shuffle for variety but maintain grade distribution
  allProperties.sort(() => Math.random() - 0.5);



     } else {
        // Buy mode - fetch from sales table with strategic grade mixing
        
        // Get a strategic mix of grades for buy mode too
        let highGradeSalesQuery = supabase
          .from('undervalued_sales')
          .select('*')
          .eq('status', 'active')
          .eq('likely_sold', false)
          .in('grade', ['A+', 'A', 'A-'])
          .order('score', { ascending: false });

        let mixedSalesQuery = supabase
          .from('undervalued_sales')
          .select('*')
          .eq('status', 'active')
          .eq('likely_sold', false)
          .order('score', { ascending: false });

        // Apply filters to both queries
        if (maxPrice.trim()) {
          const priceValue = parseInt(maxPrice.trim());
          if (!isNaN(priceValue) && priceValue > 0) {
            highGradeSalesQuery = highGradeSalesQuery.lte('price', priceValue);
            mixedSalesQuery = mixedSalesQuery.lte('price', priceValue);
          }
        }

        if (bedrooms.trim()) {
          const bedroomValue = parseInt(bedrooms.trim());
          if (!isNaN(bedroomValue)) {
            if (bedroomValue === 0) {
              highGradeSalesQuery = highGradeSalesQuery.eq('bedrooms', 0);
              mixedSalesQuery = mixedSalesQuery.eq('bedrooms', 0);
            } else {
              highGradeSalesQuery = highGradeSalesQuery.gte('bedrooms', bedroomValue);
              mixedSalesQuery = mixedSalesQuery.gte('bedrooms', bedroomValue);
            }
          }
        }

        if (selectedNeighborhoods.length > 0) {
          highGradeSalesQuery = highGradeSalesQuery.in('neighborhood', selectedNeighborhoods);
          mixedSalesQuery = mixedSalesQuery.in('neighborhood', selectedNeighborhoods);
        }

        if (minGrade.trim()) {
          const gradeIndex = gradeOptions.indexOf(minGrade);
          if (gradeIndex !== -1) {
            const allowedGrades = gradeOptions.slice(0, gradeIndex + 1);
            highGradeSalesQuery = highGradeSalesQuery.in('grade', allowedGrades);
            mixedSalesQuery = mixedSalesQuery.in('grade', allowedGrades);
          }
        }

        // Fetch with strategic distribution for sales
        const [highGradeSalesResult, mixedSalesResult] = await Promise.all([
          highGradeSalesQuery.range(0, 50), // Get A+ and A properties
          mixedSalesQuery.range(0, 70)      // Get mixed grade properties
        ]);

        // Combine with variety
        const highGradeSalesProperties = (highGradeSalesResult.data || []);
        const mixedSalesProperties = (mixedSalesResult.data || []);

        // Mix them strategically - 60% high grade, 40% mixed
        allProperties = [
          ...highGradeSalesProperties,
          ...mixedSalesProperties
        ];

        // Shuffle for variety but maintain grade distribution
        allProperties.sort(() => Math.random() - 0.5);
      }

      // Take only what we need for this page
      const startIndex = reset ? 0 : currentOffset;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const pageProperties = allProperties.slice(startIndex, endIndex);
      
 if (reset) {
  setProperties(pageProperties);
  setOffset(ITEMS_PER_PAGE);
  setLoadedImageIndex(-1); // Reset image loading
} else {
  setProperties(prev => [...prev, ...pageProperties]);
  setOffset(prev => prev + ITEMS_PER_PAGE);
  // Don't reset for load more - continue cascading
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

// Track if any filters are active
useEffect(() => {
  const filtersActive = maxPrice.trim() || 
                       bedrooms.trim() || 
                       selectedNeighborhoods.length > 0 || 
                       minGrade.trim();
  setHasActiveFilters(filtersActive);
}, [maxPrice, bedrooms, selectedNeighborhoods, minGrade]);
  
// Cascading image loader effect
useEffect(() => {
  if (properties.length > 0 && loadedImageIndex < properties.length - 1) {
    const timer = setTimeout(() => {
      setLoadedImageIndex(prev => prev + 1);
    }, 150); // 150ms delay between each image load
    
    return () => clearTimeout(timer);
  }
}, [properties, loadedImageIndex]);

// Reset image loading when properties change
useEffect(() => {
  setLoadedImageIndex(-1);
}, [properties]);

  // Refetch when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProperties(true);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [maxPrice, bedrooms, selectedNeighborhoods, minGrade]);

  // Visibility limits
 const getVisibilityLimit = () => {
  if (!user) {
    return hasActiveFilters ? 0 : 12; // Blur all when filters active, otherwise show 12
  }
  if (userProfile?.subscription_plan === 'unlimited' || userProfile?.subscription_plan === 'open_door_plan') {
    return Infinity; // Unlimited users see all
  }
  return hasActiveFilters ? 0 : 24; // Free plan: blur all when filters active, otherwise show 24
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
      badge: 'bg-white/20 backdrop-blur-md border-white/30 text-black',
      discountBg: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      hover: 'hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:border-yellow-400/40'
    };
  } else if (grade === 'A' || grade === 'A-') {
    return {
      badge: 'bg-white/20 backdrop-blur-md border-white/30 text-black',
      discountBg: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      hover: 'hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:border-purple-400/40'
    };
  } else if (grade?.startsWith('B')) {
    return {
      badge: 'bg-white/20 backdrop-blur-md border-white/30 text-black',
      discountBg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      hover: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-blue-400/40'
    };
  } else {
    return {
      badge: 'bg-white/20 backdrop-blur-md border-white/30 text-black',
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

{/* Rent/Buy Toggle with Saved Heart + Refresh Button */}
<div className="flex items-center justify-center mb-3 relative">
  {/* Saved Heart Button - Left side */}
  <button
    onClick={() => {
      if (!user) {
        navigate('/join');
      } else {
        navigate('/saved');
      }
    }}
    className="absolute left-0 bg-gray-700/60 hover:bg-gray-600/80 text-gray-400 hover:text-white p-2 rounded-full transition-colors active:scale-95"
    title={!user ? "Join to save properties" : "View saved properties"}
  >
    <svg 
      className="w-4 h-4" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
      />
    </svg>
  </button>

  {/* Rent/Buy Toggle - Centered */}
  <div className="flex items-center gap-2">
    <span className={`text-sm font-semibold tracking-tight ${isRentMode ? 'text-white' : 'text-gray-400'}`}>
      Rent
    </span>
    <Toggle 
      checked={!isRentMode} 
      onCheckedChange={(checked) => setIsRentMode(!checked)}
      className="scale-90"
    />
    <span className={`text-sm font-semibold tracking-tight ${!isRentMode ? 'text-white' : 'text-gray-400'}`}>
      Buy
    </span>
  </div>
  
  {/* Refresh Button - Right side */}
  <button
    onClick={() => {
      fetchProperties(true);
    }}
    className="absolute right-0 bg-gray-700/60 hover:bg-gray-600/80 text-gray-400 hover:text-white p-2 rounded-full transition-colors active:scale-95"
    title="Clear search and refresh"
  >
    <svg 
      className="w-4 h-4" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
      />
    </svg>
  </button>
</div>

{/* AI Search Bar - Full Width Below Toggle */}
<div className="mb-0">
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
    setHasActiveFilters(true); // Mark as filtered search
  }
}}
    placeholder="Describe your dream home. We'll find it for you"
    className="w-full bg-gray-900/80 border border-gray-700/50 rounded-2xl pl-4 pr-12 py-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none text-sm tracking-tight"
    showSuggestions={false}
    hideInterpretation={true}
  />
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
    {/* Properties Grid - 2 per row */}
<div className="px-4">
  {/* Filter-based CTA for signed out users - centered at top when filters active */}
  {!user && hasActiveFilters && properties.length > 0 && (
    <div className="flex justify-center mb-4">
      <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 text-center max-w-xs">
        <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
          Want to see more of the best deals in NYC?
        </h3>
        <button
          onClick={() => navigate('/join')}
          className="bg-white text-black px-6 py-2 rounded-full font-semibold text-sm tracking-tight mb-2"
        >
          Create free account to continue
        </button>
        <p className="text-xs text-gray-400">6,000+ New Yorkers already beating the market</p>
      </div>
    </div>
  )}

  {/* Filter-based CTA for free plan users - centered at top when filters active */}
  {isFreeUser && hasActiveFilters && properties.length > 0 && (
    <div className="flex justify-center mb-4">
      <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 text-center max-w-xs">
        <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
          The only tool that helps you find your dream home. And afford it.
        </h3>
        <button
          onClick={() => navigate('/pricing')}
          className="bg-white text-black px-6 py-2 rounded-full font-semibold text-sm tracking-tight mb-2"
        >
          Try Unlimited Access for Free
        </button>
        <p className="text-xs text-gray-400">6,000+ New Yorkers already beating the market</p>
      </div>
    </div>
  )}

 <div className="grid grid-cols-2 gap-3 mb-8">
    {properties.map((property, index) => {
      const gradeColors = getGradeColors(property.grade);
      const isBlurred = index >= visibilityLimit;
      
      return (
        <React.Fragment key={`fragment-${index}`}>
           {/* CTA at first blurred listing for non-filter cases */}
      {!hasActiveFilters && index === visibilityLimit && (
        <div className="col-span-2 flex justify-center my-4">
          <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 text-center max-w-xs">
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
              {!user ? "See all the best deals" : "Unlock all deals"}
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              Only {visibilityLimit} of 4,193 deals shown
            </p>
            <button
              onClick={() => navigate(!user ? '/join' : '/pricing')}
              className="bg-white text-black px-6 py-2 rounded-full font-semibold text-sm tracking-tight"
            >
              {!user ? "Join Free" : "Try Free"}
            </button>
          </div>
        </div>
      )}
          {/* Social Proof Card - appears at index 8 */}
          {index === 8 && (
            <div className="col-span-2 bg-gray-900/40 rounded-xl p-4 my-2 border border-gray-700/30">
              <div className="text-center">
                <p className="text-sm text-white font-semibold mb-1">💬 "Found my dream 1BR in Williamsburg"</p>
                <p className="text-xs text-gray-400">- Sarah K., saved $1,200/mo</p>
              </div>
            </div>
          )}

          {/* Social Proof Card - appears at index 16 */}
          {index === 16 && (
            <div className="col-span-2 bg-gray-900/40 rounded-xl p-4 my-2 border border-gray-700/30">
              <div className="text-center">
                <p className="text-sm text-white font-semibold mb-1">🏠 "Saved $800/mo on a Park Slope studio"</p>
                <p className="text-xs text-gray-400">- Mike T., moved in early August</p>
              </div>
            </div>
          )}

          <div 
            key={`${property.id}-${index}`} 
            className="relative"
            style={{
              opacity: index <= loadedImageIndex ? 1 : 0.3,
              transform: index <= loadedImageIndex ? 'scale(1)' : 'scale(0.95)',
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
            }}
          >
            <div className={isBlurred ? 'filter blur-sm' : ''}>
              <div
                onClick={() => handlePropertyClick(property, index)}
                className={`bg-gray-900/60 border border-gray-700/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${gradeColors.hover}`}
              >
                <div className="aspect-square bg-gray-800 relative overflow-hidden">
                  {property.images?.[0] && index <= loadedImageIndex ? (
                    <img 
                      src={property.images[0]} 
                      alt={property.address}
                      className="w-full h-full object-cover transition-opacity duration-300"
                      style={{ opacity: index <= loadedImageIndex ? 1 : 0 }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
                      {index <= loadedImageIndex ? (
                        <span className="text-gray-400 text-xs">No Image</span>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse"></div>
                          <div className="relative z-10 flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${gradeColors.badge}`}>
                      {property.grade}
                    </span>
                  </div>
                  
                  <div className="absolute top-2 right-2">
                    <Heart className="h-5 w-5 text-white/80" />
                  </div>
                </div>

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
                  
                  {(property.discount_percent || property.undervaluation_percent) && (
                    <div className="mt-2">
                      <span className={`${gradeColors.discountBg} px-2 py-1 rounded-full text-xs font-semibold`}>
                        {Math.round(Math.max(
                          property.discount_percent || 0, 
                          property.undervaluation_percent || 0,
                          property.grade === 'A+' ? 15 : 0
                        ))}% below market
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

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
        </React.Fragment>
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

{/* Apple-Style Footer - Landing Page (No Active State) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-3xl">
        <div className="flex items-center justify-around py-3 px-6">
          
          <button 
            onClick={() => navigate('/buy')}
            className="flex flex-col items-center py-1 min-w-0 flex-1 active:scale-95 transition-all duration-100"
          >
            <div className="w-7 h-7 mb-1 flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">Buy</span>
          </button>

          <button 
            onClick={() => navigate('/rent')}
            className="flex flex-col items-center py-1 min-w-0 flex-1 active:scale-95 transition-all duration-100"
          >
            <div className="w-7 h-7 mb-1 flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">Rent</span>
          </button>

          <button 
            onClick={() => navigate('/pricing')}
            className="flex flex-col items-center py-1 min-w-0 flex-1 active:scale-95 transition-all duration-100"
          >
            <div className="w-7 h-7 mb-1 flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-blue-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-[10px] text-blue-400 font-medium">Upgrade</span>
          </button>

          <button 
            onClick={() => navigate('/mission')}
            className="flex flex-col items-center py-1 min-w-0 flex-1 active:scale-95 transition-all duration-100"
          >
            <div className="w-7 h-7 mb-1 flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">About</span>
          </button>

        </div>
      </div>
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/5 to-black/30"></div>
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
          Using data-driven algorithms trained to analyze the NYC housing market and find the best undervalued & rent-stabilized deals in the city, statistically.
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
            Let the apartment hunt end here.
          </h2>
          <p className="text-xl text-gray-300 mb-12 tracking-tight">
            Join the platform actually built for renters & buyers.
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