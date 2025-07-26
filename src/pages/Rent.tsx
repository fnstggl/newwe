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

interface RentalProperty {
  id: string;
  address: string;
  grade: string;
  score: number;
  monthly_rent: number;
  rent_per_sqft: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  neighborhood: string;
  discount_percent: number;
  reasoning: string;
  images: string[];
  isRentStabilized: boolean;
}

interface Subscription {
  subscription_plan: string | null;
}

const Rent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('discount_desc');
  const [selectedProperty, setSelectedProperty] = useState<RentalProperty | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  const [softGateProperty, setSoftGateProperty] = useState<RentalProperty | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['rentals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rentals')
        .select('*');

      if (error) {
        console.error('Error fetching rentals:', error);
        throw new Error(error.message);
      }
      return data as RentalProperty[];
    },
  });

  const { data: subscription, isLoading: isSubscriptionLoading, error: subscriptionError } = useQuery<Subscription>({
    queryKey: ['subscription'],
    queryFn: async () => {
      if (!user) {
        return { subscription_plan: null };
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching subscription:', error);
        throw new Error(error.message);
      }
      return data as Subscription;
    },
    enabled: !!user,
  });

  const filteredProperties = useMemo(() => {
    if (!properties) return [];

    let filtered = [...properties];

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGrades.length > 0) {
      filtered = filtered.filter(property =>
        selectedGrades.includes(property.grade)
      );
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      filtered = filtered.filter(property => property.monthly_rent >= min);
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      filtered = filtered.filter(property => property.monthly_rent <= max);
    }

    if (selectedNeighborhood) {
      filtered = filtered.filter(property =>
        property.neighborhood === selectedNeighborhood
      );
    }

    return filtered;
  }, [properties, searchTerm, selectedGrades, minPrice, maxPrice, selectedNeighborhood]);

  const sortedProperties = useMemo(() => {
    if (!filteredProperties) return [];

    let sorted = [...filteredProperties];

    switch (sortBy) {
      case 'price_asc':
        sorted.sort((a, b) => a.monthly_rent - b.monthly_rent);
        break;
      case 'price_desc':
        sorted.sort((a, b) => b.monthly_rent - a.monthly_rent);
        break;
      case 'sqft_asc':
        sorted.sort((a, b) => a.sqft - b.sqft);
        break;
      case 'sqft_desc':
        sorted.sort((a, b) => b.sqft - a.sqft);
        break;
      case 'discount_asc':
        sorted.sort((a, b) => a.discount_percent - b.discount_percent);
        break;
      case 'discount_desc':
      default:
        sorted.sort((a, b) => b.discount_percent - a.discount_percent);
        break;
    }

    return sorted;
  }, [filteredProperties, sortBy]);

    const filteredAndSortedProperties = useMemo(() => {
        if (!properties) return [];

        let filtered = [...properties];

        if (searchTerm) {
            filtered = filtered.filter(property =>
                property.address.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedGrades.length > 0) {
            filtered = filtered.filter(property =>
                selectedGrades.includes(property.grade)
            );
        }

        if (minPrice) {
            const min = parseFloat(minPrice);
            filtered = filtered.filter(property => property.monthly_rent >= min);
        }

        if (maxPrice) {
            const max = parseFloat(maxPrice);
            filtered = filtered.filter(property => property.monthly_rent <= max);
        }

        if (selectedNeighborhood) {
            filtered = filtered.filter(property =>
                property.neighborhood === selectedNeighborhood
            );
        }

        let sorted = [...filtered];

        switch (sortBy) {
            case 'price_asc':
                sorted.sort((a, b) => a.monthly_rent - b.monthly_rent);
                break;
            case 'price_desc':
                sorted.sort((a, b) => b.monthly_rent - a.monthly_rent);
                break;
            case 'sqft_asc':
                sorted.sort((a, b) => a.sqft - b.sqft);
                break;
            case 'sqft_desc':
                sorted.sort((a, b) => b.sqft - a.sqft);
                break;
            case 'discount_asc':
                sorted.sort((a, b) => a.discount_percent - b.discount_percent);
                break;
            case 'discount_desc':
            default:
                sorted.sort((a, b) => b.discount_percent - a.discount_percent);
                break;
        }

        return sorted;
    }, [properties, searchTerm, selectedGrades, minPrice, maxPrice, selectedNeighborhood, sortBy]);

  const handlePropertyClick = (property: RentalProperty) => {
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

  const gradeOptions = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D'];

  const neighborhoodOptions = useMemo(() => {
    if (!properties) return [];
    return [...new Set(properties.map(property => property.neighborhood))];
  }, [properties]);

  if (selectedProperty) {
    return (
      <PropertyDetail
        property={selectedProperty}
        onBack={() => setSelectedProperty(null)}
        isRental={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="bg-black/40 py-4 border-b border-white/5">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            NYC Rentals
          </h1>
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Search by address..."
              className="bg-gray-800 text-white rounded-full px-5 py-2 focus-visible:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="secondary" className="rounded-full">
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="bg-black/30 rounded-2xl p-6 space-y-6 backdrop-blur-md border border-white/5">
              <div>
                <h3 className="text-lg font-semibold text-white">Filter by Grade</h3>
                <div className="mt-2 space-y-1">
                  {gradeOptions.map(grade => (
                    <label key={grade} className="flex items-center space-x-2 text-white/80">
                      <Input
                        type="checkbox"
                        className="rounded-sm text-blue-500 focus:ring-blue-500"
                        checked={selectedGrades.includes(grade)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedGrades([...selectedGrades, grade]);
                          } else {
                            setSelectedGrades(selectedGrades.filter(g => g !== grade));
                          }
                        }}
                      />
                      <span>{grade}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">Filter by Price</h3>
                <div className="mt-2 flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    className="bg-gray-800 text-white rounded-md px-3 py-2 focus-visible:ring-blue-500"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    className="bg-gray-800 text-white rounded-md px-3 py-2 focus-visible:ring-blue-500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">Filter by Neighborhood</h3>
                <Select onValueChange={setSelectedNeighborhood}>
                  <SelectTrigger className="w-full bg-gray-800 text-white rounded-md px-3 py-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select a neighborhood" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white rounded-md">
                    {neighborhoodOptions.map(neighborhood => (
                      <SelectItem key={neighborhood} value={neighborhood}>
                        {neighborhood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">Sort By</h3>
                <Select onValueChange={setSortBy}>
                  <SelectTrigger className="w-full bg-gray-800 text-white rounded-md px-3 py-2 focus:ring-blue-500">
                    <SelectValue placeholder="Discount (High to Low)" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white rounded-md">
                    <SelectItem value="discount_desc">
                      Discount <ArrowUpDown className="inline-block w-4 h-4" />
                    </SelectItem>
                    <SelectItem value="discount_asc">
                      Discount (Low to High) <ArrowUpDown className="inline-block w-4 h-4" />
                    </SelectItem>
                    <SelectItem value="price_desc">
                      Price (High to Low) <ArrowUpDown className="inline-block w-4 h-4" />
                    </SelectItem>
                    <SelectItem value="price_asc">
                      Price (Low to High) <ArrowUpDown className="inline-block w-4 h-4" />
                    </SelectItem>
                    <SelectItem value="sqft_desc">
                      Sqft (High to Low) <ArrowUpDown className="inline-block w-4 h-4" />
                    </SelectItem>
                    <SelectItem value="sqft_asc">
                      Sqft (Low to High) <ArrowUpDown className="inline-block w-4 h-4" />
                    </SelectItem>
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
                          isRental={true}
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
                      isRental={true}
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
        isRental={true}
      />
    </div>
  );
};

export default Rent;
