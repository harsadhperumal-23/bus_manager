const AccessLog = require('../models/AccessLog');

/**
 * Middleware to log all API requests to MongoDB
 * Captures user info, route, method, IP, user agent, and response details
 */
const logAccess = async (req, res, next) => {
    // Skip logging for health checks and static files
    if (req.path === '/health' || req.path.startsWith('/static')) {
        return next();
    }

    const startTime = Date.now();

    // Store original res.json to capture response
    const originalJson = res.json;

    res.json = function (data) {
        const responseTime = Date.now() - startTime;

        // Log to database asynchronously (don't block response)
        setImmediate(async () => {
            try {
                // Determine action based on route and method
                let action = `${req.method}_${req.path.replace(/\//g, '_').toUpperCase()}`;

                // Simplify common actions
                if (req.path.includes('/auth/login')) action = 'LOGIN';
                else if (req.path.includes('/auth/logout')) action = 'LOGOUT';
                else if (req.path.includes('/bus/status')) action = 'VIEW_BUS_STATUS';
                else if (req.path.includes('/bus/seats')) action = 'VIEW_SEATS';
                else if (req.path.includes('/analytics')) action = 'VIEW_ANALYTICS';
                else if (req.path.includes('/access-logs')) action = 'VIEW_ACCESS_LOGS';

                const logEntry = new AccessLog({
                    userId: req.session?.user?.id || 'anonymous',
                    username: req.session?.user?.username || 'anonymous',
                    role: req.session?.user?.role || 'GUEST',
                    action,
                    route: req.path,
                    method: req.method,
                    ipAddress: req.ip || req.connection.remoteAddress,
                    userAgent: req.get('user-agent') || 'unknown',
                    statusCode: res.statusCode,
                    responseTime,
                    timestamp: new Date()
                });

                await logEntry.save();
            } catch (error) {
                console.error('❌ Access logging error:', error.message);
            }
        });

        return originalJson.call(this, data);
    };

    next();
};

module.exports = logAccess;
