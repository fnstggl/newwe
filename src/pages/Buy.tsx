import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard from "@/components/PropertyCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, DollarSign, Home, TrendingDown, Building2, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface SalesProperty {
  id: string;
  address: string;
  neighborhood: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  discount_percent: number;
  images: string[];
  description: string;
  created_at: string;
  likely_sold: boolean;
  grade: string;
  score: number;
  lat: number;
  lng: number;
  building_type: string;
  year_built: number;
  monthly_taxes: number;
  monthly_hoa: number;
  days_on_market: number;
  price_history: any[];
  walk_score: number;
  transit_score: number;
  bike_score: number;
  address_score: number;
  safety_score: number;
  school_score: number;
  quality_of_life_score: number;
  deal_score: number;
  [key: string]: any;
}

interface Filters {
  neighborhood: string;
  bedrooms: string;
  bathrooms: string;
  priceRange: number[];
  sqftRange: number[];
  discountRange: number[];
}

const Buy = () => {
  const [filters, setFilters] = useState<Filters>({
    neighborhood: 'all',
    bedrooms: 'all',
    bathrooms: 'all',
    priceRange: [0, 5000000],
    sqftRange: [0, 10000],
    discountRange: [0, 100],
  });
  const [sortBy, setSortBy] = useState('score');
  const [selectedProperty, setSelectedProperty] = useState<SalesProperty | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const { data: salesData, isLoading, error } = useQuery({
    queryKey: ['sales', filters],
    queryFn: async () => {
      let query = supabase
        .from('undervalued_sales')
        .select('*')
        .eq('likely_sold', false);

      if (filters.neighborhood && filters.neighborhood !== 'all') {
        query = query.eq('neighborhood', filters.neighborhood);
      }

      if (filters.bedrooms && filters.bedrooms !== 'all') {
        const bedroomValue = Number(filters.bedrooms);
        query = query.eq('bedrooms', bedroomValue);
      }

      if (filters.bathrooms && filters.bathrooms !== 'all') {
        const bathroomValue = Number(filters.bathrooms);
        query = query.eq('bathrooms', bathroomValue);
      }

      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000000) {
        query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);
      }

      if (filters.sqftRange[0] > 0 || filters.sqftRange[1] < 10000) {
        query = query.gte('sqft', filters.sqftRange[0]).lte('sqft', filters.sqftRange[1]);
      }

      if (filters.discountRange[0] > 0 || filters.discountRange[1] < 100) {
        query = query.gte('discount_percent', filters.discountRange[0]).lte('discount_percent', filters.discountRange[1]);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching sales data:', error);
        throw error;
      }

      // Client-side sorting
      let sortedData = data || [];
      switch (sortBy) {
        case 'price-low':
          sortedData = sortedData.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          sortedData = sortedData.sort((a, b) => b.price - a.price);
          break;
        case 'discount':
          sortedData = sortedData.sort((a, b) => b.discount_percent - a.discount_percent);
          break;
        case 'newest':
          sortedData = sortedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        default:
          sortedData = sortedData.sort((a, b) => b.score - a.score);
      }

      return sortedData;
    },
    enabled: true
  });

  const neighborhoods = [
    "All", "SoHo", "Tribeca", "Greenwich Village", "East Village", "Lower East Side",
    "Chelsea", "Midtown", "Upper West Side", "Upper East Side", "Harlem", "Brooklyn Heights",
    "DUMBO", "Williamsburg", "Greenpoint", "Park Slope", "Fort Greene", "Bushwick",
    "Astoria", "Long Island City", "Jackson Heights", "Flushing", "Forest Hills", "Kew Gardens"
  ];

  if (isLoading) return <div className="min-h-screen bg-black text-white">Loading...</div>;
  if (error) return <div className="min-h-screen bg-black text-white">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="py-6 px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Undervalued Sales</h1>
          <div className="space-x-4">
            <select
              className="bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="score">Best Match</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="discount">Discount</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Neighborhood Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Neighborhood</label>
            <Select onValueChange={(value) => handleFilterChange('neighborhood', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a neighborhood" />
              </SelectTrigger>
              <SelectContent>
                {neighborhoods.map((neighborhood) => (
                  <SelectItem key={neighborhood} value={neighborhood.toLowerCase() === 'all' ? 'all' : neighborhood}>
                    {neighborhood}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bedrooms Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bedrooms</label>
            <Select onValueChange={(value) => handleFilterChange('bedrooms', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="0">Studio</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bathrooms Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bathrooms</label>
            <Select onValueChange={(value) => handleFilterChange('bathrooms', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="1.5">1.5</SelectItem>
                <SelectItem value="2">2+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Filter */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-300 mb-2">Price Range (${filters.priceRange[0]} - ${filters.priceRange[1]})</label>
            <Slider
              defaultValue={filters.priceRange}
              max={5000000}
              step={10000}
              onValueChange={(value) => handleFilterChange('priceRange', value)}
            />
          </div>

          {/* Sqft Range Filter */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-300 mb-2">Square Footage ({filters.sqftRange[0]} - {filters.sqftRange[1]} sqft)</label>
            <Slider
              defaultValue={filters.sqftRange}
              max={10000}
              step={100}
              onValueChange={(value) => handleFilterChange('sqftRange', value)}
            />
          </div>

          {/* Discount Range Filter */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-300 mb-2">Discount ({filters.discountRange[0]}% - {filters.discountRange[1]}%)</label>
            <Slider
              defaultValue={filters.discountRange}
              max={100}
              step={1}
              onValueChange={(value) => handleFilterChange('discountRange', value)}
            />
          </div>
        </div>
      </section>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-w-7xl mx-auto">
        {salesData?.map((property) => (
          <PropertyCard 
            key={property.id} 
            property={property}
            onClick={() => setSelectedProperty(property)}
          />
        ))}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-900 rounded-2xl max-w-3xl w-full mx-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">{selectedProperty.address}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <img src={selectedProperty.images[0]} alt={selectedProperty.address} className="w-full rounded-md h-64 object-cover" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedProperty.neighborhood}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span>${selectedProperty.price}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Home className="w-4 h-4" />
                    <span>{selectedProperty.bedrooms} Beds / {selectedProperty.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Building2 className="w-4 h-4" />
                    <span>{selectedProperty.sqft} sqft</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedProperty.days_on_market} Days on Market</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <TrendingDown className="w-4 h-4" />
                    <span>{selectedProperty.discount_percent}% Discount</span>
                  </div>
                </div>
                <p className="text-gray-300">{selectedProperty.description}</p>
                <button onClick={() => setSelectedProperty(null)} className="bg-blue-500 text-white rounded-md px-4 py-2 mt-4">Close</button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buy;
