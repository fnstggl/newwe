
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

  // Updated getLiveCount to fetch all properties and apply client-side filtering like ForYou.tsx
  const getLiveCount = async (filters: Partial<typeof userProfile>): Promise<number> => {
    try {
      const propertyType = filters.property_type;
      const allProperties: any[] = [];
      
      if (propertyType === 'rent') {
        // Fetch from undervalued_rentals
        const { data: rentals } = await supabase
          .from('undervalued_rentals')
          .select('*')
          .eq('status', 'active');

        if (rentals) {
          rentals.forEach(rental => {
            allProperties.push({
              ...rental,
              property_type: 'rent',
              table_source: 'undervalued_rentals'
            });
          });
        }

        // Fetch from undervalued_rent_stabilized
        const { data: stabilized } = await supabase
          .from('undervalued_rent_stabilized')
          .select('*')
          .eq('display_status', 'active');

        if (stabilized) {
          stabilized.forEach(property => {
            allProperties.push({
              ...property,
              property_type: 'rent',
              table_source: 'undervalued_rent_stabilized',
              discount_percent: property.undervaluation_percent || 0,
              isRentStabilized: true
            });
          });
        }

      } else if (propertyType === 'buy') {
        const { data: sales } = await supabase
          .from('undervalued_sales')
          .select('*')
          .eq('status', 'active');

        if (sales) {
          sales.forEach(sale => {
            allProperties.push({
              ...sale,
              property_type: 'buy',
              table_source: 'undervalued_sales'
            });
          });
        }
      }

      // Apply client-side filters exactly like ForYou.tsx
      let filteredProperties = allProperties;

      // Filter by bedrooms
      if (filters.bedrooms !== undefined && filters.bedrooms !== null) {
        filteredProperties = filteredProperties.filter(p => p.bedrooms === filters.bedrooms);
      }

      // Filter by budget
      if (filters.max_budget) {
        filteredProperties = filteredProperties.filter(p => {
          if (p.property_type === 'rent' && p.monthly_rent) {
            return p.monthly_rent <= filters.max_budget!;
          } else if (p.property_type === 'buy' && p.price) {
            return p.price <= filters.max_budget!;
          }
          return true;
        });
      }

      // Filter by neighborhoods using the same flexible matching as ForYou.tsx
      if (filters.preferred_neighborhoods && filters.preferred_neighborhoods.length > 0) {
        const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
        const selectedBoroughs = filters.preferred_neighborhoods.filter(n => boroughs.includes(n));
        const selectedNeighborhoods = filters.preferred_neighborhoods.filter(n => !boroughs.includes(n) && n !== 'Anywhere with a train');
        
        filteredProperties = filteredProperties.filter(p => {
          // If "Anywhere with a train" is selected, show all properties
          if (filters.preferred_neighborhoods!.includes('Anywhere with a train')) {
            return true;
          }
          
          // Check if property matches selected boroughs
          if (selectedBoroughs.length > 0 && p.borough) {
            if (selectedBoroughs.includes(p.borough)) return true;
          }
          
          // Check if property matches selected neighborhoods using flexible matching
          if (selectedNeighborhoods.length > 0 && p.neighborhood) {
            const propertyNeighborhood = p.neighborhood.toLowerCase();
            
            for (const selectedNeighborhood of selectedNeighborhoods) {
              const selected = selectedNeighborhood.toLowerCase();
              
              // Try exact match first
              if (propertyNeighborhood.includes(selected)) {
                return true;
              }
              
              // Try with cleaned names (remove apostrophes, spaces, hyphens)
              const cleanPropertyName = propertyNeighborhood.replace(/['\s-]/g, '');
              const cleanSelectedName = selected.replace(/['\s-]/g, '');
              if (cleanPropertyName.includes(cleanSelectedName) || cleanSelectedName.includes(cleanPropertyName)) {
                return true;
              }
              
              // Try variations
              const variations = [
                selected.replace(/'/g, ''),  // Remove apostrophes
                selected.replace(/\s+/g, '-'), // Spaces to hyphens  
                selected.replace(/-/g, ' ')   // Hyphens to spaces
              ];
              
              for (const variation of variations) {
                if (propertyNeighborhood.includes(variation)) {
                  return true;
                }
              }
            }
          }
          
          // If no boroughs or neighborhoods selected, but other areas selected, exclude
          if (selectedBoroughs.length === 0 && selectedNeighborhoods.length === 0) {
            return true;
          }
          
          return false;
        });
      }

      // Filter by discount threshold
      if (filters.discount_threshold) {
        filteredProperties = filteredProperties.filter(p => 
          p.discount_percent >= filters.discount_threshold!
        );
      }

      // Filter by must-haves for rentals
      if (filters.property_type === 'rent' && filters.must_haves && filters.must_haves.length > 0) {
        filteredProperties = filteredProperties.filter(p => {
          if (filters.must_haves!.includes('No broker fee') && p.table_source === 'undervalued_rentals') {
            return p.no_fee === true;
          }
          if (filters.must_haves!.includes('Rent-stabilized')) {
            return p.table_source === 'undervalued_rent_stabilized';
          }
          return true;
        });
      }

      return filteredProperties.length;

    } catch (error) {
      console.error('Error getting live count:', error);
      return 0;
    }
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
      transition={{ 
        duration: 0.2, 
        ease: "easeOut" 
      }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 300,
          duration: 0.3
        }}
        onClick={(e) => e.stopPropagation()}
        className="bg-black/20 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl ring-1 ring-white/5"
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
                    className={`p-3 rounded-full border transition-all duration-200 ${
  searchingFor === option
    ? 'border-white/40 bg-white/10 text-white backdrop-blur-sm'
    : 'border-white/20 bg-black/30 text-gray-300 hover:border-white/30 hover:bg-white/5 backdrop-blur-sm'
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
                className="w-full p-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-all duration-200"
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
                className="w-full p-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

{/* Live Count Display */}
{propertyType && (
  <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-center">
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
  className="flex-1 px-6 py-3 border border-white/20 text-gray-300 rounded-full hover:bg-white/5 backdrop-blur-sm transition-all duration-200"
>
  Cancel
</button>
<button
  onClick={handleSubmit}
  disabled={isSubmitting}
  className="flex-1 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
