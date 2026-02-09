import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { busRoute } from '../services/mockDataService';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom bus icon - changes color based on status
const createBusIcon = (isOnline = true) => {
    const bgColor = isOnline
        ? 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'
        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';

    return L.divIcon({
        html: `
      <div style="
        background: ${bgColor};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: pulse 2s infinite;
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
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      </style>
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
                duration: 1.5,
            });
        }
    }, [position, map]);

    return null;
}

const BusMap = ({ currentPosition, busData }) => {
    const center = currentPosition || busRoute[0];

    // Determine if bus is online based on lastUpdated timestamp
    const isOnline = busData?.lastUpdated
        ? (new Date() - new Date(busData.lastUpdated)) / 1000 < 15
        : false;

    // Format time ago
    const getTimeAgo = (timestamp) => {
        if (!timestamp) return 'Never';
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        return `${Math.floor(seconds / 3600)}h ago`;
    };

    return (
        <div className="glass-card rounded-xl overflow-hidden h-full relative">
            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-semibold text-slate-900">
                        {isOnline ? 'ONLINE' : 'OFFLINE'}
                    </span>
                </div>
            </div>

            <MapContainer
                center={center}
                zoom={13}
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
                        opacity: 0.5,
                        dashArray: '10, 10',
                    }}
                />

                {/* Bus Marker with Popup */}
                {currentPosition && (
                    <Marker position={currentPosition} icon={createBusIcon(isOnline)}>
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-bold text-lg mb-2">
                                    {busData?.busId || 'Bus Location'}
                                </h3>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-600">Status:</span>
                                        <span className={`font-semibold ${isOnline ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {isOnline ? 'ONLINE' : 'OFFLINE'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-600">Speed:</span>
                                        <span className="font-semibold">
                                            {busData?.speed ? `${(busData.speed * 3.6).toFixed(1)} km/h` : '0 km/h'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-600">Heading:</span>
                                        <span className="font-semibold">
                                            {busData?.heading !== undefined ? `${busData.heading.toFixed(0)}°` : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-600">Updated:</span>
                                        <span className="font-semibold">
                                            {getTimeAgo(busData?.lastUpdated)}
                                        </span>
                                    </div>
                                    <div className="border-t pt-1 mt-2">
                                        <div className="text-xs text-slate-500">
                                            {currentPosition[0].toFixed(6)}, {currentPosition[1].toFixed(6)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Start and End Markers */}
                <Marker position={busRoute[0]}>
                    <Popup>
                        <div className="font-semibold">Start: Anna University</div>
                    </Popup>
                </Marker>
                <Marker position={busRoute[busRoute.length - 1]}>
                    <Popup>
                        <div className="font-semibold">End: Tambaram</div>
                    </Popup>
                </Marker>

                <MapUpdater position={currentPosition} />
            </MapContainer>
        </div>
    );
};

export default BusMap;
