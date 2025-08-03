import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArrowUpIcon } from 'lucide-react';
import { GlowEffect } from '@/components/ui/glow-effect';

interface AISearchProps {
  onResults: (results: any[], interpretation: string) => void;
}

interface AIFilters {
  property_type?: 'rent' | 'buy';
  max_budget?: number;
  bedrooms?: number;
  neighborhoods?: string[];
  boroughs?: string[];
  must_haves?: string[];
  discount_threshold?: number;
  interpretation?: string;
}

const AISearch = ({ onResults }: AISearchProps) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastInterpretation, setLastInterpretation] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const neighborhoods = [
    // Manhattan
    'Upper East Side', 'Upper West Side', 'Midtown', 'Chelsea', 'Greenwich Village',
    'SoHo', 'Tribeca', 'Lower East Side', 'East Village', 'Hell\'s Kitchen',
    'Financial District', 'Harlem', 'Washington Heights', 'Inwood',
    
    // Brooklyn
    'Williamsburg', 'DUMBO', 'Brooklyn Heights', 'Park Slope', 'Prospect Heights',
    'Crown Heights', 'Bed-Stuy', 'Bushwick', 'Red Hook', 'Carroll Gardens',
    'Cobble Hill', 'Boerum Hill', 'Fort Greene', 'Clinton Hill', 'Greenpoint',
    'Bay Ridge', 'Sunset Park', 'Gowanus', 'Sheepshead Bay',
    
    // Queens
    'Long Island City', 'Astoria', 'Sunnyside', 'Woodside', 'Jackson Heights',
    'Elmhurst', 'Forest Hills', 'Kew Gardens', 'Flushing', 'Bayside',
    
    // Bronx
    'South Bronx', 'Mott Haven', 'Concourse', 'Fordham', 'Riverdale',
    
    // Staten Island
    'St. George', 'Stapleton', 'New Brighton'
  ];

  const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];

  const callClaudeAPI = async (userQuery: string): Promise<AIFilters> => {
    try {
      console.log('Calling AI search with query:', userQuery);
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ai-search', {
        body: { query: userQuery }
      });

      if (error) {
        console.error('Supabase Edge Function error:', error);
        throw new Error(`Edge function error: ${error.message}`);
      }

      console.log('AI search response:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.fallback) {
        return data.fallback;
      }

      return data.filters || {};
    } catch (error) {
      console.error('AI search error:', error);
      throw new Error('Failed to process your request');
    }
  };

  const searchWithFilters = async (filters: AIFilters) => {
    const results: any[] = [];

    try {
      console.log('Searching with filters:', filters);

      // Search rentals if not specifically looking to buy
      if (!filters.property_type || filters.property_type === 'rent') {
        
        // Search undervalued_rentals
        let rentalQuery = supabase
          .from('undervalued_rentals')
          .select('*')
          .eq('status', 'active')
          .order('discount_percent', { ascending: false });

        // Search undervalued_rent_stabilized
        let stabilizedQuery = supabase
          .from('undervalued_rent_stabilized')
          .select('*')
          .eq('display_status', 'active')
          .order('undervaluation_percent', { ascending: false });

        // Apply budget filter
        if (filters.max_budget) {
          rentalQuery = rentalQuery.lte('monthly_rent', filters.max_budget);
          stabilizedQuery = stabilizedQuery.lte('monthly_rent', filters.max_budget);
        }
        
        // Apply bedroom filter
        if (filters.bedrooms !== undefined) {
          rentalQuery = rentalQuery.eq('bedrooms', filters.bedrooms);
          stabilizedQuery = stabilizedQuery.eq('bedrooms', filters.bedrooms);
        }

        // Apply location filters
        if (filters.neighborhoods?.length || filters.boroughs?.length) {
          const allAreas = [...(filters.neighborhoods || []), ...(filters.boroughs || [])];
          
          // For neighborhoods, use flexible matching
          const neighborhoodConditions = allAreas.map(area => {
            // Check if it's a borough
            if (boroughs.includes(area)) {
              return `borough.eq.${area}`;
            } else {
              // It's a neighborhood - use flexible matching
              return `neighborhood.ilike.%${area}%`;
            }
          }).join(',');

          if (neighborhoodConditions) {
            rentalQuery = rentalQuery.or(neighborhoodConditions);
            stabilizedQuery = stabilizedQuery.or(neighborhoodConditions);
          }
        }

        // Apply discount filter
        if (filters.discount_threshold) {
          rentalQuery = rentalQuery.gte('discount_percent', filters.discount_threshold);
          stabilizedQuery = stabilizedQuery.gte('undervaluation_percent', filters.discount_threshold);
        }

        // Apply must-haves
        if (filters.must_haves?.length) {
          filters.must_haves.forEach(feature => {
            switch (feature) {
              case 'no_fee':
              case 'No broker fee':
                rentalQuery = rentalQuery.eq('no_fee', true);
                break;
              case 'pet_friendly':
              case 'Pet-friendly':
                rentalQuery = rentalQuery.eq('pet_friendly', true);
                break;
              case 'doorman_building':
              case 'Doorman':
                rentalQuery = rentalQuery.eq('doorman_building', true);
                break;
              case 'elevator_building':
              case 'Elevator':
                rentalQuery = rentalQuery.eq('elevator_building', true);
                break;
              case 'laundry_available':
              case 'Laundry in building':
                rentalQuery = rentalQuery.eq('laundry_available', true);
                break;
              case 'gym_available':
              case 'Gym/fitness center':
                rentalQuery = rentalQuery.eq('gym_available', true);
                break;
              case 'rooftop_access':
              case 'Outdoor space':
                rentalQuery = rentalQuery.eq('rooftop_access', true);
                break;
            }
          });
        }

        // If specifically looking for rent-stabilized, only query that table
        if (filters.must_haves?.includes('rent_stabilized') || filters.must_haves?.includes('Rent-stabilized')) {
          const { data: stabilizedData } = await stabilizedQuery.limit(20);
          results.push(...(stabilizedData || []).map(item => ({ 
            ...item, 
            isRentStabilized: true,
            property_type: 'rent',
            table_source: 'undervalued_rent_stabilized'
          })));
        } else {
          // Get both types
          const [rentalResult, stabilizedResult] = await Promise.all([
            rentalQuery.limit(10),
            stabilizedQuery.limit(10)
          ]);
          
          results.push(...(rentalResult.data || []).map(item => ({ 
            ...item, 
            property_type: 'rent',
            table_source: 'undervalued_rentals'
          })));
          results.push(...(stabilizedResult.data || []).map(item => ({ 
            ...item, 
            isRentStabilized: true,
            property_type: 'rent',
            table_source: 'undervalued_rent_stabilized'
          })));
        }
      }

      // Search sales if not specifically looking to rent
      if (!filters.property_type || filters.property_type === 'buy') {
        let salesQuery = supabase
          .from('undervalued_sales')
          .select('*')
          .eq('status', 'active')
          .order('discount_percent', { ascending: false });

        // Apply budget filter
        if (filters.max_budget) {
          salesQuery = salesQuery.lte('price', filters.max_budget);
        }
        
        // Apply bedroom filter
        if (filters.bedrooms !== undefined) {
          salesQuery = salesQuery.eq('bedrooms', filters.bedrooms);
        }

        // Apply location filters
        if (filters.neighborhoods?.length || filters.boroughs?.length) {
          const allAreas = [...(filters.neighborhoods || []), ...(filters.boroughs || [])];
          
          const locationConditions = allAreas.map(area => {
            if (boroughs.includes(area)) {
              return `borough.eq.${area}`;
            } else {
              return `neighborhood.ilike.%${area}%`;
            }
          }).join(',');

          if (locationConditions) {
            salesQuery = salesQuery.or(locationConditions);
          }
        }

        // Apply discount filter
        if (filters.discount_threshold) {
          salesQuery = salesQuery.gte('discount_percent', filters.discount_threshold);
        }

        // Apply must-haves (sales table has some different columns)
        if (filters.must_haves?.length) {
          filters.must_haves.forEach(feature => {
            switch (feature) {
              case 'pet_friendly':
              case 'Pet-friendly':
                salesQuery = salesQuery.eq('pet_friendly', true);
                break;
              case 'doorman_building':
              case 'Doorman':
                salesQuery = salesQuery.eq('doorman_building', true);
                break;
              case 'elevator_building':
              case 'Elevator':
                salesQuery = salesQuery.eq('elevator_building', true);
                break;
              case 'laundry_available':
              case 'Laundry in building':
                salesQuery = salesQuery.eq('laundry_available', true);
                break;
              case 'gym_available':
              case 'Gym/fitness center':
                salesQuery = salesQuery.eq('gym_available', true);
                break;
              case 'rooftop_access':
              case 'Outdoor space':
                salesQuery = salesQuery.eq('rooftop_access', true);
                break;
            }
          });
        }

        const { data: salesData } = await salesQuery.limit(20);
        results.push(...(salesData || []).map(item => ({ 
          ...item, 
          property_type: 'buy',
          table_source: 'undervalued_sales'
        })));
      }

      // Sort by discount/undervaluation percentage
      results.sort((a, b) => {
        const aDiscount = a.discount_percent || a.undervaluation_percent || 0;
        const bDiscount = b.discount_percent || b.undervaluation_percent || 0;
        return bDiscount - aDiscount;
      });

      console.log('Search results:', results.length, 'properties found');
      return results.slice(0, 20); // Limit to 20 results
    } catch (error) {
      console.error('Database search error:', error);
      return [];
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      console.log('Starting AI search for:', query);
      
      // Call Claude API to parse the query
      const filters = await callClaudeAPI(query);
      console.log('Parsed filters:', filters);
      
      setLastInterpretation(filters.interpretation || '');
      
      // Search with the parsed filters
      const results = await searchWithFilters(filters);
      console.log('Final results:', results);
      
      onResults(results, filters.interpretation || '');
    } catch (error) {
      console.error('AI Search error:', error);
      onResults([], 'Sorry, I couldn\'t process your request. Please try a different search.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 mt-8">
      <div className="relative">
        {/* Glow Effect - Only visible on hover/focus */}
        {isFocused && (
          <div className="absolute -inset-1 rounded-full">
            <GlowEffect
              colors={['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8b5cf6', '#06b6d4', '#10b981', '#f97316']}
              mode="rotate"
              blur="medium"
              duration={4}
              className="rounded-full"
            />
          </div>
        )}
        
        {/* Main Chat Input Container */}
        <div className={`
          relative bg-gray-900/80 backdrop-blur-md border transition-all duration-300 rounded-full flex items-center
          ${isFocused 
            ? 'border-transparent shadow-lg' 
            : 'border-gray-600/50 hover:border-gray-500/70'
          }
        `}>
          <input
            type="text"
            placeholder="Describe your dream home... we'll find it for you"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 px-6 py-3 bg-transparent border-none text-white placeholder:text-gray-400 focus:outline-none text-base font-medium tracking-tight"
          />
          
          <button 
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className={`
              mr-3 rounded-full p-2.5 transition-all duration-200 border-none
              ${query.trim() && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowUpIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      
      {/* Last interpretation display */}
      {lastInterpretation && (
        <div className="mt-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-center">
          <p className="text-blue-300 text-sm">🎯 {lastInterpretation}</p>
        </div>
      )}

      {/* Search suggestions chips */}
      <div className="flex justify-center space-x-3 mt-4">
        {['2BR under $4k in Brooklyn', 'Pet-friendly with gym', 'Rent stabilized deals'].map((example) => (
          <button
            key={example}
            onClick={() => setQuery(example)}
            className="px-4 py-2 bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-full text-sm text-gray-300 hover:text-white hover:border-gray-500/70 transition-all duration-200"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AISearch;