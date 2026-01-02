import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Bus } from 'lucide-react';
import { busRoute } from '../services/mockDataService';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom bus icon
const createBusIcon = () => {
    return L.divIcon({
        html: `
      <div style="
        background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 6v6"></path>
          <path d="M15 6v6"></path>
          <path d="M2 12h19.6"></path>
          <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"></path>
          <circle cx="7" cy="18" r="2"></circle>
          <circle cx="17" cy="18" r="2"></circle>
        </svg>
      </div>
    `,
        className: 'custom-bus-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });
};

// Component to animate map center
function MapUpdater({ position }) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom(), {
                duration: 2,
            });
        }
    }, [position, map]);

    return null;
}

const BusMap = ({ currentPosition }) => {
    const center = currentPosition || busRoute[0];

    return (
        <div className="glass-card rounded-xl overflow-hidden h-full">
            <MapContainer
                center={center}
                zoom={8}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {/* Route Polyline */}
                <Polyline
                    positions={busRoute}
                    pathOptions={{
                        color: '#3b82f6',
                        weight: 4,
                        opacity: 0.7,
                        dashArray: '10, 10',
                    }}
                />

                {/* Bus Marker */}
                {currentPosition && (
                    <Marker position={currentPosition} icon={createBusIcon()} />
                )}

                {/* Start and End Markers */}
                <Marker position={busRoute[0]}>
                </Marker>
                <Marker position={busRoute[busRoute.length - 1]}>
                </Marker>

                <MapUpdater position={currentPosition} />
            </MapContainer>
        </div>
    );
};

export default BusMap;
