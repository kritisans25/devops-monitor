import React, { useState, useEffect, useCallback } from 'react';
import {
  Cpu,
  HardDrive,
  Clock,
  Layers,
  Server,
  Database,
  Radio,
  Info,
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import ServerChart from '../components/ServerChart';
import EndpointTable from '../components/EndpointTable';
import AddEndpointModal from '../components/AddEndpointModal';
import StatusBadge from '../components/StatusBadge';
import { CardSkeleton, ChartSkeleton, TableSkeleton } from '../components/LoadingSkeleton';
import ErrorCard from '../components/ErrorCard';
import { formatBytes, formatUptime, formatTimeAgo } from '../utils/formatters';
import { getServerStats, getServerMetrics, getMonitors, getApiHistory, getApiUptime } from '../api/api';

export default function Overview({ refreshSignal, autoRefresh }) {
  const [stats, setStats] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [monitors, setMonitors] = useState([]);
  const [histories, setHistories] = useState({});
  const [uptimes, setUptimes] = useState({});

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingMonitors, setLoadingMonitors] = useState(true);

  const [statsError, setStatsError] = useState(null);
  const [metricsError, setMetricsError] = useState(null);
  const [monitorsError, setMonitorsError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Server Stats
  const fetchStats = useCallback(async () => {
    try {
      const data = await getServerStats();
      setStats(data);
      setStatsError(null);
    } catch (err) {
      console.error('Error fetching server stats:', err);
      setStatsError(err.message || 'Unable to retrieve server statistics');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch Historical Server Metrics
  const fetchMetrics = useCallback(async () => {
    try {
      const data = await getServerMetrics();
      setMetrics(Array.isArray(data) ? data : []);
      setMetricsError(null);
    } catch (err) {
      console.error('Error fetching server metrics:', err);
      setMetricsError(err.message || 'Unable to fetch metrics');
    } finally {
      setLoadingMetrics(false);
    }
  }, []);

  // Fetch Monitored Endpoints & latest history/uptime
  const fetchMonitorsData = useCallback(async () => {
    try {
      const monitorList = await getMonitors();
      const list = Array.isArray(monitorList) ? monitorList : [];
      setMonitors(list);
      setMonitorsError(null);

      const historyMap = {};
      const uptimeMap = {};

      await Promise.all(
        list.map(async (m) => {
          try {
            const [historyData, uptimeData] = await Promise.all([
              getApiHistory(m.url).catch(() => []),
              getApiUptime(m.url).catch(() => null),
            ]);

            if (Array.isArray(historyData) && historyData.length > 0) {
              historyMap[m.url] = historyData[0];
            }
            if (uptimeData) {
              uptimeMap[m.url] = uptimeData;
            }
          } catch {
            // non-fatal
          }
        })
      );

      setHistories(historyMap);
      setUptimes(uptimeMap);
    } catch (err) {
      console.error('Error fetching monitors:', err);
      setMonitorsError(err.message || 'Failed to fetch monitors');
    } finally {
      setLoadingMonitors(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchMetrics();
    fetchMonitorsData();
  }, [fetchStats, fetchMetrics, fetchMonitorsData]);

  useEffect(() => {
    if (refreshSignal > 0) {
      fetchStats();
      fetchMetrics();
      fetchMonitorsData();
    }
  }, [refreshSignal, fetchStats, fetchMetrics, fetchMonitorsData]);

  useEffect(() => {
    if (!autoRefresh) return;

    const statsInterval = setInterval(() => {
      fetchStats();
      fetchMetrics();
    }, 10000);

    const monitorsInterval = setInterval(() => {
      fetchMonitorsData();
    }, 30000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(monitorsInterval);
    };
  }, [autoRefresh, fetchStats, fetchMetrics, fetchMonitorsData]);

  // Sparklines from historical metrics
  const cpuSparkline = React.useMemo(() => {
    return [...metrics]
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(-15)
      .map((m) => (typeof m.cpuUsage === 'number' ? m.cpuUsage : parseFloat(m.cpuUsage) || 0));
  }, [metrics]);

  const memSparkline = React.useMemo(() => {
    return [...metrics]
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(-15)
      .map((m) => (typeof m.memoryUsage === 'number' ? m.memoryUsage : parseFloat(m.memoryUsage) || 0));
  }, [metrics]);

  const diskSparkline = React.useMemo(() => {
    return [...metrics]
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(-15)
      .map((m) => (typeof m.diskUsage === 'number' ? m.diskUsage : parseFloat(m.diskUsage) || 0));
  }, [metrics]);

  return (
    <div className="space-y-4">
      {/* SECTION 1 — SERVER HEALTH CARDS */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5">
            <Server className="w-3.5 h-3.5 text-[#9281F7]" />
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A4A5] font-mono">
              Server Telemetry
            </h2>
          </div>
          {stats?.hostname && (
            <span className="text-[11px] font-mono text-[#A1A4A5]">
              Node: <span className="text-[#FFFFFF] font-medium">{stats.hostname}</span>
            </span>
          )}
        </div>

        {loadingStats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : statsError ? (
          <ErrorCard title="Server Statistics Offline" message={statsError} onRetry={fetchStats} />
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* CPU */}
            <MetricCard
              title="CPU Load"
              value={stats.cpuUsage !== undefined ? `${stats.cpuUsage}%` : '—'}
              subValue={`${stats.cpuCores || '—'} Cores (${stats.architecture || 'x64'})`}
              isPercentage={true}
              rawPercent={stats.cpuUsage}
              icon={Cpu}
              sparklineData={cpuSparkline}
              sparklineColor="#3B9EFF"
            />

            {/* Memory */}
            <MetricCard
              title="Memory"
              value={stats.memoryUsage !== undefined ? `${stats.memoryUsage}%` : '—'}
              subValue={`${formatBytes(stats.totalMemory - stats.freeMemory)} / ${formatBytes(stats.totalMemory)}`}
              isPercentage={true}
              rawPercent={stats.memoryUsage}
              icon={Layers}
              sparklineData={memSparkline}
              sparklineColor="#9281F7"
            />

            {/* Disk */}
            <MetricCard
              title="Disk Space"
              value={stats.diskUsage !== null && stats.diskUsage !== undefined ? `${stats.diskUsage}%` : '—'}
              subValue={
                stats.diskUsed && stats.diskTotal
                  ? `${formatBytes(stats.diskUsed)} / ${formatBytes(stats.diskTotal)}`
                  : 'Root partition'
              }
              isPercentage={true}
              rawPercent={stats.diskUsage}
              icon={HardDrive}
              sparklineData={diskSparkline}
              sparklineColor="#3B9EFF"
            />

            {/* Uptime */}
            <MetricCard
              title="Server Uptime"
              value={formatUptime(stats.uptime)}
              subValue={`OS: ${stats.platform || 'Unknown'}`}
              customStatusType="online"
              statusLabel="Online"
              icon={Clock}
            />
          </div>
        ) : null}
      </section>

      {/* SECTION 2 — SERVER PERFORMANCE LINE CHART */}
      <section>
        {loadingMetrics ? (
          <ChartSkeleton />
        ) : metricsError ? (
          <ErrorCard
            title="Unable to load server telemetry"
            message={metricsError}
            onRetry={fetchMetrics}
          />
        ) : (
          <ServerChart metrics={metrics} />
        )}
      </section>

      {/* SECTION 3 & 4 — MONITORED ENDPOINTS & SYSTEM STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monitored Endpoints Table (2 cols) */}
        <div className="lg:col-span-2">
          {loadingMonitors ? (
            <TableSkeleton rows={3} />
          ) : monitorsError ? (
            <ErrorCard
              title="Unable to load monitored endpoints"
              message={monitorsError}
              onRetry={fetchMonitorsData}
            />
          ) : (
            <EndpointTable
              monitors={monitors}
              histories={histories}
              uptimes={uptimes}
              onAddEndpoint={() => setIsModalOpen(true)}
              onRefresh={fetchMonitorsData}
              title="Monitored Endpoints"
              subtitle="Active HTTP checks & response latencies"
              showSearch={false}
              showFullColumns={false}
            />
          )}
        </div>

        {/* Section 4 — System Status Infrastructure Console (1 col) */}
        <div className="lg:col-span-1">
          <div className="ops-card p-4 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-[#292D30]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF] flex items-center gap-1.5 font-mono">
                  <Info className="w-3.5 h-3.5 text-[#9281F7]" />
                  System Status
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-[4px] bg-[#000000] text-[#3AD389] border border-[#292D30] font-medium">
                  Nominal
                </span>
              </div>

              <div className="mt-3 space-y-2 font-mono text-xs">
                {/* Node Server */}
                <div className="flex items-center justify-between p-2 rounded-[6px] bg-[#000000] border border-[#292D30]">
                  <div className="flex items-center space-x-2">
                    <Server className="w-3.5 h-3.5 text-[#A1A4A5]" />
                    <div>
                      <div className="text-[#FFFFFF] font-medium text-xs">Node.js Server</div>
                      <div className="text-[10px] text-[#6E727A]">{stats?.hostname || 'localhost:5000'}</div>
                    </div>
                  </div>
                  <StatusBadge status={stats ? 'ONLINE' : 'OFFLINE'} size="sm" />
                </div>

                {/* MongoDB Atlas */}
                <div className="flex items-center justify-between p-2 rounded-[6px] bg-[#000000] border border-[#292D30]">
                  <div className="flex items-center space-x-2">
                    <Database className="w-3.5 h-3.5 text-[#A1A4A5]" />
                    <div>
                      <div className="text-[#FFFFFF] font-medium text-xs">MongoDB Atlas</div>
                      <div className="text-[10px] text-[#6E727A]">Cloud Cluster</div>
                    </div>
                  </div>
                  <StatusBadge status={metrics.length > 0 || monitors.length > 0 ? 'CONNECTED' : 'ONLINE'} size="sm" />
                </div>

                {/* API Monitoring Engine */}
                <div className="flex items-center justify-between p-2 rounded-[6px] bg-[#000000] border border-[#292D30]">
                  <div className="flex items-center space-x-2">
                    <Radio className="w-3.5 h-3.5 text-[#A1A4A5]" />
                    <div>
                      <div className="text-[#FFFFFF] font-medium text-xs">API Monitoring</div>
                      <div className="text-[10px] text-[#6E727A]">Scheduler 30s interval</div>
                    </div>
                  </div>
                  <StatusBadge status="ACTIVE" size="sm" />
                </div>
              </div>
            </div>

            {/* Technical Metadata Breakdown */}
            <div className="mt-4 pt-3 border-t border-[#292D30] text-[11px] font-mono text-[#A1A4A5] space-y-1">
              <div className="flex justify-between">
                <span className="text-[#6E727A]">Platform:</span>
                <span className="text-[#FFFFFF] font-medium">{stats?.platform || '—'} ({stats?.architecture || '—'})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E727A]">CPU Cores:</span>
                <span className="text-[#FFFFFF] font-medium">{stats?.cpuCores || '—'} Cores</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E727A]">Telemetry Interval:</span>
                <span className="text-[#FFFFFF] font-medium">10 seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E727A]">Last Telemetry:</span>
                <span className="text-[#3AD389] font-medium">
                  {metrics[0]?.timestamp ? formatTimeAgo(metrics[0].timestamp) : 'Just now'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Endpoint Modal */}
      <AddEndpointModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchMonitorsData}
      />
    </div>
  );
}

