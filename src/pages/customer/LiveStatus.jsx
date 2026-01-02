import React from 'react';
import { motion } from 'framer-motion';
import { Activity, MapPin, Clock, Gauge } from 'lucide-react';

const LiveStatus = ({ liveStatus, tripInfo }) => {
    if (!liveStatus) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-xl p-6 h-full"
        >
            <h2 className="text-xl font-bold text-white light:text-slate-900 mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-emerald-400" />
                Live Status
            </h2>

            <div className="space-y-6">
                {/* Service Status */}
                <div>
                    <p className="text-sm text-slate-400 light:text-slate-600 mb-2">Service Status</p>
                    <div className={`px-4 py-3 rounded-lg border ${liveStatus.serviceStatus === 'On Time'
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-orange-500/10 border-orange-500/30'
                        }`}>
                        <p className={`font-semibold ${liveStatus.serviceStatus === 'On Time'
                                ? 'text-emerald-400'
                                : 'text-orange-400'
                            }`}>
                            {liveStatus.serviceStatus}
                        </p>
                    </div>
                </div>

                {/* Speed */}
                <div>
                    <p className="text-sm text-slate-400 light:text-slate-600 mb-2">Current Speed</p>
                    <div className="flex items-center gap-3">
                        <Gauge className="w-8 h-8 text-blue-400" />
                        <div>
                            <p className="text-3xl font-bold text-white light:text-slate-900">
                                {liveStatus.speed}
                            </p>
                            <p className="text-sm text-slate-400 light:text-slate-600">km/h</p>
                        </div>
                    </div>
                </div>

                {/* Next Stop */}
                <div>
                    <p className="text-sm text-slate-400 light:text-slate-600 mb-2">Next Stop</p>
                    <div className="bg-white/5 light:bg-slate-100 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-5 h-5 text-emerald-400" />
                            <p className="font-semibold text-white light:text-slate-900">
                                {liveStatus.nextStop}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <p className="text-slate-400 light:text-slate-600">
                                ETA: {liveStatus.etaToNextStop} minutes
                            </p>
                        </div>
                    </div>
                </div>

                {/* Seat Availability */}
                <div>
                    <p className="text-sm text-slate-400 light:text-slate-600 mb-2">Seat Availability</p>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-white light:text-slate-900">Available</span>
                            <span className="font-bold text-emerald-400">
                                {liveStatus.availableSeats}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white light:text-slate-900">Occupied</span>
                            <span className="font-bold text-blue-400">
                                {liveStatus.occupiedSeats}
                            </span>
                        </div>
                        <div className="w-full bg-white/10 light:bg-slate-200 rounded-full h-2 mt-2">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(liveStatus.occupiedSeats / 40) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Moving Indicator */}
                <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 light:text-slate-600">Bus Status</p>
                            <p className="font-semibold text-emerald-400">
                                {liveStatus.isMoving ? 'In Motion' : 'Stopped'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default LiveStatus;
