const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    route: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    statusCode: {
        type: Number
    },
    responseTime: {
        type: Number // in milliseconds
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
accessLogSchema.index({ userId: 1, timestamp: -1 });
accessLogSchema.index({ action: 1 });
accessLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AccessLog', accessLogSchema);
