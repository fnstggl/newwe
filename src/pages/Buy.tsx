import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, ChevronDown, ChevronUp, X, Filter } from "lucide-react";
import { GooeyFilter } from "@/components/ui/liquid-toggle";
import { HoverButton } from "@/components/ui/hover-button";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetail from "@/components/PropertyDetail";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

type SupabaseUndervaluedSales = Tables<'undervalued_sales'>;

const Buy = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const { listingId } = useParams();
  const isMobile = useIsMobile();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [minGrade, setMinGrade] = useState("");
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [showNeighborhoodDropdown, setShowNeighborhoodDropdown] = useState(false);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [neighborhoodSearchTerm, setNeighborhoodSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Additional filters state
  const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);
  const [selectedBoroughs, setSelectedBoroughs] = useState<string[]>([]);
  const [minSqft, setMinSqft] = useState("");
  const [addressSearch, setAddressSearch] = useState("");
  const [minDiscount, setMinDiscount] = useState("");
  const [sortBy, setSortBy] = useState("Featured");
  const [showBoroughDropdown, setShowBoroughDropdown] = useState(false);
  const boroughDropdownRef = useRef<HTMLDivElement>(null);

  // Mobile filters state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const ITEMS_PER_PAGE = 30;
  const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-'];
  const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx'];
  const discountOptions = ['50%', '45%', '40%', '35%', '30%', '25%', '20%', '15%'];
  const sortOptions = [
    'Featured',
    'Price: Low to High',
    'Price: High to Low',
    'Sqft: Low to High',
    'Sqft: High to Low',
    'Score: Low to High',
    'Score: High to Low',
    'Newest Listed'
  ];

  // Determine visibility limits based on user status
  const getVisibilityLimit = () => {
    if (!user) return 3; // Signed out users see 3
    if (userProfile?.subscription_plan === 'unlimited') return Infinity; // Unlimited users see all
    return 9; // Free plan users see 9
  };

  // Load property from URL parameter if present
  useEffect(() => {
    if (listingId && properties.length > 0) {
      const property = properties.find(p => p.listing_id === listingId);
      if (property) {
        setSelectedProperty(property);
      }
    }
  }, [listingId, properties]);

  useEffect(() => {
    fetchNeighborhoods();
    fetchProperties(true);
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProperties(true);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, zipCode, maxPrice, bedrooms, minGrade, selectedNeighborhoods, selectedBoroughs, minSqft, addressSearch, minDiscount, sortBy]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNeighborhoodDropdown(false);
      }
      if (boroughDropdownRef.current && !boroughDropdownRef.current.contains(event.target as Node)) {
        setShowBoroughDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Update meta tags for SEO
    document.title = "Buy NYC Real Estate - Find Undervalued Properties for Sale | Realer Estate";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Find undervalued NYC properties for sale with advanced algorithms. Buy smarter with real-time market analysis and transparent pricing data.');
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', 'Find undervalued NYC properties for sale with advanced algorithms. Buy smarter with real-time market analysis and transparent pricing data.');
      document.head.appendChild(metaDescription);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://realerestate.org/buy');
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', 'https://realerestate.org/buy');
      document.head.appendChild(canonical);
    }

    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Buy NYC Real Estate - Find Undervalued Properties | Realer Estate');
    } else {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      ogTitle.setAttribute('content', 'Buy NYC Real Estate - Find Undervalued Properties | Realer Estate');
      document.head.appendChild(ogTitle);
    }
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Find undervalued NYC properties for sale with advanced algorithms. Your unfair advantage in real estate.');
    } else {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      ogDescription.setAttribute('content', 'Find undervalued NYC properties for sale with advanced algorithms. Your unfair advantage in real estate.');
      document.head.appendChild(ogDescription);
    }
    
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', 'https://realerestate.org/buy');
    } else {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      ogUrl.setAttribute('content', 'https://realerestate.org/buy');
      document.head.appendChild(ogUrl);
    }

    // Update Twitter tags
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', 'Buy NYC Real Estate - Find Undervalued Properties | Realer Estate');
    } else {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      twitterTitle.setAttribute('content', 'Buy NYC Real Estate - Find Undervalued Properties | Realer Estate');
      document.head.appendChild(twitterTitle);
    }
    
    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', 'Find undervalued NYC properties for sale with advanced algorithms. Your unfair advantage in real estate.');
    } else {
      twitterDescription = document.createElement('meta');
      twitterDescription.setAttribute('name', 'twitter:description');
      twitterDescription.setAttribute('content', 'Find undervalued NYC properties for sale with advanced algorithms. Your unfair advantage in real estate.');
      document.head.appendChild(twitterDescription);
    }
    
    let twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) {
      twitterUrl.setAttribute('content', 'https://realerestate.org/buy');
    } else {
      twitterUrl = document.createElement('meta');
      twitterUrl.setAttribute('name', 'twitter:url');
      twitterUrl.setAttribute('content', 'https://realerestate.org/buy');
      document.head.appendChild(twitterUrl);
    }
  }, []);

  const fetchNeighborhoods = async () => {
    try {
      const { data, error } = await supabase
        .from('undervalued_sales')
        .select('neighborhood')
        .not('neighborhood', 'is', null)
        .order('neighborhood');

      if (error) {
        console.error('Error fetching neighborhoods:', error);
        return;
      }

      const dbNeighborhoods = [...new Set(data.map(item => item.neighborhood).filter(Boolean))];
      
      // Add missing neighborhoods that should be available
      const additionalNeighborhoods = [
        // Manhattan
        'west-village',
        'lower-east-side', 
        'little-italy',
        'nolita',
        'soho',
        'tribeca',
        'two-bridges',
        'murray-hill',
        // Brooklyn
        'williamsburg',
        'prospect-heights',
        'park-slope',
        // Queens
        'long-island-city',
        'sunnyside',
        'woodside',
        // Bronx
        'mott-haven',
        'melrose',
        'south-bronx'
      ];

      // Combine database neighborhoods with additional ones, removing duplicates
      const allNeighborhoods = [...new Set([...dbNeighborhoods, ...additionalNeighborhoods])].sort();
      setNeighborhoods(allNeighborhoods);
    } catch (error) {
      console.error('Error fetching neighborhoods:', error);
    }
  };

  const fetchProperties = async (reset = false) => {
    setLoading(true);
    const currentOffset = reset ? 0 : offset;

    try {
      let query = supabase
        .from('undervalued_sales')
        .select('*')
        .eq('status', 'active')
        .or('investor_plan_property.is.null,investor_plan_property.neq.true');

      if (searchTerm.trim()) {
        query = query.ilike('address', `%${searchTerm.trim()}%`);
      }

      if (zipCode.trim()) {
        query = query.ilike('zipcode', `${zipCode.trim()}%`);
      }

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
            // Studio: filter for exactly 0 bedrooms
            query = query.eq('bedrooms', 0);
          } else {
            // For other values: filter for that number or more bedrooms
            query = query.gte('bedrooms', bedroomValue);
          }
        }
      }

      if (minGrade.trim()) {
        const gradeIndex = gradeOptions.indexOf(minGrade);
        if (gradeIndex !== -1) {
          const allowedGrades = gradeOptions.slice(0, gradeIndex + 1);
          query = query.in('grade', allowedGrades);
        }
      }

      if (selectedNeighborhoods.length > 0) {
        query = query.in('neighborhood', selectedNeighborhoods);
      }

      // Additional filters
      if (selectedBoroughs.length > 0) {
        query = query.in('borough', selectedBoroughs);
      }

      if (minSqft.trim()) {
        const sqftValue = parseInt(minSqft.trim());
        if (!isNaN(sqftValue) && sqftValue > 0) {
          query = query.gte('sqft', sqftValue).not('sqft', 'is', null);
        }
      }

      if (addressSearch.trim()) {
        query = query.ilike('address', `%${addressSearch.trim()}%`);
      }

      if (minDiscount.trim()) {
        const discountValue = parseInt(minDiscount.replace('%', ''));
        if (!isNaN(discountValue) && discountValue > 0) {
          query = query.gte('discount_percent', discountValue);
        }
      }

      // Apply sorting
      switch (sortBy) {
        case 'Price: Low to High':
          query = query.order('price', { ascending: true });
          break;
        case 'Price: High to Low':
          query = query.order('price', { ascending: false });
          break;
        case 'Sqft: Low to High':
          query = query.order('sqft', { ascending: true, nullsFirst: true });
          break;
        case 'Sqft: High to Low':
          query = query.order('sqft', { ascending: false, nullsFirst: false });
          break;
        case 'Score: Low to High':
          query = query.order('score', { ascending: true });
          break;
        case 'Score: High to Low':
          query = query.order('score', { ascending: false });
          break;
        case 'Newest Listed':
          query = query.order('days_on_market', { ascending: true });
          break;
        default: // Featured
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query.range(currentOffset, currentOffset + ITEMS_PER_PAGE - 1);

      if (error) {
        console.error('❌ SUPABASE ERROR:', error);
        setProperties([]);
        return;
      }

      if (!data || !Array.isArray(data)) {
        console.error('❌ DATA IS NOT AN ARRAY OR IS NULL:', data);
        setProperties([]);
        return;
      }

      // Only shuffle if Featured sorting
      const resultData = sortBy === 'Featured' ? data.sort(() => Math.random() - 0.5) : data;

      if (reset) {
        setProperties(resultData);
        setOffset(ITEMS_PER_PAGE);
      } else {
        setProperties(prev => [...prev, ...resultData]);
        setOffset(prev => prev + ITEMS_PER_PAGE);
      }

      setHasMore(data.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('💥 CATCH ERROR:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchProperties(false);
    }
  };

  const toggleNeighborhood = (neighborhood: string) => {
    setSelectedNeighborhoods(prev => 
      prev.includes(neighborhood) 
        ? prev.filter(n => n !== neighborhood)
        : [...prev, neighborhood]
    );
  };

  const clearNeighborhoods = () => {
    setSelectedNeighborhoods([]);
  };

  const removeNeighborhood = (neighborhood: string) => {
    setSelectedNeighborhoods(prev => prev.filter(n => n !== neighborhood));
  };

  const toggleBorough = (borough: string) => {
    setSelectedBoroughs(prev => 
      prev.includes(borough) 
        ? prev.filter(b => b !== borough)
        : [...prev, borough]
    );
  };

  const clearBoroughs = () => {
    setSelectedBoroughs([]);
  };

  const removeBorough = (borough: string) => {
    setSelectedBoroughs(prev => prev.filter(b => b !== borough));
  };

  const getGradeColors = (grade: string) => {
    if (grade === 'A+') {
      return {
        badge: 'bg-white text-black border-gray-300',
        scoreText: 'text-yellow-400',
        scoreBorder: 'border-yellow-600',
        hover: 'hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:border-yellow-400/40'
      };
    } else if (grade === 'A' || grade === 'A-') {
      return {
        badge: 'bg-white text-black border-gray-300',
        scoreText: 'text-purple-400',
        scoreBorder: 'border-purple-600',
        hover: 'hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:border-purple-400/40'
      };
    } else if (grade.startsWith('B')) {
      return {
        badge: 'bg-white text-black border-gray-300',
        scoreText: 'text-blue-400',
        scoreBorder: 'border-blue-600',
        hover: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-blue-400/40'
      };
    } else {
      return {
        badge: 'bg-white text-black border-gray-300',
        scoreText: 'text-gray-300',
        scoreBorder: 'border-gray-600',
        hover: 'hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:border-white/40'
      };
    }
  };

  const handlePropertyClick = (property: any, index: number) => {
    const visibilityLimit = getVisibilityLimit();
    
    // Only allow clicks on visible properties
    if (index >= visibilityLimit) {
      return;
    }
    
    // Update URL with listing ID
    navigate(`/buy/${property.listing_id}`, { replace: true });
    setSelectedProperty(property);
  };

  const handleClosePropertyDetail = () => {
    // Navigate back to main buy page
    navigate('/buy', { replace: true });
    setSelectedProperty(null);
  };

  // Filter neighborhoods based on search term
  const filteredNeighborhoods = neighborhoods.filter(neighborhood =>
    neighborhood.toLowerCase().includes(neighborhoodSearchTerm.toLowerCase())
  );

  const visibilityLimit = getVisibilityLimit();
  const isUnlimitedUser = userProfile?.subscription_plan === 'unlimited';
  const isFreeUser = user && userProfile?.subscription_plan !== 'unlimited';

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <GooeyFilter />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
            Find the best deals to buy. Actually.
          </h1>
          <p className="text-xl text-gray-400 tracking-tight">
            Stop wasting time on overpriced listings.
          </p>
        </div>

        {/* Mobile Filters Button */}
        {isMobile && (
          <div className="mb-6">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 text-white hover:border-blue-500/40 transition-all"
            >
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filters</span>
              {showMobileFilters ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        )}

        {/* Search Filters */}
        <div className={`bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 mb-8 relative z-10 ${isMobile && !showMobileFilters ? 'hidden' : ''}`}>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                Neighborhoods
              </label>
              <div className="relative">
                <div className="relative flex items-center">
                  <div className="flex items-center w-full pl-4 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl min-h-[48px] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    {selectedNeighborhoods.length > 0 && (
                      <div className="flex items-center gap-2 mr-2 flex-shrink-0">
                        {selectedNeighborhoods.map((neighborhood) => (
                          <div
                            key={neighborhood}
                            className="bg-white text-black px-3 py-1 rounded-full text-sm flex items-center cursor-pointer flex-shrink-0"
                            onClick={() => removeNeighborhood(neighborhood)}
                          >
                            {neighborhood}
                            <X className="ml-1 h-3 w-3" />
                          </div>
                        ))}
                      </div>
                    )}
                    <input
                      type="text"
                      value={neighborhoodSearchTerm}
                      onChange={(e) => setNeighborhoodSearchTerm(e.target.value)}
                      onFocus={() => setShowNeighborhoodDropdown(true)}
                      placeholder={selectedNeighborhoods.length === 0 ? "East Village" : ""}
                      className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 min-w-0"
                    />
                  </div>
                </div>
                
                {showNeighborhoodDropdown && (
                  <div className="absolute top-full left-0 right-0 mb-1 bg-gray-900 border border-gray-700 rounded-xl p-4 z-[100] max-h-80 overflow-y-auto">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-300">Filter by Neighborhoods</span>
                      {selectedNeighborhoods.length > 0 && (
                        <button
                          onClick={clearNeighborhoods}
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filteredNeighborhoods.map((neighborhood) => (
                        <button
                          key={neighborhood}
                          onClick={() => toggleNeighborhood(neighborhood)}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            selectedNeighborhoods.includes(neighborhood)
                              ? 'bg-white text-black'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {neighborhood}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                Zip Code
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="10009"
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                Max Price
              </label>
              <input
                type="text"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="$1,500,000"
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                Bedrooms
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
              >
                <option value="" className="text-gray-500">Any</option>
                <option value="0" className="text-white">Studio</option>
                <option value="1" className="text-white">1+</option>
                <option value="2" className="text-white">2+</option>
                <option value="3" className="text-white">3+</option>
                <option value="4" className="text-white">4+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                Min Grade
              </label>
              <select
                value={minGrade}
                onChange={(e) => setMinGrade(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
              >
                <option value="" className="text-gray-500">Any Grade</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade} className="text-white">{grade}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Filters Dropdown Toggle */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowAdditionalFilters(!showAdditionalFilters)}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              {showAdditionalFilters ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Additional Filters Section */}
          {showAdditionalFilters && (
          <div className="grid md:grid-cols-5 gap-4 mt-6 pt-4">
              <div className="relative" ref={boroughDropdownRef}>
                <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                  Borough
                </label>
                <div className="relative">
                  <div className="flex items-center w-full pl-4 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl min-h-[48px] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    {selectedBoroughs.length > 0 && (
                      <div className="flex items-center gap-2 mr-2 flex-shrink-0">
                        {selectedBoroughs.map((borough) => (
                          <div
                            key={borough}
                            className="bg-white text-black px-3 py-1 rounded-full text-sm flex items-center cursor-pointer flex-shrink-0"
                            onClick={() => removeBorough(borough)}
                          >
                            {borough}
                            <X className="ml-1 h-3 w-3" />
                          </div>
                        ))}
                      </div>
                    )}
                    <div
                      className="flex-1 cursor-pointer text-gray-500"
                      onClick={() => setShowBoroughDropdown(true)}
                    >
                      {selectedBoroughs.length === 0 ? "Manhattan" : ""}
                    </div>
                  </div>
                  
                  {showBoroughDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl p-4 z-[100] max-h-80 overflow-y-auto">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-300">Filter by Borough</span>
                        {selectedBoroughs.length > 0 && (
                          <button
                            onClick={clearBoroughs}
                            className="text-xs text-blue-400 hover:text-blue-300"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {boroughs.map((borough) => (
                          <button
                            key={borough}
                            onClick={() => toggleBorough(borough)}
                            className={`px-3 py-1 rounded-full text-sm transition-all ${
                              selectedBoroughs.includes(borough)
                                ? 'bg-white text-black'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {borough}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                  Min Sqft
                </label>
                <input
                  type="text"
                  value={minSqft}
                  onChange={(e) => setMinSqft(e.target.value)}
                  placeholder="1,100"
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                  Address
                </label>
                <input
                  type="text"
                  value={addressSearch}
                  onChange={(e) => setAddressSearch(e.target.value)}
                  placeholder="123 Carroll St"
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                  Min Discount
                </label>
                <select
                  value={minDiscount}
                  onChange={(e) => setMinDiscount(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
                >
                  <option value="" className="text-gray-500">Any</option>
                  {discountOptions.map((discount) => (
                    <option key={discount} value={discount} className="text-white">{discount}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option} className="text-white">{option}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Properties Grid with Overlay for CTAs */}
        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {properties.map((property, index) => {
              const gradeColors = getGradeColors(property.grade);
              const isBlurred = index >= visibilityLimit;
              
              return (
                <div
                  key={`${property.id}-${index}`}
                  className="relative"
                >
                  <div className={isBlurred ? 'filter blur-sm pointer-events-none' : ''}>
                    <PropertyCard
                      property={property}
                      isRental={false}
                      onClick={() => handlePropertyClick(property, index)}
                      gradeColors={gradeColors}
                    />
                  </div>

                  {/* Overlay CTA for signed out users - positioned over the 4th property (index 3) */}
                  {!user && index === 4 && properties.length > 4 && (
                    <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
                        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 text-center max-w-md w-full pointer-events-auto px-[3px]">
                        <h3 className="text-2xl font-bold text-white mb-4">
                          Want to see more of the best deals in NYC?
                        </h3>
                        <p className="text-white mb-4">
                          You've seen 3 of 2,193 listings. Create a free account to continue hunting.
                        </p>
                        <button
                          onClick={() => navigate('/join')}
                          className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                        >
                          🔓 See More Deals
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Overlay CTA for free plan users - positioned over the 10th property (index 9) */}
                  {isFreeUser && index === 10 && properties.length > 10 && (
                    <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
                        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 text-center max-w-md w-full pointer-events-auto px-[3px]">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          Your next home could be just past this point.
                        </h3>
                        <p className="text-white font-bold mb-4">
                          You're only seeing 9 of 2,193 deals.
                        </p>
                     <button
  onClick={() => navigate('/pricing')}
  className="relative group bg-white text-black px-8 py-3 rounded-full font-semibold transition-all duration-300
             hover:shadow-[0_0_12px_rgba(255,255,255,0.4)]"
>
  <span className="inline-block mr-2 animate-none group-hover:animate-bounce">
    🔥
  </span>
  Unlock the rest for just $3
</button>
                          <p className="text-xs text-gray-400 mt-3">
  6,000+ New Yorkers · As seen on CBS & AP
</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-gray-400">Loading properties...</div>
          </div>
        )}

        {/* Load More Button - only show for unlimited users or when there are visible properties */}
        {!loading && hasMore && properties.length > 0 && isUnlimitedUser && (
          <div className="text-center py-8">
            <HoverButton onClick={loadMore} textColor="text-white">
              Load More Properties
            </HoverButton>
          </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
              No properties found matching your search criteria
            </h3>
            <p className="text-gray-400 tracking-tight mb-6">
              Try adjusting your filters
            </p>
            
            {/* Red glow line */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60 mb-12 relative">
              <div className="absolute inset-0 w-full h-px bg-gradient-to-r from-transparent via-red-400 to-transparent blur-sm"></div>
            </div>
            
            {/* Early Access Section - same as bottom section */}
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tighter font-inter">
                Want to be the first to know when new deals in {selectedNeighborhoods.length > 0 ? selectedNeighborhoods.join(', ') : 'NYC'} are listed?
              </h3>
              <p className="text-2xl text-gray-400 mb-12 tracking-tight font-inter">
                The best deals in the city get bought in days. Don't miss them.
              </p>
              <button 
                onClick={() => navigate('/pricing')}
                className="bg-white text-black px-12 py-5 rounded-full font-bold text-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:border hover:border-white shadow-lg font-inter tracking-tight"
              >
                Early Access
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          isRental={false}
          onClose={handleClosePropertyDetail}
        />
      )}
    </div>
  );
};

export default Buy;
