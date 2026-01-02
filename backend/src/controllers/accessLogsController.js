const AccessLog = require('../models/AccessLog');

/**
 * Get access logs with filtering
 * Admin only
 */
exports.getAccessLogs = async (req, res) => {
    try {
        const {
            userId,
            action,
            startDate,
            endDate,
            page = 1,
            limit = 50
        } = req.query;

        const query = {};

        if (userId) query.userId = userId;
        if (action) query.action = action;

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const logs = await AccessLog.find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await AccessLog.countDocuments(query);

        res.json({
            success: true,
            data: {
                logs,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get access logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching access logs'
        });
    }
};

/**
 * Get access log statistics
 * Admin only
 */
exports.getAccessStats = async (req, res) => {
    try {
        const { days = 7 } = req.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const logs = await AccessLog.find({
            timestamp: { $gte: startDate }
        });

        // Calculate stats
        const totalRequests = logs.length;
        const uniqueUsers = new Set(logs.map(log => log.userId)).size;

        const actionCounts = {};
        logs.forEach(log => {
            actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
        });

        const topActions = Object.entries(actionCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([action, count]) => ({ action, count }));

        res.json({
            success: true,
            data: {
                totalRequests,
                uniqueUsers,
                topActions,
                period: `Last ${days} days`
            }
        });
    } catch (error) {
        console.error('Get access stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching access statistics'
        });
    }
};

/**
 * Export access logs as CSV
 * Admin only
 */
exports.exportLogs = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const query = {};
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        const logs = await AccessLog.find(query).sort({ timestamp: -1 });

        // Generate CSV
        let csv = 'Timestamp,User ID,Username,Role,Action,Route,Method,IP Address,Status Code,Response Time\n';

        logs.forEach(log => {
            csv += `${log.timestamp},${log.userId},${log.username},${log.role},${log.action},${log.route},${log.method},${log.ipAddress},${log.statusCode},${log.responseTime}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=access-logs.csv');
        res.send(csv);
    } catch (error) {
        console.error('Export logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting logs'
        });
    }
};
