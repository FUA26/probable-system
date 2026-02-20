import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons not showing in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  currentLocation: { lat: number; lng: number } | null;
  officeLocation: { lat: number; lng: number; radius: number } | null;
}

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

export const MapComponent: React.FC<MapComponentProps> = ({ currentLocation, officeLocation }) => {
  const defaultCenter = officeLocation 
    ? [officeLocation.lat, officeLocation.lng] as [number, number]
    : [-7.983908, 112.621391] as [number, number]; // Default to Malang

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        dragging={true}
        touchZoom={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Office Location */}
        {officeLocation && (
          <>
            <Marker position={[officeLocation.lat, officeLocation.lng]}>
              <Popup>
                <div className="text-center">
                  <p className="font-bold">Lokasi Kantor</p>
                  <p className="text-xs">Radius: {officeLocation.radius}m</p>
                </div>
              </Popup>
            </Marker>
            <Circle 
              center={[officeLocation.lat, officeLocation.lng]} 
              radius={officeLocation.radius} 
              pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, color: 'blue' }} 
            />
          </>
        )}

        {/* Current Location */}
        {currentLocation && (
          <>
            <Marker position={[currentLocation.lat, currentLocation.lng]}>
              <Popup>Lokasi Anda</Popup>
            </Marker>
            <Circle 
              center={[currentLocation.lat, currentLocation.lng]} 
              radius={20} 
              pathOptions={{ fillColor: 'green', fillOpacity: 0.2, color: 'green' }} 
            />
            <RecenterMap lat={currentLocation.lat} lng={currentLocation.lng} />
          </>
        )}
      </MapContainer>
    </div>
  );
};
