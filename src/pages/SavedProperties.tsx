
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, MapPin, Home } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { UndervaluedSales, UndervaluedRentals } from "@/types/database";
import PropertyCard from "../components/PropertyCard";
import PropertyDetail from "../components/PropertyDetail";
import { Heart } from "lucide-react"; // if not already imported

interface SavedProperty {
  id: string;
  property_id: string;
  property_type: 'sale' | 'rental';
  saved_at: string;
  user_id?: string;
}

interface SavedPropertyWithDetails extends SavedProperty {
  property_details: UndervaluedSales | UndervaluedRentals | null;
}

const SavedProperties = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedProperties, setSavedProperties] = useState<SavedPropertyWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);

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
      try {
        // Get saved properties from user
        const { data: savedData, error: savedError } = await supabase
          .from('saved_properties')
          .select('*')
          .eq('user_id', user.id)
          .order('saved_at', { ascending: false });

        if (savedError) throw savedError;

        if (!savedData || savedData.length === 0) {
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

        // Fetch property details
        const salesPromise = salesIds.length > 0 
          ? supabase
              .from('undervalued_sales')
              .select('*')
              .in('id', salesIds)
              .eq('status', 'active')
          : Promise.resolve({ data: [], error: null });

        const rentalsPromise = rentalIds.length > 0
          ? supabase
              .from('undervalued_rentals')
              .select('*')
              .in('id', rentalIds)
              .eq('status', 'active')
          : Promise.resolve({ data: [], error: null });

        const [salesResult, rentalsResult] = await Promise.all([salesPromise, rentalsPromise]);

        if (salesResult.error) throw salesResult.error;
        if (rentalsResult.error) throw rentalsResult.error;

        // Combine the results
        const combinedProperties: SavedPropertyWithDetails[] = savedData.map(savedProp => {
          let propertyDetails = null;
          
          if (savedProp.property_type === 'sale') {
            propertyDetails = (salesResult.data || []).find(p => p.id === savedProp.property_id) || null;
          } else {
            propertyDetails = (rentalsResult.data || []).find(p => p.id === savedProp.property_id) || null;
          }

          return {
            ...savedProp,
            property_type: savedProp.property_type as 'sale' | 'rental',
            property_details: propertyDetails
          };
        });

        // Filter out properties that no longer exist
        const activeProperties = combinedProperties.filter(p => p.property_details !== null);
        setSavedProperties(activeProperties);

      } catch (error) {
        console.error('Error fetching saved properties:', error);
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

  if (!user) {
    return null;
  }

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

            <h2 className="text-2xl font-bold mb-4 tracking-tight">Nothing saved... yet</h2>
            <p className="text-gray-400 mb-8 tracking-tight">
                  Click the <Heart size={16} className="inline-block -mt-1 text-red-500" /> to save listings you love.
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
              const gradeColors = getGradeColors(property.grade);
              
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
