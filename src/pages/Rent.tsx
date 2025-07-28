import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, ChevronDown, ChevronUp, X, Filter } from "lucide-react";
import { GooeyFilter } from "@/components/ui/liquid-toggle";
import { HoverButton } from "@/components/ui/hover-button";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetail from "@/components/PropertyDetail";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import SoftGateModal from "@/components/SoftGateModal";

type SupabaseUndervaluedRentals = Tables<'undervalued_rentals'>;

const Rent = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [showNeighborhoodDropdown, setShowNeighborhoodDropdown] = useState(false);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [neighborhoodSearchTerm, setNeighborhoodSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Soft-gate modal state
  const [softGateModal, setSoftGateModal] = useState<{
    isOpen: boolean;
    property: any;
  }>({
    isOpen: false,
    property: null
  });

  const ITEMS_PER_PAGE = 18;

  useEffect(() => {
    fetchNeighborhoods();
    fetchProperties(true);
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProperties(true);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, zipCode, maxPrice, bedrooms]);

  const fetchNeighborhoods = async () => {
    try {
      const { data, error } = await supabase
        .from('undervalued_rentals')
        .select('neighborhood')
        .not('neighborhood', 'is', null)
        .order('neighborhood');

      if (error) {
        console.error('Error fetching neighborhoods:', error);
        return;
      }

      const dbNeighborhoods = [...new Set(data.map(item => item.neighborhood).filter(Boolean))];
      setNeighborhoods(dbNeighborhoods.sort());
    } catch (error) {
      console.error('Error fetching neighborhoods:', error);
    }
  };

  const fetchProperties = async (reset = false) => {
    setLoading(true);
    const currentOffset = reset ? 0 : offset;

    try {
      const { data, error } = await supabase
        .from('undervalued_rentals')
        .select('*')
        .eq('status', 'active')
        .or('investor_plan_property.is.null,investor_plan_property.neq.true')
        .ilike('address', `%${searchTerm.trim()}%`)
        .ilike('zipcode', `${zipCode.trim()}%`)
        .lte('monthly_rent', parseInt(maxPrice.trim() || '0'))
        .gte('bedrooms', parseInt(bedrooms.trim() || '0'))
        .range(currentOffset, currentOffset + ITEMS_PER_PAGE - 1);

      if (error) {
        console.error('❌ SUPABASE ERROR:', error);
        setProperties([]);
        return;
      }

      if (!data || !Array.isArray(data)) {
        console.error('❌ DATA IS NOT AN ARRAY OR IS NULL:', data);
        setProperties([]);
        return;
      }

      if (reset) {
        setProperties(data);
        setOffset(ITEMS_PER_PAGE);
      } else {
        setProperties(prev => [...prev, ...data]);
        setOffset(prev => prev + ITEMS_PER_PAGE);
      }

      setHasMore(data.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('💥 CATCH ERROR:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyClick = (property: any, index: number) => {
    const visibilityLimit = 9; // Assuming 9 is the limit for visibility

    // Only allow clicks on visible properties
    if (index >= visibilityLimit) {
      return;
    }

    // For free plan users clicking on blurred listings, show soft-gate modal
    if (userProfile?.subscription_plan !== 'unlimited' && index >= 9) {
      setSoftGateModal({
        isOpen: true,
        property: property
      });
      return;
    }
    
    // Update URL with listing ID
    navigate(`/rent/${property.listing_id}`, { replace: true });
    setSelectedProperty(property);
  };

  const handleCloseSoftGate = () => {
    setSoftGateModal({
      isOpen: false,
      property: null
    });
  };

  const handleClosePropertyDetail = () => {
    // Navigate back to main rent page
    navigate('/rent', { replace: true });
    setSelectedProperty(null);
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <GooeyFilter />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
            Find the best deals to rent. Actually.
          </h1>
          <p className="text-xl text-gray-400 tracking-tight">
            Stop wasting time on overpriced listings.
          </p>
        </div>

        {/* Search Filters */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 mb-8">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                Search Address or Neighborhood
              </label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. East Village, 10009"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                Zip Code
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="10009"
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                Max /month
              </label>
              <input
                type="text"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="$4,000"
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                Bedrooms
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
              >
                <option value="">Any</option>
                <option value="0">Studio</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid with Overlay for CTAs */}
        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {properties.map((property, index) => {
              const isBlurred = index >= 9; // Assuming 9 is the limit for visibility
              
              return (
                <div
                  key={`${property.id}-${index}`}
                  className="relative"
                >
                  <div className={isBlurred ? 'filter blur-sm' : ''}>
                    <PropertyCard
                      property={property}
                      isRental={true}
                      onClick={() => handlePropertyClick(property, index)}
                    />
                  </div>

                  {/* Make blurred listings clickable for free plan users */}
                  {userProfile?.subscription_plan !== 'unlimited' && isBlurred && (
                    <div 
                      className="absolute inset-0 cursor-pointer"
                      onClick={() => {
                        setSoftGateModal({
                          isOpen: true,
                          property: property
                        });
                      }}
                    />
                  )}

                  {/* Make blurred listings clickable for logged out users */}
                  {!user && isBlurred && (
                    <div 
                      className="absolute inset-0 cursor-pointer"
                      onClick={() => {
                        setSoftGateModal({
                          isOpen: true,
                          property: property
                        });
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-gray-400">Loading properties...</div>
          </div>
        )}

        {/* Load More Button */}
        {!loading && hasMore && properties.length > 0 && (
          <div className="text-center py-8">
            <HoverButton onClick={fetchProperties} textColor="text-white">
              Load More Properties
            </HoverButton>
          </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
              No properties found matching your search criteria
            </h3>
            <p className="text-gray-400 tracking-tight mb-6">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          isRental={true}
          onClose={handleClosePropertyDetail}
        />
      )}

      {/* Soft-gate Modal */}
      <SoftGateModal
        isOpen={softGateModal.isOpen}
        onClose={handleCloseSoftGate}
        property={softGateModal.property}
        isRental={true}
      />
    </div>
  );
};

export default Rent;
