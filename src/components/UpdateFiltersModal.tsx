
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UpdateFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersUpdated: () => void;
}

const UpdateFiltersModal = ({ isOpen, onClose, onFiltersUpdated }: UpdateFiltersModalProps) => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [searchingFor, setSearchingFor] = useState(userProfile?.searching_for || '');
  const [propertyType, setPropertyType] = useState(userProfile?.property_type || '');
  const [bedrooms, setBedrooms] = useState<number | undefined>(userProfile?.bedrooms);
  const [maxBudget, setMaxBudget] = useState<number | undefined>(userProfile?.max_budget);
  const [preferredNeighborhoods, setPreferredNeighborhoods] = useState<string[]>(userProfile?.preferred_neighborhoods || []);
  const [mustHaves, setMustHaves] = useState<string[]>(userProfile?.must_haves || []);
  const [discountThreshold, setDiscountThreshold] = useState<number | undefined>(userProfile?.discount_threshold);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liveCount, setLiveCount] = useState<number>(0);
  const [isCountLoading, setIsCountLoading] = useState(false);

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
  
  const allNeighborhoodOptions = [
    'Anywhere with a train',
    ...boroughs,
    ...neighborhoods
  ];

  // Get live counts for filters - copied from PreSignupOnboarding
const getLiveCount = async (filters: Partial<typeof userProfile>): Promise<number> => {
  try {
    const propertyType = filters.property_type;
    
    if (propertyType === 'rent') {
      // Count from undervalued_rentals
      let rentalQuery = supabase
        .from('undervalued_rentals')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active');

      // Count from undervalued_rent_stabilized
      let stabilizedQuery = supabase
        .from('undervalued_rent_stabilized')
        .select('id', { count: 'exact', head: true })
        .eq('display_status', 'active');

      // Apply filters to both queries
      if (filters.max_budget) {
        rentalQuery = rentalQuery.lte('monthly_rent', filters.max_budget);
        stabilizedQuery = stabilizedQuery.lte('monthly_rent', filters.max_budget);
      }
      if (filters.bedrooms !== undefined) {
        rentalQuery = rentalQuery.eq('bedrooms', filters.bedrooms);
        stabilizedQuery = stabilizedQuery.eq('bedrooms', filters.bedrooms);
      }
      if (filters.preferred_neighborhoods && filters.preferred_neighborhoods.length > 0) {
        const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
        const selectedBoroughs = filters.preferred_neighborhoods.filter(n => boroughs.includes(n));
        const selectedNeighborhoods = filters.preferred_neighborhoods.filter(n => !boroughs.includes(n) && n !== 'Anywhere with a train');
        
        if (!filters.preferred_neighborhoods.includes('Anywhere with a train')) {
          if (selectedBoroughs.length > 0) {
            rentalQuery = rentalQuery.in('borough', selectedBoroughs);
            stabilizedQuery = stabilizedQuery.in('borough', selectedBoroughs);
          }
          if (selectedNeighborhoods.length > 0) {
            const neighborhoodConditions = selectedNeighborhoods.map(n => `neighborhood.ilike.%${n}%`).join(',');
            rentalQuery = rentalQuery.or(neighborhoodConditions);
            stabilizedQuery = stabilizedQuery.or(neighborhoodConditions);
          }
        }
      }
      if (filters.discount_threshold) {
        rentalQuery = rentalQuery.gte('discount_percent', filters.discount_threshold);
        stabilizedQuery = stabilizedQuery.gte('undervaluation_percent', filters.discount_threshold);
      }
      if (filters.must_haves && filters.must_haves.includes('No broker fee')) {
        rentalQuery = rentalQuery.eq('no_fee', true);
      }
      if (filters.must_haves && filters.must_haves.includes('Rent-stabilized')) {
        // Only count stabilized rentals if this filter is selected
        const { count: stabilizedCount } = await stabilizedQuery;
        return stabilizedCount || 0;
      }

      const [rentalResult, stabilizedResult] = await Promise.all([
        rentalQuery,
        stabilizedQuery
      ]);

      return (rentalResult.count || 0) + (stabilizedResult.count || 0);

    } else if (propertyType === 'buy') {
      let query = supabase
        .from('undervalued_sales')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active');

      if (filters.max_budget) {
        query = query.lte('price', filters.max_budget);
      }
      if (filters.bedrooms !== undefined) {
        query = query.eq('bedrooms', filters.bedrooms);
      }
      if (filters.preferred_neighborhoods && filters.preferred_neighborhoods.length > 0) {
        const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
        const selectedBoroughs = filters.preferred_neighborhoods.filter(n => boroughs.includes(n));
        const selectedNeighborhoods = filters.preferred_neighborhoods.filter(n => !boroughs.includes(n) && n !== 'Anywhere with a train');
        
        if (!filters.preferred_neighborhoods.includes('Anywhere with a train')) {
          if (selectedBoroughs.length > 0) {
            query = query.in('borough', selectedBoroughs);
          }
          if (selectedNeighborhoods.length > 0) {
            const neighborhoodConditions = selectedNeighborhoods.map(n => `neighborhood.ilike.%${n}%`).join(',');
            query = query.or(neighborhoodConditions);
          }
        }
      }
      if (filters.discount_threshold) {
        query = query.gte('discount_percent', filters.discount_threshold);
      }

      const { count } = await query;
      return count || 0;
    }
  } catch (error) {
    console.error('Error getting live count:', error);
  }
  return 0;
};

  const rentMustHaves = [
    'No broker fee',
    'Rent-stabilized',
    'Pet-friendly',
    'Laundry in building',
    'Gym/fitness center',
    'Doorman',
    'Elevator',
    'Outdoor space'
  ];

  const handleNeighborhoodToggle = (neighborhood: string) => {
    setPreferredNeighborhoods(prev => 
      prev.includes(neighborhood) 
        ? prev.filter(n => n !== neighborhood)
        : [...prev, neighborhood]
    );
  };

  const handleMustHaveToggle = (mustHave: string) => {
    setMustHaves(prev => 
      prev.includes(mustHave) 
        ? prev.filter(m => m !== mustHave)
        : [...prev, mustHave]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          searching_for: searchingFor,
          property_type: propertyType,
          bedrooms: bedrooms,
          max_budget: maxBudget,
          preferred_neighborhoods: preferredNeighborhoods,
          must_haves: mustHaves,
          discount_threshold: discountThreshold,
          neighborhood_preferences: preferredNeighborhoods
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "✅ Filters Updated",
        description: "Your dream home preferences have been saved!",
      });

      onFiltersUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating filters:', error);
      toast({
        title: "Error",
        description: "Failed to update your filters. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

// Update live count when filters change
useEffect(() => {
  if (propertyType) {
    setIsCountLoading(true);
    const currentFilters = {
      property_type: propertyType,
      bedrooms: bedrooms,
      max_budget: maxBudget,
      preferred_neighborhoods: preferredNeighborhoods,
      must_haves: mustHaves,
      discount_threshold: discountThreshold
    };
    
    getLiveCount(currentFilters).then(count => {
      setLiveCount(count);
      setIsCountLoading(false);
    });
  }
}, [propertyType, bedrooms, maxBudget, preferredNeighborhoods, mustHaves, discountThreshold]);
  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Update Personalized Search Filters</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="space-y-6">
            {/* What are you searching for? */}
            <div>
              <label className="block text-white font-medium mb-3">What are you searching for?</label>
              <div className="grid grid-cols-2 gap-3">
                {['A place to rent', 'A place to buy'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSearchingFor(option);
                      setPropertyType(option === 'A place to rent' ? 'rent' : 'buy');
                    }}
                    className={`p-3 rounded-full border transition-colors ${
  searchingFor === option
    ? 'border-blue-800/40 bg-blue-500/15 text-blue-300'
    : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-blue-500/30 hover:bg-blue-800/10'
}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-white font-medium mb-3">How many bedrooms?</label>
              <div className="grid grid-cols-4 gap-3">
                {['Studio', '1', '2', '3+'].map((option, index) => (
                  <button
                    key={option}
                    onClick={() => setBedrooms(index)}
                    className={`p-3 rounded-full border transition-colors ${
  bedrooms === index
    ? 'border-blue-800/40 bg-blue-500/15 text-blue-300'
    : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-blue-500/30 hover:bg-blue-800/10'
}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-white font-medium mb-3">Maximum budget</label>
              <input
                type="number"
                value={maxBudget || ''}
                onChange={(e) => setMaxBudget(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder={propertyType === 'rent' ? 'Monthly rent' : 'Purchase price'}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Neighborhoods */}
            <div>
              <label className="block text-white font-medium mb-3">Preferred areas</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {allNeighborhoodOptions.map((neighborhood) => (
                  <button
                    key={neighborhood}
                    onClick={() => handleNeighborhoodToggle(neighborhood)}
                   className={`p-2 text-sm rounded-full border transition-colors text-left ${
  preferredNeighborhoods.includes(neighborhood)
    ? 'border-blue-800/40 bg-blue-500/15 text-blue-300'
    : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-blue-500/30 hover:bg-blue-800/10'
}`}
                  >
                    {neighborhood}
                  </button>
                ))}
              </div>
            </div>

            {/* Must-haves (for rentals) */}
            {propertyType === 'rent' && (
              <div>
                <label className="block text-white font-medium mb-3">Must-haves</label>
                <div className="grid grid-cols-2 gap-2">
                  {rentMustHaves.map((mustHave) => (
                    <button
                      key={mustHave}
                      onClick={() => handleMustHaveToggle(mustHave)}
                     className={`p-2 text-sm rounded-full border transition-colors text-left ${
  mustHaves.includes(mustHave)
    ? 'border-blue-800/40 bg-blue-500/15 text-blue-300'
    : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-blue-500/30 hover:bg-blue-800/10'
}`}
                    >
                      {mustHave}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Discount Threshold */}
            <div>
              <label className="block text-white font-medium mb-3">Minimum discount (%)</label>
              <input
                type="number"
                value={discountThreshold || ''}
                onChange={(e) => setDiscountThreshold(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="15"
                min="0"
                max="100"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

{/* Live Count Display */}
{propertyType && (
  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
    <div className="flex items-center justify-center space-x-2">
      {isCountLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
          <span className="text-blue-300 font-medium">Counting listings...</span>
        </>
      ) : (
        <>
          <span className="text-blue-300 font-medium">
            {liveCount.toLocaleString()} listings match your filters
          </span>
        </>
      )}
    </div>
  </div>
)}

          
          <div className="flex space-x-4 mt-8">
           <button
  onClick={onClose}
  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-full hover:bg-gray-800/50 transition-colors"
>
  Cancel
</button>
<button
  onClick={handleSubmit}
  disabled={isSubmitting}
  className="flex-1 px-6 py-3 bg-white/15 text-white rounded-full hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
>
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Update Filters</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdateFiltersModal;
