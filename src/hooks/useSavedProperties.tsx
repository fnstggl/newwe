
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SavedProperty {
  id: string;
  property_id: string;
  property_type: 'sale' | 'rental';
  saved_at: string;
  user_id: string;
}

export const useSavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSavedProperties = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Type assertion to ensure proper typing
      setSavedProperties((data || []).map(item => ({
        ...item,
        property_type: item.property_type as 'sale' | 'rental'
      })));
    } catch (error) {
      console.error('Error fetching saved properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedProperties();
  }, [user]);

  const saveProperty = async (propertyId: string, propertyType: 'sale' | 'rental') => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('saved_properties')
        .insert([
          {
            user_id: user.id,
            property_id: propertyId,
            property_type: propertyType
          }
        ]);

      if (error) throw error;

      await fetchSavedProperties();
      toast({
        title: "Property saved!",
        description: "Property has been added to your saved list.",
      });
      return true;
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Error",
        description: "Failed to save property. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeSavedProperty = async (propertyId: string, propertyType: 'sale' | 'rental') => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId)
        .eq('property_type', propertyType);

      if (error) throw error;

      await fetchSavedProperties();
      toast({
        title: "Property removed",
        description: "Property has been removed from your saved list.",
      });
      return true;
    } catch (error) {
      console.error('Error removing saved property:', error);
      toast({
        title: "Error",
        description: "Failed to remove property. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const isPropertySaved = (propertyId: string, propertyType: 'sale' | 'rental') => {
    return savedProperties.some(
      prop => prop.property_id === propertyId && prop.property_type === propertyType
    );
  };

  return {
    savedProperties,
    isLoading,
    saveProperty,
    removeSavedProperty,
    isPropertySaved,
    refetch: fetchSavedProperties
  };
};
