
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { Coordinates } from '@/utils/geocoding';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  `),
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  `),
  shadowUrl: '',
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25]
});

interface MiniMapProps {
  coordinates: Coordinates;
  address: string;
  onClick: () => void;
}

const MiniMap: React.FC<MiniMapProps> = ({ coordinates, address, onClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !coordinates) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [coordinates.lat, coordinates.lng],
      zoom: 15,
      zoomControl: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
      boxZoom: false,
      keyboard: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Add dark tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '',
      maxZoom: 19
    }).addTo(map);

    // Add marker
    const marker = L.marker([coordinates.lat, coordinates.lng]).addTo(map);

    // Add click handler to entire map
    map.on('click', onClick);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates, onClick]);

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
        ref={mapRef} 
        className="w-full h-48 rounded-xl border border-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
        style={{ 
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
        }}
      />
      <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
        Click to expand
      </div>
    </div>
  );
};

export default MiniMap;
