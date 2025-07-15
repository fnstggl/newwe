
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Coordinates } from '@/utils/geocoding';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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
  if (!isOpen) return null;

  // Calculate center position
  const validProperties = properties.filter(p => p.coordinates);
  if (validProperties.length === 0) return null;

  const center = centerProperty 
    ? [centerProperty.coordinates.lat, centerProperty.coordinates.lng] as [number, number]
    : [validProperties[0].coordinates.lat, validProperties[0].coordinates.lng] as [number, number];

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
        <div className="w-full h-full pt-16">
          <MapContainer
            center={center}
            zoom={validProperties.length === 1 ? 15 : 12}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© OpenStreetMap contributors'
            />
            
            {validProperties.map((property, index) => (
              <Marker
                key={`${property.address}-${index}`}
                position={[property.coordinates.lat, property.coordinates.lng]}
              >
                <Popup>
                  <div style={{ color: 'black', fontFamily: 'system-ui' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      {property.type === 'rental' || property.type === 'rent-stabilized'
                        ? `$${property.price.toLocaleString()}/mo`
                        : `$${property.price.toLocaleString()}`}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                      {property.type === 'sale' ? 'For Sale' : 
                       property.type === 'rental' ? 'For Rent' : 
                       'Rent-Stabilized'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#888' }}>
                      {property.address}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>For Sale</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>For Rent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span>Rent-Stabilized</span>
          </div>
          {centerProperty && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white rounded-full border-2 border-gray-400"></div>
              <span>Current Property</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullScreenMap;
