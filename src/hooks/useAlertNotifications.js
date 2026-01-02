import { useState, useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';

/**
 * Custom hook to monitor alerts and trigger toast notifications
 * Prevents duplicate notifications for the same alert
 */
export const useAlertNotifications = (alerts) => {
    const toast = useToast();
    const seenAlerts = useRef(new Set());

    useEffect(() => {
        if (!alerts || alerts.length === 0) return;

        alerts.forEach(alert => {
            // Skip if we've already shown this alert
            if (seenAlerts.current.has(alert.id)) return;

            // Determine severity level
            const severity = alert.severity || determineSeverity(alert);

            // Only show toasts for warning and critical alerts
            if (severity === 'warning') {
                toast.warning(alert.message, 6000);
                seenAlerts.current.add(alert.id);
            } else if (severity === 'critical') {
                toast.error(alert.message, 8000);
                seenAlerts.current.add(alert.id);
            }
        });

        // Clean up old seen alerts (keep last 100)
        if (seenAlerts.current.size > 100) {
            const alertsArray = Array.from(seenAlerts.current);
            seenAlerts.current = new Set(alertsArray.slice(-100));
        }
    }, [alerts, toast]);
};

/**
 * Determine severity based on alert type and message
 */
const determineSeverity = (alert) => {
    const message = alert.message?.toLowerCase() || '';
    const type = alert.type?.toLowerCase() || '';

    // Critical keywords
    if (
        message.includes('emergency') ||
        message.includes('critical') ||
        message.includes('danger') ||
        message.includes('unauthorized') ||
        type === 'critical'
    ) {
        return 'critical';
    }

    // Warning keywords
    if (
        message.includes('warning') ||
        message.includes('alert') ||
        message.includes('suspicious') ||
        message.includes('luggage') ||
        type === 'luggage' ||
        type === 'warning'
    ) {
        return 'warning';
    }

    // Default to info
    return 'info';
};

export default useAlertNotifications;
