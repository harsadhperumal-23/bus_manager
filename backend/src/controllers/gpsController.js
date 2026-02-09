const Bus = require('../models/Bus');
const AccessLog = require('../models/AccessLog');

/**
 * Update bus GPS location from mobile phone
 * POST /api/bus/location
 */
exports.updateLocation = async (req, res) => {
    try {
        const { busId, lat, lng, speed, heading } = req.body;

        // Validate input
        if (!busId || lat === undefined || lng === undefined) {
            return res.status(400).json({
                success: false,
                message: 'busId, lat, and lng are required'
            });
        }

        // Validate coordinates
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            return res.status(400).json({
                success: false,
                message: 'Invalid coordinates'
            });
        }

        // Find and update bus
        const bus = await Bus.findOneAndUpdate(
            { busId },
            {
                gpsLocation: { lat, lng },
                currentLocation: { lat, lng },
                speed: speed || 0,
                heading: heading || 0,
                lastUpdated: new Date()
            },
            { new: true, upsert: false }
        );

        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'Bus not found'
            });
        }

        // Log GPS update to access log
        try {
            await AccessLog.create({
                userId: req.session?.user?.userId || 'GPS_DEVICE',
                username: req.session?.user?.username || 'GPS_DEVICE',
                role: req.session?.user?.role || 'SYSTEM',
                action: 'GPS_UPDATE',
                resource: `/api/bus/location`,
                details: `Updated GPS for ${busId}: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.get('user-agent')
            });
        } catch (logError) {
            console.error('Error logging GPS update:', logError);
            // Don't fail the request if logging fails
        }

        res.json({
            success: true,
            message: 'Location updated successfully',
            data: {
                busId: bus.busId,
                location: bus.gpsLocation,
                speed: bus.speed,
                heading: bus.heading,
                lastUpdated: bus.lastUpdated
            }
        });
    } catch (error) {
        console.error('Error updating GPS location:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update location'
        });
    }
};
