
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SavedProperty {
  id: string;
  user_id: string;
  property_id: string;
  property_type: 'sale' | 'rental';
  saved_at: string;
}

export const useSavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSavedProperties = async () => {
    if (!user) {
      setSavedProperties([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching saved properties:', error);
        return;
      }

      // Type-safe conversion
      const typedData: SavedProperty[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        property_id: item.property_id,
        property_type: item.property_type as 'sale' | 'rental',
        saved_at: item.saved_at
      }));

      setSavedProperties(typedData);
    } catch (error) {
      console.error('Error fetching saved properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProperty = async (propertyId: string, propertyType: 'sale' | 'rental') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_properties')
        .insert({
          user_id: user.id,
          property_id: propertyId,
          property_type: propertyType
        });

      if (error) {
        console.error('Error saving property:', error);
        return;
      }

      // Refresh the saved properties list
      await fetchSavedProperties();
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const removeSavedProperty = async (propertyId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);

      if (error) {
        console.error('Error removing saved property:', error);
        return;
      }

      // Refresh the saved properties list
      await fetchSavedProperties();
    } catch (error) {
      console.error('Error removing saved property:', error);
    }
  };

  const isPropertySaved = (propertyId: string) => {
    return savedProperties.some(prop => prop.property_id === propertyId);
  };

  useEffect(() => {
    fetchSavedProperties();
  }, [user]);

  return {
    savedProperties,
    loading,
    saveProperty,
    removeSavedProperty,
    isPropertySaved,
    refetch: fetchSavedProperties
  };
};
