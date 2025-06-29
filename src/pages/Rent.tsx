import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, ChevronDown } from "lucide-react";
import { GooeyFilter } from "@/components/ui/liquid-toggle";
import { HoverButton } from "@/components/ui/hover-button";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetail from "@/components/PropertyDetail";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type SupabaseUndervaluedRentals = Tables<'undervalued_rentals'>;
type SupabaseUndervaluedRentStabilized = Tables<'undervalued_rent_stabilized'>;

const Rent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 30;
  const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-'];

  useEffect(() => {
    fetchNeighborhoods();
    fetchProperties(true);
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProperties(true);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, zipCode, maxPrice, bedrooms, minGrade, selectedNeighborhoods]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNeighborhoodDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Update meta tags for SEO
    document.title = "NYC Rental Apartments - Find Undervalued Rentals | Realer Estate";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Find undervalued NYC rental apartments with advanced algorithms. Rent smarter with real-time market analysis and transparent pricing data.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Find undervalued NYC rental apartments with advanced algorithms. Rent smarter with real-time market analysis and transparent pricing data.';
      document.head.appendChild(meta);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'NYC Rental Apartments - Find Undervalued Rentals | Realer Estate');
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', 'Find undervalued NYC rental apartments with advanced algorithms. Your unfair advantage in rentals.');
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', 'https://realerestate.org/rent');

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', 'NYC Rental Apartments - Find Undervalued Rentals | Realer Estate');
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', 'Find undervalued NYC rental apartments with advanced algorithms. Your unfair advantage in rentals.');
    
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute('content', 'https://realerestate.org/rent');

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://realerestate.org/rent');
  }, []);

  const fetchNeighborhoods = async () => {
    try {
      // Fetch neighborhoods from both tables
      const [regularResult, stabilizedResult] = await Promise.all([
        supabase
          .from('undervalued_rentals')
          .select('neighborhood')
          .not('neighborhood', 'is', null)
          .order('neighborhood'),
        supabase
          .from('undervalued_rent_stabilized')
          .select('neighborhood')
          .not('neighborhood', 'is', null)
          .order('neighborhood')
      ]);

      const regularNeighborhoods = regularResult.data?.map(item => item.neighborhood).filter(Boolean) || [];
      const stabilizedNeighborhoods = stabilizedResult.data?.map(item => item.neighborhood).filter(Boolean) || [];
      const allNeighborhoods = [...regularNeighborhoods, ...stabilizedNeighborhoods];
      const uniqueNeighborhoods = [...new Set(allNeighborhoods)];
      
      setNeighborhoods(uniqueNeighborhoods);
    } catch (error) {
      console.error('Error fetching neighborhoods:', error);
    }
  };

  const normalizeRentStabilizedProperty = (property: SupabaseUndervaluedRentStabilized) => {
    // Calculate grade based on rent_stabilized_confidence and undervaluation_percent
    let grade = 'C';
    const confidence = property.rent_stabilized_confidence || 0;
    const undervaluation = property.undervaluation_percent || 0;
    
    if (confidence >= 90 && undervaluation >= 25) grade = 'A+';
    else if (confidence >= 85 && undervaluation >= 20) grade = 'A';
    else if (confidence >= 80 && undervaluation >= 15) grade = 'A-';
    else if (confidence >= 75 && undervaluation >= 12) grade = 'B+';
    else if (confidence >= 70 && undervaluation >= 10) grade = 'B';
    else if (confidence >= 65 && undervaluation >= 8) grade = 'B-';
    else if (confidence >= 60 && undervaluation >= 5) grade = 'C+';
    else if (confidence >= 50) grade = 'C';
    else grade = 'C-';

    // Calculate score (0-100)
    const score = Math.min(100, Math.round((confidence * 0.6) + (undervaluation * 2)));

    return {
      ...property,
      // Map fields to match regular rental structure
      discount_percent: property.undervaluation_percent,
      grade,
      score,
      reasoning: property.rent_stabilization_analysis?.explanation || '',
      status: property.display_status || 'active',
      likely_rented: property.display_status === 'rented',
      last_seen_in_search: property.last_verified,
      rent_per_sqft: property.sqft ? property.monthly_rent / property.sqft : undefined,
      property_type: 'apartment',
      listed_at: property.discovered_at,
      days_on_market: Math.floor((new Date().getTime() - new Date(property.discovered_at).getTime()) / (1000 * 3600 * 24)),
      no_fee: property.broker_fee === 'No Fee' || property.broker_fee === 'no fee',
      pet_friendly: property.pet_policy?.toLowerCase().includes('allowed') || false,
      laundry_available: property.building_amenities?.some((amenity: any) => 
        typeof amenity === 'string' ? amenity.toLowerCase().includes('laundry') : false) || false,
      gym_available: property.building_amenities?.some((amenity: any) => 
        typeof amenity === 'string' ? amenity.toLowerCase().includes('gym') || amenity.toLowerCase().includes('fitness') : false) || false,
      doorman_building: property.building_amenities?.some((amenity: any) => 
        typeof amenity === 'string' ? amenity.toLowerCase().includes('doorman') : false) || false,
      elevator_building: property.building_amenities?.some((amenity: any) => 
        typeof amenity === 'string' ? amenity.toLowerCase().includes('elevator') : false) || false,
      rooftop_access: property.building_amenities?.some((amenity: any) => 
        typeof amenity === 'string' ? amenity.toLowerCase().includes('rooftop') : false) || false,
      agents: [
        ...(property.broker_name ? [{
          name: property.broker_name,
          phone: property.broker_phone,
          email: property.broker_email
        }] : []),
        ...(property.listing_agent ? [{
          name: property.listing_agent
        }] : [])
      ],
      building_info: {
        year_built: property.year_built,
        total_units: property.total_units_in_building,
        building_type: property.building_type
      },
      annual_savings: property.potential_annual_savings,
      // Add rent-stabilized flag
      is_rent_stabilized: true,
      rent_stabilized_confidence: property.rent_stabilized_confidence
    };
  };

  const fetchProperties = async (reset = false) => {
    setLoading(true);
    const currentOffset = reset ? 0 : offset;

    try {
      // Build queries for both tables
      let regularQuery = supabase
        .from('undervalued_rentals')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      let stabilizedQuery = supabase
        .from('undervalued_rent_stabilized')
        .select('*')
        .eq('display_status', 'active')
        .order('discovered_at', { ascending: false });

      // Apply filters to both queries
      if (searchTerm.trim()) {
        regularQuery = regularQuery.ilike('address', `%${searchTerm.trim()}%`);
        stabilizedQuery = stabilizedQuery.ilike('address', `%${searchTerm.trim()}%`);
      }

      if (zipCode.trim()) {
        regularQuery = regularQuery.ilike('zipcode', `${zipCode.trim()}%`);
        stabilizedQuery = stabilizedQuery.ilike('zip_code', `${zipCode.trim()}%`);
      }

      if (maxPrice.trim()) {
        const priceValue = parseInt(maxPrice.trim());
        if (!isNaN(priceValue) && priceValue > 0) {
          regularQuery = regularQuery.lte('monthly_rent', priceValue);
          stabilizedQuery = stabilizedQuery.lte('monthly_rent', priceValue);
        }
      }

      if (bedrooms.trim()) {
        const bedroomValue = parseInt(bedrooms.trim());
        if (!isNaN(bedroomValue) && bedroomValue >= 0) {
          regularQuery = regularQuery.gte('bedrooms', bedroomValue);
          stabilizedQuery = stabilizedQuery.gte('bedrooms', bedroomValue);
        }
      }

      if (selectedNeighborhoods.length > 0) {
        regularQuery = regularQuery.in('neighborhood', selectedNeighborhoods);
        stabilizedQuery = stabilizedQuery.in('neighborhood', selectedNeighborhoods);
      }

      // Execute both queries
      const [regularResult, stabilizedResult] = await Promise.all([
        regularQuery.range(Math.floor(currentOffset/2), Math.floor(currentOffset/2) + Math.floor(ITEMS_PER_PAGE/2) - 1),
        stabilizedQuery.range(Math.floor(currentOffset/2), Math.floor(currentOffset/2) + Math.floor(ITEMS_PER_PAGE/2) - 1)
      ]);

      if (regularResult.error) {
        console.error('❌ REGULAR RENTALS ERROR:', regularResult.error);
      }
      if (stabilizedResult.error) {
        console.error('❌ RENT STABILIZED ERROR:', stabilizedResult.error);
      }

      const regularData = regularResult.data || [];
      const stabilizedData = stabilizedResult.data || [];

      // Normalize rent-stabilized properties to match regular rental structure
      const normalizedStabilized = stabilizedData.map(normalizeRentStabilizedProperty);

      // Apply grade filtering after normalization for rent-stabilized properties
      let filteredStabilized = normalizedStabilized;
      if (minGrade.trim()) {
        const gradeIndex = gradeOptions.indexOf(minGrade);
        if (gradeIndex !== -1) {
          const allowedGrades = gradeOptions.slice(0, gradeIndex + 1);
          filteredStabilized = normalizedStabilized.filter(prop => allowedGrades.includes(prop.grade));
        }
      }

      // Apply grade filtering to regular rentals
      let filteredRegular = regularData;
      if (minGrade.trim()) {
        const gradeIndex = gradeOptions.indexOf(minGrade);
        if (gradeIndex !== -1) {
          const allowedGrades = gradeOptions.slice(0, gradeIndex + 1);
          filteredRegular = regularData.filter(prop => allowedGrades.includes(prop.grade));
        }
      }

      // Combine and shuffle the results
      const combinedData = [...filteredRegular, ...filteredStabilized];
      const shuffledData = combinedData.sort(() => Math.random() - 0.5);

      if (reset) {
        setProperties(shuffledData);
        setOffset(ITEMS_PER_PAGE);
      } else {
        setProperties(prev => [...prev, ...shuffledData]);
        setOffset(prev => prev + ITEMS_PER_PAGE);
      }

      setHasMore(combinedData.length === ITEMS_PER_PAGE);
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
    if (!user && index >= 3) {
      return;
    }
    setSelectedProperty(property);
  };

  const visibleProperties = user ? properties : properties.slice(0, 3);
  const shouldShowBlur = !user && properties.length > 3;

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <GooeyFilter />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
            Find the best deals to rent. Actually.
          </h1>
          <p className="text-xl text-gray-400 tracking-tight">
            Stop wasting time on overpriced listings.
          </p>
        </div>

        {/* Search Filters */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 mb-8 relative z-10">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                Neighborhoods
              </label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowNeighborhoodDropdown(true)}
                  placeholder="e.g. East Village, 10009"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
                />
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
                      {neighborhoods.map((neighborhood) => (
                        <button
                          key={neighborhood}
                          onClick={() => toggleNeighborhood(neighborhood)}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            selectedNeighborhoods.includes(neighborhood)
                              ? 'bg-blue-600 text-white'
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
                Max /month
              </label>
              <input
                type="text"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="$4,000"
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
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
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
              <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                Min Grade
              </label>
              <select
                value={minGrade}
                onChange={(e) => setMinGrade(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
              >
                <option value="">Any Grade</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {properties.map((property, index) => {
              const gradeColors = getGradeColors(property.grade);
              const isBlurred = !user && index >= 3;
              const isClickable = user || index < 3;
              
              return (
                <div
                  key={`${property.id}-${index}`}
                  className={`relative ${isBlurred ? 'blur-sm' : ''}`}
                >
                  <PropertyCard
                    property={property}
                    isRental={true}
                    onClick={() => handlePropertyClick(property, index)}
                    gradeColors={gradeColors}
                    isRentStabilized={property.is_rent_stabilized}
                  />
                  {!isClickable && (
                    <div className="absolute inset-0 cursor-not-allowed z-10" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Sign-in button overlay for non-authenticated users */}
          {!user && properties.length > 3 && (
            <div className="relative">
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:bg-gray-100"
                >
                  Sign in to view all properties
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-gray-400">Loading properties...</div>
          </div>
        )}

        {/* Load More Button - only show for authenticated users */}
        {user && !loading && hasMore && properties.length > 0 && (
          <div className="text-center py-8">
            <HoverButton onClick={loadMore}>
              Load More Properties
            </HoverButton>
          </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl text-gray-400 mb-4 tracking-tight">
              No properties found matching your criteria
            </h3>
            <p className="text-gray-500 tracking-tight">
              Try adjusting your search filters to see more results.
            </p>
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          isRental={true}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default Rent;
