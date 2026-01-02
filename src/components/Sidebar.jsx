import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, Activity, BarChart3, Armchair, FileText, MapPin, Clock, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();

    // Customer Navigation
    const customerNavItems = [
        { path: '/customer/dashboard', icon: Activity, label: 'Dashboard', description: 'Trip overview' },
        { path: '/customer/dashboard', icon: MapPin, label: 'Trip Info', description: 'Route and stops' },
        { path: '/customer/dashboard', icon: Armchair, label: 'Seat Map', description: 'View available seats' },
        { path: '/customer/dashboard', icon: Clock, label: 'Live Status', description: 'Real-time updates' },
    ];

    // Admin Navigation
    const adminNavItems = [
        { path: '/operations', icon: Activity, label: 'Operations', description: 'Real-time bus monitoring' },
        { path: '/performance', icon: BarChart3, label: 'Performance', description: 'Performance metrics' },
        { path: '/analytics', icon: Armchair, label: 'Analytics', description: 'Analytics dashboard' },
        { path: '/access-logs', icon: FileText, label: 'Access Logs', description: 'System access logs (Admin only)' },
    ];

    // Select navigation based on role
    const navItems = user?.role === 'CUSTOMER' ? customerNavItems : adminNavItems;

    return (
        <aside
            className="w-64 glass-dark border-r border-white/10 light:border-slate-200 flex flex-col"
            role="navigation"
            aria-label="Main navigation"
        >
            {/* Logo */}
            <div className="p-6 border-b border-white/10 light:border-slate-200">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center"
                        aria-hidden="true"
                    >
                        <Bus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white light:text-slate-900">
                            {user?.role === 'CUSTOMER' ? 'Bus Tracker' : 'Bus Monitor'}
                        </h1>
                        <p className="text-xs text-slate-400 light:text-slate-600">
                            {user?.role === 'CUSTOMER' ? 'Passenger' : 'v3.0'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2" aria-label="Primary navigation">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path + item.label}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${isActive
                                ? 'bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border border-blue-500/30 text-white light:text-slate-900'
                                : 'text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-white/5 light:hover:bg-slate-100'
                            }`
                        }
                        aria-label={item.description}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className="w-5 h-5" aria-hidden="true" />
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"
                                        aria-hidden="true"
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer Info */}
            <div className="p-4 border-t border-white/10 light:border-slate-200">
                <div className="glass-card p-3 rounded-lg">
                    <p className="text-xs text-slate-400 light:text-slate-600 mb-1">
                        {user?.role === 'CUSTOMER' ? 'Trip Status' : 'System Status'}
                    </p>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"
                            role="status"
                            aria-label="System operational"
                        />
                        <span className="text-sm text-emerald-400 light:text-emerald-600 font-medium">
                            {user?.role === 'CUSTOMER' ? 'On Time' : 'All Systems Operational'}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
