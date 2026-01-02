import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { updateSeats, getCurrentSeats, generateAIInsights, getCurrentBusData } from '../services/mockDataService';

const Analytics = () => {
    const [seats, setSeats] = useState(getCurrentSeats());
    const [insights, setInsights] = useState(generateAIInsights());

    useEffect(() => {
        // Update seats every 5 seconds
        const interval = setInterval(() => {
            const { seats: newSeats } = updateSeats();
            setSeats(newSeats);
            setInsights(generateAIInsights());
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const getSeatColor = (status) => {
        switch (status) {
            case 'occupied':
                return 'bg-emerald-500 border-emerald-400';
            case 'luggage':
                return 'bg-orange-500 border-orange-400';
            default:
                return 'bg-slate-700 border-slate-600';
        }
    };

    const getSeatLabel = (status) => {
        switch (status) {
            case 'occupied':
                return 'Human';
            case 'luggage':
                return 'Luggage';
            default:
                return 'Empty';
        }
    };

    const handleExportCSV = () => {
        const busData = getCurrentBusData();
        const exportData = seats.map(seat => ({
            SeatNumber: seat.id,
            Row: seat.row,
            Column: seat.col,
            Status: getSeatLabel(seat.status),
        }));

        const csv = Papa.unparse(exportData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `bus-analytics-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Analytics & Seat Map</h1>
                    <p className="text-slate-400">Real-time seat monitoring and AI-powered insights</p>
                </div>

                {/* Export Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                >
                    <Download className="w-4 h-4" />
                    Download CSV
                </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Seat Grid - 2 columns */}
                <div className="lg:col-span-2 glass-card rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">Seat Map (30 Seats)</h2>

                        {/* Legend */}
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-emerald-500 rounded border border-emerald-400"></div>
                                <span className="text-slate-300">Occupied</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-orange-500 rounded border border-orange-400"></div>
                                <span className="text-slate-300">Luggage</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-slate-700 rounded border border-slate-600"></div>
                                <span className="text-slate-300">Empty</span>
                            </div>
                        </div>
                    </div>

                    {/* 5x6 Grid */}
                    <div className="grid grid-cols-6 gap-3">
                        {seats.map((seat) => (
                            <motion.div
                                key={seat.id}
                                layout
                                initial={false}
                                animate={{
                                    backgroundColor: seat.status === 'occupied' ? '#10b981' :
                                        seat.status === 'luggage' ? '#f97316' : '#334155',
                                }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform ${getSeatColor(seat.status)}`}
                            >
                                <span className="text-white font-bold text-lg">{seat.id}</span>
                                <span className="text-white/80 text-xs mt-1">{getSeatLabel(seat.status)}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* AI Insights Panel - 1 column */}
                <div className="glass-card rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Lightbulb className="w-6 h-6 text-yellow-400" />
                        <h2 className="text-xl font-semibold text-white">AI Insights</h2>
                    </div>

                    <div className="space-y-4">
                        {insights.map((insight, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-blue-500/30 transition-all"
                            >
                                <div className="flex items-start gap-3">
                                    {index === 0 ? (
                                        <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                    )}
                                    <p className="text-sm text-slate-300 leading-relaxed">{insight}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Summary Stats */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <h3 className="text-sm font-semibold text-slate-400 mb-3">Current Status</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Occupied:</span>
                                <span className="text-emerald-400 font-semibold">
                                    {seats.filter(s => s.status === 'occupied').length} seats
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Luggage:</span>
                                <span className="text-orange-400 font-semibold">
                                    {seats.filter(s => s.status === 'luggage').length} seats
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Empty:</span>
                                <span className="text-slate-400 font-semibold">
                                    {seats.filter(s => s.status === 'empty').length} seats
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
