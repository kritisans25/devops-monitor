
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  Box,
  CheckCircle2,
  Clock3,
  Cpu,
  HardDrive,
  RefreshCw,
  RotateCcw,
  Search,
  Server,
  XCircle,
} from 'lucide-react';
import { getContainers } from '../api/api';

const formatBytes = (bytes) => {
  if (bytes == null || !Number.isFinite(bytes)) return '—';
  if (bytes < 1024) return `${bytes} B`;

  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let unit = 0;

  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }

  return `${value.toFixed(1)} ${units[unit]}`;
};

const formatDuration = (seconds) => {
  if (seconds == null || !Number.isFinite(seconds)) return '—';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

function StatusPill({ container }) {
  const isRunning = container.state === 'running';
  const isUnhealthy = container.healthStatus === 'unhealthy';

  const label = isUnhealthy
    ? 'UNHEALTHY'
    : (container.state || 'unknown').toUpperCase();

  const classes = isUnhealthy
    ? 'border-[#ff6465]/40 text-[#ff9592]'
    : isRunning
      ? 'border-[#3ad389]/40 text-[#3ad389]'
      : 'border-[#6e727a]/40 text-[#a1a4a5]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[4px] border px-2 py-1 text-[10px] font-mono ${classes}`}
    >
      {isRunning && !isUnhealthy ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <XCircle className="h-3 w-3" />
      )}
      {label}
    </span>
  );
}

function MetricBar({ label, value, color, suffix = '%' }) {
  const valid = typeof value === 'number' && Number.isFinite(value);
  const width = valid ? Math.max(0, Math.min(value, 100)) : 0;

  return (
    <div className="min-w-0 space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-[#a1a4a5]">{label}</span>
        <span className="font-mono text-[#f0f0f0]">
          {valid ? `${value.toFixed(1)}${suffix}` : '—'}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#292d30]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, detail }) {
  return (
    <div className="ops-card rounded-xl border border-[#292d30] bg-black p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#a1a4a5]">{label}</span>
        <Icon className="h-4 w-4 text-[#9281f7]" />
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-white">
        {value}
      </div>
      <div className="mt-1 text-[11px] text-[#6e727a]">{detail}</div>
    </div>
  );
}

function ContainerCard({ container }) {
  const memory =
    container.memoryUsageBytes != null
      ? formatBytes(container.memoryUsageBytes)
      : '—';

  const memoryLimit =
    container.memoryLimitBytes != null
      ? formatBytes(container.memoryLimitBytes)
      : '—';

  return (
    <article className="ops-card rounded-xl border border-[#292d30] bg-black p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#292d30] bg-black text-[#9281f7]">
            <Box className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="break-words text-sm font-semibold text-white">
              {container.name || 'Unnamed container'}
            </h3>
            <p className="mt-1 break-all font-mono text-[11px] text-[#6e727a]">
              {container.image}
            </p>
            <p className="mt-1 font-mono text-[10px] text-[#464a4d]">
              ID: {container.id}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <StatusPill container={container} />
          {container.healthStatus &&
            container.healthStatus !== 'unhealthy' && (
              <span className="rounded-[4px] border border-[#292d30] px-2 py-1 text-[10px] font-mono text-[#a1a4a5]">
                HEALTH: {container.healthStatus.toUpperCase()}
              </span>
            )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <MetricBar
          label="CPU usage"
          value={container.cpuPercent}
          color="bg-[#9281f7]"
        />

        <MetricBar
          label="Memory usage"
          value={container.memoryPercent}
          color="bg-[#3b9eff]"
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#292d30] pt-4 sm:grid-cols-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#6e727a]">
            <HardDrive className="h-3 w-3" />
            Memory
          </div>
          <div className="mt-1 font-mono text-xs text-[#f0f0f0]">
            {memory}
          </div>
          <div className="mt-0.5 text-[10px] text-[#6e727a]">
            Limit: {memoryLimit}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#6e727a]">
            <Clock3 className="h-3 w-3" />
            Uptime
          </div>
          <div className="mt-1 font-mono text-xs text-[#f0f0f0]">
            {formatDuration(container.uptimeSeconds)}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#6e727a]">
            <RotateCcw className="h-3 w-3" />
            Restarts
          </div>
          <div className="mt-1 font-mono text-xs text-[#f0f0f0]">
            {container.restartCount ?? '—'}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#6e727a]">
            <Activity className="h-3 w-3" />
            Docker status
          </div>
          <div
            className="mt-1 break-words text-xs text-[#a1a4a5]"
            title={container.status || ''}
          >
            {container.status || 'No status available'}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Containers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadContainers = useCallback(async (initial = false) => {
    if (initial) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const result = await getContainers();
      setData(result);
      setError('');
    } catch (err) {
      setError(
        err.message || 'Unable to load Docker container telemetry.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadContainers(true);

    const interval = setInterval(() => {
      loadContainers(false);
    }, 15000);

    return () => clearInterval(interval);
  }, [loadContainers]);

  const containers = data?.containers || [];

  const filteredContainers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return containers;

    return containers.filter((container) =>
      [
        container.name,
        container.image,
        container.id,
        container.state,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [containers, search]);

  const total = data?.total ?? 0;
  const running = data?.running ?? 0;
  const stopped = Math.max(0, total - running);
  const unhealthy = containers.filter(
    (container) =>
      container.healthStatus === 'unhealthy'
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Box className="h-5 w-5 text-[#9281f7]" />
            <h1 className="text-lg font-semibold tracking-tight text-white">
              Containers
            </h1>
          </div>
          <p className="mt-1 text-xs text-[#a1a4a5]">
            Docker container health, uptime and resource metrics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-md border border-[#292d30] px-3 py-2 text-[11px] font-mono text-[#a1a4a5]">
            <span
              className={`h-1.5 w-1.5 rounded-full ${error ? 'bg-[#ff6465]' : 'bg-[#3ad389]'
                }`}
            />
            {error ? 'TELEMETRY ISSUE' : 'LIVE TELEMETRY'}
          </span>

          <button
            type="button"
            onClick={() => loadContainers(false)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-md border border-[#292d30] px-3 py-2 text-xs text-white transition hover:border-[#9281f7] disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''
                }`}
            />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-[#ff6465]/30 bg-[#ff6465]/5 p-4 text-sm text-[#ff9592]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Unable to update container telemetry</p>
            <p className="mt-1 text-xs text-[#a1a4a5]">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total containers"
          value={loading && !data ? '—' : total}
          icon={Server}
          detail="Including stopped containers"
        />
        <SummaryCard
          label="Running"
          value={loading && !data ? '—' : running}
          icon={CheckCircle2}
          detail="Currently active"
        />
        <SummaryCard
          label="Stopped"
          value={loading && !data ? '—' : stopped}
          icon={XCircle}
          detail="Not currently running"
        />
        <SummaryCard
          label="Unhealthy"
          value={loading && !data ? '—' : unhealthy}
          icon={AlertCircle}
          detail="Failed Docker health checks"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Container inventory
          </h2>
          <p className="mt-1 text-[11px] text-[#6e727a]">
            Automatically refreshed every 15 seconds
            {data?.timestamp
              ? ` · Last updated ${new Date(data.timestamp).toLocaleTimeString()}`
              : ''}
          </p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6e727a]" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, image or ID..."
            className="w-full rounded-md border border-[#292d30] bg-black py-2 pl-9 pr-3 text-xs text-white outline-none placeholder:text-[#6e727a] focus:border-[#9281f7]"
          />
        </div>
      </div>

      {loading && !data ? (
        <div className="ops-card flex items-center justify-center gap-3 rounded-xl border border-[#292d30] p-12 text-sm text-[#a1a4a5]">
          <RefreshCw className="h-4 w-4 animate-spin text-[#9281f7]" />
          Connecting to Docker telemetry...
        </div>
      ) : filteredContainers.length === 0 ? (
        <div className="ops-card rounded-xl border border-[#292d30] p-10 text-center">
          <Box className="mx-auto h-7 w-7 text-[#6e727a]" />
          <p className="mt-3 text-sm text-white">
            {error && !data
              ? 'Container telemetry is disconnected'
              : search
                ? 'No matching containers'
                : 'No containers found'}
          </p>
          <p className="mt-1 text-xs text-[#6e727a]">
            {search
              ? 'Try a different search term.'
              : 'Check the telemetry agent and Docker connection.'}
          </p>
          <button
            type="button"
            onClick={() => loadContainers(false)}
            className="mt-4 rounded-md border border-[#292d30] px-3 py-2 text-xs text-white hover:border-[#9281f7]"
          >
            Retry connection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {filteredContainers.map((container) => (
            <ContainerCard
              key={container.id}
              container={container}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-[#292d30] pt-4 text-[11px] text-[#6e727a]">
        <Cpu className="h-3.5 w-3.5 shrink-0" />
        CPU readings may be unavailable until Docker provides valid usage
        counters. The dashboard displays unavailable readings as an em dash.
      </div>
    </div>
  );
}
