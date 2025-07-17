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

interface Property {
  id: string;
  created_at: string;
  address: string;
  neighborhood: string;
  monthly_rent: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  description: string;
  images: string[];
  latitude: number;
  longitude: number;
  walk_score: number;
  transit_score: number;
  bike_score: number;
  grade: string;
  score: number;
  discount_percent: number;
  likely_rented: boolean;
  rent_stabilized_confidence?: number;
  undervaluation_percent?: number;
}

interface Filters {
  neighborhood: string;
  bedrooms: string;
  bathrooms: string;
  priceRange: number[];
  sqftRange: number[];
  discountRange: number[];
  undervaluationRange: number[];
}

const Rent = () => {
  const [filters, setFilters] = useState<Filters>({
    neighborhood: 'all',
    bedrooms: 'all',
    bathrooms: 'all',
    priceRange: [0, 20000],
    sqftRange: [0, 10000],
    discountRange: [0, 100],
    undervaluationRange: [0, 100],
  });
  const [sortBy, setSortBy] = useState<string>('score');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState<string>('rentals');

  const neighborhoods = [
    "all", "Tribeca", "Midtown", "Upper East Side", "Financial District", "Greenwich Village",
    "Upper West Side", "Chelsea", "Lower East Side", "East Village", "SoHo", "Williamsburg",
    "Long Island City", "Park Slope", "DUMBO", "Fort Greene", "Boerum Hill", "Cobble Hill",
    "Carroll Gardens", "Red Hook", "Brooklyn Heights", "Downtown Brooklyn", "Clinton Hill",
    "Prospect Heights", "Crown Heights", "Flatbush", "Bushwick", "Greenpoint", "Astoria",
    "Sunnyside", "Forest Hills", "Jackson Heights", "Flushing", "Jamaica", "St. George",
    "Staten Island"
  ];

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const { data: rentalData, isLoading: rentalLoading } = useQuery({
    queryKey: ['rentals', filters],
    queryFn: async () => {
      let query = supabase
        .from('undervalued_rentals')
        .select('*')
        .eq('likely_rented', false);

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

      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 20000) {
        query = query.gte('monthly_rent', filters.priceRange[0]).lte('monthly_rent', filters.priceRange[1]);
      }

      if (filters.sqftRange[0] > 0 || filters.sqftRange[1] < 10000) {
        query = query.gte('sqft', filters.sqftRange[0]).lte('sqft', filters.sqftRange[1]);
      }

      if (filters.discountRange[0] > 0 || filters.discountRange[1] < 100) {
        query = query.gte('discount_percent', filters.discountRange[0]).lte('discount_percent', filters.discountRange[1]);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching rental data:', error);
        throw error;
      }

      // Client-side sorting
      let sortedData = data || [];
      switch (sortBy) {
        case 'price-low':
          sortedData = sortedData.sort((a, b) => a.monthly_rent - b.monthly_rent);
          break;
        case 'price-high':
          sortedData = sortedData.sort((a, b) => b.monthly_rent - a.monthly_rent);
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

  const { data: stabilizedData, isLoading: stabilizedLoading } = useQuery({
    queryKey: ['rent-stabilized', filters],
    queryFn: async () => {
      let query = supabase
        .from('undervalued_rent_stabilized')
        .select('*')
        .eq('likely_rented', false);

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

      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 20000) {
        query = query.gte('monthly_rent', filters.priceRange[0]).lte('monthly_rent', filters.priceRange[1]);
      }

      if (filters.sqftRange[0] > 0 || filters.sqftRange[1] < 10000) {
        query = query.gte('sqft', filters.sqftRange[0]).lte('sqft', filters.sqftRange[1]);
      }

      if (filters.undervaluationRange[0] > 0 || filters.undervaluationRange[1] < 100) {
        query = query.gte('undervaluation_percent', filters.undervaluationRange[0]).lte('undervaluation_percent', filters.undervaluationRange[1]);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching stabilized data:', error);
        throw error;
      }

      return data || [];
    },
    enabled: true
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header and Filters */}
      <div className="bg-gray-900 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold mb-4">Find Your Next Home</h1>

          {/* Tabs */}
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded-md ${activeTab === 'rentals' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              onClick={() => setActiveTab('rentals')}
            >
              Rentals
            </button>
            <button
              className={`px-4 py-2 rounded-md ${activeTab === 'rent-stabilized' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              onClick={() => setActiveTab('rent-stabilized')}
            >
              Rent Stabilized
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Neighborhood Filter */}
            <div>
              <Select onValueChange={(value) => handleFilterChange('neighborhood', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Neighborhood" />
                </SelectTrigger>
                <SelectContent>
                  {neighborhoods.map((neighborhood) => (
                    <SelectItem key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bedrooms Filter */}
            <div>
              <Select onValueChange={(value) => handleFilterChange('bedrooms', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="0">Studio</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bathrooms Filter */}
            <div>
              <Select onValueChange={(value) => handleFilterChange('bathrooms', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Bathrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="1.5">1.5</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Price Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <Slider
                    defaultValue={filters.priceRange}
                    max={20000}
                    step={100}
                    onValueChange={(value) => handleFilterChange('priceRange', value)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sqft Range Filter */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Sqft Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <Slider
                    defaultValue={filters.sqftRange}
                    max={10000}
                    step={100}
                    onValueChange={(value) => handleFilterChange('sqftRange', value)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>{filters.sqftRange[0]} sqft</span>
                    <span>{filters.sqftRange[1]} sqft</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Discount Range Filter (Rentals Tab) */}
            {activeTab === 'rentals' && (
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Discount %</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Slider
                      defaultValue={filters.discountRange}
                      max={100}
                      step={1}
                      onValueChange={(value) => handleFilterChange('discountRange', value)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>{filters.discountRange[0]}%</span>
                      <span>{filters.discountRange[1]}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Undervaluation Range Filter (Rent Stabilized Tab) */}
            {activeTab === 'rent-stabilized' && (
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Undervaluation %</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Slider
                      defaultValue={filters.undervaluationRange}
                      max={100}
                      step={1}
                      onValueChange={(value) => handleFilterChange('undervaluationRange', value)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>{filters.undervaluationRange[0]}%</span>
                      <span>{filters.undervaluationRange[1]}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Property Grids */}
      {activeTab === 'rentals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-w-7xl mx-auto">
          {rentalData?.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property}
              onClick={() => setSelectedProperty(property)}
            />
          ))}
        </div>
      )}

      {activeTab === 'rent-stabilized' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-w-7xl mx-auto">
          {stabilizedData?.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={{
                ...property,
                grade: 'A',
                score: property.rent_stabilized_confidence || 0
              }}
              onClick={() => setSelectedProperty(property)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Rent;
