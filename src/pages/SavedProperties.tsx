import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PropertyCard from '@/components/PropertyCard';

interface SavedPropertyWithDetails {
  id: string;
  user_id: string;
  property_id: string;
  property_type: 'sale' | 'rental';
  saved_at: string;
  property_details: any;
}

const SavedProperties = () => {
  const { user } = useAuth();
  const [savedPropertiesWithDetails, setSavedPropertiesWithDetails] = useState<SavedPropertyWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSavedPropertiesWithDetails = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data: savedProps, error } = await supabase
        .from('saved_properties')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const propertiesWithDetails = await Promise.all(
        savedProps.map(async (savedProp) => {
          let propertyDetails = null;
          
          try {
            if (savedProp.property_type === 'sale') {
              const { data } = await supabase
                .from('undervalued_sales')
                .select('*')
                .eq('id', savedProp.property_id)
                .single();
              propertyDetails = data;
            } else {
              const { data } = await supabase
                .from('undervalued_rentals')
                .select('*')
                .eq('id', savedProp.property_id)
                .single();
              propertyDetails = data;
            }
          } catch (error) {
            console.error('Error fetching property details:', error);
          }

          return {
            ...savedProp,
            property_type: savedProp.property_type as 'sale' | 'rental',
            property_details: propertyDetails,
          };
        })
      );

      setSavedPropertiesWithDetails(propertiesWithDetails);
    } catch (error) {
      console.error('Error fetching saved properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPropertiesWithDetails();
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 tracking-tight">Saved Properties</h1>
        {isLoading ? (
          <p>Loading saved properties...</p>
        ) : savedPropertiesWithDetails.length === 0 ? (
          <p>No properties saved yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPropertiesWithDetails.map((savedProperty) => (
              <PropertyCard
                key={savedProperty.id}
                property={savedProperty.property_details}
                isRental={savedProperty.property_type === 'rental'}
                onClick={() => {
                  // Handle click action here, e.g., navigate to property details page
                  console.log(`Clicked property with ID: ${savedProperty.property_id}`);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedProperties;
