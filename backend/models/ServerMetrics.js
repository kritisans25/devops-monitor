const mongoose = require("mongoose");

const serverMetricSchema = new mongoose.Schema({
    cpuUsage: {
        type: Number,
        required: true
    },

    memoryUsage: {
        type: Number,
        required: true
    },

    diskUsage: {
        type: Number,
        required: true
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("ServerMetric", serverMetricSchema);