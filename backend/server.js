require("dotenv").config();
const collectServerMetrics = require("./services/monitoringServices");
const ServerMetric = require("./models/ServerMetrics");
const monitorApi = require("./services/apimonitorservices");
const MonitoredApi = require("./models/MonitoredApi");
const checkAllApis = require("./services/apiScheduler");
const getApiUptime = require("./services/uptimeservice");
const os = require("os")
const express = require("express");
const cors = require("cors");
const si = require("systeminformation");
const connectDatabase = require("./config/database");
const ApiMonitor = require("./models/apimonitor");
const mongoose = require("mongoose");
const axios = require("axios");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => {
    res.json({
        message: "DevOps Monitoring API is running!"
    });
});

app.get("/api/server-stats", async (req, res) => {
    try {
        const cpu = await si.currentLoad();
        const memory = await si.mem();
        const disk = await si.fsSize();

        const diskInfo = disk[0];

        res.json({
            hostname: os.hostname(),
            platform: os.platform(),
            architecture: os.arch(),
            cpuCores: os.cpus().length,

            cpuUsage: cpu.currentLoad.toFixed(2),

            totalMemory: memory.total,
            freeMemory: memory.available,
            memoryUsage: (
                ((memory.total - memory.available) / memory.total) * 100
            ).toFixed(2),

            diskUsage: diskInfo
                ? diskInfo.use.toFixed(2)
                : null,

            diskTotal: diskInfo
                ? diskInfo.size
                : null,

            diskUsed: diskInfo
                ? diskInfo.used
                : null,

            uptime: os.uptime()
        });

    } catch (error) {
        console.error("Error getting server statistics:", error);

        res.status(500).json({
            error: "Unable to retrieve server statistics"
        });
    }
});
app.get("/api/containers", async (req, res) => {
    try {
        const response = await axios.get(
            "http://telemetry-agent:5001/containers",
            {
                timeout: 12000
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error(
            "Error fetching Docker container telemetry:",
            error.message
        );

        res.status(503).json({
            error: "Container telemetry is temporarily unavailable"
        });
    }
});
app.get("/api/metrics", async (req, res) => {
    try {
        const metrics = await ServerMetric
            .find()
            .sort({ timestamp: -1 })
            .limit(50);

        res.json(metrics);

    } catch (error) {
        console.error("Error fetching metrics:", error.message);

        res.status(500).json({
            error: "Unable to fetch metrics"
        });
    }
});

app.post("/api/check", async (req, res) => {

    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                error: "API URL is required"
            });
        }

        const result = await monitorApi(
            url,
            url
        );

        res.json(result);

    } catch (error) {
        console.error("API check failed:", error.message);

        res.status(500).json({
            error: "Unable to check API"
        });
    }
});
app.post("/api/monitors", async (req, res) => {
    try {
        const { name, url } = req.body;

        if (!name || !url) {
            return res.status(400).json({
                error: "Name and URL are required"
            });
        }

        const existingMonitor = await MonitoredApi.findOne({ url });

        if (existingMonitor) {
            return res.status(409).json({
                error: "This API is already being monitored"
            });
        }

        const monitor = await MonitoredApi.create({
            name,
            url
        });

        res.status(201).json(monitor);

    } catch (error) {
        console.error("Error creating monitor:", error.message);

        res.status(500).json({
            error: "Failed to create monitor"
        });
    }
});
app.get("/api/monitors", async (req, res) => {
    try {
        const monitors = await MonitoredApi.find();

        res.json(monitors);

    } catch (error) {
        console.error("Error fetching monitors:", error.message);

        res.status(500).json({
            error: "Failed to fetch monitors"
        });
    }
});
app.get("/api/uptime", async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                error: "API URL is required"
            });
        }

        const uptime = await getApiUptime(url);

        res.json(uptime);

    } catch (error) {
        console.error("Error calculating uptime:", error.message);

        res.status(500).json({
            error: "Unable to calculate uptime"
        });
    }
});
app.get("/api/api-history", async (req, res) => {
    try {
        const { url } = req.query;

        const history = await ApiMonitor
            .find({ url })
            .sort({ timestamp: -1 })
            .limit(50);

        res.json(history);

    } catch (error) {
        console.error("Error fetching API history:", error.message);

        res.status(500).json({
            error: "Unable to fetch API history"
        });
    }
});
app.get("/health", async (req, res) => {
    const dbStatus =
        mongoose.connection.readyState === 1
            ? "connected"
            : "disconnected";

    if (dbStatus !== "connected") {
        return res.status(503).json({
            status: "unhealthy",
            database: dbStatus
        });
    }

    res.status(200).json({
        status: "healthy",
        service: "opsmonitor-backend",
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});
connectDatabase().then(() => {

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
    });

    // Server monitoring
    collectServerMetrics();

    setInterval(() => {
        collectServerMetrics();
    }, 10000);

    // API monitoring
    checkAllApis();

    setInterval(() => {
        checkAllApis();
    }, 30000);

});