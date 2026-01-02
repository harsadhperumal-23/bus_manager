import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut, Activity, Wifi, Shield, Eye, Sun, Moon,
    User, Settings, ChevronDown, Clock, CheckCircle,
    AlertTriangle, XCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getCurrentBusData } from '../services/mockDataService';
import Tooltip from './Tooltip';

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, toggleTheme, isDark } = useTheme();
    const [latency, setLatency] = useState(24);
    const [systemStatus, setSystemStatus] = useState('operational');
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const updateData = () => {
            const data = getCurrentBusData();
            setLatency(data.latency);
            setLastUpdated(new Date());

            // Determine system status based on latency and other factors
            if (data.latency > 100) {
                setSystemStatus('critical');
            } else if (data.latency > 50) {
                setSystemStatus('degraded');
            } else {
                setSystemStatus('operational');
            }
        };

        updateData();
        const interval = setInterval(updateData, 3000);

        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isDropdownOpen]);

    const handleLogout = async () => {
        setIsDropdownOpen(false);
        await logout();
        navigate('/');
    };

    const getSystemStatusConfig = () => {
        switch (systemStatus) {
            case 'operational':
                return {
                    color: 'text-emerald-400',
                    bgColor: 'bg-emerald-500/10',
                    borderColor: 'border-emerald-500/20',
                    icon: CheckCircle,
                    label: 'Operational',
                    description: 'All systems normal'
                };
            case 'degraded':
                return {
                    color: 'text-yellow-400',
                    bgColor: 'bg-yellow-500/10',
                    borderColor: 'border-yellow-500/20',
                    icon: AlertTriangle,
                    label: 'Degraded',
                    description: 'Some issues detected'
                };
            case 'critical':
                return {
                    color: 'text-red-400',
                    bgColor: 'bg-red-500/10',
                    borderColor: 'border-red-500/20',
                    icon: XCircle,
                    label: 'Critical',
                    description: 'Major issues detected'
                };
            default:
                return {
                    color: 'text-slate-400',
                    bgColor: 'bg-slate-500/10',
                    borderColor: 'border-slate-500/20',
                    icon: Activity,
                    label: 'Unknown',
                    description: 'Status unknown'
                };
        }
    };

    const statusConfig = getSystemStatusConfig();
    const StatusIcon = statusConfig.icon;

    const formatLastUpdated = () => {
        const now = new Date();
        const diff = Math.floor((now - lastUpdated) / 1000);

        if (diff < 5) return 'Just now';
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        return lastUpdated.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <header className="glass-dark border-b border-white/10 light:border-slate-200 px-6 py-4" role="banner">
            <div className="flex items-center justify-between">
                {/* Left: Status Indicators */}
                <div className="flex items-center gap-4">
                    {/* System Status */}
                    <Tooltip content={statusConfig.description} position="bottom">
                        <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${statusConfig.bgColor} ${statusConfig.borderColor}`}
                            role="status"
                            aria-label={`System status: ${statusConfig.label}`}
                        >
                            <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                            <span className={`text-sm font-medium ${statusConfig.color} hidden md:inline`}>
                                {statusConfig.label}
                            </span>
                        </div>
                    </Tooltip>

                    {/* Connection Latency */}
                    <Tooltip content={`Network latency: ${latency}ms`} position="bottom">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 light:bg-slate-100 rounded-lg border border-white/10 light:border-slate-200">
                            <Wifi className="w-4 h-4 text-blue-400 light:text-blue-600" />
                            <span className="text-slate-300 light:text-slate-700 text-sm font-medium">{latency}ms</span>
                        </div>
                    </Tooltip>

                    {/* Last Updated */}
                    <Tooltip content={`Last updated: ${lastUpdated.toLocaleTimeString()}`} position="bottom">
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/5 light:bg-slate-100 rounded-lg border border-white/10 light:border-slate-200">
                            <Clock className="w-4 h-4 text-slate-400 light:text-slate-600" />
                            <span className="text-slate-400 light:text-slate-600 text-xs font-medium">
                                {formatLastUpdated()}
                            </span>
                        </div>
                    </Tooltip>
                </div>

                {/* Right: User Actions */}
                <div className="flex items-center gap-4">
                    {/* Dark Mode Toggle */}
                    <Tooltip content={isDark ? 'Switch to light mode' : 'Switch to dark mode'} position="bottom">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-white/5 light:bg-slate-100 hover:bg-white/10 light:hover:bg-slate-200 border border-white/10 light:border-slate-200 transition-all"
                            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            <AnimatePresence mode="wait">
                                {isDark ? (
                                    <motion.div
                                        key="sun"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Sun className="w-5 h-5 text-yellow-400" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="moon"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Moon className="w-5 h-5 text-slate-700" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </Tooltip>

                    {/* Role Badge */}
                    <div
                        className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${user?.role === 'ADMIN'
                            ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                            : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                            }`}
                        role="status"
                        aria-label={`User role: ${user?.role || 'GUEST'}`}
                    >
                        {user?.role === 'ADMIN' ? (
                            <Shield className="w-3.5 h-3.5" />
                        ) : (
                            <Eye className="w-3.5 h-3.5" />
                        )}
                        <span className="text-xs font-semibold uppercase tracking-wider hidden md:inline">
                            {user?.role || 'GUEST'}
                        </span>
                    </div>

                    {/* User Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 px-3 py-2 bg-white/5 light:bg-slate-100 hover:bg-white/10 light:hover:bg-slate-200 rounded-lg border border-white/10 light:border-slate-200 transition-all"
                            aria-expanded={isDropdownOpen}
                            aria-haspopup="true"
                            aria-label="User menu"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-white light:text-slate-900">
                                    {user?.username || 'User'}
                                </p>
                                <p className="text-xs text-slate-400 light:text-slate-600">
                                    {user?.email || 'N/A'}
                                </p>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 text-slate-400 light:text-slate-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''
                                    }`}
                            />
                        </motion.button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-56 glass-card rounded-lg shadow-xl border border-white/10 light:border-slate-200 overflow-hidden z-50"
                                    role="menu"
                                    aria-orientation="vertical"
                                >
                                    <div className="p-3 border-b border-white/10 light:border-slate-200">
                                        <p className="text-sm font-medium text-white light:text-slate-900">
                                            {user?.username || 'User'}
                                        </p>
                                        <p className="text-xs text-slate-400 light:text-slate-600 mt-0.5">
                                            {user?.email || 'N/A'}
                                        </p>
                                    </div>

                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                setIsDropdownOpen(false);
                                                navigate('/profile');
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 light:text-slate-700 hover:bg-white/10 light:hover:bg-slate-100 transition-colors"
                                            role="menuitem"
                                        >
                                            <User className="w-4 h-4" />
                                            <span>Profile</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                setIsDropdownOpen(false);
                                                navigate('/settings');
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 light:text-slate-700 hover:bg-white/10 light:hover:bg-slate-100 transition-colors"
                                            role="menuitem"
                                        >
                                            <Settings className="w-4 h-4" />
                                            <span>Settings</span>
                                        </button>
                                    </div>

                                    <div className="border-t border-white/10 light:border-slate-200 py-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                            role="menuitem"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

