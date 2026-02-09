const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    busId: {
        type: String,
        required: true,
        unique: true
    },
    busNumber: {
        type: String,
        required: true
    },
    route: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['ONLINE', 'OFFLINE', 'MAINTENANCE'],
        default: 'ONLINE'
    },
    gpsLocation: {
        lat: Number,
        lng: Number
    },
    speed: {
        type: Number,
        default: 0
    },
    heading: {
        type: Number,
        default: 0
    },
    currentLocation: {
        lat: Number,
        lng: Number
    },
    currentStop: String,
    nextStop: String,
    estimatedArrival: Date,
    departureTime: Date,
    // Driver tracking
    driverStatus: {
        name: String,
        present: {
            type: Boolean,
            default: false
        },
        lastSeen: Date,
        location: {
            type: String,
            enum: ['DRIVER_SEAT', 'OUTSIDE_BUS', 'UNKNOWN'],
            default: 'UNKNOWN'
        }
    },
    // Attender tracking
    attenderStatus: {
        name: String,
        present: {
            type: Boolean,
            default: false
        },
        lastSeen: Date,
        location: {
            type: String,
            enum: ['FRONT', 'MIDDLE', 'REAR', 'OUTSIDE_BUS', 'UNKNOWN'],
            default: 'UNKNOWN'
        }
    },
    passengerCount: {
        type: Number,
        default: 0
    },
    capacity: {
        type: Number,
        default: 40
    },
    // Seat states array for real-time simulation
    seatStates: [{
        seatNumber: {
            type: Number,
            required: true
        },
        state: {
            type: String,
            enum: ['HUMAN', 'LUGGAGE', 'EMPTY'],
            default: 'EMPTY'
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Bus', busSchema);
