import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../utils/supabaseClient';
import PropertyCard from '../components/PropertyCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

const Rent = () => {
  const [filters, setFilters] = useState({
    neighborhood: '',
    bedrooms: '',
    bathrooms: '',
    priceRange: '',
    sortBy: 'createdAt',
  });
  const [activeTab, setActiveTab] = useState('all-rentals');

  useEffect(() => {
    // Update meta tags for SEO - Rent page
    document.title = "NYC Apartments for Rent | Find Undervalued & Rent-Stabilized Deals";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover undervalued apartments and rent-stabilized deals in NYC. Use our AI-powered search to find your next home.');
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'NYC Apartments for Rent | Find Undervalued & Rent-Stabilized Deals');
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', 'Discover undervalued apartments and rent-stabilized deals in NYC. Use our AI-powered search to find your next home.');
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', 'https://realerestate.org/rent');

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', 'NYC Apartments for Rent | Find Undervalued & Rent-Stabilized Deals');
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', 'Discover undervalued apartments and rent-stabilized deals in NYC.');
    
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute('content', 'https://realerestate.org/rent');

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://realerestate.org/rent');
  }, []);

  const { data: rentalsData, isLoading } = useQuery({
    queryKey: ['undervalued-rentals', filters, activeTab],
    queryFn: async () => {
      console.log('Fetching rentals data with filters:', filters, 'activeTab:', activeTab);
      
      let query;
      
      if (activeTab === 'rent-stabilized') {
        query = supabase
          .from('undervalued_rent_stabilized')
          .select('*')
          .eq('likely_rented', false);
      } else {
        query = supabase
          .from('undervalued_rentals')
          .select('*')
          .eq('likely_rented', false);
      }

      // Apply filters
      if (filters.neighborhood) {
        query = query.eq('neighborhood', filters.neighborhood);
      }
      
      if (filters.bedrooms) {
        query = query.eq('bedrooms', parseInt(filters.bedrooms));
      }
      
      if (filters.bathrooms) {
        query = query.eq('bathrooms', parseInt(filters.bathrooms));
      }
      
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(p => parseInt(p.replace(/[^\d]/g, '')));
        query = query.gte('monthly_rent', min);
        if (max) {
          query = query.lte('monthly_rent', max);
        }
      }

      // Apply sorting - removed nullsLast
      if (filters.sortBy === 'savings') {
        if (activeTab === 'rent-stabilized') {
          query = query.order('potential_monthly_savings', { ascending: false });
        } else {
          query = query.order('discount_percent', { ascending: false });
        }
      } else if (filters.sortBy === 'price') {
        query = query.order('monthly_rent', { ascending: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(50);
      
      if (error) {
        console.error('Error fetching rentals data:', error);
        throw error;
      }
      
      console.log('Fetched rentals data:', data);
      return data || [];
    }
  });

  const { data: stabilizedData, isLoading: isLoadingStabilized } = useQuery({
    queryKey: ['rent-stabilized-only', filters],
    queryFn: async () => {
      if (activeTab !== 'rent-stabilized') return [];
      
      console.log('Fetching rent stabilized data with filters:', filters);
      
      let query = supabase
        .from('undervalued_rent_stabilized')
        .select('*')
        .eq('likely_rented', false);

      // Apply filters
      if (filters.neighborhood) {
        query = query.eq('neighborhood', filters.neighborhood);
      }
      
      if (filters.bedrooms) {
        query = query.eq('bedrooms', parseInt(filters.bedrooms));
      }
      
      if (filters.bathrooms) {
        query = query.eq('bathrooms', parseInt(filters.bathrooms));
      }
      
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(p => parseInt(p.replace(/[^\d]/g, '')));
        query = query.gte('monthly_rent', min);
        if (max) {
          query = query.lte('monthly_rent', max);
        }
      }

      // Apply sorting - removed nullsLast
      if (filters.sortBy === 'savings') {
        query = query.order('potential_monthly_savings', { ascending: false });
      } else if (filters.sortBy === 'price') {
        query = query.order('monthly_rent', { ascending: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(50);
      
      if (error) {
        console.error('Error fetching rent stabilized data:', error);
        throw error;
      }
      
      console.log('Fetched rent stabilized data:', data);
      return data || [];
    },
    enabled: activeTab === 'rent-stabilized'
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSortChange = (value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      sortBy: value,
    }));
  };

  const handlePriceRangeChange = (value: number[]) => {
		const min = value[0];
		const max = value[1];
		setFilters(prevFilters => ({
			...prevFilters,
			priceRange: `${min}-${max}`,
		}));
	};

  const neighborhoods = [
    "Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"
  ];

  const bedrooms = ["Studio", "1", "2", "3", "4+"];

  const bathrooms = ["1", "1.5", "2", "2.5", "3+"];

  const priceRanges = [
    "Under $2,000", "$2,000 - $3,000", "$3,000 - $4,000", "$4,000 - $5,000", "Over $5,000"
  ];

  const combinedData = activeTab === 'rent-stabilized' ? stabilizedData : rentalsData;

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-semibold mb-6 tracking-tight">Find Your Next Home in NYC</h1>

          <Tabs defaultValue="all-rentals" className="w-full mb-8" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all-rentals">All Rentals</TabsTrigger>
              <TabsTrigger value="rent-stabilized">Rent-Stabilized</TabsTrigger>
            </TabsList>
            <Separator className="bg-gray-700 my-4" />
            <TabsContent value="all-rentals">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Neighborhood Filter */}
                <div>
                  <Label htmlFor="neighborhood" className="block text-sm font-medium text-gray-300">Neighborhood</Label>
                  <Select name="neighborhood" onValueChange={(value) => setFilters(prev => ({...prev, neighborhood: value}))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a neighborhood" />
                    </SelectTrigger>
                    <SelectContent>
                      {neighborhoods.map(neighborhood => (
                        <SelectItem key={neighborhood} value={neighborhood}>{neighborhood}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bedrooms Filter */}
                <div>
                  <Label htmlFor="bedrooms" className="block text-sm font-medium text-gray-300">Bedrooms</Label>
                  <Select name="bedrooms" onValueChange={(value) => setFilters(prev => ({...prev, bedrooms: value}))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      {bedrooms.map(bedroom => (
                        <SelectItem key={bedroom} value={bedroom}>{bedroom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bathrooms Filter */}
                <div>
                  <Label htmlFor="bathrooms" className="block text-sm font-medium text-gray-300">Bathrooms</Label>
                  <Select name="bathrooms" onValueChange={(value) => setFilters(prev => ({...prev, bathrooms: value}))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      {bathrooms.map(bathroom => (
                        <SelectItem key={bathroom} value={bathroom}>{bathroom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By Filter */}
                <div>
                  <Label htmlFor="sort" className="block text-sm font-medium text-gray-300">Sort By</Label>
                  <Select onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Most Recent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Most Recent</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="rent-stabilized">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Neighborhood Filter */}
                <div>
                  <Label htmlFor="neighborhood" className="block text-sm font-medium text-gray-300">Neighborhood</Label>
                  <Select name="neighborhood" onValueChange={(value) => setFilters(prev => ({...prev, neighborhood: value}))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a neighborhood" />
                    </SelectTrigger>
                    <SelectContent>
                      {neighborhoods.map(neighborhood => (
                        <SelectItem key={neighborhood} value={neighborhood}>{neighborhood}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bedrooms Filter */}
                <div>
                  <Label htmlFor="bedrooms" className="block text-sm font-medium text-gray-300">Bedrooms</Label>
                  <Select name="bedrooms" onValueChange={(value) => setFilters(prev => ({...prev, bedrooms: value}))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      {bedrooms.map(bedroom => (
                        <SelectItem key={bedroom} value={bedroom}>{bedroom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bathrooms Filter */}
                <div>
                  <Label htmlFor="bathrooms" className="block text-sm font-medium text-gray-300">Bathrooms</Label>
                  <Select name="bathrooms" onValueChange={(value) => setFilters(prev => ({...prev, bathrooms: value}))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      {bathrooms.map(bathroom => (
                        <SelectItem key={bathroom} value={bathroom}>{bathroom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By Filter */}
                <div>
                  <Label htmlFor="sort" className="block text-sm font-medium text-gray-300">Sort By</Label>
                  <Select onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Most Recent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Most Recent</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mb-6">
						<Label htmlFor="priceRange" className="block text-sm font-medium text-gray-300">Price Range (Monthly)</Label>
						<Slider
							defaultValue={[1000, 5000]}
							max={10000}
							step={100}
							aria-label="price"
							onValueChange={(value) => {
								handlePriceRangeChange(value)
							}}
						/>
						<div className="mt-2 text-gray-400 text-sm">
							Range: $1,000 - $10,000
						</div>
					</div>

          {isLoading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {combinedData && combinedData.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Rent;
