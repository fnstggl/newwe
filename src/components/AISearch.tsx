import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle } from 'lucide-react';

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

  const SYSTEM_PROMPT = `You are an AI real estate assistant for NYC. Convert natural language search queries into structured filters for our property database.

AVAILABLE TABLES & COLUMNS:
1. undervalued_sales: price, bedrooms, bathrooms, sqft, neighborhood, borough, discount_percent, no_fee, pet_friendly, doorman_building, elevator_building, laundry_available, gym_available, rooftop_access
2. undervalued_rentals: monthly_rent, bedrooms, bathrooms, sqft, neighborhood, borough, discount_percent, no_fee, pet_friendly, doorman_building, elevator_building, laundry_available, gym_available, rooftop_access  
3. undervalued_rent_stabilized: monthly_rent, bedrooms, bathrooms, sqft, neighborhood, borough, undervaluation_percent, rent_stabilized_confidence

NYC NEIGHBORHOODS: ${neighborhoods.join(', ')}
NYC BOROUGHS: ${boroughs.join(', ')}

RESPOND ONLY WITH VALID JSON (no markdown formatting):
{
  "property_type": "rent|buy",
  "max_budget": number,
  "bedrooms": number,
  "neighborhoods": ["neighborhood1", "neighborhood2"],
  "boroughs": ["borough1"],
  "must_haves": ["feature1", "feature2"],
  "discount_threshold": number,
  "interpretation": "Clear explanation of what you understood from the user's request"
}

EXAMPLES:
"2BR under $4k in Brooklyn" → {"property_type": "rent", "max_budget": 4000, "bedrooms": 2, "boroughs": ["Brooklyn"], "interpretation": "Looking for 2-bedroom rentals under $4,000/month in Brooklyn"}

"Safe family neighborhood with good schools" → {"neighborhoods": ["Park Slope", "Carroll Gardens", "Brooklyn Heights"], "interpretation": "Looking for family-friendly neighborhoods known for safety and good schools"}

"Pet-friendly with gym and doorman" → {"must_haves": ["pet_friendly", "gym_available", "doorman_building"], "interpretation": "Looking for pet-friendly properties with gym and doorman"}

"Rent stabilized apartments" → {"must_haves": ["rent_stabilized"], "interpretation": "Looking specifically for rent-stabilized apartments"}

"Great deal at least 20% below market" → {"discount_threshold": 20, "interpretation": "Looking for properties with at least 20% discount from market value"}`;

  const callClaudeAPI = async (userQuery: string): Promise<AIFilters> => {
  try {
    // Get Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    // Call your Supabase Edge Function
    const response = await fetch(`${supabaseUrl}/functions/v1/ai-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ query: userQuery })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    return data.filters
  } catch (error) {
    console.error('Supabase Edge Function error:', error)
    throw new Error('Failed to process your request')
  }
}

  const searchWithFilters = async (filters: AIFilters) => {
    const results: any[] = [];

    try {
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
      // Call Claude API to parse the query
      const filters = await callClaudeAPI(query);
      setLastInterpretation(filters.interpretation || '');
      
      // Search with the parsed filters
      const results = await searchWithFilters(filters);
      
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
    <div className="w-full max-w-lg mx-auto px-6 pb-8">
      <div className="flex rounded-full overflow-hidden border border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <input
          type="text"
          placeholder="Describe your dream home..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full px-4 py-3 bg-transparent text-white focus:outline-none placeholder-gray-400"
        />
        <button 
          onClick={handleSearch}
          disabled={isLoading}
          className="px-4 py-3 bg-blue-600/80 text-white hover:bg-blue-500/80 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <MessageCircle className="w-5 h-5" />
          )}
        </button>
      </div>
      
      {lastInterpretation && (
        <div className="mt-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-center">
          <p className="text-blue-300 text-sm">🎯 {lastInterpretation}</p>
        </div>
      )}

      {/* Example prompts */}
      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        {['2BR under $4k in Brooklyn', 'Pet-friendly with gym', 'Rent stabilized deals'].map((example) => (
          <button
            key={example}
            onClick={() => setQuery(example)}
            className="px-3 py-1 text-xs bg-gray-800/50 text-gray-400 rounded-full hover:bg-gray-700/50 hover:text-gray-300 transition-colors"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AISearch;
