
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard from "@/components/PropertyCard";
import { useAuth } from "@/contexts/AuthContext";

interface SavedProperty {
  id: string;
  user_id: string;
  property_id: string;
  property_type: 'sale' | 'rental';
  saved_at: string;
}

interface SavedPropertyWithDetails extends SavedProperty {
  property_details: any;
}

const SavedProperties = () => {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState<SavedPropertyWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedProperties = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: savedData, error: savedError } = await supabase
        .from('saved_properties')
        .select('*')
        .eq('user_id', user.id);

      if (savedError) {
        console.error('Error fetching saved properties:', savedError);
        return;
      }

      if (!savedData || savedData.length === 0) {
        setSavedProperties([]);
        setLoading(false);
        return;
      }

      // Fetch property details for each saved property
      const propertiesWithDetails = await Promise.all(
        savedData.map(async (saved) => {
          let propertyDetails = null;
          
          if (saved.property_type === 'sale') {
            const { data } = await supabase
              .from('undervalued_sales')
              .select('*')
              .eq('id', saved.property_id)
              .single();
            propertyDetails = data;
          } else if (saved.property_type === 'rental') {
            // Try rent stabilized first
            const { data: rentStabilizedData } = await supabase
              .from('undervalued_rent_stabilized')
              .select('*')
              .eq('id', saved.property_id)
              .single();
            
            if (rentStabilizedData) {
              propertyDetails = rentStabilizedData;
            } else {
              // Fallback to regular rentals
              const { data: rentalData } = await supabase
                .from('undervalued_rentals')
                .select('*')
                .eq('id', saved.property_id)
                .single();
              propertyDetails = rentalData;
            }
          }

          return {
            ...saved,
            property_type: saved.property_type as 'sale' | 'rental',
            property_details: propertyDetails
          };
        })
      );

      // Filter out properties where details couldn't be found
      const validProperties = propertiesWithDetails.filter(p => p.property_details !== null);
      setSavedProperties(validProperties);
    } catch (error) {
      console.error('Error fetching saved properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedProperties();
  }, [user]);

  if (!user) {
    return (
      <div className="font-inter min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
              Your Saved Properties
            </h1>
            <p className="text-xl text-gray-400 tracking-tight">
              Please log in to view your saved properties.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="mt-8 bg-white text-black px-8 py-3 rounded-full font-medium tracking-tight hover:bg-gray-200 transition-colors"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="font-inter min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading your saved properties...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-inter min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
            Your Saved Properties
          </h1>
          <p className="text-xl text-gray-400 tracking-tight">
            {savedProperties.length} saved propert{savedProperties.length === 1 ? 'y' : 'ies'}
          </p>
        </div>

        {savedProperties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">
              You haven't saved any properties yet.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Browse our listings and save properties you're interested in!
            </p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.href = '/buy'}
                className="block w-full max-w-xs mx-auto bg-white text-black px-8 py-3 rounded-full font-medium tracking-tight hover:bg-gray-200 transition-colors"
              >
                Browse Sales
              </button>
              <button
                onClick={() => window.location.href = '/rent'}
                className="block w-full max-w-xs mx-auto bg-gray-800 text-white px-8 py-3 rounded-full font-medium tracking-tight hover:bg-gray-700 transition-colors"
              >
                Browse Rentals
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedProperties.map((savedProperty) => (
              <PropertyCard 
                key={savedProperty.id}
                property={savedProperty.property_details}
                type={savedProperty.property_type === 'sale' ? 'sale' : 
                      savedProperty.property_details.rent_stabilized_confidence ? 'rent-stabilized' : 'rental'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedProperties;
