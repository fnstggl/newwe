
import { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Toggle, GooeyFilter } from "@/components/ui/liquid-toggle";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetail from "@/components/PropertyDetail";

// Use the auto-generated Supabase types directly
type SupabaseUndervaluedSales = Tables<'undervalued_sales'>;
type SupabaseUndervaluedRentals = Tables<'undervalued_rentals'>;

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [isRent, setIsRent] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);

  const ITEMS_PER_PAGE = 50;

  useEffect(() => {
    fetchProperties(true);
  }, [isRent]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProperties(true);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, zipCode, maxPrice, bedrooms]);

  const fetchProperties = async (reset = false) => {
    setLoading(true);
    const currentOffset = reset ? 0 : offset;

    try {
      console.log(`🔍 STARTING FRESH FETCH: Querying ${isRent ? 'undervalued_rentals' : 'undervalued_sales'}`);
      
      const tableName = isRent ? 'undervalued_rentals' : 'undervalued_sales';
      
      // Define base columns that exist in both tables
      const baseColumns = [
        'id', 'address', 'grade', 'score', 'bedrooms', 'bathrooms', 'sqft',
        'neighborhood', 'borough', 'zipcode', 'discount_percent', 'reasoning',
        'images', 'image_count', 'videos', 'floorplans', 'description', 'amenities',
        'property_type', 'listed_at', 'days_on_market', 'built_in', 'agents',
        'building_info', 'status', 'last_seen_in_search', 'analysis_date', 'created_at'
      ];

      // Add table-specific columns
      const selectColumns = isRent 
        ? [...baseColumns, 'monthly_rent', 'rent_per_sqft', 'likely_rented']
        : [...baseColumns, 'price', 'price_per_sqft', 'monthly_hoa', 'monthly_tax', 'likely_sold'];

      let query = supabase
        .from(tableName)
        .select(selectColumns.join(', '))
        .eq('status', 'active')
        .order('score', { ascending: false });

      // Apply filters more flexibly - only add filters if they have values
      if (searchTerm.trim()) {
        // Make the search more flexible by using case-insensitive partial matching
        query = query.or(`address.ilike.%${searchTerm.trim()}%,neighborhood.ilike.%${searchTerm.trim()}%,borough.ilike.%${searchTerm.trim()}%`);
      }

      if (zipCode.trim()) {
        // Make zipcode search more flexible
        query = query.or(`zipcode.ilike.${zipCode.trim()}%,zipcode.ilike.%${zipCode.trim()}%`);
      }

      if (maxPrice.trim()) {
        const priceValue = parseInt(maxPrice.trim());
        if (!isNaN(priceValue) && priceValue > 0) {
          const priceField = isRent ? 'monthly_rent' : 'price';
          query = query.lte(priceField, priceValue);
        }
      }

      if (bedrooms.trim()) {
        const bedroomValue = parseInt(bedrooms.trim());
        if (!isNaN(bedroomValue) && bedroomValue >= 0) {
          query = query.gte('bedrooms', bedroomValue);
        }
      }

      // Apply pagination
      const finalQuery = query.range(currentOffset, currentOffset + ITEMS_PER_PAGE - 1);

      console.log('🚀 EXECUTING QUERY with filters:', {
        searchTerm: searchTerm.trim(),
        zipCode: zipCode.trim(),
        maxPrice: maxPrice.trim(),
        bedrooms: bedrooms.trim(),
        tableName,
        offset: currentOffset
      });

      const { data, error } = await finalQuery;

      if (error) {
        console.error('❌ SUPABASE ERROR:', error);
        return;
      }

      // Validate that we actually have meaningful data before considering this a success
      if (!data || !Array.isArray(data)) {
        console.error('❌ DATA IS NOT AN ARRAY OR IS NULL:', data);
        setProperties([]);
        return;
      }

      console.log('✅ QUERY SUCCESS - RAW DATA:', {
        totalReturned: data.length,
        firstThreeRaw: data.slice(0, 3).map(item => ({
          id: item.id,
          address: item.address,
          grade: item.grade,
          score: item.score,
          gradeType: typeof item.grade,
          scoreType: typeof item.score
        }))
      });

      // Use the data directly without additional validation since all properties have grades and scores
      if (reset) {
        setProperties(data);
        setOffset(ITEMS_PER_PAGE);
      } else {
        setProperties(prev => [...prev, ...data]);
        setOffset(prev => prev + ITEMS_PER_PAGE);
      }

      setHasMore(data.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('💥 CATCH ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchProperties(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <GooeyFilter />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
            Find the best deal in the city. Actually.
          </h1>
          <p className="text-xl text-gray-400 tracking-tight">
            Stop wasting time on overpriced listings.
          </p>
        </div>

        {/* Search Filters */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 mb-8">
          {/* Rent/Buy Toggle */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              <span className={`text-sm font-medium tracking-tight transition-colors ${!isRent ? 'text-white' : 'text-gray-400'}`}>
                Buy
              </span>
              <Toggle 
                checked={isRent} 
                onCheckedChange={setIsRent} 
                variant="default"
              />
              <span className={`text-sm font-medium tracking-tight transition-colors ${isRent ? 'text-white' : 'text-gray-400'}`}>
                Rent
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                Search Address or Neighborhood
              </label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. East Village, 10009"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
                />
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
                Max {isRent ? '/month' : 'Price'}
              </label>
              <input
                type="text"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder={isRent ? "$4,000" : "$1,500,000"}
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
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm text-gray-500">
            Showing {properties.length} {isRent ? 'rental' : 'sale'} properties
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {properties.map((property, index) => {
            console.log(`🏠 PROPERTY ${index + 1} BEING PASSED TO CARD:`, {
              id: property?.id,
              address: property?.address,
              grade: property?.grade,
              score: property?.score,
              gradeType: typeof property?.grade,
              scoreType: typeof property?.score
            });
            
            return (
              <PropertyCard
                key={`${property.id}-${index}`}
                property={property}
                isRental={isRent}
                onClick={() => setSelectedProperty(property)}
              />
            );
          })}
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
              onClick={loadMore}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold"
            >
              Load More Properties
            </Button>
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
          isRental={isRent}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default Search;
