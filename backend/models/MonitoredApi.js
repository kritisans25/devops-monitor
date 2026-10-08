const mongoose = require("mongoose");

const monitoredApiSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    url: {
        type: String,
        required: true
    },

    active: {
        type: Boolean,
        default: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("MonitoredApi", monitoredApiSchema);