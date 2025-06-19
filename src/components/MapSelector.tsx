import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapSelectorProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  initialPosition?: { lat: number; lng: number };
  height?: string;
  className?: string;
}

interface LocationMarkerProps {
  position: LatLngExpression | null;
  onPositionChange: (lat: number, lng: number) => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ position, onPositionChange }) => {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

export const MapSelector: React.FC<MapSelectorProps> = ({
  onLocationSelect,
  initialPosition,
  height = '400px',
  className = ''
}) => {
  const [position, setPosition] = useState<LatLngExpression | null>(
    initialPosition ? [initialPosition.lat, initialPosition.lng] : null
  );
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userPos: LatLngExpression = [latitude, longitude];
          setUserLocation(userPos);
          
          // If no initial position, use user location
          if (!initialPosition) {
            setPosition(userPos);
            onLocationSelect(latitude, longitude);
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Default to Bangkok coordinates if geolocation fails
          const defaultPos: LatLngExpression = [13.7563, 100.5018];
          setUserLocation(defaultPos);
          if (!initialPosition) {
            setPosition(defaultPos);
            onLocationSelect(13.7563, 100.5018);
          }
        }
      );
    }
  }, [initialPosition, onLocationSelect]);

  const handlePositionChange = async (lat: number, lng: number) => {
    const newPosition: LatLngExpression = [lat, lng];
    setPosition(newPosition);
    
    // Reverse geocoding to get address
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      onLocationSelect(lat, lng, address);
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      onLocationSelect(lat, lng);
    }
  };

  const centerPosition = position || userLocation || [13.7563, 100.5018];

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <MapContainer
        center={centerPosition}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={position}
          onPositionChange={handlePositionChange}
        />
      </MapContainer>
      
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 z-[1000]">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Click on the map to select location
        </p>
        {position && (
          <div className="text-xs text-gray-600">
            <div>Lat: {(position as [number, number])[0].toFixed(6)}</div>
            <div>Lng: {(position as [number, number])[1].toFixed(6)}</div>
          </div>
        )}
      </div>
    </div>
  );
};