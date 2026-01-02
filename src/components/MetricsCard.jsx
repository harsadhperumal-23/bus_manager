import React from 'react';
import { motion } from 'framer-motion';

const MetricsCard = ({ title, value, icon: Icon, trend, isLoading }) => {
    if (isLoading) {
        return (
            <div className="glass-card rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-white/10 rounded w-3/4"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card rounded-xl p-6 hover:border-blue-500/30 transition-all cursor-pointer"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-400" />
                </div>
                {trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded ${trend > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-2">{title}</h3>
            <motion.p
                key={value}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold text-white"
            >
                {value}
            </motion.p>
        </motion.div>
    );
};

export default MetricsCard;
