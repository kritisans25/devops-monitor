const ApiMonitor = require("../models/apimonitor");

const getApiUptime = async (url) => {
    const twentyFourHoursAgo = new Date(
        Date.now() - 24 * 60 * 60 * 1000
    );

    const checks = await ApiMonitor.find({
        url,
        timestamp: {
            $gte: twentyFourHoursAgo
        }
    });

    if (checks.length === 0) {
        return {
            url,
            period: "Last 24 hours",
            totalChecks: 0,
            successfulChecks: 0,
            failedChecks: 0,
            uptimePercentage: 0
        };
    }

    const successfulChecks = checks.filter(
        check => check.status === "UP"
    ).length;

    const failedChecks = checks.filter(
        check => check.status === "DOWN"
    ).length;

    const uptimePercentage =
        (successfulChecks / checks.length) * 100;

    return {
        url,
        period: "Last 24 hours",
        totalChecks: checks.length,
        successfulChecks,
        failedChecks,
        uptimePercentage: Number(
            uptimePercentage.toFixed(2)
        )
    };
};

module.exports = getApiUptime;