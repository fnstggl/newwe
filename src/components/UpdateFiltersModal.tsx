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
            <h2 className="text-2xl font-bold text-white">Update Dream Home Filters</h2>
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
                    className={`p-3 rounded-lg border transition-colors ${
                      searchingFor === option
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                        : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
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
                    className={`p-3 rounded-lg border transition-colors ${
                      bedrooms === index
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                        : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
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
                    className={`p-2 text-sm rounded-lg border transition-colors text-left ${
                      preferredNeighborhoods.includes(neighborhood)
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                        : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
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
                      className={`p-2 text-sm rounded-lg border transition-colors text-left ${
                        mustHaves.includes(mustHave)
                          ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                          : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
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

          <div className="flex space-x-4 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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