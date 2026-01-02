const mongoose = require('mongoose');

const tripSnapshotSchema = new mongoose.Schema({
    busId: {
        type: String,
        required: true
    },
    passengerCount: {
        type: Number,
        required: true,
        default: 0
    },
    occupiedSeats: {
        type: Number,
        required: true,
        default: 0
    },
    luggageSeats: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Index for time-series queries
tripSnapshotSchema.index({ busId: 1, timestamp: -1 });

module.exports = mongoose.model('TripSnapshot', tripSnapshotSchema);
