import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search as SearchIcon, ChevronDown, ChevronUp, X } from "lucide-react";
import { Toggle, GooeyFilter } from "@/components/ui/liquid-toggle";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetail from "@/components/PropertyDetail";
import { useAuth } from "@/contexts/AuthContext";

type SupabaseUndervaluedRentals = Tables<'undervalued_rentals'>;
type SupabaseUndervaluedRentStabilized = Tables<'undervalued_rent_stabilized'>;

const Rent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { listingId } = useParams();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [isRentStabilized, setIsRentStabilized] = useState(false);
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

  const ITEMS_PER_PAGE = 30;

  // Grade options for filtering
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

  useEffect(() => {
    fetchNeighborhoods();
    fetchProperties(true);
  }, []);

  useEffect(() => {
    if (listingId) {
      fetchPropertyByListingId(listingId);
    }
  }, [listingId]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProperties(true);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, zipCode, maxPrice, bedrooms, isRentStabilized, selectedNeighborhoods, selectedBoroughs, minSqft, addressSearch, minDiscount, sortBy]);

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

  const fetchPropertyByListingId = async (listing_id: string) => {
    try {
      // Try undervalued_rentals first
      const { data: rentalData, error: rentalError } = await supabase
        .from('undervalued_rentals')
        .select('*')
        .eq('listing_id', listing_id)
        .eq('status', 'active')
        .maybeSingle();

      if (rentalData) {
        setSelectedProperty(rentalData);
        return;
      }

      // Try undervalued_rent_stabilized
      const { data: stabilizedData, error: stabilizedError } = await supabase
        .from('undervalued_rent_stabilized')
        .select('*')
        .eq('listing_id', listing_id)
        .eq('display_status', 'active')
        .maybeSingle();

      if (stabilizedData) {
        setSelectedProperty({
          ...stabilizedData,
          isRentStabilized: true
        });
        return;
      }

      // If property not found, navigate back to rent page
      navigate('/rent');
    } catch (error) {
      console.error('Error fetching property by listing ID:', error);
      navigate('/rent');
    }
  };

  const fetchNeighborhoods = async () => {
    try {
      const { data, error } = await supabase
        .from('undervalued_rentals')
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
      let query;
      if (isRentStabilized) {
        query = supabase
          .from('undervalued_rent_stabilized')
          .select('*')
          .eq('display_status', 'active');
      } else {
        query = supabase
          .from('undervalued_rentals')
          .select('*')
          .eq('status', 'active');
      }

      if (searchTerm.trim()) {
        query = query.ilike('address', `%${searchTerm.trim()}%`);
      }

      if (zipCode.trim()) {
        query = query.ilike('zipcode', `${zipCode.trim()}%`);
      }

      if (maxPrice.trim()) {
        const priceValue = parseInt(maxPrice.trim());
        if (!isNaN(priceValue) && priceValue > 0) {
          query = query.lte('monthly_rent', priceValue);
        }
      }

      if (bedrooms.trim()) {
        const bedroomValue = parseInt(bedrooms.trim());
        if (!isNaN(bedroomValue) && bedroomValue >= 0) {
          query = query.gte('bedrooms', bedroomValue);
        }
      }

      if (selectedNeighborhoods.length > 0) {
        query = query.in('neighborhood', selectedNeighborhoods);
      }

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
          query = query.order('monthly_rent', { ascending: true });
          break;
        case 'Price: High to Low':
          query = query.order('monthly_rent', { ascending: false });
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

  const handlePropertyClick = (property: any, index: number) => {
    // Only allow clicks on first 6 properties if user is not logged in
    if (!user && index >= 6) {
      return;
    }
    
    // Update URL with listing ID
    navigate(`/rent/${property.listing_id}`);
    setSelectedProperty(property);
  };

  const handleClosePropertyDetail = () => {
    navigate('/rent');
    setSelectedProperty(null);
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
                      {neighborhoods.filter(neighborhood =>
                        neighborhood.toLowerCase().includes(neighborhoodSearchTerm.toLowerCase())
                      ).map((neighborhood) => (
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
                Rent Stabilized
              </label>
              <Toggle 
                checked={isRentStabilized} 
                onCheckedChange={setIsRentStabilized} 
                variant="default"
              />
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

        {/* Properties Grid */}
        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {properties.map((property, index) => {
              const isBlurred = !user && index >= 6;
              
              return (
                <div
                  key={`${property.id}-${index}`}
                  className="relative"
                >
                  <div className={isBlurred ? 'filter blur-sm pointer-events-none' : ''}>
                    <PropertyCard
                      property={property}
                      isRental={true}
                      onClick={() => handlePropertyClick(property, index)}
                    />
                  </div>
                  
                  {/* Show CTA button on 8th property (index 7) for non-logged users */}
                  {!user && index === 7 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-xl z-10">
                      <h3 className="text-2xl font-bold text-white mb-4 text-center px-4">
                        Want to see the best deals in NYC?
                      </h3>
                      <button
                        onClick={() => navigate('/join')}
                        className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Create free account
                      </button>
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

        {/* Load More Button */}
        {!loading && hasMore && properties.length > 0 && (
          <div className="text-center py-8">
            <Button
              onClick={() => fetchProperties(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold"
            >
              Load More Properties
            </Button>
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
                The best deals in the city get rented in days. Don't miss them.
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
          onClose={handleClosePropertyDetail}
        />
      )}
    </div>
  );
};

export default Rent;
