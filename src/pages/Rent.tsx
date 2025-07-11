
import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, ChevronDown, X } from "lucide-react";
import { GooeyFilter, Toggle } from "@/components/ui/liquid-toggle";
import { HoverButton } from "@/components/ui/hover-button";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetail from "@/components/PropertyDetail";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { UndervaluedRentStabilized } from "@/types/database";

type SupabaseUndervaluedRentals = Tables<'undervalued_rentals'>;

const Rent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [minGrade, setMinGrade] = useState("");
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [rentStabilizedOnly, setRentStabilizedOnly] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [showNeighborhoodDropdown, setShowNeighborhoodDropdown] = useState(false);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [neighborhoodSearchTerm, setNeighborhoodSearchTerm] = useState("");
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
  }, [searchTerm, zipCode, maxPrice, bedrooms, minGrade, selectedNeighborhoods, rentStabilizedOnly]);

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
      const [rentalsResult, rentStabilizedResult] = await Promise.all([
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

      const rentalNeighborhoods = rentalsResult.data?.map(item => item.neighborhood).filter(Boolean) || [];
      const rentStabilizedNeighborhoods = rentStabilizedResult.data?.map(item => item.neighborhood).filter(Boolean) || [];
      
      const allNeighborhoods = [...rentalNeighborhoods, ...rentStabilizedNeighborhoods];
      const uniqueNeighborhoods = [...new Set(allNeighborhoods)].map(neighborhood => 
        neighborhood === 'Bedford-Stuyvesant' ? 'Bed-Stuy' : neighborhood
      );
      setNeighborhoods(uniqueNeighborhoods);
    } catch (error) {
      console.error('Error fetching neighborhoods:', error);
    }
  };

  const normalizeRentStabilizedProperty = (property: any): any => {
    return {
      ...property,
      // Map rent-stabilized fields to match regular rental fields
      zipcode: property.zip_code,
      rent_per_sqft: property.sqft ? property.monthly_rent / property.sqft : null,
      grade: 'RS', // Special grade for rent-stabilized
      score: property.rent_stabilized_confidence,
      discount_percent: property.undervaluation_percent,
      reasoning: `Rent-stabilized property with ${property.rent_stabilized_confidence}% confidence`,
      listed_at: property.discovered_at,
      days_on_market: null,
      built_in: property.year_built,
      no_fee: false,
      pet_friendly: false,
      laundry_available: false,
      gym_available: false,
      doorman_building: false,
      elevator_building: false,
      rooftop_access: false,
      agents: [],
      building_info: {},
      status: property.display_status || 'active',
      likely_rented: false,
      last_seen_in_search: property.last_verified,
      analysis_date: property.analysis_date || property.created_at,
      annual_savings: property.potential_annual_savings,
      isRentStabilized: true // Flag to identify rent-stabilized properties
    };
  };

  const fetchProperties = async (reset = false) => {
    setLoading(true);
    const currentOffset = reset ? 0 : offset;

    try {
      if (rentStabilizedOnly) {
        // Only fetch rent-stabilized properties
        let rentStabilizedQuery = supabase
          .from('undervalued_rent_stabilized')
          .select('*')
          .eq('display_status', 'active')
          .order('created_at', { ascending: false });

        // Apply filters to rent-stabilized query
        if (searchTerm.trim()) {
          rentStabilizedQuery = rentStabilizedQuery.ilike('address', `%${searchTerm.trim()}%`);
        }

        if (zipCode.trim()) {
          rentStabilizedQuery = rentStabilizedQuery.ilike('zip_code', `${zipCode.trim()}%`);
        }

        if (maxPrice.trim()) {
          const priceValue = parseInt(maxPrice.trim());
          if (!isNaN(priceValue) && priceValue > 0) {
            rentStabilizedQuery = rentStabilizedQuery.lte('monthly_rent', priceValue);
          }
        }

        if (bedrooms.trim()) {
          const bedroomValue = parseInt(bedrooms.trim());
          if (!isNaN(bedroomValue) && bedroomValue >= 0) {
            rentStabilizedQuery = rentStabilizedQuery.gte('bedrooms', bedroomValue);
          }
        }

        if (selectedNeighborhoods.length > 0) {
          const mappedNeighborhoods = selectedNeighborhoods.map(n => n === 'Bed-Stuy' ? 'Bedford-Stuyvesant' : n);
          rentStabilizedQuery = rentStabilizedQuery.in('neighborhood', mappedNeighborhoods);
        }

        const { data, error } = await rentStabilizedQuery.range(currentOffset, currentOffset + ITEMS_PER_PAGE - 1);

        if (error) {
          console.error('❌ RENT STABILIZED ERROR:', error);
          setProperties([]);
          return;
        }

        const normalizedData = data?.map(normalizeRentStabilizedProperty) || [];
        const shuffledData = normalizedData.sort(() => Math.random() - 0.5);

        if (reset) {
          setProperties(shuffledData);
          setOffset(ITEMS_PER_PAGE);
        } else {
          setProperties(prev => [...prev, ...shuffledData]);
          setOffset(prev => prev + ITEMS_PER_PAGE);
        }

        setHasMore(data?.length === ITEMS_PER_PAGE);
      } else {
        // Build queries for both tables
        let rentalsQuery = supabase
          .from('undervalued_rentals')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        let rentStabilizedQuery = supabase
          .from('undervalued_rent_stabilized')
          .select('*')
          .eq('display_status', 'active')
          .order('created_at', { ascending: false });

        // Apply filters to both queries
        if (searchTerm.trim()) {
          rentalsQuery = rentalsQuery.ilike('address', `%${searchTerm.trim()}%`);
          rentStabilizedQuery = rentStabilizedQuery.ilike('address', `%${searchTerm.trim()}%`);
        }

        if (zipCode.trim()) {
          rentalsQuery = rentalsQuery.ilike('zipcode', `${zipCode.trim()}%`);
          rentStabilizedQuery = rentStabilizedQuery.ilike('zip_code', `${zipCode.trim()}%`);
        }

        if (maxPrice.trim()) {
          const priceValue = parseInt(maxPrice.trim());
          if (!isNaN(priceValue) && priceValue > 0) {
            rentalsQuery = rentalsQuery.lte('monthly_rent', priceValue);
            rentStabilizedQuery = rentStabilizedQuery.lte('monthly_rent', priceValue);
          }
        }

        if (bedrooms.trim()) {
          const bedroomValue = parseInt(bedrooms.trim());
          if (!isNaN(bedroomValue) && bedroomValue >= 0) {
            rentalsQuery = rentalsQuery.gte('bedrooms', bedroomValue);
            rentStabilizedQuery = rentStabilizedQuery.gte('bedrooms', bedroomValue);
          }
        }

        if (selectedNeighborhoods.length > 0) {
          const mappedNeighborhoods = selectedNeighborhoods.map(n => n === 'Bed-Stuy' ? 'Bedford-Stuyvesant' : n);
          rentalsQuery = rentalsQuery.in('neighborhood', mappedNeighborhoods);
          rentStabilizedQuery = rentStabilizedQuery.in('neighborhood', mappedNeighborhoods);
        }

        // Execute both queries
        const [rentalsResult, rentStabilizedResult] = await Promise.all([
          rentalsQuery.range(currentOffset, currentOffset + Math.floor(ITEMS_PER_PAGE / 2) - 1),
          rentStabilizedQuery.range(currentOffset, currentOffset + Math.floor(ITEMS_PER_PAGE / 2) - 1)
        ]);

        if (rentalsResult.error) {
          console.error('❌ RENTALS ERROR:', rentalsResult.error);
        }

        if (rentStabilizedResult.error) {
          console.error('❌ RENT STABILIZED ERROR:', rentStabilizedResult.error);
        }

        const rentalsData = rentalsResult.data || [];
        const rentStabilizedData = rentStabilizedResult.data || [];

        // Normalize rent-stabilized properties
        const normalizedRentStabilized = rentStabilizedData.map(normalizeRentStabilizedProperty);

        // Combine and shuffle both types of properties
        const combinedData = [...rentalsData, ...normalizedRentStabilized];
        const shuffledData = combinedData.sort(() => Math.random() - 0.5);

        if (reset) {
          setProperties(shuffledData);
          setOffset(ITEMS_PER_PAGE);
        } else {
          setProperties(prev => [...prev, ...shuffledData]);
          setOffset(prev => prev + ITEMS_PER_PAGE);
        }

        setHasMore(combinedData.length === ITEMS_PER_PAGE);
      }
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
    setNeighborhoodSearchTerm("");
  };

  const removeNeighborhood = (neighborhood: string) => {
    setSelectedNeighborhoods(prev => prev.filter(n => n !== neighborhood));
  };

  const clearNeighborhoods = () => {
    setSelectedNeighborhoods([]);
  };

  const getGradeColors = (grade: string, isRentStabilized?: boolean) => {
    if (isRentStabilized) {
      return {
        badge: 'bg-green-500 text-white border-green-600',
        scoreText: 'text-green-400',
        scoreBorder: 'border-green-600',
        hover: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:border-green-400/40'
      };
    }
    
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
    // Only allow clicks on first 3 properties for non-authenticated users
    if (!user && index >= 3) {
      return;
    }
    setSelectedProperty(property);
  };

  // Filter neighborhoods based on search term and display Bed-Stuy instead of Bedford-Stuyvesant
  const filteredNeighborhoods = neighborhoods.filter(neighborhood =>
    neighborhood.toLowerCase().includes(neighborhoodSearchTerm.toLowerCase())
  );

  // Determine which properties to show based on auth status
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
          <div className="grid md:grid-cols-6 gap-4">
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
                  <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl p-4 z-[100] max-h-80 overflow-y-auto">
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
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight text-center">
                Rent Stabilized
              </label>
              <div className="flex justify-center mt-4">
                <Toggle 
                  checked={rentStabilizedOnly} 
                  onCheckedChange={setRentStabilizedOnly} 
                  variant="default"
                  className={rentStabilizedOnly ? '[--c-background:#000000]' : ''}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {properties.map((property, index) => {
              const gradeColors = getGradeColors(property.grade, property.isRentStabilized);
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
            <HoverButton onClick={loadMore} textColor="text-white">
              Load More Properties
            </HoverButton>
          </div>
        )}

        {/* Early Access Section - only show when there are no more properties to load */}
        {user && !loading && !hasMore && properties.length > 0 && (
          <div className="text-center py-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tighter font-inter">
              Want to be the first to know when new properties in {selectedNeighborhoods.length > 0 ? selectedNeighborhoods.join(', ') : 'NYC'} are listed?
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
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl text-gray-400 mb-4 tracking-tight">
              No properties found matching your criteria
            </h3>
            <p className="text-gray-500 tracking-tight mb-16">
              Try adjusting your search filters to see more results.
            </p>
            
            {/* Early Access Section - same as bottom section */}
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tighter font-inter">
                Want to be the first to know when new properties in {selectedNeighborhoods.length > 0 ? selectedNeighborhoods.join(', ') : 'NYC'} are listed?
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
          isRental={true}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default Rent;
