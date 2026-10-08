import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Server,
  Activity,
  Globe,
  Clock,
  ArrowRight,
  Terminal,
  Layers,
  HardDrive,
  ShieldCheck,
  Zap,
  BarChart3,
  Database,
  Radio,
  Cpu,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
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
import { getServerStats, getServerMetrics, getMonitors, getApiHistory } from '../api/api';
import { formatBytes, formatUptime } from '../utils/formatters';

export default function Landing() {
  const [stats, setStats] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [monitors, setMonitors] = useState([]);

  useEffect(() => {
    // Fetch live data for product preview if backend is available
    async function loadLiveData() {
      try {
        const [statsData, metricsData, monitorsData] = await Promise.all([
          getServerStats().catch(() => null),
          getServerMetrics().catch(() => []),
          getMonitors().catch(() => []),
        ]);
        if (statsData) setStats(statsData);
        if (Array.isArray(metricsData) && metricsData.length > 0) setMetrics(metricsData);
        if (Array.isArray(monitorsData) && monitorsData.length > 0) setMonitors(monitorsData);
      } catch {
        // Fallbacks are handled gracefully
      }
    }
    loadLiveData();
  }, []);

  // Format telemetry chart samples for hero visual
  const chartData = React.useMemo(() => {
    if (metrics.length >= 5) {
      return metrics.slice(-12).map((m, i) => ({
        time: `:${String(i * 10).padStart(2, '0')}`,
        CPU: typeof m.cpuUsage === 'number' ? m.cpuUsage : parseFloat(m.cpuUsage) || 0,
        Memory: typeof m.memoryUsage === 'number' ? m.memoryUsage : parseFloat(m.memoryUsage) || 0,
      }));
    }
    return [
      { time: ':00', CPU: 42.1, Memory: 58.4 },
      { time: ':10', CPU: 46.5, Memory: 59.2 },
      { time: ':20', CPU: 51.0, Memory: 60.1 },
      { time: ':30', CPU: 48.2, Memory: 61.3 },
      { time: ':40', CPU: 56.4, Memory: 62.0 },
      { time: ':50', CPU: 53.8, Memory: 62.8 },
      { time: ':60', CPU: 55.2, Memory: 63.5 },
      { time: ':70', CPU: 58.1, Memory: 64.0 },
      { time: ':80', CPU: 54.9, Memory: 63.8 },
      { time: ':90', CPU: 56.2, Memory: 64.5 },
    ];
  }, [metrics]);

  // Synchronized Multi-Signal Telemetry Data
  const multiSignalData = React.useMemo(() => {
    return [
      { time: '12:00:00', cpu: 38, mem: 56, latency: 142 },
      { time: '12:00:10', cpu: 44, mem: 57, latency: 156 },
      { time: '12:00:20', cpu: 52, mem: 59, latency: 185 },
      { time: '12:00:30', cpu: 48, mem: 58, latency: 164 },
      { time: '12:00:40', cpu: 62, mem: 61, latency: 220 },
      { time: '12:00:50', cpu: 56, mem: 60, latency: 195 },
      { time: '12:01:00', cpu: 54, mem: 61, latency: 180 },
      { time: '12:01:10', cpu: 58, mem: 63, latency: 192 },
      { time: '12:01:20', cpu: 55, mem: 62, latency: 178 },
      { time: '12:01:30', cpu: 51, mem: 62, latency: 170 },
      { time: '12:01:40', cpu: 49, mem: 60, latency: 162 },
      { time: '12:01:50', cpu: 53, mem: 61, latency: 168 },
    ];
  }, []);

  const features = [
    {
      title: 'Server Monitoring',
      description: 'Stream live CPU utilization, memory consumption, disk partitions, and server uptime.',
      icon: Cpu,
    },
    {
      title: 'API Monitoring',
      description: 'Monitor any public or internal HTTP/HTTPS endpoint with custom interval verification.',
      icon: Globe,
    },
    {
      title: 'Response Time Latency',
      description: 'Track request round-trip times down to the millisecond with automatic latency grading.',
      icon: Zap,
    },
    {
      title: '24-Hour Uptime Analytics',
      description: 'Calculate rolling uptime percentages across fifty-check historical evaluation windows.',
      icon: ShieldCheck,
    },
    {
      title: 'Historical Telemetry',
      description: 'Store continuous metrics snapshots to isolate performance regressions before they cause outages.',
      icon: BarChart3,
    },
    {
      title: 'Deep Endpoint Diagnostics',
      description: 'Inspect individual health checks with HTTP status codes, timestamp logs, and TLS verification.',
      icon: Activity,
    },
    {
      title: 'MongoDB Storage Engine',
      description: 'Persistent telemetry datastore ensuring monitoring history is safely recorded and queryable.',
      icon: Database,
    },
    {
      title: 'Automated Daemon Checks',
      description: 'Continuous background monitoring workers polling endpoints at predictable 30-second cycles.',
      icon: Radio,
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] font-sans selection:bg-[#9281F7] selection:text-white">
      {/* 1. MINIMAL TOP NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-md border-b border-[#292D30] px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-7 h-7 rounded-[6px] bg-[#000000] border border-[#292D30] flex items-center justify-center text-[#9281F7] group-hover:border-[#9281F7] transition-colors">
              <Server className="w-4 h-4" />
            </div>
            <div className="font-bold text-sm tracking-tight flex items-center gap-1.5">
              <span>OpsMonitor</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#9281F7]" />
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6 text-xs text-[#A1A4A5]">
            <a href="#product-value" className="hover:text-[#FFFFFF] transition-colors">
              Product
            </a>
            <a href="#how-it-works" className="hover:text-[#FFFFFF] transition-colors">
              How it Works
            </a>
            <a href="#features" className="hover:text-[#FFFFFF] transition-colors">
              Features
            </a>
            <a href="#telemetry" className="hover:text-[#FFFFFF] transition-colors">
              Monitoring
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <Link
            to="/dashboard"
            className="btn-ghost inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium cursor-pointer"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#9281F7]" />
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="pt-20 sm:pt-28 pb-16 px-4 sm:px-8 max-w-5xl mx-auto text-center">
        {/* Status indicator pill */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-[6px] bg-[#000000] border border-[#292D30] text-[#F0F0F0] text-xs font-mono mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3AD389] animate-pulse-live" />
          <span className="text-[#A1A4A5]">Monitoring infrastructure in real time</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#FFFFFF] max-w-4xl mx-auto leading-[1.08] mb-6">
          Know what's running. <br />
          <span className="text-[#A1A4A5]">Know when it breaks.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#A1A4A5] max-w-2xl mx-auto leading-relaxed mb-10">
          Monitor server health, API uptime, response times, and infrastructure telemetry from one focused dashboard.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
          <Link
            to="/dashboard"
            className="btn-ghost inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-medium hover:border-white transition-all cursor-pointer bg-[#000000]"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-4 h-4 text-[#9281F7]" />
          </Link>

          <a
            href="#product-value"
            className="inline-flex items-center space-x-2 px-4 py-2.5 text-sm text-[#A1A4A5] hover:text-[#FFFFFF] transition-colors"
          >
            <span>Explore Architecture</span>
          </a>
        </div>
      </section>

      {/* 3. HERO PRODUCT VISUAL (Actual OpsMonitor Dashboard Preview) */}
      <section className="px-4 sm:px-8 max-w-6xl mx-auto pb-24">
        <div className="ops-card p-4 sm:p-6 rounded-[24px] border border-[#292D30] bg-[#000000] overflow-hidden">
          {/* Top Bar of Dashboard Preview */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#292D30] text-xs font-mono">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#292D30]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#292D30]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#292D30]" />
              <span className="text-[#6E727A] pl-2 hidden sm:inline">opsmonitor.internal/dashboard</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-[4px] bg-[#000000] border border-[#292D30] text-[#3AD389]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3AD389] animate-pulse-live" />
              <span className="text-[11px] uppercase">All systems operational</span>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="ops-card p-3.5 bg-[#000000] border border-[#292D30] rounded-[16px]">
              <div className="text-[11px] font-mono text-[#A1A4A5] uppercase tracking-wider mb-1">CPU Load</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#FFFFFF]">
                {stats?.cpuUsage !== undefined ? `${stats.cpuUsage}%` : '56.2%'}
              </div>
              <div className="text-[10px] font-mono text-[#6E727A] mt-0.5">8 Cores (x64)</div>
            </div>

            <div className="ops-card p-3.5 bg-[#000000] border border-[#292D30] rounded-[16px]">
              <div className="text-[11px] font-mono text-[#A1A4A5] uppercase tracking-wider mb-1">Memory</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#FFFFFF]">
                {stats?.memoryUsage !== undefined ? `${stats.memoryUsage}%` : '64.5%'}
              </div>
              <div className="text-[10px] font-mono text-[#6E727A] mt-0.5">
                {stats ? `${formatBytes(stats.totalMemory - stats.freeMemory)} / ${formatBytes(stats.totalMemory)}` : '10.3 GB / 16.0 GB'}
              </div>
            </div>

            <div className="ops-card p-3.5 bg-[#000000] border border-[#292D30] rounded-[16px]">
              <div className="text-[11px] font-mono text-[#A1A4A5] uppercase tracking-wider mb-1">Disk Space</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#FFFFFF]">
                {stats?.diskUsage !== undefined && stats?.diskUsage !== null ? `${stats.diskUsage}%` : '56.8%'}
              </div>
              <div className="text-[10px] font-mono text-[#6E727A] mt-0.5">Root Partition</div>
            </div>

            <div className="ops-card p-3.5 bg-[#000000] border border-[#292D30] rounded-[16px]">
              <div className="text-[11px] font-mono text-[#A1A4A5] uppercase tracking-wider mb-1">Uptime</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#3AD389]">
                {stats?.uptime ? formatUptime(stats.uptime) : '2h 34m'}
              </div>
              <div className="text-[10px] font-mono text-[#6E727A] mt-0.5">Daemon Active</div>
            </div>
          </div>

          {/* Performance Chart & Live Endpoint Snippet */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Telemetry Chart */}
            <div className="lg:col-span-2 ops-card p-4 bg-[#000000] border border-[#292D30] rounded-[16px]">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#292D30] text-xs font-mono">
                <span className="font-bold text-[#FFFFFF]">Server Performance</span>
                <div className="flex items-center space-x-3">
                  <span className="text-[#3B9EFF] flex items-center gap-1">● CPU</span>
                  <span className="text-[#9281F7] flex items-center gap-1">● Memory</span>
                </div>
              </div>
              <div className="h-44 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#292D30" vertical={false} />
                    <XAxis dataKey="time" stroke="#6E727A" tick={{ fill: '#A1A4A5', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={{ stroke: '#292D30' }} />
                    <YAxis domain={[0, 100]} stroke="#6E727A" tick={{ fill: '#A1A4A5', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={{ stroke: '#292D30' }} tickFormatter={(v) => `${v}%`} />
                    <Line type="monotone" dataKey="CPU" stroke="#3B9EFF" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                    <Line type="monotone" dataKey="Memory" stroke="#9281F7" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monitored Endpoints list snippet */}
            <div className="lg:col-span-1 ops-card p-4 bg-[#000000] border border-[#292D30] rounded-[16px] flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold font-mono text-[#FFFFFF] pb-2 mb-2 border-b border-[#292D30]">
                  Monitored Targets
                </div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="p-2 rounded-[6px] bg-[#000000] border border-[#292D30] flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[#FFFFFF] text-[11px]">GitHub API</div>
                      <div className="text-[10px] text-[#9281F7] truncate max-w-[120px]">api.github.com</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-[#3AD389] font-medium">● 200 UP</span>
                      <div className="text-[10px] text-[#A1A4A5]">185 ms</div>
                    </div>
                  </div>

                  <div className="p-2 rounded-[6px] bg-[#000000] border border-[#292D30] flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[#FFFFFF] text-[11px]">HTTPBin Test</div>
                      <div className="text-[10px] text-[#9281F7] truncate max-w-[120px]">httpbin.org/status/200</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-[#3AD389] font-medium">● 200 UP</span>
                      <div className="text-[10px] text-[#A1A4A5]">412 ms</div>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/dashboard"
                className="mt-3 block text-center text-[11px] font-mono text-[#9281F7] hover:underline"
              >
                View all live telemetry →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROBLEM SECTION */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto border-t border-[#292D30]">
        <div className="max-w-2xl mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF] mb-3">
            Production doesn't wait for you.
          </h2>
          <p className="text-sm sm:text-base text-[#A1A4A5] leading-relaxed">
            Servers consume resources. APIs slow down. Dependencies fail. Without visibility, small problems become incidents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="ops-card p-6 bg-[#000000] border border-[#292D30] rounded-[16px]">
            <div className="w-8 h-8 rounded-[6px] bg-[#000000] border border-[#292D30] flex items-center justify-center text-[#3B9EFF] mb-4">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-[#FFFFFF] mb-1.5">
              Server Health
            </h3>
            <p className="text-xs text-[#A1A4A5] leading-relaxed">
              Continuous visibility into CPU load, system memory pressure, disk storage limits, and server uptime.
            </p>
          </div>

          <div className="ops-card p-6 bg-[#000000] border border-[#292D30] rounded-[16px]">
            <div className="w-8 h-8 rounded-[6px] bg-[#000000] border border-[#292D30] flex items-center justify-center text-[#3AD389] mb-4">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-[#FFFFFF] mb-1.5">
              API Health
            </h3>
            <p className="text-xs text-[#A1A4A5] leading-relaxed">
              Live endpoint availability checks, HTTP status code monitoring, and millisecond latency tracking.
            </p>
          </div>

          <div className="ops-card p-6 bg-[#000000] border border-[#292D30] rounded-[16px]">
            <div className="w-8 h-8 rounded-[6px] bg-[#000000] border border-[#292D30] flex items-center justify-center text-[#9281F7] mb-4">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-[#FFFFFF] mb-1.5">
              History
            </h3>
            <p className="text-xs text-[#A1A4A5] leading-relaxed">
              Understand historical patterns and pinpoint the exact moments latency spiked or checks failed.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PRODUCT VALUE SECTION (Alternating Layout) */}
      <section id="product-value" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto border-t border-[#292D30]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#FFFFFF] mb-3">
            One place to see everything that matters.
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A4A5]">
            Engineered to provide immediate diagnostic clarity without dashboard clutter.
          </p>
        </div>

        <div className="space-y-16">
          {/* Story 1: Server Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-[#9281F7] font-semibold">
                01 / Infrastructure Telemetry
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] tracking-tight">
                Server Health in Real Time
              </h3>
              <p className="text-xs sm:text-sm text-[#A1A4A5] leading-relaxed">
                Track host operating performance with precision. Keep tabs on multi-core utilization, active memory consumption, and disk space saturation before thresholds are breached.
              </p>
            </div>

            <div className="ops-card p-5 bg-[#000000] border border-[#292D30] rounded-[16px] font-mono text-xs space-y-2">
              <div className="flex justify-between items-center p-3 rounded-[6px] bg-[#000000] border border-[#292D30]">
                <span className="text-[#A1A4A5]">CPU Utilization</span>
                <span className="text-[#3B9EFF] font-bold">56.25%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-[6px] bg-[#000000] border border-[#292D30]">
                <span className="text-[#A1A4A5]">Memory Allocation</span>
                <span className="text-[#9281F7] font-bold">10.3 GB / 16.0 GB</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-[6px] bg-[#000000] border border-[#292D30]">
                <span className="text-[#A1A4A5]">Disk Volume Capacity</span>
                <span className="text-[#FFFFFF] font-bold">56.88% Allocated</span>
              </div>
            </div>
          </div>

          {/* Story 2: API Uptime (Reversed) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="ops-card p-5 bg-[#000000] border border-[#292D30] rounded-[16px] font-mono text-xs space-y-2.5 order-2 lg:order-1">
              <div className="p-3 rounded-[6px] bg-[#000000] border border-[#292D30] flex items-center justify-between">
                <div>
                  <div className="text-[#FFFFFF] font-bold">GitHub REST API</div>
                  <div className="text-[11px] text-[#9281F7]">https://api.github.com</div>
                </div>
                <div className="text-right">
                  <div className="text-[#3AD389] font-bold">● UP (HTTP 200)</div>
                  <div className="text-[#A1A4A5] text-[11px]">185 ms latency</div>
                </div>
              </div>

              <div className="p-3 rounded-[6px] bg-[#000000] border border-[#292D30] flex items-center justify-between">
                <div>
                  <div className="text-[#FFFFFF] font-bold">Cloudflare Public DNS</div>
                  <div className="text-[11px] text-[#9281F7]">https://1.1.1.1</div>
                </div>
                <div className="text-right">
                  <div className="text-[#3AD389] font-bold">● UP (HTTP 200)</div>
                  <div className="text-[#A1A4A5] text-[11px]">42 ms latency</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 order-1 lg:order-2">
              <div className="text-xs font-mono uppercase tracking-wider text-[#3AD389] font-semibold">
                02 / Synthetic Availability
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] tracking-tight">
                API Uptime & Latency
              </h3>
              <p className="text-xs sm:text-sm text-[#A1A4A5] leading-relaxed">
                Monitor any HTTP or HTTPS endpoint with automatic status checks every 30 seconds. Detect degraded latencies, network timeouts, and 5xx outages immediately.
              </p>
            </div>
          </div>

          {/* Story 3: Historical Telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-[#3B9EFF] font-semibold">
                03 / Trend Observability
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] tracking-tight">
                Historical Observability
              </h3>
              <p className="text-xs sm:text-sm text-[#A1A4A5] leading-relaxed">
                Understand systemic performance over time rather than chasing transient anomalies. Evaluate 50-check uptime blocks and response time distribution graphs.
              </p>
            </div>

            <div className="ops-card p-5 bg-[#000000] border border-[#292D30] rounded-[16px]">
              <div className="text-xs font-mono text-[#A1A4A5] mb-2 flex justify-between">
                <span>Latency Timeline</span>
                <span className="text-[#9281F7]">50 checks recorded</span>
              </div>
              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={multiSignalData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#292D30" vertical={false} />
                    <XAxis dataKey="time" stroke="#6E727A" tick={{ fill: '#A1A4A5', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={{ stroke: '#292D30' }} />
                    <YAxis stroke="#6E727A" tick={{ fill: '#A1A4A5', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={{ stroke: '#292D30' }} />
                    <Line type="monotone" dataKey="latency" stroke="#9281F7" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-4 sm:px-8 max-w-5xl mx-auto border-t border-[#292D30]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF] mb-2">
            Simple 3-Step Setup
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A4A5]">
            Get full infrastructure and API observability running in under a minute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="ops-card p-6 bg-[#000000] border border-[#292D30] rounded-[16px]">
            <div className="text-3xl font-bold font-mono text-[#9281F7] mb-3">01</div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-[#FFFFFF] mb-2">
              Connect
            </h3>
            <p className="text-xs text-[#A1A4A5] leading-relaxed">
              Register the API endpoints and services you care about directly from the dashboard.
            </p>
          </div>

          <div className="ops-card p-6 bg-[#000000] border border-[#292D30] rounded-[16px]">
            <div className="text-3xl font-bold font-mono text-[#3B9EFF] mb-3">02</div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-[#FFFFFF] mb-2">
              Monitor
            </h3>
            <p className="text-xs text-[#A1A4A5] leading-relaxed">
              OpsMonitor executes periodic synthetic health checks and samples host statistics automatically.
            </p>
          </div>

          <div className="ops-card p-6 bg-[#000000] border border-[#292D30] rounded-[16px]">
            <div className="text-3xl font-bold font-mono text-[#3AD389] mb-3">03</div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-[#FFFFFF] mb-2">
              Understand
            </h3>
            <p className="text-xs text-[#A1A4A5] leading-relaxed">
              Analyze uptime ratios, response times, and resource telemetry to ensure continuous reliability.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FEATURE GRID */}
      <section id="features" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto border-t border-[#292D30]">
        <div className="max-w-2xl mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF] mb-2">
            Everything you need to see system health.
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A4A5]">
            Built with modern web technologies for low latency and zero overhead.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="ops-card p-5 bg-[#000000] border border-[#292D30] rounded-[16px] hover:border-[#4B5158] transition-colors"
              >
                <div className="w-8 h-8 rounded-[6px] bg-[#000000] border border-[#292D30] flex items-center justify-center text-[#9281F7] mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold font-mono text-[#FFFFFF] mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-[11px] text-[#A1A4A5] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. DEVELOPER / TECHNICAL SECTION */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto border-t border-[#292D30]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF]">
              Built for developers who want visibility.
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A4A5] leading-relaxed">
              Designed with a clean terminal aesthetic, high-density monospace tables, and rapid keyboard interactions. No bloated widgets or sluggish dashboards.
            </p>
            <div className="pt-2">
              <Link
                to="/dashboard"
                className="btn-ghost inline-flex items-center space-x-2 px-4 py-2 text-xs font-mono font-medium cursor-pointer"
              >
                <span>Launch Operations Terminal</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#9281F7]" />
              </Link>
            </div>
          </div>

          {/* Terminal / Code Window */}
          <div className="ops-card bg-[#000000] border border-[#292D30] rounded-[16px] p-4 font-mono text-xs overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#292D30] text-[11px] text-[#6E727A]">
              <span>bash — opsmonitor telemetry</span>
              <span>node v20.x</span>
            </div>
            <div className="space-y-2 select-all">
              <div className="text-[#A1A4A5]">
                <span className="text-[#3AD389]">$</span> opsmonitor --status
              </div>
              <div className="text-[#6E727A] pt-1">[HOST_TELEMETRY]</div>
              <div className="pl-3 space-y-0.5 text-[11px]">
                <div>CPU LOAD     : <span className="text-[#3B9EFF]">56.25% (8 Cores)</span></div>
                <div>MEMORY USAGE : <span className="text-[#9281F7]">64.52% (10.3 GB)</span></div>
                <div>DISK PARTITION: <span className="text-[#FFFFFF]">56.88% (Root Volume)</span></div>
                <div>HOST UPTIME  : <span className="text-[#3AD389]">2h 34m (Daemon OK)</span></div>
              </div>
              <div className="text-[#6E727A] pt-1">[ENDPOINTS_MONITORED]</div>
              <div className="pl-3 space-y-0.5 text-[11px]">
                <div>• api.github.com   → <span className="text-[#3AD389]">HTTP 200 (185ms) 99.8%</span></div>
                <div>• httpbin.org/200  → <span className="text-[#3AD389]">HTTP 200 (412ms) 98.4%</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. LIVE TELEMETRY CURVES */}
      <section id="telemetry" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto border-t border-[#292D30]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF] mb-2">
            From signal to insight.
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A4A5]">
            Real-time synchronized telemetry lines mapping system load and API response latency.
          </p>
        </div>

        <div className="ops-card p-6 bg-[#000000] border border-[#292D30] rounded-[24px]">
          <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#292D30] text-xs font-mono gap-2">
            <span className="font-bold text-[#FFFFFF]">Synchronized Infrastructure Telemetry</span>
            <div className="flex items-center space-x-4">
              <span className="text-[#3B9EFF] flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-[#3B9EFF]" /> CPU (%)
              </span>
              <span className="text-[#9281F7] flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-[#9281F7]" /> Memory (%)
              </span>
              <span className="text-[#3AD389] flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-[#3AD389]" /> Latency (ms / 5)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={multiSignalData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292D30" vertical={false} />
                <XAxis dataKey="time" stroke="#6E727A" tick={{ fill: '#A1A4A5', fontSize: 11, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={{ stroke: '#292D30' }} />
                <YAxis stroke="#6E727A" tick={{ fill: '#A1A4A5', fontSize: 11, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={{ stroke: '#292D30' }} />
                <Line type="monotone" dataKey="cpu" name="CPU" stroke="#3B9EFF" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="mem" name="Memory" stroke="#9281F7" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="latency" name="Latency" stroke="#3AD389" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="py-24 px-4 sm:px-8 max-w-4xl mx-auto text-center border-t border-[#292D30]">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF] mb-4">
          Start monitoring what matters.
        </h2>
        <p className="text-sm sm:text-base text-[#A1A4A5] max-w-xl mx-auto mb-8 leading-relaxed">
          See your infrastructure clearly. Catch problems earlier. Understand what happened.
        </p>
        <Link
          to="/dashboard"
          className="btn-ghost inline-flex items-center space-x-2 px-6 py-3 text-sm font-mono font-medium hover:border-white transition-all cursor-pointer bg-[#000000]"
        >
          <span>Open Dashboard</span>
          <ArrowRight className="w-4 h-4 text-[#9281F7]" />
        </Link>
      </section>

      {/* 11. MINIMAL FOOTER */}
      <footer className="border-t border-[#292D30] px-4 sm:px-8 py-10 bg-[#000000] text-xs font-mono text-[#A1A4A5]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-[#FFFFFF] font-bold">
              <Server className="w-4 h-4 text-[#9281F7]" />
              <span>OpsMonitor</span>
            </div>
            <p className="text-[#6E727A] text-[11px]">
              DevOps monitoring, without the noise.
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="hover:text-[#FFFFFF] transition-colors">
              Dashboard
            </Link>
            <Link to="/endpoints" className="hover:text-[#FFFFFF] transition-colors">
              Endpoints
            </Link>
            <Link to="/containers" className="hover:text-[#FFFFFF] transition-colors">
              Containers
            </Link>
          </div>

          <div className="text-[11px] text-[#6E727A]">
            Built with React · Node.js · MongoDB
          </div>
        </div>
      </footer>
    </div>
  );
}
