import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bus, MapPin, Clock, Users, Armchair, TrendingUp } from 'lucide-react';
import { customerApi } from '../../services/customerApi';
import TripInfo from './TripInfo';
import LiveStatus from './LiveStatus';
import SeatMap from './SeatMap';

const CustomerDashboard = () => {
    const [tripInfo, setTripInfo] = useState(null);
    const [seatAvailability, setSeatAvailability] = useState(null);
    const [liveStatus, setLiveStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();

        // Auto-refresh every 5 seconds
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [trip, seats, status] = await Promise.all([
                customerApi.getTripInfo(),
                customerApi.getSeatAvailability(),
                customerApi.getLiveStatus()
            ]);

            setTripInfo(trip.data);
            setSeatAvailability(seats.data);
            setLiveStatus(status.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching customer data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white light:text-slate-900">Loading trip information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6" id="main-content">
            {/* Welcome Header */}
            <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <Bus className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white light:text-slate-900 mb-1">
                            Welcome Aboard!
                        </h1>
                        <p className="text-slate-400 light:text-slate-600">
                            Track your journey in real-time
                        </p>
                    </div>
                    {liveStatus && (
                        <div className="text-right">
                            <div className="flex items-center gap-2 justify-end mb-1">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-emerald-400 font-semibold">Live</span>
                            </div>
                            <p className="text-sm text-slate-400 light:text-slate-600">
                                Last updated: {new Date(liveStatus.lastUpdated).toLocaleTimeString()}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Available Seats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-xl p-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                            <Armchair className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-400 light:text-slate-600 mb-1">Available Seats</p>
                            <p className="text-3xl font-bold text-white light:text-slate-900">
                                {seatAvailability?.availableSeats || 0}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Occupancy */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card rounded-xl p-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-400 light:text-slate-600 mb-1">Occupancy</p>
                            <p className="text-3xl font-bold text-white light:text-slate-900">
                                {seatAvailability?.occupancyPercentage || 0}%
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Speed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card rounded-xl p-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-400 light:text-slate-600 mb-1">Current Speed</p>
                            <p className="text-3xl font-bold text-white light:text-slate-900">
                                {liveStatus?.speed || 0} km/h
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trip Info - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    <TripInfo tripInfo={tripInfo} />
                    <SeatMap />
                </div>

                {/* Live Status - 1 column */}
                <div>
                    <LiveStatus liveStatus={liveStatus} tripInfo={tripInfo} />
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
