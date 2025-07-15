
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { Coordinates } from '@/utils/geocoding';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface MiniMapProps {
  coordinates: Coordinates | null;
  address: string;
  onClick: () => void;
}

const MiniMap: React.FC<MiniMapProps> = ({ coordinates, address, onClick }) => {
  if (!coordinates) {
    return (
      <div 
        className="w-full h-48 bg-gray-800/50 border border-gray-700 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-800/70 transition-colors"
        onClick={onClick}
      >
        <div className="text-center">
          <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Location unavailable</p>
          <p className="text-xs text-gray-500 mt-1">Click to view area map</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        className="w-full h-48 rounded-xl border border-gray-700 cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
        onClick={onClick}
        style={{ 
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
        }}
      >
        <MapContainer
          center={[coordinates.lat, coordinates.lng]}
          zoom={15}
          scrollWheelZoom={false}
          dragging={false}
          touchZoom={false}
          doubleClickZoom={false}
          boxZoom={false}
          keyboard={false}
          attributionControl={false}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© OpenStreetMap contributors'
          />
          <Marker position={[coordinates.lat, coordinates.lng]}>
            <Popup>{address}</Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
        Click to expand
      </div>
    </div>
  );
};

export default MiniMap;
