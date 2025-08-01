
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, MapPin, Home } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { UndervaluedSales, UndervaluedRentals } from "@/types/database";
import PropertyCard from "../components/PropertyCard";
import PropertyDetail from "../components/PropertyDetail";

interface SavedProperty {
  id: string;
  property_id: string;
  property_type: 'sale' | 'rental';
  saved_at: string;
  user_id?: string;
}

interface SavedPropertyWithDetails extends SavedProperty {
  property_details: any | null;
}

const SavedProperties = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedProperties, setSavedProperties] = useState<SavedPropertyWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch saved properties
  useEffect(() => {
    const fetchSavedProperties = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Starting to fetch saved properties for user:', user.id);
        
        // Get saved properties from user
        const { data: savedData, error: savedError } = await supabase
          .from('saved_properties')
          .select('*')
          .eq('user_id', user.id)
          .order('saved_at', { ascending: false });

        if (savedError) {
          console.error('❌ Error fetching saved properties:', savedError);
          setError('Failed to load saved properties');
          setSavedProperties([]);
          setLoading(false);
          return;
        }

        console.log('📋 Saved properties from database:', savedData);

        if (!savedData || savedData.length === 0) {
          console.log('📭 No saved properties found');
          setSavedProperties([]);
          setLoading(false);
          return;
        }

        // Separate sales and rental IDs
        const salesIds = savedData
          .filter(p => p.property_type === 'sale')
          .map(p => p.property_id);
        
        const rentalIds = savedData
          .filter(p => p.property_type === 'rental')
          .map(p => p.property_id);

        console.log('🏠 Sales IDs to fetch:', salesIds);
        console.log('🏠 Rental IDs to fetch:', rentalIds);

        // Initialize results
        let salesData: any[] = [];
        let rentalsData: any[] = [];
        let stabilizedRentalsData: any[] = [];

        // Fetch property details from all relevant tables with proper error handling
        try {
          // Sales properties
          if (salesIds.length > 0) {
            const salesResult = await supabase
              .from('undervalued_sales')
              .select('*')
              .in('id', salesIds)
              .eq('status', 'active');
            
            if (salesResult.error) {
              console.error('❌ Error fetching sales:', salesResult.error);
            } else {
              salesData = salesResult.data || [];
              console.log('🏠 Sales data fetched:', salesData.length);
            }
          }

          // Regular rental properties
          if (rentalIds.length > 0) {
            const rentalsResult = await supabase
              .from('undervalued_rentals')
              .select('*')
              .in('id', rentalIds)
              .eq('status', 'active');
            
            if (rentalsResult.error) {
              console.error('❌ Error fetching rentals:', rentalsResult.error);
            } else {
              rentalsData = rentalsResult.data || [];
              console.log('🏠 Rentals data fetched:', rentalsData.length);
            }
          }

          // Rent stabilized properties (from For You page)
          if (rentalIds.length > 0) {
            const stabilizedResult = await supabase
              .from('undervalued_rent_stabilized')
              .select('*')
              .in('id', rentalIds)
              .eq('display_status', 'active');
            
            if (stabilizedResult.error) {
              console.error('❌ Error fetching stabilized rentals:', stabilizedResult.error);
            } else {
              stabilizedRentalsData = stabilizedResult.data || [];
              console.log('🏠 Stabilized rentals data fetched:', stabilizedRentalsData.length);
            }
          }

        } catch (fetchError) {
          console.error('❌ Error during property fetching:', fetchError);
          // Continue with partial data rather than failing completely
        }

        // Combine the results
        const combinedProperties: SavedPropertyWithDetails[] = savedData.map(savedProp => {
          let propertyDetails = null;
          
          if (savedProp.property_type === 'sale') {
            propertyDetails = salesData.find(p => p.id === savedProp.property_id) || null;
          } else {
            // Check both rental tables for rental properties
            propertyDetails = rentalsData.find(p => p.id === savedProp.property_id) || 
                             stabilizedRentalsData.find(p => p.id === savedProp.property_id) || 
                             null;
            
            // Mark rent-stabilized properties
            if (propertyDetails && stabilizedRentalsData.find(p => p.id === savedProp.property_id)) {
              propertyDetails.isRentStabilized = true;
            }
          }

          return {
            ...savedProp,
            property_type: savedProp.property_type as 'sale' | 'rental',
            property_details: propertyDetails
          };
        });

        console.log('🔗 Combined properties:', combinedProperties);

        // Filter out properties that no longer exist
        const activeProperties = combinedProperties.filter(p => p.property_details !== null);
        console.log('✅ Active properties to display:', activeProperties.length);
        
        setSavedProperties(activeProperties);

      } catch (error) {
        console.error('❌ Unexpected error fetching saved properties:', error);
        setError('Failed to load saved properties');
        setSavedProperties([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSavedProperties();
    }
  }, [user]);

  const getGradeColors = (grade: string) => {
    if (grade === 'A+') {
      return {
        badge: 'bg-white/20 backdrop-blur-md border-white/30 text-white',
        scoreText: 'text-yellow-400',
        scoreBorder: 'border-yellow-600',
        hover: 'hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:border-yellow-400/40'
      };
    } else if (grade === 'A' || grade === 'A-') {
      return {
        badge: 'bg-white/20 backdrop-blur-md border-white/30 text-white',
        scoreText: 'text-purple-400',
        scoreBorder: 'border-purple-600',
        hover: 'hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:border-purple-400/40'
      };
    } else if (grade.startsWith('B')) {
      return {
        badge: 'bg-white/20 backdrop-blur-md border-white/30 text-white',
        scoreText: 'text-blue-400',
        scoreBorder: 'border-blue-600',
        hover: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-blue-400/40'
      };
    } else {
      return {
        badge: 'bg-white/20 backdrop-blur-md border-white/30 text-white',
        scoreText: 'text-gray-300',
        scoreBorder: 'border-gray-600',
        hover: 'hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:border-white/40'
      };
    }
  };

  // Show loading state without user check to prevent flash
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-inter">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="text-lg tracking-tight">Loading your saved properties...</div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect check after loading
  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white font-inter">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
              Find the best deals you've saved. Actually.
            </h1>
            <div className="text-red-400 mb-8">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-black px-8 py-3 rounded-full font-semibold tracking-tight hover:bg-gray-100 hover:scale-105 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
            Find the best deals you've saved. Actually.
          </h1>
          <p className="text-xl text-gray-400 tracking-tight">
            {savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} saved
          </p>
        </div>

        {savedProperties.length === 0 ? (
          <div className="text-center py-16">
            <Home className="h-16 w-16 mx-auto mb-6 text-gray-600" />
            <h2 className="text-2xl font-bold mb-4 tracking-tight">Nothing saved... yet</h2>
            <p className="text-gray-400 mb-8 tracking-tight">
                Click the <Bookmark size={16} className="inline-block -mt-1" /> to save listings you love.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/buy')}
                className="bg-white text-black px-8 py-3 rounded-full font-semibold tracking-tight hover:bg-gray-100 hover:scale-105 transition-all duration-300"
              >
                Browse Sales
              </button>
              <button
                onClick={() => navigate('/rent')}
                className="bg-gray-900 text-white border border-gray-700 px-8 py-3 rounded-full font-semibold tracking-tight hover:bg-gray-800 hover:scale-105 transition-all duration-300"
              >
                Browse Rentals
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {savedProperties.map((savedProp) => {
              const property = savedProp.property_details!;
              const isRental = savedProp.property_type === 'rental';
              const gradeColors = getGradeColors(property.grade || 'C');
              
              return (
                <PropertyCard
                  key={`${savedProp.property_id}-${savedProp.property_type}`}
                  property={property}
                  isRental={isRental}
                  onClick={() => setSelectedProperty(property)}
                  gradeColors={gradeColors}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          isRental={selectedProperty.monthly_rent ? true : false}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default SavedProperties;
