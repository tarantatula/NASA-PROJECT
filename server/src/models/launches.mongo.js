const mongoose = require('mongoose');
const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true
    },
    mission: String,
    rocket: String,
    launchDate: {
        type: Date,
        required: true,
    },
    target: {
        type: String,
        ref: 'Planet',
    },
    customers: [String],
    upcoming: {
        type: Boolean,
        default: true,
    },
    success: {
        type: Boolean,
        default: false,
    },
    isExternalLaunch: {
        type: Boolean,
        default: false,
        required: true
    }
});
//connect launchesSchema to the "launches" collection
module.exports = mongoose.model('Launch', launchesSchema);