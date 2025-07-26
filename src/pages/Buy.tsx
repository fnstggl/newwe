import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import PropertyCard from '@/components/PropertyCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Search, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PropertyDetail from '@/components/PropertyDetail';
import SoftGateModal from '@/components/SoftGateModal';

interface Property {
  id: string;
  address: string;
  grade: string;
  score: number;
  price: number;
  price_per_sqft: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  neighborhood: string;
  discount_percent: number;
  reasoning: string;
  images: string[];
  [key: string]: any;
}

interface Subscription {
  subscription_plan: string | null;
}

const Buy = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('discount_desc');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  const [softGateProperty, setSoftGateProperty] = useState<Property | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: properties, isLoading, error } = useQuery(
    ['properties'],
    async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*');
      if (error) {
        throw new Error(error.message);
      }
      return data as Property[];
    }
  );

  const { data: subscription, isLoading: isSubscriptionLoading, error: subscriptionError } = useQuery(
    ['subscription', user?.id],
    async () => {
      if (!user?.id) {
        return null;
      }
      const { data, error } = await supabase
        .from('user_profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data as Subscription;
    }
  );

  const filteredProperties = useMemo(() => {
    if (!properties) return [];

    let filtered = properties.filter(property =>
      property.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedGrades.length > 0) {
      filtered = filtered.filter(property => selectedGrades.includes(property.grade));
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      filtered = filtered.filter(property => property.price >= min);
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      filtered = filtered.filter(property => property.price <= max);
    }

    if (selectedNeighborhood) {
      filtered = filtered.filter(property => property.neighborhood === selectedNeighborhood);
    }

    return filtered;
  }, [properties, searchTerm, selectedGrades, minPrice, maxPrice, selectedNeighborhood]);

  const sortedProperties = useMemo(() => {
    if (!filteredProperties) return [];

    let sorted = [...filteredProperties];

    switch (sortBy) {
      case 'price_asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'discount_asc':
        sorted.sort((a, b) => a.discount_percent - b.discount_percent);
        break;
      case 'discount_desc':
        sorted.sort((a, b) => b.discount_percent - a.discount_percent);
        break;
      default:
        break;
    }

    return sorted;
  }, [filteredProperties, sortBy]);

  const filteredAndSortedProperties = sortedProperties;

  const handlePropertyClick = (property: Property) => {
    if (!user) {
      // For signed out users, show soft gate for blurred properties (index 3 and beyond)
      const propertyIndex = filteredAndSortedProperties.indexOf(property);
      if (propertyIndex >= 3) {
        setSoftGateProperty(property);
        return;
      }
    } else if (user && subscription?.subscription_plan === 'free') {
      // For free plan users, show soft gate for blurred properties (index 9 and beyond)
      const propertyIndex = filteredAndSortedProperties.indexOf(property);
      if (propertyIndex >= 9) {
        setSoftGateProperty(property);
        return;
      }
    }
    
    setSelectedProperty(property);
  };

  if (selectedProperty) {
    return (
      <PropertyDetail
        property={selectedProperty}
        onBack={() => setSelectedProperty(null)}
        isRental={false}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="bg-white/5 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Buy a home
            </h1>
            <Input
              type="search"
              placeholder="Search by address..."
              className="max-w-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-start items-center gap-4">
            {/* Grade Filter */}
            <div>
              <Select onValueChange={(value) => setSelectedGrades(value === 'all' ? [] : [value])}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Min Price"
                className="w-24"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="text-gray-400">-</span>
              <Input
                type="number"
                placeholder="Max Price"
                className="w-24"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            {/* Neighborhood Filter */}
            <div>
              <Select onValueChange={setSelectedNeighborhood}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Neighborhood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Neighborhoods</SelectItem>
                  <SelectItem value="Tribeca">Tribeca</SelectItem>
                  <SelectItem value="Chelsea">Chelsea</SelectItem>
                  <SelectItem value="Midtown">Midtown</SelectItem>
                  <SelectItem value="Upper East Side">Upper East Side</SelectItem>
                  <SelectItem value="Upper West Side">Upper West Side</SelectItem>
                  <SelectItem value="Financial District">Financial District</SelectItem>
                  <SelectItem value="Greenwich Village">Greenwich Village</SelectItem>
                  <SelectItem value="East Village">East Village</SelectItem>
                  <SelectItem value="Soho">Soho</SelectItem>
                  <SelectItem value="Lower East Side">Lower East Side</SelectItem>
                  <SelectItem value="Williamsburg">Williamsburg</SelectItem>
                  <SelectItem value="Park Slope">Park Slope</SelectItem>
                  <SelectItem value="Astoria">Astoria</SelectItem>
                  <SelectItem value="Long Island City">Long Island City</SelectItem>
                  <SelectItem value="DUMBO">DUMBO</SelectItem>
                  <SelectItem value="Brooklyn Heights">Brooklyn Heights</SelectItem>
                  <SelectItem value="Fort Greene">Fort Greene</SelectItem>
                  <SelectItem value="Clinton Hill">Clinton Hill</SelectItem>
                  <SelectItem value="Park Slope">Park Slope</SelectItem>
                  <SelectItem value="Carroll Gardens">Carroll Gardens</SelectItem>
                  <SelectItem value="Cobble Hill">Cobble Hill</SelectItem>
                  <SelectItem value="Boerum Hill">Boerum Hill</SelectItem>
                  <SelectItem value="Gowanus">Gowanus</SelectItem>
                  <SelectItem value="Prospect Heights">Prospect Heights</SelectItem>
                  <SelectItem value="Crown Heights">Crown Heights</SelectItem>
                  <SelectItem value="Bedford-Stuyvesant">Bedford-Stuyvesant</SelectItem>
                  <SelectItem value="Bushwick">Bushwick</SelectItem>
                  <SelectItem value="Greenpoint">Greenpoint</SelectItem>
                  <SelectItem value="Sunset Park">Sunset Park</SelectItem>
                  <SelectItem value="Bay Ridge">Bay Ridge</SelectItem>
                  <SelectItem value="Jackson Heights">Jackson Heights</SelectItem>
                  <SelectItem value="Flushing">Flushing</SelectItem>
                  <SelectItem value="Forest Hills">Forest Hills</SelectItem>
                  <SelectItem value="Kew Gardens">Kew Gardens</SelectItem>
                  <SelectItem value="Rego Park">Rego Park</SelectItem>
                  <SelectItem value="Sunnyside">Sunnyside</SelectItem>
                  <SelectItem value="Woodside">Woodside</SelectItem>
                  <SelectItem value="Elmhurst">Elmhurst</SelectItem>
                  <SelectItem value="Ridgewood">Ridgewood</SelectItem>
                  <SelectItem value="Astoria">Astoria</SelectItem>
                  <SelectItem value="LIC">LIC</SelectItem>
                  <SelectItem value="Roosevelt Island">Roosevelt Island</SelectItem>
                  <SelectItem value="Mott Haven">Mott Haven</SelectItem>
                  <SelectItem value="Concourse">Concourse</SelectItem>
                  <SelectItem value="Riverdale">Riverdale</SelectItem>
                  <SelectItem value="City Island">City Island</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <Select onValueChange={setSortBy}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount_desc">
                    Discount <ArrowUpDown className="ml-2 h-4 w-4" />
                  </SelectItem>
                  <SelectItem value="price_asc">
                    Price (Lowest to Highest) <ArrowUpDown className="ml-2 h-4 w-4" />
                  </SelectItem>
                  <SelectItem value="price_desc">
                    Price (Highest to Lowest) <ArrowUpDown className="ml-2 h-4 w-4" />
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-4 sticky top-20">
              <h4 className="text-lg font-semibold text-white">Filters</h4>
              
              {/* Grade Filter */}
              <div>
                <label className="block text-sm font-medium text-white">Grade</label>
                <Select onValueChange={(value) => setSelectedGrades(value === 'all' ? [] : [value])}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-white">Price Range</label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Min Price"
                    className="w-1/2"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max Price"
                    className="w-1/2"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Neighborhood Filter */}
              <div>
                <label className="block text-sm font-medium text-white">Neighborhood</label>
                <Select onValueChange={setSelectedNeighborhood}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Neighborhood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Neighborhoods</SelectItem>
                    <SelectItem value="Tribeca">Tribeca</SelectItem>
                    <SelectItem value="Chelsea">Chelsea</SelectItem>
                    <SelectItem value="Midtown">Midtown</SelectItem>
                    <SelectItem value="Upper East Side">Upper East Side</SelectItem>
                    <SelectItem value="Upper West Side">Upper West Side</SelectItem>
                    <SelectItem value="Financial District">Financial District</SelectItem>
                    <SelectItem value="Greenwich Village">Greenwich Village</SelectItem>
                    <SelectItem value="East Village">East Village</SelectItem>
                    <SelectItem value="Soho">Soho</SelectItem>
                    <SelectItem value="Lower East Side">Lower East Side</SelectItem>
                    <SelectItem value="Williamsburg">Williamsburg</SelectItem>
                    <SelectItem value="Park Slope">Park Slope</SelectItem>
                    <SelectItem value="Astoria">Astoria</SelectItem>
                    <SelectItem value="Long Island City">Long Island City</SelectItem>
                    <SelectItem value="DUMBO">DUMBO</SelectItem>
                    <SelectItem value="Brooklyn Heights">Brooklyn Heights</SelectItem>
                    <SelectItem value="Fort Greene">Fort Greene</SelectItem>
                    <SelectItem value="Clinton Hill">Clinton Hill</SelectItem>
                    <SelectItem value="Park Slope">Park Slope</SelectItem>
                    <SelectItem value="Carroll Gardens">Carroll Gardens</SelectItem>
                    <SelectItem value="Cobble Hill">Cobble Hill</SelectItem>
                    <SelectItem value="Boerum Hill">Boerum Hill</SelectItem>
                    <SelectItem value="Gowanus">Gowanus</SelectItem>
                    <SelectItem value="Prospect Heights">Prospect Heights</SelectItem>
                    <SelectItem value="Crown Heights">Crown Heights</SelectItem>
                    <SelectItem value="Bedford-Stuyvesant">Bedford-Stuyvesant</SelectItem>
                    <SelectItem value="Bushwick">Bushwick</SelectItem>
                    <SelectItem value="Greenpoint">Greenpoint</SelectItem>
                    <SelectItem value="Sunset Park">Sunset Park</SelectItem>
                    <SelectItem value="Bay Ridge">Bay Ridge</SelectItem>
                    <SelectItem value="Jackson Heights">Jackson Heights</SelectItem>
                    <SelectItem value="Flushing">Flushing</SelectItem>
                    <SelectItem value="Forest Hills">Forest Hills</SelectItem>
                    <SelectItem value="Kew Gardens">Kew Gardens</SelectItem>
                    <SelectItem value="Rego Park">Rego Park</SelectItem>
                    <SelectItem value="Sunnyside">Sunnyside</SelectItem>
                    <SelectItem value="Woodside">Woodside</SelectItem>
                    <SelectItem value="Elmhurst">Elmhurst</SelectItem>
                    <SelectItem value="Ridgewood">Ridgewood</SelectItem>
                    <SelectItem value="Astoria">Astoria</SelectItem>
                    <SelectItem value="LIC">LIC</SelectItem>
                    <SelectItem value="Roosevelt Island">Roosevelt Island</SelectItem>
                    <SelectItem value="Mott Haven">Mott Haven</SelectItem>
                    <SelectItem value="Concourse">Concourse</SelectItem>
                    <SelectItem value="Riverdale">Riverdale</SelectItem>
                    <SelectItem value="City Island">City Island</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedProperties.map((property, index) => {
                // Determine if this property should be blurred
                const shouldBlur = !user ? index >= 3 : (user && subscription?.subscription_plan === 'free' && index >= 9);
                
                // Show CTA in the middle of the first blurred row
                const showCTA = !user ? index === 3 : (user && subscription?.subscription_plan === 'free' && index === 9);

                if (showCTA) {
                  return (
                    <div key={`cta-${index}`} className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md border border-blue-500/30 rounded-2xl z-10 flex items-center justify-center">
                        <div className="text-center p-8 space-y-4">
                          <h3 className="text-2xl font-bold text-white">
                            {!user ? 'Sign up to see more deals' : 'Upgrade to see more deals'}
                          </h3>
                          <p className="text-gray-300">
                            {!user 
                              ? 'Join 6000+ New Yorkers finding below-market homes'
                              : 'Access all undervalued properties for $3/month'
                            }
                          </p>
                          <Button 
                            onClick={() => navigate(!user ? '/join' : '/pricing')}
                            className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl"
                          >
                            {!user ? 'Join Free' : 'Upgrade Now'}
                          </Button>
                        </div>
                      </div>
                      <div className="filter blur-sm">
                        <PropertyCard
                          property={property}
                          onClick={() => {}}
                          isRental={false}
                        />
                      </div>
                    </div>
                  );
                }

                return (
                  <div 
                    key={property.id} 
                    className={shouldBlur ? 'filter blur-sm' : ''}
                  >
                    <PropertyCard
                      property={property}
                      onClick={() => handlePropertyClick(property)}
                      isRental={false}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <SoftGateModal
        isOpen={!!softGateProperty}
        onClose={() => setSoftGateProperty(null)}
        property={softGateProperty || {}}
        isRental={false}
      />
    </div>
  );
};

export default Buy;
