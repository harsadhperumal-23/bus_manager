import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Armchair, MapPin } from 'lucide-react';
import { customerApi } from '../../services/customerApi';

const SeatMap = () => {
    const [seatData, setSeatData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSeatMap();

        // Refresh every 10 seconds
        const interval = setInterval(fetchSeatMap, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchSeatMap = async () => {
        try {
            const response = await customerApi.getSeatMap();
            setSeatData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching seat map:', error);
            setLoading(false);
        }
    };

    const renderSeat = (seat) => {
        const isOccupied = seat.occupied;

        return (
            <div
                key={seat.seatNumber}
                className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${isOccupied
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                        : 'bg-slate-500/10 border-slate-600 text-slate-400'
                    }`}
            >
                <div className="flex flex-col items-center gap-1">
                    <Armchair className="w-4 h-4" />
                    <span className="text-xs font-semibold">{seat.seatNumber}</span>
                </div>
            </div>
        );
    };

    const renderRow = (rowIndex) => {
        if (!seatData) return null;

        const startSeat = rowIndex * 4;
        const rowSeats = seatData.seats.slice(startSeat, startSeat + 4);

        return (
            <div key={rowIndex} className="grid grid-cols-9 gap-2 items-center">
                {/* Left side - 2 seats */}
                <div className="col-span-2 grid grid-cols-2 gap-2">
                    {rowSeats[0] && renderSeat(rowSeats[0])}
                    {rowSeats[1] && renderSeat(rowSeats[1])}
                </div>

                {/* Aisle */}
                <div className="col-span-1 flex items-center justify-center">
                    <div className="h-full w-0.5 bg-slate-700/30 rounded-full" />
                </div>

                {/* Right side - 2 seats */}
                <div className="col-span-2 grid grid-cols-2 gap-2">
                    {rowSeats[2] && renderSeat(rowSeats[2])}
                    {rowSeats[3] && renderSeat(rowSeats[3])}
                </div>

                {/* Row label */}
                <div className="col-span-4 text-right">
                    <span className="text-xs text-slate-500 font-medium">Row {rowIndex + 1}</span>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="glass-card rounded-xl p-6">
                <p className="text-center text-slate-400">Loading seat map...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6"
        >
            <h2 className="text-xl font-bold text-white light:text-slate-900 mb-4 flex items-center gap-2">
                <Armchair className="w-6 h-6 text-blue-400" />
                Seat Map
            </h2>

            {/* Legend */}
            <div className="flex items-center gap-4 mb-6 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-slate-500/10 border-2 border-slate-600" />
                    <span className="text-slate-400">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500/20 border-2 border-blue-500" />
                    <span className="text-slate-400">Occupied</span>
                </div>
            </div>

            {/* Bus Front Indicator */}
            <div className="flex items-center justify-center mb-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Front of Bus</span>
                </div>
            </div>

            {/* Seat Grid */}
            <div className="space-y-3">
                {Array.from({ length: 10 }, (_, i) => renderRow(i))}
            </div>

            {/* Note */}
            <p className="text-xs text-slate-500 text-center mt-4">
                Read-only view • Updates every 10 seconds
            </p>
        </motion.div>
    );
};

export default SeatMap;
