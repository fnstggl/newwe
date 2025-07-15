
import { useState, useEffect } from 'react';
import { geocodeAddresses, Coordinates } from '@/utils/geocoding';

interface GeocodedListing {
  address: string;
  coordinates: Coordinates | null;
  price: number;
  type: 'sale' | 'rental' | 'rent-stabilized';
}

export function useGeocodedListings(listings: any[]) {
  const [geocodedListings, setGeocodedListings] = useState<GeocodedListing[]>([]);
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    if (!listings || listings.length === 0) return;

    const geocodeListings = async () => {
      setIsGeocoding(true);
      
      try {
        // Extract unique addresses from all listings
        const addresses = [...new Set(listings.map(listing => listing.address).filter(Boolean))];
        
        // Geocode all addresses
        const coordinatesMap = await geocodeAddresses(addresses);
        
        // Map back to listings with proper type detection
        const geocoded = listings.map(listing => {
          const coordinates = coordinatesMap.get(listing.address) || null;
          
          let type: 'sale' | 'rental' | 'rent-stabilized' = 'sale';
          let price = 0;
          
          // Determine type and price based on listing properties
          if (listing.monthly_rent !== undefined) {
            // This is a rental property
            if (listing.rent_stabilized_confidence !== undefined || listing.isRentStabilized === true) {
              type = 'rent-stabilized';
            } else {
              type = 'rental';
            }
            price = listing.monthly_rent;
          } else if (listing.price !== undefined) {
            // This is a sale property
            type = 'sale';
            price = listing.price;
          }
          
          return {
            address: listing.address,
            coordinates,
            price,
            type
          };
        });
        
        setGeocodedListings(geocoded);
      } catch (error) {
        console.error('Error geocoding listings:', error);
        setGeocodedListings([]);
      } finally {
        setIsGeocoding(false);
      }
    };

    geocodeListings();
  }, [listings]);

  return { geocodedListings, isGeocoding };
}
