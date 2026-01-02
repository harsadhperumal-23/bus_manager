const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    busId: {
        type: String,
        required: true
    },
    seatNumber: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        enum: ['HUMAN', 'LUGGAGE', 'EMPTY'],
        default: 'EMPTY'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Composite index for busId and seatNumber
seatSchema.index({ busId: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model('Seat', seatSchema);
