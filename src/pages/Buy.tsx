import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabaseClient';
import { Select } from "@/components/ui/select"
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Link } from 'react-router-dom';
import { HoverButton } from '@/components/ui/hover-button';
import { ArrowRight } from 'lucide-react';

const Buy = () => {
  const [filters, setFilters] = useState({
    neighborhood: '',
    bedrooms: '',
    bathrooms: '',
    priceRange: '',
    sortBy: 'createdAt',
  });

  useEffect(() => {
    // Update meta tags for SEO - Buy page
    document.title = "Find Undervalued Properties for Sale in NYC | Realer Estate";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover undervalued properties for sale in NYC with Realer Estate. Our AI-powered platform helps you find the best deals on apartments and homes.');
    }
  }, []);

  const { data: salesData, isLoading } = useQuery({
    queryKey: ['undervalued-sales', filters],
    queryFn: async () => {
      console.log('Fetching sales data with filters:', filters);
      
      let query = supabase
        .from('undervalued_sales')
        .select('*')
        .eq('likely_sold', false);

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
        query = query.gte('price', min);
        if (max) {
          query = query.lte('price', max);
        }
      }

      // Apply sorting - removed nullsLast
      if (filters.sortBy === 'savings') {
        query = query.order('discount_percent', { ascending: false });
      } else if (filters.sortBy === 'price') {
        query = query.order('price', { ascending: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(50);
      
      if (error) {
        console.error('Error fetching sales data:', error);
        throw error;
      }
      
      console.log('Fetched sales data:', data);
      return data || [];
    }
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    const min = value[0] * 10000;
    const max = value[1] === 100 ? null : value[1] * 10000;
    const priceRange = max ? `${min}-${max}` : `${min}-`;
    handleFilterChange('priceRange', priceRange);
  };

  const formatPrice = (value: number) => {
    const price = value * 10000;
    return price >= 1000000 ? `${price / 1000000}M` : `${price / 1000}K`;
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold mb-8 tracking-tighter">
          Find Undervalued Properties for Sale
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Select onValueChange={(value) => handleFilterChange('neighborhood', value)}>
            <SelectTrigger className="col-span-1 md:col-span-1">
              <SelectValue placeholder="Neighborhood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Neighborhoods</SelectItem>
              <SelectItem value="SoHo">SoHo</SelectItem>
              <SelectItem value="Tribeca">Tribeca</SelectItem>
              <SelectItem value="Greenwich Village">Greenwich Village</SelectItem>
              <SelectItem value="East Village">East Village</SelectItem>
              <SelectItem value="Upper East Side">Upper East Side</SelectItem>
              <SelectItem value="Upper West Side">Upper West Side</SelectItem>
              <SelectItem value="Midtown">Midtown</SelectItem>
              <SelectItem value="Financial District">Financial District</SelectItem>
              <SelectItem value="Brooklyn Heights">Brooklyn Heights</SelectItem>
              <SelectItem value="Williamsburg">Williamsburg</SelectItem>
              <SelectItem value="DUMBO">DUMBO</SelectItem>
              <SelectItem value="Park Slope">Park Slope</SelectItem>
              <SelectItem value="Fort Greene">Fort Greene</SelectItem>
              <SelectItem value="Bushwick">Bushwick</SelectItem>
              <SelectItem value="Astoria">Astoria</SelectItem>
              <SelectItem value="Long Island City">Long Island City</SelectItem>
              <SelectItem value="Sunnyside">Sunnyside</SelectItem>
              <SelectItem value="Forest Hills">Forest Hills</SelectItem>
              <SelectItem value="Flushing">Flushing</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleFilterChange('bedrooms', value)}>
            <SelectTrigger className="col-span-1 md:col-span-1">
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3+</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleFilterChange('bathrooms', value)}>
            <SelectTrigger className="col-span-1 md:col-span-1">
              <SelectValue placeholder="Bathrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2+</SelectItem>
            </SelectContent>
          </Select>

          <div className="col-span-1 md:col-span-2">
            <p className="text-sm text-gray-400 mb-2">Price Range (Thousands)</p>
            <Slider
              defaultValue={[0, 100]}
              max={100}
              step={1}
              onValueChange={handlePriceRangeChange}
              aria-label="Price range"
              className="text-white"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>0K</span>
              <span>1M+</span>
            </div>
          </div>
        </div>

        {/* Sorting */}
        <div className="mb-8">
          <Select onValueChange={(value) => handleFilterChange('sortBy', value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest</SelectItem>
              <SelectItem value="price">Price (Lowest)</SelectItem>
              <SelectItem value="savings">Savings (Highest)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {isLoading ? (
          <p className="text-gray-500">Loading undervalued sales...</p>
        ) : salesData && salesData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {salesData.map((sale) => (
              <Card key={sale.id} className="bg-gray-900/50 border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold tracking-tight">{sale.address}</CardTitle>
                  <CardDescription className="text-gray-400 tracking-tight">
                    {sale.neighborhood}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold tracking-tight">${sale.price.toLocaleString()}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {sale.bedrooms} Bed
                      </Badge>
                      <Badge variant="secondary">
                        {sale.bathrooms} Bath
                      </Badge>
                      {sale.discount_percent > 0 && (
                        <Badge className="bg-green-600 text-white">
                          {sale.discount_percent}% Savings
                        </Badge>
                      )}
                    </div>
                    <Separator className="my-4" />
                    <p className="text-gray-300 tracking-tight">
                      {sale.description?.substring(0, 100)}...
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <p className="text-sm text-gray-500 tracking-tight">
                    Posted {new Date(sale.created_at).toLocaleDateString()}
                  </p>
                  <Link to={`/property/${sale.id}`}>
                    <HoverButton>
                      View Deal <ArrowRight className="ml-2 h-4 w-4" />
                    </HoverButton>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No undervalued sales found with the current filters.</p>
        )}
      </section>
    </div>
  );
};

export default Buy;
