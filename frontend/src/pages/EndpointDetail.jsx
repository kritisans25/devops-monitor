import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Clock,
  Activity,
  Zap,
  TrendingDown,
  TrendingUp,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import StatusBadge from '../components/StatusBadge';
import UptimeBars from '../components/UptimeBars';
import { CardSkeleton, ChartSkeleton } from '../components/LoadingSkeleton';
import ErrorCard from '../components/ErrorCard';
import {
  formatDateTime,
  formatChartTime,
  formatTimeAgo,
  getResponseTimeClassification,
} from '../utils/formatters';
import { getMonitors, getApiHistory, getApiUptime, checkApi } from '../api/api';

function ResponseTimeTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#000000] border border-[#292D30] rounded-[6px] p-2.5 shadow-none font-mono text-xs z-50 text-[#FFFFFF]">
        <div className="text-[#A1A4A5] mb-1.5 font-medium pb-1 border-b border-[#292D30]">
          {formatDateTime(data.rawTimestamp)}
        </div>
        <div className="flex items-center justify-between space-x-3 mb-1">
          <span className="text-[#A1A4A5]">Latency:</span>
          <span className="font-medium text-[#9281F7]">{data.latency} ms</span>
        </div>
        <div className="flex items-center justify-between space-x-3">
          <span className="text-[#A1A4A5]">Status:</span>
          <span
            className={`font-medium ${
              data.status === 'UP' ? 'text-[#3AD389]' : 'text-[#FF6465]'
            }`}
          >
            {data.status} (HTTP {data.statusCode || '—'})
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export default function EndpointDetail({ refreshSignal, autoRefresh }) {
  const { url: encodedUrl } = useParams();
  const decodedUrl = decodeURIComponent(encodedUrl || '');

  const [monitor, setMonitor] = useState(null);
  const [history, setHistory] = useState([]);
  const [uptimeData, setUptimeData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (!decodedUrl) return;

    try {
      setError(null);
      const [allMonitors, historyLogs, uptimeStats] = await Promise.all([
        getMonitors().catch(() => []),
        getApiHistory(decodedUrl),
        getApiUptime(decodedUrl),
      ]);

      const foundMonitor = allMonitors.find((m) => m.url === decodedUrl) || {
        name: historyLogs[0]?.name || new URL(decodedUrl).hostname,
        url: decodedUrl,
      };

      setMonitor(foundMonitor);
      setHistory(Array.isArray(historyLogs) ? historyLogs : []);
      setUptimeData(uptimeStats);
    } catch (err) {
      console.error('Error fetching endpoint details:', err);
      setError(err.message || 'Failed to retrieve telemetry for this endpoint');
    } finally {
      setLoading(false);
    }
  }, [decodedUrl]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (refreshSignal > 0) {
      loadData();
    }
  }, [refreshSignal, loadData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(loadData, 20000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadData]);

  const handleManualCheck = async () => {
    if (checking) return;
    try {
      setChecking(true);
      await checkApi(decodedUrl);
      await loadData();
    } catch (err) {
      console.error('Check failed:', err);
    } finally {
      setChecking(false);
    }
  };

  const latestCheck = history[0];
  const currentStatus = latestCheck?.status || 'UNKNOWN';
  const latestLatency = latestCheck?.responseTime;
  const latestStatusCode = latestCheck?.statusCode;
  const lastCheckedTime = latestCheck?.timestamp;

  const statsMetrics = useMemo(() => {
    const validLatencies = history
      .filter((h) => typeof h.responseTime === 'number' && !isNaN(h.responseTime))
      .map((h) => h.responseTime);

    if (validLatencies.length === 0) {
      return { avg: null, min: null, max: null, count: 0 };
    }

    const min = Math.min(...validLatencies);
    const max = Math.max(...validLatencies);
    const sum = validLatencies.reduce((acc, curr) => acc + curr, 0);
    const avg = Math.round(sum / validLatencies.length);

    return { avg, min, max, count: validLatencies.length };
  }, [history]);

  const chartData = useMemo(() => {
    return [...history]
      .reverse()
      .map((h) => ({
        timestamp: formatChartTime(h.timestamp),
        rawTimestamp: h.timestamp,
        latency: h.responseTime || 0,
        status: h.status,
        statusCode: h.statusCode,
      }));
  }, [history]);

  const rtClassification = getResponseTimeClassification(latestLatency);

  return (
    <div className="space-y-4">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/endpoints"
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#A1A4A5] hover:text-[#9281F7] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Endpoints Directory</span>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="ops-card p-5 h-24 animate-pulse bg-[#000000]" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <ChartSkeleton />
        </div>
      ) : error ? (
        <ErrorCard
          title="Endpoint Telemetry Offline"
          message={error}
          onRetry={loadData}
        />
      ) : (
        <>
          {/* Header Card */}
          <div className="ops-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2.5">
                <h1 className="text-base font-bold text-[#FFFFFF] tracking-tight">
                  {monitor?.name || 'Endpoint'}
                </h1>
                <StatusBadge status={currentStatus} size="sm" />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-[#9281F7] bg-[#000000] px-2 py-0.5 rounded-[4px] border border-[#292D30] select-all">
                  {decodedUrl}
                </span>
                <a
                  href={decodedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-0.5 text-[#A1A4A5] hover:text-[#9281F7] transition-colors"
                  title="Open URL in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Check Action Button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleManualCheck}
                disabled={checking}
                className="btn-ghost inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-medium cursor-pointer disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-[#9281F7] ${checking ? 'animate-spin' : ''}`}
                />
                <span>{checking ? 'Checking...' : 'Check Now'}</span>
              </button>
            </div>
          </div>

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Status */}
            <div className="ops-card p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono uppercase text-[#A1A4A5] tracking-wider font-medium">
                  Status
                </span>
                <Activity className="w-3.5 h-3.5 text-[#6E727A]" />
              </div>
              <div className="text-lg font-medium font-mono text-[#FFFFFF]">
                <StatusBadge status={currentStatus} size="sm" />
              </div>
              <div className="text-[11px] font-mono text-[#6E727A] mt-1.5">
                Checked {formatTimeAgo(lastCheckedTime)}
              </div>
            </div>

            {/* Response Time */}
            <div className="ops-card p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono uppercase text-[#A1A4A5] tracking-wider font-medium">
                  Response Time
                </span>
                <Zap className="w-3.5 h-3.5 text-[#9281F7]" />
              </div>
              <div className={`text-xl font-medium font-mono ${rtClassification.color}`}>
                {latestLatency !== undefined && latestLatency !== null ? `${latestLatency} ms` : '—'}
              </div>
              <div className="text-[11px] font-mono text-[#6E727A] mt-1.5">
                Latency Tier: <span className={rtClassification.color}>{rtClassification.label}</span>
              </div>
            </div>

            {/* Uptime 24h */}
            <div className="ops-card p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono uppercase text-[#A1A4A5] tracking-wider font-medium">
                  Uptime 24h
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#3AD389]" />
              </div>
              <div className="text-xl font-medium font-mono text-[#3AD389]">
                {uptimeData?.uptimePercentage !== undefined ? `${uptimeData.uptimePercentage}%` : '—'}
              </div>
              <div className="text-[11px] font-mono text-[#6E727A] mt-1.5">
                {uptimeData?.successfulChecks || 0} of {uptimeData?.totalChecks || 0} passed
              </div>
            </div>

            {/* Last Status Code */}
            <div className="ops-card p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono uppercase text-[#A1A4A5] tracking-wider font-medium">
                  Status Code
                </span>
                <Clock className="w-3.5 h-3.5 text-[#6E727A]" />
              </div>
              <div className="text-xl font-medium font-mono text-[#FFFFFF]">
                {latestStatusCode ? `HTTP ${latestStatusCode}` : '—'}
              </div>
              <div className="text-[11px] font-mono text-[#6E727A] mt-1.5">
                Scheme: {decodedUrl.startsWith('https') ? 'HTTPS (TLS)' : 'HTTP'}
              </div>
            </div>
          </div>

          {/* Uptime History Bars */}
          <div className="ops-card p-4">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#292D30]">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF] flex items-center gap-1.5 font-mono">
                  <BarChart3 className="w-3.5 h-3.5 text-[#9281F7]" />
                  Uptime History
                </h3>
                <p className="text-[11px] text-[#A1A4A5] mt-0.5">
                  Sequential health check outcomes
                </p>
              </div>
              <div className="flex items-center space-x-3 text-xs font-mono">
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-[#3AD389]" />
                  <span className="text-[#A1A4A5]">UP</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-[#FF6465]" />
                  <span className="text-[#A1A4A5]">DOWN</span>
                </div>
              </div>
            </div>

            <UptimeBars history={history} maxBars={50} />
          </div>

          {/* Clean Response Time Line Chart */}
          <div className="ops-card p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 pb-2.5 border-b border-[#292D30] gap-1">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF] font-mono">
                  Response Time Latency
                </h3>
                <p className="text-[11px] text-[#A1A4A5] mt-0.5">
                  Telemetry logs in milliseconds (ms)
                </p>
              </div>
              <div className="text-xs font-mono text-[#A1A4A5]">
                Samples: <span className="text-[#FFFFFF] font-medium">{chartData.length}</span>
              </div>
            </div>

            <div className="h-56 w-full">
              {chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs font-mono text-[#A1A4A5] bg-[#000000] rounded-[6px] border border-dashed border-[#292D30]">
                  No historical response time samples recorded.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#292D30" vertical={false} />

                    <XAxis
                      dataKey="timestamp"
                      stroke="#6E727A"
                      tick={{ fill: '#A1A4A5', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      tickLine={false}
                      axisLine={{ stroke: '#292D30' }}
                      minTickGap={25}
                    />

                    <YAxis
                      stroke="#6E727A"
                      tick={{ fill: '#A1A4A5', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      tickLine={false}
                      axisLine={{ stroke: '#292D30' }}
                      tickFormatter={(val) => `${val}ms`}
                    />

                    <Tooltip content={<ResponseTimeTooltip />} />

                    <Line
                      type="monotone"
                      dataKey="latency"
                      name="Response Time"
                      stroke="#9281F7"
                      strokeWidth={1.5}
                      dot={false}
                      activeDot={{ r: 3.5, stroke: '#9281F7', strokeWidth: 1, fill: '#000000' }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Two-Column Telemetry Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Response Time Stats */}
            <div className="ops-card p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF] pb-2.5 border-b border-[#292D30] font-mono">
                Latency Breakdown
              </h3>
              <div className="mt-3 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#000000] border border-[#292D30]">
                  <div className="flex items-center space-x-2 text-[#A1A4A5]">
                    <Activity className="w-3.5 h-3.5 text-[#9281F7]" />
                    <span>Average Latency</span>
                  </div>
                  <span className="text-sm font-medium text-[#FFFFFF]">
                    {statsMetrics.avg !== null ? `${statsMetrics.avg} ms` : '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#000000] border border-[#292D30]">
                  <div className="flex items-center space-x-2 text-[#A1A4A5]">
                    <TrendingDown className="w-3.5 h-3.5 text-[#3AD389]" />
                    <span>Minimum (Fastest)</span>
                  </div>
                  <span className="text-sm font-medium text-[#3AD389]">
                    {statsMetrics.min !== null ? `${statsMetrics.min} ms` : '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#000000] border border-[#292D30]">
                  <div className="flex items-center space-x-2 text-[#A1A4A5]">
                    <TrendingUp className="w-3.5 h-3.5 text-[#FFCA16]" />
                    <span>Maximum (Slowest)</span>
                  </div>
                  <span className="text-sm font-medium text-[#FFCA16]">
                    {statsMetrics.max !== null ? `${statsMetrics.max} ms` : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Uptime Breakdown */}
            <div className="ops-card p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF] pb-2.5 border-b border-[#292D30] font-mono">
                Uptime Log (24h)
              </h3>
              <div className="mt-3 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#000000] border border-[#292D30]">
                  <span className="text-[#A1A4A5]">Calculated Ratio</span>
                  <span className="text-sm font-medium text-[#3AD389]">
                    {uptimeData?.uptimePercentage !== undefined ? `${uptimeData.uptimePercentage}%` : '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#000000] border border-[#292D30]">
                  <span className="text-[#A1A4A5]">Total Checks</span>
                  <span className="text-sm font-medium text-[#FFFFFF]">
                    {uptimeData?.totalChecks || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#000000] border border-[#292D30]">
                  <span className="text-[#A1A4A5]">Successful (UP)</span>
                  <span className="text-sm font-medium text-[#3AD389]">
                    {uptimeData?.successfulChecks || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#000000] border border-[#292D30]">
                  <span className="text-[#A1A4A5]">Failed (DOWN)</span>
                  <span className="text-sm font-medium text-[#FF6465]">
                    {uptimeData?.failedChecks || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

