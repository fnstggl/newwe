
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Coordinates } from '@/utils/geocoding';

interface PropertyLocation {
  address: string;
  coordinates: Coordinates;
  price: number;
  type: 'sale' | 'rental' | 'rent-stabilized';
  isCurrentProperty?: boolean;
}

interface FullScreenMapProps {
  isOpen: boolean;
  onClose: () => void;
  properties: PropertyLocation[];
  centerProperty?: PropertyLocation;
}

const FullScreenMap: React.FC<FullScreenMapProps> = ({ 
  isOpen, 
  onClose, 
  properties, 
  centerProperty 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!isOpen || !mapRef.current) return;

    // Calculate bounds for all properties
    const validProperties = properties.filter(p => p.coordinates);
    if (validProperties.length === 0) return;

    const bounds = L.latLngBounds(validProperties.map(p => [p.coordinates.lat, p.coordinates.lng]));
    
    // Initialize map
    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Add dark tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Add markers for all properties
    validProperties.forEach(property => {
      const iconHtml = `
        <div style="
          background: ${property.isCurrentProperty ? '#3b82f6' : 'white'};
          border: 2px solid ${property.isCurrentProperty ? 'white' : '#374151'};
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          color: ${property.isCurrentProperty ? 'white' : 'black'};
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          ${property.type === 'sale' ? '$' : property.type === 'rental' ? 'R' : 'S'}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });

      const marker = L.marker([property.coordinates.lat, property.coordinates.lng], {
        icon: customIcon
      }).addTo(map);

      // Format price based on type
      const formattedPrice = property.type === 'rental' || property.type === 'rent-stabilized'
        ? `$${property.price.toLocaleString()}/mo`
        : `$${property.price.toLocaleString()}`;

      const typeLabel = property.type === 'sale' ? 'For Sale' : 
                       property.type === 'rental' ? 'For Rent' : 
                       'Rent-Stabilized';

      // Add popup with price and property info
      marker.bindPopup(`
        <div style="color: black; font-family: system-ui;">
          <div style="font-weight: bold; margin-bottom: 4px;">${formattedPrice}</div>
          <div style="font-size: 12px; color: #666; margin-bottom: 4px;">${typeLabel}</div>
          <div style="font-size: 11px; color: #888;">${property.address}</div>
        </div>
      `);

      // Show popup on hover
      marker.on('mouseover', function() {
        this.openPopup();
      });

      marker.on('mouseout', function() {
        this.closePopup();
      });
    });

    // Fit map to show all properties
    if (validProperties.length === 1) {
      map.setView([validProperties[0].coordinates.lat, validProperties[0].coordinates.lng], 15);
    } else {
      map.fitBounds(bounds, { padding: [20, 20] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, properties]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Property Locations</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-gray-800"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Map */}
        <div 
          ref={mapRef} 
          className="w-full h-full pt-16"
          style={{ 
            filter: 'contrast(1.1) brightness(0.9)',
          }}
        />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white rounded-full border-2 border-gray-400 flex items-center justify-center text-black font-bold text-[10px]">$</div>
            <span>For Sale</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white rounded-full border-2 border-gray-400 flex items-center justify-center text-black font-bold text-[10px]">R</div>
            <span>For Rent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white rounded-full border-2 border-gray-400 flex items-center justify-center text-black font-bold text-[10px]">S</div>
            <span>Rent-Stabilized</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
            <span>Current Property</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenMap;
