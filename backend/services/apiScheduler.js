const MonitoredApi = require("../models/MonitoredApi");
const monitorApi = require("./apimonitorservices");

const checkAllApis = async () => {
    try {
        const monitors = await MonitoredApi.find({
            active: true
        });

        console.log(`Checking ${monitors.length} APIs...`);

        for (const monitor of monitors) {
            await monitorApi(
                monitor.name,
                monitor.url
            );
        }

    } catch (error) {
        console.error(
            "API monitoring failed:",
            error.message
        );
    }
};

module.exports = checkAllApis;