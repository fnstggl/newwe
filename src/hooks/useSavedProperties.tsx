
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UndervaluedSales, UndervaluedRentals } from '@/types/database';

interface SavedProperty {
  id: string;
  property_id: string;
  property_type: 'sale' | 'rental';
  saved_at: string;
}

export const useSavedProperties = () => {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSavedProperties = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .select('*')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) throw error;
      setSavedProperties((data || []).map(item => ({
        ...item,
        property_type: item.property_type as 'sale' | 'rental'
      })));
    } catch (error) {
      console.error('Error fetching saved properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProperty = async (propertyId: string, propertyType: 'sale' | 'rental') => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('saved_properties')
        .insert({
          user_id: user.id,
          property_id: propertyId,
          property_type: propertyType
        });

      if (error) throw error;
      
      // Update local state
      const newSavedProperty: SavedProperty = {
        id: crypto.randomUUID(),
        property_id: propertyId,
        property_type: propertyType,
        saved_at: new Date().toISOString()
      };
      setSavedProperties(prev => [newSavedProperty, ...prev]);
      return true;
    } catch (error) {
      console.error('Error saving property:', error);
      return false;
    }
  };

  const unsaveProperty = async (propertyId: string, propertyType: 'sale' | 'rental') => {
    if (!user) return false;

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
      return true;
    } catch (error) {
      console.error('Error unsaving property:', error);
      return false;
    }
  };

  const isSaved = (propertyId: string, propertyType: 'sale' | 'rental') => {
    return savedProperties.some(p => p.property_id === propertyId && p.property_type === propertyType);
  };

  useEffect(() => {
    if (user) {
      fetchSavedProperties();
    } else {
      setSavedProperties([]);
    }
  }, [user]);

  return {
    savedProperties,
    loading,
    saveProperty,
    unsaveProperty,
    isSaved,
    fetchSavedProperties
  };
};
