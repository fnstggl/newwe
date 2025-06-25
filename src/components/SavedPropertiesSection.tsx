
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, MapPin, Home, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { UndervaluedSales, UndervaluedRentals } from '@/types/database';
import PropertyImage from './PropertyImage';

interface SavedPropertyWithDetails {
  id: string;
  property_id: string;
  property_type: 'sale' | 'rental';
  saved_at: string;
  property_details: UndervaluedSales | UndervaluedRentals | null;
}

const SavedPropertiesSection: React.FC = () => {
  const { user } = useAuth();
  const { savedProperties, unsaveProperty, loading } = useSavedProperties();
  const [propertiesWithDetails, setPropertiesWithDetails] = useState<SavedPropertyWithDetails[]>([]);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  const fetchPropertyDetails = async () => {
    if (!savedProperties.length) {
      setPropertiesWithDetails([]);
      return;
    }

    setFetchingDetails(true);
    try {
      const salesIds = savedProperties
        .filter(p => p.property_type === 'sale')
        .map(p => p.property_id);
      
      const rentalIds = savedProperties
        .filter(p => p.property_type === 'rental')
        .map(p => p.property_id);

      // Fetch sales properties
      const salesPromise = salesIds.length > 0 
        ? supabase
            .from('undervalued_sales')
            .select('*')
            .in('id', salesIds)
            .eq('status', 'active') // Only active listings
        : Promise.resolve({ data: [], error: null });

      // Fetch rental properties
      const rentalsPromise = rentalIds.length > 0
        ? supabase
            .from('undervalued_rentals')
            .select('*')
            .in('id', rentalIds)
            .eq('status', 'active') // Only active listings
        : Promise.resolve({ data: [], error: null });

      const [salesResult, rentalsResult] = await Promise.all([salesPromise, rentalsPromise]);

      if (salesResult.error) throw salesResult.error;
      if (rentalsResult.error) throw rentalsResult.error;

      // Combine the results with saved property data
      const combinedProperties: SavedPropertyWithDetails[] = savedProperties.map(savedProp => {
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

      // Filter out properties that no longer exist (property_details is null)
      const activeProperties = combinedProperties.filter(p => p.property_details !== null);
      
      // If some properties were removed, clean up the saved_properties table
      const removedProperties = combinedProperties.filter(p => p.property_details === null);
      if (removedProperties.length > 0) {
        for (const removed of removedProperties) {
          await unsaveProperty(removed.property_id, removed.property_type);
        }
      }

      setPropertiesWithDetails(activeProperties);
    } catch (error) {
      console.error('Error fetching property details:', error);
    } finally {
      setFetchingDetails(false);
    }
  };

  const handleUnsave = async (propertyId: string, propertyType: 'sale' | 'rental') => {
    await unsaveProperty(propertyId, propertyType);
    // Remove from local state
    setPropertiesWithDetails(prev => 
      prev.filter(p => !(p.property_id === propertyId && p.property_type === propertyType))
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    if (savedProperties.length > 0) {
      fetchPropertyDetails();
    } else {
      setPropertiesWithDetails([]);
    }
  }, [savedProperties]);

  if (loading || fetchingDetails) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Saved Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-400">Loading saved properties...</div>
        </CardContent>
      </Card>
    );
  }

  if (propertiesWithDetails.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Saved Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-400 text-center py-8">
            <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No saved properties yet.</p>
            <p className="text-sm mt-2">Browse properties and click the bookmark icon to save them here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">
          Saved Properties ({propertiesWithDetails.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {propertiesWithDetails.map((savedProp) => {
          const property = savedProp.property_details!;
          const isRental = savedProp.property_type === 'rental';
          const price = isRental 
            ? (property as UndervaluedRentals).monthly_rent 
            : (property as UndervaluedSales).price;

          return (
            <div key={`${savedProp.property_id}-${savedProp.property_type}`} className="border border-gray-700 rounded-lg p-4">
              <div className="flex gap-4">
                {/* Property Image */}
                <div className="w-32 h-24 flex-shrink-0">
                  <PropertyImage
                    images={property.images}
                    address={property.address}
                    className="w-full h-full rounded-lg"
                  />
                </div>

                {/* Property Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg truncate">
                        {property.address}
                      </h3>
                      <div className="flex items-center text-gray-400 text-sm mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {property.neighborhood && `${property.neighborhood}, `}
                        {property.borough}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnsave(savedProp.property_id, savedProp.property_type)}
                      className="text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-white font-bold">
                        {formatPrice(price)}{isRental ? '/mo' : ''}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>{property.bedrooms || 0}bd</span>
                        <span>{property.bathrooms || 0}ba</span>
                        {property.sqft && <span>{property.sqft}sqft</span>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                        {isRental ? 'Rental' : 'Sale'}
                      </Badge>
                      <Badge className="bg-white/20 border-white text-white text-xs">
                        {property.grade}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SavedPropertiesSection;
