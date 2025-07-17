import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '@/components/PropertyCard';
import Filter from '@/components/Filter';
import AdditionalFilters from '@/components/AdditionalFilters';
import { neighborhoodsByBorough } from '@/lib/neighborhoods';
import { BeatLoader } from 'react-spinners';
import { useToast } from "@/components/ui/use-toast"

const ITEMS_PER_PAGE = 12;

interface Property {
  id: number;
  address: string;
  monthly_rent: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  neighborhood: string;
  zipcode: string;
  building_grade: string;
  score: number;
  discount_percent: number;
  days_on_market: number;
  url: string;
  latitude: number;
  longitude: number;
  type?: 'regular' | 'rent_stabilized';
  undervaluation_percent?: number;
  undervaluation_confidence?: number;
}

interface FilterState {
  neighborhoods: string[];
  zipCode: string;
  maxPrice: number;
  bedrooms: string;
  minGrade: string;
  rentStabilized: boolean;
}

interface AdditionalFilterState {
  boroughs: string[];
  minSqft: number;
  address: string;
  minDiscount: number;
  sortBy: string;
}

const Rent = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast()

  const initialFilters: FilterState = {
    neighborhoods: searchParams.getAll('neighborhood') || [],
    zipCode: searchParams.get('zipCode') || '',
    maxPrice: parseInt(searchParams.get('maxPrice') || '0') || 0,
    bedrooms: searchParams.get('bedrooms') || 'any',
    minGrade: searchParams.get('minGrade') || 'any',
    rentStabilized: searchParams.get('rentStabilized') === 'true',
  };

  const initialAdditionalFilters: AdditionalFilterState = {
    boroughs: searchParams.getAll('borough') || [],
    minSqft: parseInt(searchParams.get('minSqft') || '0') || 0,
    address: searchParams.get('address') || '',
    minDiscount: parseInt(searchParams.get('minDiscount') || '0') || 0,
    sortBy: searchParams.get('sortBy') || 'default',
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [additionalFilters, setAdditionalFilters] = useState<AdditionalFilterState>(initialAdditionalFilters);

  useEffect(() => {
    // Update meta tags for SEO - Rent page
    document.title = "NYC Apartments for Rent | Find Undervalued Deals | Realer Estate";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Find undervalued apartments for rent in NYC. Search apartments by neighborhood, price, bedrooms, and more. Discover hidden gem rental deals with Realer Estate.');
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'NYC Apartments for Rent | Find Undervalued Deals | Realer Estate');
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', 'Find undervalued apartments for rent in NYC. Search apartments by neighborhood, price, bedrooms, and more. Discover hidden gem rental deals with Realer Estate.');
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', 'https://realerestate.org/rent');

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', 'NYC Apartments for Rent | Find Undervalued Deals | Realer Estate');
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', 'Find undervalued apartments for rent in NYC. Search apartments by neighborhood, price, bedrooms, and more.');
    
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute('content', 'https://realerestate.org/rent');

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://realerestate.org/rent');
  }, []);

  useEffect(() => {
    setProperties([]);
    setPage(0);
    setHasMore(true);
    fetchProperties();
  }, [filters, additionalFilters]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    if (page > 0 && hasMore && !loading) {
      fetchProperties();
    }
  }, [page, hasMore, loading]);

  const fetchProperties = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      let regularQuery = supabase
        .from('undervalued_rentals')
        .select('*')
        .eq('likely_rented', false);

      let stabilizedQuery = supabase
        .from('undervalued_rent_stabilized')
        .select('*')
        .eq('likely_rented', false);

      // Apply filters to both queries
      [regularQuery, stabilizedQuery].forEach(query => {
        if (filters.neighborhoods.length > 0) {
          query = query.in('neighborhood', filters.neighborhoods);
        }

        if (filters.zipCode) {
          query = query.eq('zipcode', filters.zipCode);
        }

        if (filters.maxPrice) {
          query = query.lte('monthly_rent', filters.maxPrice);
        }

        if (filters.bedrooms && filters.bedrooms !== 'any') {
          query = query.eq('bedrooms', parseInt(filters.bedrooms));
        }

        if (filters.minGrade && filters.minGrade !== 'any') {
          const gradeToScore = { 'A+': 95, 'A': 85, 'B': 75, 'C': 65 };
          query = query.gte('score', gradeToScore[filters.minGrade as keyof typeof gradeToScore]);
        }

        // Additional filters
        if (additionalFilters.boroughs.length > 0) {
          const boroughNeighborhoods = neighborhoodsByBorough
            .filter(b => additionalFilters.boroughs.includes(b.borough))
            .flatMap(b => b.neighborhoods);
          query = query.in('neighborhood', boroughNeighborhoods);
        }

        if (additionalFilters.minSqft) {
          query = query.gte('sqft', additionalFilters.minSqft).not('sqft', 'is', null);
        }

        if (additionalFilters.address) {
          query = query.ilike('address', `%${additionalFilters.address}%`);
        }

        if (additionalFilters.minDiscount) {
          if (query === regularQuery) {
            query = query.gte('discount_percent', additionalFilters.minDiscount);
          } else {
            query = query.gte('undervaluation_percent', additionalFilters.minDiscount);
          }
        }
      });

      // Apply sorting
      if (additionalFilters.sortBy === 'price_low_high') {
        regularQuery = regularQuery.order('monthly_rent', { ascending: true });
        stabilizedQuery = stabilizedQuery.order('monthly_rent', { ascending: true });
      } else if (additionalFilters.sortBy === 'price_high_low') {
        regularQuery = regularQuery.order('monthly_rent', { ascending: false });
        stabilizedQuery = stabilizedQuery.order('monthly_rent', { ascending: false });
      } else if (additionalFilters.sortBy === 'score_low_high') {
        regularQuery = regularQuery.order('score', { ascending: true });
        stabilizedQuery = stabilizedQuery.order('undervaluation_confidence', { ascending: true });
      } else if (additionalFilters.sortBy === 'score_high_low') {
        regularQuery = regularQuery.order('score', { ascending: false });
        stabilizedQuery = stabilizedQuery.order('undervaluation_confidence', { ascending: false });
      } else if (additionalFilters.sortBy === 'newest_listed') {
        regularQuery = regularQuery.order('days_on_market', { ascending: true });
        stabilizedQuery = stabilizedQuery.order('days_on_market', { ascending: true });
      } else {
        regularQuery = regularQuery.order('score', { ascending: false });
        stabilizedQuery = stabilizedQuery.order('undervaluation_confidence', { ascending: false });
      }

      // Execute queries
      const [regularResult, stabilizedResult] = await Promise.all([
        !filters.rentStabilized ? regularQuery : Promise.resolve({ data: [], error: null }),
        filters.rentStabilized ? stabilizedQuery : Promise.resolve({ data: [], error: null })
      ]);

      if (regularResult.error) throw regularResult.error;
      if (stabilizedResult.error) throw stabilizedResult.error;

      let combinedData = [
        ...(regularResult.data || []).map(item => ({ ...item, type: 'regular' as const })),
        ...(stabilizedResult.data || []).map(item => ({ ...item, type: 'rent_stabilized' as const }))
      ];

      // Client-side sorting for sqft
      if (additionalFilters.sortBy === 'sqft_low_high') {
        combinedData = combinedData.sort((a, b) => {
          const aVal = a.sqft || 0;
          const bVal = b.sqft || 0;
          return aVal - bVal;
        });
      } else if (additionalFilters.sortBy === 'sqft_high_low') {
        combinedData = combinedData.sort((a, b) => {
          const aVal = a.sqft || 0;
          const bVal = b.sqft || 0;
          return bVal - aVal;
        });
      }

      // Apply pagination
      const startIndex = page * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedData = combinedData.slice(startIndex, endIndex);

      setProperties(page === 0 ? paginatedData : [...properties, ...paginatedData]);
      setTotalCount(combinedData.length);
      setHasMore(endIndex < combinedData.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters, additionalFilters, page, loading, properties]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(0);
    setProperties([]);
    setSearchParams(newFilters);
  };

  const handleAdditionalFilterChange = (newAdditionalFilters: AdditionalFilterState) => {
    setAdditionalFilters(newAdditionalFilters);
    setPage(0);
    setProperties([]);

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(item => params.append(key, item));
        } else if (typeof value === 'boolean') {
            params.set(key, String(value));
        } else if (value) {
            params.set(key, String(value));
        }
    });
    Object.entries(newAdditionalFilters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(item => params.append(key, item));
        } else if (typeof value === 'boolean') {
            params.set(key, String(value));
        } else if (value) {
            params.set(key, String(value));
        }
    });
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <Filter filters={filters} onFilterChange={handleFilterChange} />

      <AdditionalFilters
        additionalFilters={additionalFilters}
        onAdditionalFilterChange={handleAdditionalFilterChange}
      />

      {error && (
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error,
        })
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-8 max-w-6xl mx-auto">
        {properties.map(property => (
          <PropertyCard key={property.id} property={property} type={property.type} />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <BeatLoader color="#ffffff" />
        </div>
      )}

      {!loading && properties.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No properties found matching your criteria.</p>
        </div>
      )}

      {hasMore && !loading && properties.length > 0 && (
        <div className="flex justify-center py-4">
          <button
            onClick={handleLoadMore}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Rent;
