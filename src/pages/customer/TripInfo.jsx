import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Calendar } from 'lucide-react';

const TripInfo = ({ tripInfo }) => {
    if (!tripInfo) return null;

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getETA = () => {
        const eta = new Date(tripInfo.estimatedArrival);
        const now = new Date();
        const diff = eta - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6"
        >
            <h2 className="text-xl font-bold text-white light:text-slate-900 mb-6 flex items-center gap-2">
                <Navigation className="w-6 h-6 text-blue-400" />
                Trip Information
            </h2>

            {/* Route */}
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                        <div className="w-0.5 h-16 bg-gradient-to-b from-emerald-500 to-blue-500"></div>
                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <p className="text-sm text-slate-400 light:text-slate-600">From</p>
                            <p className="text-lg font-semibold text-white light:text-slate-900">
                                {tripInfo.origin}
                            </p>
                            <p className="text-sm text-slate-500">
                                Departed: {formatTime(tripInfo.departureTime)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 light:text-slate-600">To</p>
                            <p className="text-lg font-semibold text-white light:text-slate-900">
                                {tripInfo.destination}
                            </p>
                            <p className="text-sm text-slate-500">
                                ETA: {formatTime(tripInfo.estimatedArrival)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Current Status */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 light:border-slate-200">
                    <div>
                        <p className="text-sm text-slate-400 light:text-slate-600 mb-1">Current Stop</p>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            <p className="text-white light:text-slate-900 font-medium">
                                {tripInfo.currentStop}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400 light:text-slate-600 mb-1">Next Stop</p>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-emerald-400" />
                            <p className="text-white light:text-slate-900 font-medium">
                                {tripInfo.nextStop}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ETA Card */}
                <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Clock className="w-6 h-6 text-blue-400" />
                            <div>
                                <p className="text-sm text-slate-400 light:text-slate-600">Time Remaining</p>
                                <p className="text-2xl font-bold text-white light:text-slate-900">
                                    {getETA()}
                                </p>
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${tripInfo.status === 'On Time'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            }`}>
                            {tripInfo.status}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TripInfo;
