const TripSnapshot = require('../models/TripSnapshot');
const Alert = require('../models/Alert');
const Seat = require('../models/Seat');

/**
 * Get analytics data
 */
exports.getAnalytics = async (req, res) => {
    try {
        const { busId, days = 7 } = req.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const query = { timestamp: { $gte: startDate } };
        if (busId) query.busId = busId;

        const snapshots = await TripSnapshot.find(query).sort({ timestamp: 1 });

        // Calculate analytics
        const totalTrips = snapshots.length;
        const avgPassengers = snapshots.length > 0
            ? snapshots.reduce((sum, s) => sum + s.passengerCount, 0) / snapshots.length
            : 0;

        const peakPassengers = snapshots.length > 0
            ? Math.max(...snapshots.map(s => s.passengerCount))
            : 0;

        // Seat utilization
        const seats = await Seat.find(busId ? { busId } : {});
        const totalSeats = seats.length;
        const humanSeats = seats.filter(s => s.state === 'HUMAN').length;
        const luggageSeats = seats.filter(s => s.state === 'LUGGAGE').length;
        const emptySeats = seats.filter(s => s.state === 'EMPTY').length;

        const utilizationRate = totalSeats > 0 ? (humanSeats / totalSeats) * 100 : 0;

        res.json({
            success: true,
            data: {
                totalTrips,
                avgPassengers: Math.round(avgPassengers * 10) / 10,
                peakPassengers,
                currentOccupancy: {
                    human: humanSeats,
                    luggage: luggageSeats,
                    empty: emptySeats,
                    total: totalSeats
                },
                utilizationRate: Math.round(utilizationRate * 10) / 10,
                snapshots: snapshots.slice(-50) // Last 50 snapshots
            }
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics'
        });
    }
};

/**
 * Get performance metrics
 */
exports.getPerformance = async (req, res) => {
    try {
        const { busId, days = 30 } = req.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const query = { timestamp: { $gte: startDate } };
        if (busId) query.busId = busId;

        const snapshots = await TripSnapshot.find(query).sort({ timestamp: 1 });

        // Group by day
        const dailyData = {};
        snapshots.forEach(snapshot => {
            const day = snapshot.timestamp.toISOString().split('T')[0];
            if (!dailyData[day]) {
                dailyData[day] = { count: 0, totalPassengers: 0 };
            }
            dailyData[day].count++;
            dailyData[day].totalPassengers += snapshot.passengerCount;
        });

        const performanceData = Object.entries(dailyData).map(([date, data]) => ({
            date,
            trips: data.count,
            avgPassengers: Math.round((data.totalPassengers / data.count) * 10) / 10
        }));

        res.json({
            success: true,
            data: performanceData
        });
    } catch (error) {
        console.error('Get performance error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching performance data'
        });
    }
};

/**
 * Get alerts
 */
exports.getAlerts = async (req, res) => {
    try {
        const { busId, severity, resolved, limit = 50 } = req.query;

        const query = {};
        if (busId) query.busId = busId;
        if (severity) query.severity = severity;
        if (resolved !== undefined) query.resolved = resolved === 'true';

        const alerts = await Alert.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: alerts
        });
    } catch (error) {
        console.error('Get alerts error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching alerts'
        });
    }
};
