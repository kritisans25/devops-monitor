const mongoose = require("mongoose");

const apiMonitorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["UP", "DOWN"],
        required: true
    },
    statusCode: {
        type: Number,
        default: null
    },
    responseTime: {
        type: Number,
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("ApiMonitor", apiMonitorSchema);