import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Activity, CheckCircle, XCircle, Smartphone } from 'lucide-react';
import axios from 'axios';

const DriverTracker = () => {
    const [tracking, setTracking] = useState(false);
    const [error, setError] = useState(null);
    const [selectedBus, setSelectedBus] = useState('BUS-001');
    const [availableBuses] = useState(['BUS-001', 'BUS-002', 'BUS-003']);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [updateCount, setUpdateCount] = useState(0);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [watchId, setWatchId] = useState(null);

    useEffect(() => {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            setError('GPS not supported by your browser');
            return;
        }

        // Start tracking
        startTracking();

        // Cleanup on unmount
        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [selectedBus]);

    const startTracking = () => {
        setError(null);
        setTracking(false);

        const id = navigator.geolocation.watchPosition(
            (position) => {
                const locationData = {
                    busId: selectedBus,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    speed: position.coords.speed || 0,
                    heading: position.coords.heading || 0
                };

                // Update local state
                setCurrentLocation(locationData);
                setTracking(true);
                setLastUpdate(new Date());

                // Send to backend
                axios.post('/api/bus/location', locationData, {
                    withCredentials: true
                })
                    .then(() => {
                        setUpdateCount(prev => prev + 1);
                    })
                    .catch((err) => {
                        console.error('Failed to send location:', err);
                        setError('Failed to update location on server');
                    });
            },
            (err) => {
                console.error('Geolocation error:', err);
                setTracking(false);

                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError('GPS permission denied. Please enable location access.');
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError('Location information unavailable. Check your GPS settings.');
                        break;
                    case err.TIMEOUT:
                        setError('Location request timed out. Please try again.');
                        break;
                    default:
                        setError('An unknown error occurred while tracking location.');
                }
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 10000
            }
        );

        setWatchId(id);
    };

    const handleBusChange = (e) => {
        // Clear previous watch
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
        }
        setSelectedBus(e.target.value);
        setUpdateCount(0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-full mb-4">
                        <MapPin className="w-10 h-10 text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Driver GPS Tracker
                    </h1>
                    <p className="text-slate-400">
                        Keep this page open to transmit your location
                    </p>
                </div>

                {/* Bus Selector */}
                <div className="glass-card rounded-xl p-6 mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Select Bus
                    </label>
                    <select
                        value={selectedBus}
                        onChange={handleBusChange}
                        className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                        {availableBuses.map(bus => (
                            <option key={bus} value={bus} className="bg-slate-800">
                                {bus}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status Card */}
                <div className="glass-card rounded-xl p-8 mb-6">
                    {/* Tracking Status */}
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            {tracking ? (
                                <>
                                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                                    <div>
                                        <div className="text-xl font-bold text-white">GPS Active</div>
                                        <div className="text-sm text-emerald-400">Tracking {selectedBus}</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-8 h-8 text-slate-400" />
                                    <div>
                                        <div className="text-xl font-bold text-white">GPS Inactive</div>
                                        <div className="text-sm text-slate-400">Waiting for location...</div>
                                    </div>
                                </>
                            )}
                        </div>
                        {tracking && (
                            <div className="animate-pulse">
                                <Activity className="w-8 h-8 text-blue-400" />
                            </div>
                        )}
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <div className="flex items-center gap-2">
                                <XCircle className="w-5 h-5 text-red-400" />
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Location Data */}
                    {currentLocation && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-lg p-4">
                                    <div className="text-xs text-slate-400 mb-1">Latitude</div>
                                    <div className="text-lg font-bold text-white">
                                        {currentLocation.lat.toFixed(6)}°
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4">
                                    <div className="text-xs text-slate-400 mb-1">Longitude</div>
                                    <div className="text-lg font-bold text-white">
                                        {currentLocation.lng.toFixed(6)}°
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-lg p-4">
                                    <div className="text-xs text-slate-400 mb-1">Speed</div>
                                    <div className="text-lg font-bold text-white">
                                        {currentLocation.speed ?
                                            `${(currentLocation.speed * 3.6).toFixed(1)} km/h` :
                                            'Stationary'}
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4">
                                    <div className="text-xs text-slate-400 mb-1">Heading</div>
                                    <div className="text-lg font-bold text-white flex items-center gap-2">
                                        {currentLocation.heading !== null ? (
                                            <>
                                                <Navigation
                                                    className="w-4 h-4"
                                                    style={{ transform: `rotate(${currentLocation.heading}deg)` }}
                                                />
                                                {currentLocation.heading.toFixed(0)}°
                                            </>
                                        ) : (
                                            'N/A'
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Card */}
                <div className="glass-card rounded-xl p-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <div className="text-3xl font-bold text-blue-400 mb-1">
                                {updateCount}
                            </div>
                            <div className="text-xs text-slate-400">Updates Sent</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-emerald-400 mb-1">
                                {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : '--:--:--'}
                            </div>
                            <div className="text-xs text-slate-400">Last Update</div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-6 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                        <Smartphone className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div className="text-sm text-slate-300">
                            <p className="font-semibold text-white mb-2">Important:</p>
                            <ul className="space-y-1 text-slate-400">
                                <li>• Keep this page open and your phone unlocked</li>
                                <li>• Ensure location services are enabled</li>
                                <li>• Keep your phone charged or connected to power</li>
                                <li>• Your location is transmitted automatically</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverTracker;
