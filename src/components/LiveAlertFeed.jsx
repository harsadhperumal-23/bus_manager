import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, User, Package, AlertCircle, Info, AlertOctagon } from 'lucide-react';

const LiveAlertFeed = ({ alerts }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [alerts]);

    const getSeverity = (alert) => {
        if (alert.severity) return alert.severity;

        // Determine severity from message/type
        const message = alert.message?.toLowerCase() || '';
        const type = alert.type?.toLowerCase() || '';

        if (message.includes('critical') || message.includes('emergency') || type === 'critical') {
            return 'critical';
        }
        if (message.includes('warning') || message.includes('alert') || type === 'luggage' || type === 'warning') {
            return 'warning';
        }
        return 'info';
    };

    const getSeverityConfig = (severity) => {
        switch (severity) {
            case 'critical':
                return {
                    icon: AlertOctagon,
                    iconColor: 'text-red-400',
                    bgColor: 'bg-red-500/10',
                    borderColor: 'border-red-500/30',
                    badgeColor: 'bg-red-500 text-white',
                    label: 'Critical'
                };
            case 'warning':
                return {
                    icon: AlertTriangle,
                    iconColor: 'text-orange-400',
                    bgColor: 'bg-orange-500/10',
                    borderColor: 'border-orange-500/30',
                    badgeColor: 'bg-orange-500 text-white',
                    label: 'Warning'
                };
            case 'info':
            default:
                return {
                    icon: Info,
                    iconColor: 'text-blue-400',
                    bgColor: 'bg-blue-500/10',
                    borderColor: 'border-blue-500/30',
                    badgeColor: 'bg-blue-500 text-white',
                    label: 'Info'
                };
        }
    };

    const getAlertIcon = (type) => {
        switch (type) {
            case 'luggage':
                return Package;
            case 'passenger':
                return User;
            default:
                return AlertCircle;
        }
    };

    // Count alerts by severity
    const severityCounts = alerts.reduce((acc, alert) => {
        const severity = getSeverity(alert);
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
    }, {});

    return (
        <div
            className="glass-card rounded-xl p-4 h-full flex flex-col"
            role="region"
            aria-label="Live alert feed"
            aria-live="polite"
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white light:text-slate-900">Live Alerts</h3>
                    <div className="flex items-center gap-3 mt-1">
                        {severityCounts.critical > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                                {severityCounts.critical} Critical
                            </span>
                        )}
                        {severityCounts.warning > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                {severityCounts.warning} Warning
                            </span>
                        )}
                        {severityCounts.info > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                {severityCounts.info} Info
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs text-slate-400 light:text-slate-600">Real-time</span>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 pr-2">
                <AnimatePresence mode="popLayout">
                    {alerts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-slate-500 py-8"
                        >
                            <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No alerts yet</p>
                        </motion.div>
                    ) : (
                        alerts.map((alert) => {
                            const severity = getSeverity(alert);
                            const config = getSeverityConfig(severity);
                            const Icon = config.icon;
                            const TypeIcon = getAlertIcon(alert.type);

                            return (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    className={`p-3 rounded-lg border ${config.bgColor} ${config.borderColor}`}
                                    role="alert"
                                    aria-label={`${severity} alert: ${alert.message}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-0.5 ${config.iconColor}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <p className="text-sm text-white light:text-slate-900 font-medium">
                                                    {alert.message}
                                                </p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${config.badgeColor} font-semibold uppercase tracking-wider flex-shrink-0`}>
                                                    {config.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 light:text-slate-600">
                                                <TypeIcon className="w-3 h-3" />
                                                <span>{alert.timestamp}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LiveAlertFeed;

