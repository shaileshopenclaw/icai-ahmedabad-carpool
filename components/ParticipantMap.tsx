'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import type { Participant } from './ParticipantCard';

// Fix for default Leaflet icons in Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// A green icon for riders offering seats
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle auto-zooming to bounds
function MapBounds({ participants }: { participants: Participant[] }) {
  const map = useMap();

  useEffect(() => {
    if (participants.length === 0) return;

    const bounds = L.latLngBounds(
      participants.map(p => [p.latitude || 0, p.longitude || 0])
    );
    
    // Check if bounds are valid
    if (bounds.isValid()) {
      // Add Ahmedabad roughly if only 1 participant
      if (participants.length === 1) {
         map.setView([participants[0].latitude!, participants[0].longitude!], 13);
      } else {
         map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    }
  }, [participants, map]);

  return null;
}

export default function ParticipantMap({ participants }: { participants: Participant[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[400px] bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading Map...</div>
      </div>
    );
  }

  // Default to Ahmedabad central coords if no valid participants
  const defaultCenter: [number, number] = [23.0225, 72.5714];

  // Filter participants to only those with valid coords
  const validParticipants = participants.filter(p => p.latitude && p.longitude);

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-slate-800 z-10 relative">
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {validParticipants.map(participant => (
          <Marker 
            key={participant.id} 
            position={[participant.latitude!, participant.longitude!]}
            icon={participant.is_offering_ride ? greenIcon : customIcon}
          >
            <Popup>
              <div className="font-sans text-slate-800 p-1">
                <div className="font-bold text-sm mb-1">{participant.name}</div>
                <div className="text-xs text-slate-600 mb-2">{participant.area_name}</div>
                <div className="text-xs font-medium mb-1">
                  {participant.is_offering_ride ? `Offering ${participant.seats_available} seats` : 'Needs a ride'}
                </div>
                <a 
                  href={`https://wa.me/${participant.whatsapp_number || participant.phone}`}
                  target="_blank"
                  className="text-xs text-emerald-600 hover:underline font-medium"
                >
                  WhatsApp Now
                </a>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapBounds participants={validParticipants} />
      </MapContainer>
    </div>
  );
}
