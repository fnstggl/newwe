
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, MapPin, Home } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { UndervaluedSales, UndervaluedRentals } from "@/types/database";
import PropertyImage from "../components/PropertyImage";

interface SavedProperty {
  id: string;
  property_id: string;
  property_type: 'sale' | 'rental';
  saved_at: string;
}

interface SavedPropertyWithDetails extends SavedProperty {
  property_details: UndervaluedSales | UndervaluedRentals | null;
}

const SavedProperties = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedProperties, setSavedProperties] = useState<SavedPropertyWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleUnsave = async (propertyId: string, propertyType: 'sale' | 'rental') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId)
        .eq('property_type', propertyType);

      if (error) throw error;
      
      // Update local state
      setSavedProperties(prev => 
        prev.filter(p => !(p.property_id === propertyId && p.property_type === propertyType))
      );
    } catch (error) {
      console.error('Error unsaving property:', error);
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
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
            Your Saved Properties
          </h1>
          <p className="text-xl text-gray-400 tracking-tight">
            {savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} saved
          </p>
        </div>

        {savedProperties.length === 0 ? (
          <div className="text-center py-16">
            <Home className="h-16 w-16 mx-auto mb-6 text-gray-600" />
            <h2 className="text-2xl font-bold mb-4 tracking-tight">No saved properties yet</h2>
            <p className="text-gray-400 mb-8 tracking-tight">
              Browse properties and click the bookmark icon to save them here.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedProperties.map((savedProp) => {
              const property = savedProp.property_details!;
              const isRental = savedProp.property_type === 'rental';
              const price = isRental 
                ? (property as UndervaluedRentals).monthly_rent 
                : (property as UndervaluedSales).price;

              return (
                <div
                  key={`${savedProp.property_id}-${savedProp.property_type}`}
                  className="bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/50 hover:scale-105 transition-all duration-300 hover:shadow-xl group cursor-pointer"
                >
                  {/* Property Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <PropertyImage
                      images={property.images}
                      address={property.address}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    {/* Unsave Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnsave(savedProp.property_id, savedProp.property_type);
                      }}
                      className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 p-2 rounded-full transition-all duration-200"
                    >
                      <Bookmark className="h-5 w-5 text-white fill-white" />
                    </button>

                    {/* Grade Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-3 py-1 rounded-full text-sm font-bold tracking-tight">
                        {property.grade}
                      </span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2 tracking-tight text-white">
                        {property.address}
                      </h3>
                      <div className="flex items-center text-gray-400 text-sm mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.neighborhood && `${property.neighborhood}, `}
                        {property.borough}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-white tracking-tight">
                        {formatPrice(price)}{isRental ? '/mo' : ''}
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-400">
                        <span>{property.bedrooms || 0}bd</span>
                        <span>{property.bathrooms || 0}ba</span>
                        {property.sqft && <span>{property.sqft}sqft</span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs tracking-tight">
                        {isRental ? 'Rental' : 'Sale'}
                      </span>
                      <span className="text-xs text-gray-500 tracking-tight">
                        Saved {new Date(savedProp.saved_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedProperties;
