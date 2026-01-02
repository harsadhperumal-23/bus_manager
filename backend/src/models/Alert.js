const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    busId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'LOW'
    },
    resolved: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Index for querying alerts
alertSchema.index({ busId: 1, timestamp: -1 });
alertSchema.index({ severity: 1, resolved: 1 });

module.exports = mongoose.model('Alert', alertSchema);
