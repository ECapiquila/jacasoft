'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export interface LeafletMapProps {
  markers: Array<{
    id: string;
    position: [number, number];
    title: string;
  }>;
}

export function LeafletMap({ markers }: LeafletMapProps) {
  return (
    <MapContainer
      center={markers[0]?.position ?? [-8.839, 13.289]}
      zoom={12}
      scrollWheelZoom={false}
      className="h-80 w-full rounded-3xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker key={marker.id} position={marker.position} icon={defaultIcon}>
          <Popup>{marker.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
