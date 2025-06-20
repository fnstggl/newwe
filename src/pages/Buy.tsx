
import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, ChevronDown } from "lucide-react";
import { GooeyFilter } from "@/components/ui/liquid-toggle";
import { HoverButton } from "@/components/ui/hover-button";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetail from "@/components/PropertyDetail";

type SupabaseUndervaluedSales = Tables<'undervalued_sales'>;

const Buy = () => {
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

      const uniqueNeighborhoods = [...new Set(data.map(item => item.neighborhood).filter(Boolean))];
      setNeighborhoods(uniqueNeighborhoods);
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
        .order('created_at', { ascending: false }); // Random-ish order instead of by score

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
        if (!isNaN(bedroomValue) && bedroomValue >= 0) {
          query = query.gte('bedrooms', bedroomValue);
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

      // Shuffle the results to make them appear random
      const shuffledData = data.sort(() => Math.random() - 0.5);

      if (reset) {
        setProperties(shuffledData);
        setOffset(ITEMS_PER_PAGE);
      } else {
        setProperties(prev => [...prev, ...shuffledData]);
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

  const getGradeColors = (grade: string) => {
    if (grade === 'A+') {
      return {
        badge: 'bg-white text-black border-gray-300', // White background, black text
        scoreText: 'text-yellow-400',
        scoreBorder: 'border-yellow-600',
        hover: 'hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:border-yellow-400/40'
      };
    } else if (grade === 'A' || grade === 'A-') {
      return {
        badge: 'bg-white text-black border-gray-300', // White background, black text
        scoreText: 'text-purple-400',
        scoreBorder: 'border-purple-600',
        hover: 'hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:border-purple-400/40'
      };
    } else if (grade.startsWith('B')) {
      return {
        badge: 'bg-white text-black border-gray-300', // White background, black text
        scoreText: 'text-blue-400',
        scoreBorder: 'border-blue-600',
        hover: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-blue-400/40'
      };
    } else {
      return {
        badge: 'bg-white text-black border-gray-300', // White background, black text
        scoreText: 'text-gray-300',
        scoreBorder: 'border-gray-600',
        hover: 'hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:border-white/40'
      };
    }
  };

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

        {/* Search Filters */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 mb-8">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {properties.map((property, index) => {
            const gradeColors = getGradeColors(property.grade);
            return (
              <PropertyCard
                key={`${property.id}-${index}`}
                property={property}
                isRental={false}
                onClick={() => setSelectedProperty(property)}
                gradeColors={gradeColors}
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
          isRental={false}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default Buy;
