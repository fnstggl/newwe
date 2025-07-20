import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetail from "@/components/PropertyDetail";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Property {
  id: string;
  address: string;
  neighborhood: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  images: string[];
  is_rental: boolean;
  is_featured: boolean;
  grade: number | null;
  isRentStabilized: boolean | null;
  created_at: string;
}

interface NeighborhoodOption {
  label: string;
  value: string;
}

const initialPriceRange = [0, 20000];
const initialBedroomFilter = 'any';
const initialBathroomFilter = 'any';
const initialNeighborhoodFilter = 'all';
const initialSortBy = 'newest';
const initialSearchQuery = '';

const Rent = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showFeatured, setShowFeatured] = useState(true);

  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [bedroomFilter, setBedroomFilter] = useState(initialBedroomFilter);
  const [bathroomFilter, setBathroomFilter] = useState(initialBathroomFilter);
  const [neighborhoodFilter, setNeighborhoodFilter] = useState(initialNeighborhoodFilter);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [neighborhoodOptions, setNeighborhoodOptions] = useState<NeighborhoodOption[]>([]);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
    fetchFeaturedProperties();
    fetchNeighborhoods();
  }, [priceRange, bedroomFilter, bathroomFilter, neighborhoodFilter, sortBy, searchQuery]);

  const fetchProperties = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching properties with filters:', {
        priceRange,
        bedroomFilter,
        bathroomFilter,
        neighborhoodFilter,
        sortBy,
        searchQuery
      });

      let query = supabase
        .from('properties')
        .select('*')
        .eq('is_rental', true);

      // Apply filters
      if (priceRange[0] > 0 || priceRange[1] < 20000) {
        query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);
      }

      if (bedroomFilter !== 'any') {
        if (bedroomFilter === '4+') {
          query = query.gte('bedrooms', 4);
        } else {
          query = query.eq('bedrooms', parseInt(bedroomFilter));
        }
      }

      if (bathroomFilter !== 'any') {
        if (bathroomFilter === '3+') {
          query = query.gte('bathrooms', 3);
        } else {
          query = query.eq('bathrooms', parseFloat(bathroomFilter));
        }
      }

      if (neighborhoodFilter !== 'all') {
        query = query.eq('neighborhood', neighborhoodFilter);
      }

      if (searchQuery) {
        query = query.or(`address.ilike.%${searchQuery}%,neighborhood.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'bedrooms':
          query = query.order('bedrooms', { ascending: false });
          break;
        case 'grade':
          query = query.order('grade', { ascending: false, nullsFirst: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      console.log('Fetched properties:', data?.length || 0);
      setProperties(data || []);
    } catch (err) {
      console.error('Error in fetchProperties:', err);
      setError('Failed to load properties. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        fetchProperties();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [priceRange, bedroomFilter, bathroomFilter, neighborhoodFilter, sortBy, searchQuery]);

  const fetchNeighborhoods = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('neighborhood')
        .eq('is_rental', true);

      if (error) throw error;

      const neighborhoods = [...new Set(data.map(item => item.neighborhood))]
        .sort()
        .map(neighborhood => ({
          label: neighborhood,
          value: neighborhood
        }));

      setNeighborhoodOptions([
        { label: 'All Neighborhoods', value: 'all' },
        ...neighborhoods
      ]);
    } catch (err) {
      console.error('Error fetching neighborhoods:', err);
    }
  };

  const fetchFeaturedProperties = async () => {
    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('is_rental', true)
        .eq('is_featured', true);

      switch (sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'bedrooms':
          query = query.order('bedrooms', { ascending: false });
          break;
        case 'grade':
          query = query.order('grade', { ascending: false, nullsFirst: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      setFeaturedProperties(data || []);
    } catch (err) {
      console.error('Error fetching featured properties:', err);
    }
  };

  const handlePropertyClick = (property: Property, index: number) => {
    setSelectedProperty(property);
  };

  const handlePriceChange = (newRange: number[]) => {
    setPriceRange(newRange);
  };

  const handleBedroomChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBedroomFilter(event.target.value);
  };

  const handleBathroomChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBathroomFilter(event.target.value);
  };

  const handleNeighborhoodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNeighborhoodFilter(event.target.value);
  };

  const handleSortByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const resetFilters = () => {
    setPriceRange(initialPriceRange);
    setBedroomFilter(initialBedroomFilter);
    setBathroomFilter(initialBathroomFilter);
    setNeighborhoodFilter(initialNeighborhoodFilter);
    setSortBy(initialSortBy);
    setSearchQuery(initialSearchQuery);
  };

  const getGradeColors = (grade: number | null, isRentStabilized: boolean | null) => {
    if (grade === null) {
      return {
        backgroundColor: 'bg-gray-500',
        textColor: 'text-white',
        borderColor: 'border-gray-500',
      };
    }
  
    let backgroundColor = '';
    let textColor = 'text-white';
    let borderColor = '';
  
    switch (true) {
      case grade >= 90:
        backgroundColor = 'bg-green-500';
        borderColor = 'border-green-500';
        break;
      case grade >= 80:
        backgroundColor = 'bg-blue-500';
        borderColor = 'border-blue-500';
        break;
      case grade >= 70:
        backgroundColor = 'bg-purple-500';
        borderColor = 'border-purple-500';
        break;
      case grade >= 60:
        backgroundColor = 'bg-yellow-500';
        textColor = 'text-black';
        borderColor = 'border-yellow-500';
        break;
      default:
        backgroundColor = 'bg-red-500';
        borderColor = 'border-red-500';
        break;
    }
  
    if (isRentStabilized) {
      backgroundColor = 'bg-orange-500';
      textColor = 'text-black';
      borderColor = 'border-orange-500';
    }
  
    return {
      backgroundColor: backgroundColor,
      textColor: textColor,
      borderColor: borderColor,
    };
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">Find Your Perfect Rental</h1>
        </div>
      </header>

      {/* Search Bar */}
      <section className="bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <input
            type="text"
            placeholder="Search by address, neighborhood, or description..."
            className="w-full px-4 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-gray-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button
              onClick={toggleFilters}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {isFilterOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-24 px-2 py-1 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange([parseInt(e.target.value), priceRange[1]])}
                  />
                  -
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-24 px-2 py-1 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bedrooms</label>
                <select
                  className="w-full px-4 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={bedroomFilter}
                  onChange={handleBedroomChange}
                >
                  <option value="any">Any</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4+</option>
                </select>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bathrooms</label>
                <select
                  className="w-full px-4 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={bathroomFilter}
                  onChange={handleBathroomChange}
                >
                  <option value="any">Any</option>
                  <option value="1">1</option>
                  <option value="1.5">1.5</option>
                  <option value="2">2</option>
                  <option value="2.5">2.5</option>
                  <option value="3+">3+</option>
                </select>
              </div>

              {/* Neighborhood */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Neighborhood</label>
                <select
                  className="w-full px-4 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={neighborhoodFilter}
                  onChange={handleNeighborhoodChange}
                >
                  {neighborhoodOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                <select
                  className="w-full px-4 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={sortBy}
                  onChange={handleSortByChange}
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="bedrooms">Bedrooms</option>
                  <option value="grade">Grade</option>
                </select>
              </div>

              {/* Reset Filters */}
              <div className="flex items-end">
                <Button
                  onClick={resetFilters}
                  className="bg-gray-500 hover:bg-gray-400 text-white"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Featured Properties Section */}
        {showFeatured && featuredProperties.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Featured Rentals</h2>
              <button
                onClick={() => setShowFeatured(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredProperties.map((property, index) => {
                const gradeColors = getGradeColors(property.grade, property.isRentStabilized);
                
                return (
                  <PropertyCard
                    key={`featured-${property.id}-${index}`}
                    property={property}
                    isRental={true}
                    onClick={() => handlePropertyClick(property, index)}
                    gradeColors={gradeColors}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Properties Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Found
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <Button 
                onClick={fetchProperties}
                className="bg-white text-black hover:bg-gray-200"
              >
                Try Again
              </Button>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No properties found matching your criteria.</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {properties.map((property, index) => {
                const gradeColors = getGradeColors(property.grade, property.isRentStabilized);
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
                        gradeColors={gradeColors}
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
          )}
        </section>
      </main>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          isRental={true}
        />
      )}
    </div>
  );
};

export default Rent;
