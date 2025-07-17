import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Filter } from '../components/Filter';
import PropertyCard from '../components/PropertyCard';
import AdditionalFilters from '../components/AdditionalFilters';
import { neighborhoodsByBorough } from '../utils/constants';

const ITEMS_PER_PAGE = 12;

const Buy = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    neighborhoods: [] as string[],
    zipCode: '',
    maxPrice: '',
    bedrooms: 'any',
    minGrade: 'any',
    rentStabilized: false,
  });
  const [additionalFilters, setAdditionalFilters] = useState({
    boroughs: [] as string[],
    minSqft: '',
    address: '',
    minDiscount: '',
    sortBy: 'score_high_low',
  });
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPage(0);
    setProperties([]);
    setHasMore(true);
  };

  const handleAdditionalFilterChange = (newFilters: any) => {
    setAdditionalFilters(newFilters);
    setPage(0);
    setProperties([]);
    setHasMore(true);
  };

  const fetchProperties = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('undervalued_sales')
        .select('*')
        .eq('likely_sold', false);

      // Apply filters
      if (filters.neighborhoods.length > 0) {
        query = query.in('neighborhood', filters.neighborhoods);
      }

      if (filters.zipCode) {
        query = query.eq('zipcode', filters.zipCode);
      }

      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
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
        query = query.gte('discount_percent', additionalFilters.minDiscount);
      }

      // Apply sorting with client-side fallback for complex sorts
      if (additionalFilters.sortBy === 'price_low_high') {
        query = query.order('price', { ascending: true });
      } else if (additionalFilters.sortBy === 'price_high_low') {
        query = query.order('price', { ascending: false });
      } else if (additionalFilters.sortBy === 'score_low_high') {
        query = query.order('score', { ascending: true });
      } else if (additionalFilters.sortBy === 'score_high_low') {
        query = query.order('score', { ascending: false });
      } else if (additionalFilters.sortBy === 'newest_listed') {
        query = query.order('days_on_market', { ascending: true });
      } else {
        query = query.order('score', { ascending: false });
      }

      // Add pagination
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      let processedData = data || [];

      // Client-side sorting for sqft (to handle null values properly)
      if (additionalFilters.sortBy === 'sqft_low_high') {
        processedData = processedData.sort((a, b) => {
          const aVal = a.sqft || 0;
          const bVal = b.sqft || 0;
          return aVal - bVal;
        });
      } else if (additionalFilters.sortBy === 'sqft_high_low') {
        processedData = processedData.sort((a, b) => {
          const aVal = a.sqft || 0;
          const bVal = b.sqft || 0;
          return bVal - aVal;
        });
      }

      setProperties(page === 0 ? processedData : [...properties, ...processedData]);
      setTotalCount(count || 0);
      setHasMore((count || 0) > (page + 1) * ITEMS_PER_PAGE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters, additionalFilters, page, loading, properties]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <Filter onChange={handleFilterChange} />
      <AdditionalFilters onChange={handleAdditionalFilterChange} />
      
      {loading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-center py-4 text-red-500">Error: {error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {properties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {hasMore && (
        <div className="text-center py-4">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Buy;
