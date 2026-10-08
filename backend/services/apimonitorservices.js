const axios = require("axios");
const ApiMonitor = require("../models/apimonitor");

const monitorApi = async (name, url) => {
    const startTime = Date.now();

    try {
        const response = await axios.get(url, {
            timeout: 5000,
            headers: {
                "User-Agent": "DevOps-Monitor"
            }
        });

        const responseTime = Date.now() - startTime;

        const result = await ApiMonitor.create({
            name,
            url,
            status: "UP",
            statusCode: response.status,
            responseTime
        });

        return result;

    } catch (error) {
        const responseTime = Date.now() - startTime;

        const statusCode = error.response
            ? error.response.status
            : null;

        // 4xx = API is reachable but rejected the request
        const isReachable =
            statusCode >= 400 && statusCode < 500;

        const result = await ApiMonitor.create({
            name,
            url,
            status: isReachable ? "UP" : "DOWN",
            statusCode,
            responseTime
        });

        return result;
    }
};

module.exports = monitorApi;