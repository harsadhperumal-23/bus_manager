import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, AlertTriangle, Package, MapPin } from 'lucide-react';
import Tooltip from './Tooltip';

const SeatGrid = ({ seats = [], onSeatClick }) => {
    const [selectedSeat, setSelectedSeat] = useState(null);

    // Generate 40 seats in 2-2 layout (10 rows)
    const rows = 10;
    const seatsPerRow = 4;

    const getSeatData = (seatNumber) => {
        return seats.find(s => s.number === seatNumber) || {
            number: seatNumber,
            occupied: false,
            passengerCount: 0,
            hasLuggage: false,
            lastUpdated: new Date().toISOString()
        };
    };

    const getSeatStatus = (seat) => {
        if (seat.hasLuggage && seat.occupied) return 'alert';
        if (seat.occupied) return 'occupied';
        return 'vacant';
    };

    const getSeatColor = (status) => {
        switch (status) {
            case 'alert':
                return 'bg-red-500/20 border-red-500 text-red-400 seat-alert';
            case 'occupied':
                return 'bg-emerald-500/20 border-emerald-500 text-emerald-400';
            case 'vacant':
                return 'bg-slate-500/10 border-slate-600 text-slate-400 seat-vacant';
            default:
                return 'bg-slate-500/10 border-slate-600 text-slate-400';
        }
    };

    const getSeatIcon = (status, seat) => {
        if (status === 'alert') {
            return <AlertTriangle className="w-4 h-4" />;
        }
        if (status === 'occupied') {
            return <User className="w-4 h-4" />;
        }
        return null;
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleSeatClick = (seat) => {
        setSelectedSeat(seat.number === selectedSeat ? null : seat.number);
        if (onSeatClick) {
            onSeatClick(seat);
        }
    };

    const renderSeat = (seatNumber, position) => {
        const seat = getSeatData(seatNumber);
        const status = getSeatStatus(seat);
        const colorClass = getSeatColor(status);

        const tooltipContent = (
            <div className="text-left">
                <div className="font-semibold mb-1">Seat {seat.number}</div>
                <div className="text-xs space-y-0.5">
                    <div>Status: <span className="capitalize">{status}</span></div>
                    {seat.occupied && (
                        <div>Passengers: {seat.passengerCount}</div>
                    )}
                    {seat.hasLuggage && (
                        <div className="text-orange-400">⚠ Luggage Detected</div>
                    )}
                    <div className="text-slate-400 mt-1">
                        Updated: {formatTime(seat.lastUpdated)}
                    </div>
                </div>
            </div>
        );

        return (
            <Tooltip content={tooltipContent} position="top" key={seatNumber}>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSeatClick(seat)}
                    className={`relative w-full aspect-square rounded-lg border-2 ${colorClass} 
                        transition-all duration-300 flex items-center justify-center
                        hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400
                        ${selectedSeat === seat.number ? 'ring-2 ring-blue-500 scale-105' : ''}`}
                    aria-label={`Seat ${seat.number}, ${status}${seat.hasLuggage ? ', luggage alert' : ''}`}
                    aria-pressed={selectedSeat === seat.number}
                    tabIndex={0}
                >
                    <div className="flex flex-col items-center gap-1">
                        {getSeatIcon(status, seat)}
                        <span className="text-xs font-semibold">{seat.number}</span>
                    </div>

                    {seat.hasLuggage && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                    )}
                </motion.button>
            </Tooltip>
        );
    };

    const renderRow = (rowIndex) => {
        const startSeat = rowIndex * seatsPerRow + 1;

        return (
            <div key={rowIndex} className="grid grid-cols-9 gap-2 items-center">
                {/* Left side - 2 seats */}
                <div className="col-span-2 grid grid-cols-2 gap-2">
                    {renderSeat(startSeat, 'left-1')}
                    {renderSeat(startSeat + 1, 'left-2')}
                </div>

                {/* Aisle */}
                <div className="col-span-1 flex items-center justify-center">
                    <div className="h-full w-0.5 bg-slate-700/30 rounded-full" />
                </div>

                {/* Right side - 2 seats */}
                <div className="col-span-2 grid grid-cols-2 gap-2">
                    {renderSeat(startSeat + 2, 'right-1')}
                    {renderSeat(startSeat + 3, 'right-2')}
                </div>

                {/* Row label */}
                <div className="col-span-4 text-right">
                    <span className="text-xs text-slate-500 font-medium">Row {rowIndex + 1}</span>
                </div>
            </div>
        );
    };

    return (
        <div
            className="glass-card rounded-xl p-6"
            role="region"
            aria-label="Bus seat occupancy grid"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white light:text-slate-900">
                        Seat Occupancy Map
                    </h3>
                    <p className="text-sm text-slate-400 light:text-slate-600 mt-1">
                        Real-time seat status monitoring
                    </p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-slate-500/10 border-2 border-slate-600" />
                        <span className="text-slate-400">Vacant</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-emerald-500/20 border-2 border-emerald-500" />
                        <span className="text-slate-400">Occupied</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-red-500/20 border-2 border-red-500" />
                        <span className="text-slate-400">Alert</span>
                    </div>
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
            <div
                className="space-y-3"
                role="grid"
                aria-label="Seat grid with 10 rows and 4 seats per row"
            >
                {Array.from({ length: rows }, (_, i) => renderRow(i))}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">
                        {seats.filter(s => s.occupied).length}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Occupied</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-slate-400">
                        {40 - seats.filter(s => s.occupied).length}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Vacant</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">
                        {seats.filter(s => s.hasLuggage).length}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Alerts</div>
                </div>
            </div>

            {/* Keyboard Navigation Hint */}
            <div className="mt-4 text-center">
                <p className="text-xs text-slate-500">
                    Use Tab to navigate seats, Enter to select
                </p>
            </div>
        </div>
    );
};

export default SeatGrid;
