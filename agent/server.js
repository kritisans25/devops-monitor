const http = require("http");

const DOCKER_API_HOST =
    process.env.DOCKER_API_HOST || "http://docker-socket-proxy:2375";

const PORT = Number(process.env.PORT || 5001);

function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
    });

    res.end(JSON.stringify(data));
}

function dockerGet(path) {
    return new Promise((resolve, reject) => {
        const endpoint = new URL(path, DOCKER_API_HOST);

        const request = http.request(
            {
                hostname: endpoint.hostname,
                port: Number(endpoint.port || 2375),
                path: `${endpoint.pathname}${endpoint.search}`,
                method: "GET"
            },
            (response) => {
                let body = "";

                response.setEncoding("utf8");

                response.on("data", (chunk) => {
                    body += chunk;
                });

                response.on("end", () => {
                    if (
                        response.statusCode < 200 ||
                        response.statusCode >= 300
                    ) {
                        return reject(
                            new Error(
                                `Docker API returned status ${response.statusCode}`
                            )
                        );
                    }

                    const contentType =
                        response.headers["content-type"] || "";

                    if (contentType.includes("application/json")) {
                        try {
                            resolve(JSON.parse(body));
                        } catch {
                            reject(
                                new Error(
                                    "Invalid JSON returned by Docker"
                                )
                            );
                        }
                    } else {
                        resolve(body);
                    }
                });
            }
        );

        request.setTimeout(8000, () => {
            request.destroy(
                new Error("Docker API request timed out")
            );
        });

        request.on("error", reject);
        request.end();
    });
}

function dockerGetStats(containerId) {
    const path =
        `/containers/${encodeURIComponent(containerId)}/stats?stream=true`;

    return new Promise((resolve, reject) => {
        const endpoint = new URL(path, DOCKER_API_HOST);

        let buffer = "";
        let samplesReceived = 0;
        let settled = false;
        let timer;

        const finish = (error, value) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);

            if (error) reject(error);
            else resolve(value);
        };

        const request = http.request(
            {
                hostname: endpoint.hostname,
                port: Number(endpoint.port || 2375),
                path: `${endpoint.pathname}${endpoint.search}`,
                method: "GET"
            },
            (response) => {
                response.setEncoding("utf8");

                if (
                    response.statusCode < 200 ||
                    response.statusCode >= 300
                ) {
                    response.resume();
                    finish(
                        new Error(
                            `Docker stats returned HTTP ${response.statusCode}`
                        )
                    );
                    return;
                }

                response.on("data", (chunk) => {
                    buffer += chunk;

                    let newlineIndex;

                    while (
                        (newlineIndex = buffer.indexOf("\n")) !== -1
                    ) {
                        const line = buffer
                            .slice(0, newlineIndex)
                            .trim();

                        buffer = buffer.slice(newlineIndex + 1);

                        if (!line) continue;

                        let sample;

                        try {
                            sample = JSON.parse(line);
                        } catch {
                            finish(
                                new Error("Invalid Docker stats response")
                            );
                            request.destroy();
                            return;
                        }

                        samplesReceived += 1;

                        // Docker's second streaming sample has the
                        // previous CPU counters needed for a delta.
                        if (samplesReceived >= 2) {
                            finish(null, sample);
                            request.destroy();
                            return;
                        }
                    }
                });

                response.on("end", () => {
                    finish(
                        new Error(
                            "Docker stats stream ended before two samples"
                        )
                    );
                });

                response.on("error", (error) => {
                    finish(error);
                });
            }
        );

        timer = setTimeout(() => {
            finish(new Error("Docker stats request timed out"));
            request.destroy();
        }, 8000);

        request.on("error", (error) => {
            finish(error);
        });

        request.end();
    });
}


function calculateCpuPercent(stats) {
    const current = stats?.cpu_stats;
    const previous = stats?.precpu_stats;

    if (!current || !previous) {
        return null;
    }

    const cpuDelta =
        current.cpu_usage.total_usage -
        previous.cpu_usage.total_usage;

    const systemDelta =
        (current.system_cpu_usage || 0) -
        (previous.system_cpu_usage || 0);

    const cpuCount =
        current.online_cpus ||
        current.cpu_usage.percpu_usage?.length ||
        1;

    if (cpuDelta <= 0 || systemDelta <= 0) {
        return null;
    }

    const percentage =
        (cpuDelta / systemDelta) * cpuCount * 100;

    return Number(percentage.toFixed(2));
}

function calculateMemory(stats) {
    const memory = stats?.memory_stats;

    if (
        !memory ||
        typeof memory.usage !== "number" ||
        typeof memory.limit !== "number" ||
        memory.limit <= 0
    ) {
        return {
            usageBytes: null,
            limitBytes: null,
            percent: null
        };
    }

    // Subtract Linux file cache when Docker reports it.
    const cache =
        memory.stats?.inactive_file ??
        memory.stats?.cache ??
        0;

    const usageBytes = Math.max(0, memory.usage - cache);

    return {
        usageBytes,
        limitBytes: memory.limit,
        percent: Number(
            ((usageBytes / memory.limit) * 100).toFixed(2)
        )
    };
}

async function getContainerData(container) {
    const id = container.Id;

    // Inspect data is used internally, but never returned directly.
    const inspectPromise = dockerGet(
        `/containers/${encodeURIComponent(id)}/json`
    ).catch(() => null);

    const statsPromise =
        container.State === "running"
            ? dockerGetStats(id).catch((error) => {
                console.error(
                    `Could not collect stats for ${container.Names?.[0] || id}:`,
                    error.message
                );
                return null;
            })
            : Promise.resolve(null);

    const [inspect, stats] = await Promise.all([
        inspectPromise,
        statsPromise
    ]);

    const state = inspect?.State;
    const startedAt = state?.StartedAt || null;

    const validStartedAt =
        container.State === "running" &&
        startedAt &&
        new Date(startedAt).getTime() > 0;

    const uptimeSeconds = validStartedAt
        ? Math.max(
            0,
            Math.floor(
                (Date.now() - new Date(startedAt).getTime()) / 1000
            )
        )
        : null;

    const memory = calculateMemory(stats);

    return {
        id: id.slice(0, 12),
        name: (container.Names?.[0] || "")
            .replace(/^\//, ""),
        image: container.Image,
        state: container.State,
        status: container.Status,
        healthStatus: state?.Health?.Status || null,
        createdAt: container.Created
            ? new Date(container.Created * 1000).toISOString()
            : null,
        uptimeSeconds,
        restartCount:
            Number.isFinite(inspect?.RestartCount)
                ? inspect.RestartCount
                : null,
        cpuPercent:
            container.State === "running"
                ? calculateCpuPercent(stats)
                : null,
        memoryUsageBytes: memory.usageBytes,
        memoryLimitBytes: memory.limitBytes,
        memoryPercent: memory.percent
    };
}

async function getContainers() {
    const containers = await dockerGet("/containers/json?all=1");

    const results = await Promise.all(
        containers.map(getContainerData)
    );

    return {
        timestamp: new Date().toISOString(),
        total: results.length,
        running: results.filter(
            (container) => container.state === "running"
        ).length,
        containers: results
    };
}

const server = http.createServer(async (req, res) => {
    const requestUrl = new URL(
        req.url,
        "http://localhost"
    );

    // Only expose the two intended endpoints.
    if (req.method !== "GET") {
        return sendJson(res, 405, {
            error: "Method not allowed"
        });
    }

    if (requestUrl.pathname === "/health") {
        try {
            await dockerGet("/_ping");

            return sendJson(res, 200, {
                status: "healthy",
                docker: "connected"
            });
        } catch {
            return sendJson(res, 503, {
                status: "unhealthy",
                docker: "disconnected"
            });
        }
    }

    if (requestUrl.pathname === "/containers") {
        try {
            const result = await getContainers();

            return sendJson(res, 200, result);
        } catch (error) {
            console.error(
                "Container telemetry failed:",
                error.message
            );

            return sendJson(res, 503, {
                error: "Unable to retrieve Docker telemetry"
            });
        }
    }

    return sendJson(res, 404, {
        error: "Not found"
    });
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(
        `Docker telemetry agent listening on port ${PORT}`
    );
});