const ApiMonitor = require("../models/apimonitor");

const getApiUptime = async (url) => {

    const checks = await ApiMonitor.find({ url });

    if (checks.length === 0) {
        return {
            url,
            totalChecks: 0,
            successfulChecks: 0,
            failedChecks: 0,
            uptimePercentage: 0
        };
    }

    const successfulChecks = checks.filter(
        check => check.status === "UP"
    ).length;

    const failedChecks = checks.length - successfulChecks;

    const uptimePercentage =
        (successfulChecks / checks.length) * 100;

    return {
        url,
        totalChecks: checks.length,
        successfulChecks,
        failedChecks,
        uptimePercentage: Number(
            uptimePercentage.toFixed(2)
        )
    };
};

module.exports = getApiUptime;