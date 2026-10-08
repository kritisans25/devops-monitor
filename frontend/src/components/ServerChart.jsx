import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatChartTime } from '../utils/formatters';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#000000] border border-[#292D30] rounded-[6px] p-2.5 shadow-none font-mono text-xs z-50 text-[#FFFFFF]">
        <div className="text-[#A1A4A5] mb-1.5 font-medium pb-1 border-b border-[#292D30]">
          {label ? formatChartTime(label) : '—'}
        </div>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between space-x-4">
              <span className="flex items-center space-x-1.5 text-[#A1A4A5]">
                <span
                  className="w-2.5 h-0.5"
                  style={{ backgroundColor: entry.color }}
                />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold text-[#FFFFFF]">
                {entry.value !== undefined ? `${Number(entry.value).toFixed(1)}%` : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export default function ServerChart({ metrics = [] }) {
  // Sort and format historical data chronologically
  const chartData = React.useMemo(() => {
    if (!metrics || metrics.length === 0) return [];
    
    const sorted = [...metrics].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return sorted.map((m) => ({
      timestamp: m.timestamp,
      formattedTime: formatChartTime(m.timestamp),
      CPU: typeof m.cpuUsage === 'number' ? m.cpuUsage : parseFloat(m.cpuUsage) || 0,
      Memory: typeof m.memoryUsage === 'number' ? m.memoryUsage : parseFloat(m.memoryUsage) || 0,
    }));
  }, [metrics]);

  return (
    <div className="ops-card p-4 sm:p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#292D30] gap-2">
        <div>
          <h2 className="text-sm font-bold text-[#FFFFFF] tracking-tight">
            Server Performance
          </h2>
          <p className="text-xs text-[#A1A4A5] mt-0.5">
            CPU and memory utilization telemetry stream
          </p>
        </div>
        <div className="flex items-center space-x-3.5 text-xs font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-0.5 bg-[#3B9EFF]" />
            <span className="text-[#A1A4A5] font-medium">CPU %</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-0.5 bg-[#9281F7]" />
            <span className="text-[#A1A4A5] font-medium">Memory %</span>
          </div>
          <span className="text-[11px] px-1.5 py-0.5 rounded-[4px] bg-[#000000] text-[#A1A4A5] border border-[#292D30]">
            {chartData.length} samples
          </span>
        </div>
      </div>

      {/* Clean Telemetry Line Chart (No Area Fills, No Gradients) */}
      <div className="h-64 w-full pt-3">
        {chartData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-[#000000] rounded-[6px] border border-dashed border-[#292D30]">
            <p className="text-xs text-[#A1A4A5] font-medium font-mono">
              Collecting server telemetry...
            </p>
            <p className="text-[11px] text-[#6E727A] font-mono mt-0.5">
              Data samples are recorded at 10-second intervals.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#292D30"
                vertical={false}
              />

              <XAxis
                dataKey="formattedTime"
                stroke="#6E727A"
                tick={{ fill: '#A1A4A5', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                axisLine={{ stroke: '#292D30' }}
                minTickGap={30}
              />

              <YAxis
                domain={[0, 100]}
                stroke="#6E727A"
                tick={{ fill: '#A1A4A5', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                axisLine={{ stroke: '#292D30' }}
                tickFormatter={(val) => `${val}%`}
              />

              <Tooltip content={<CustomTooltip />} />

              <Line
                type="monotone"
                dataKey="CPU"
                name="CPU Usage"
                stroke="#3B9EFF"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3.5, stroke: '#3B9EFF', strokeWidth: 1, fill: '#000000' }}
                isAnimationActive={false}
              />

              <Line
                type="monotone"
                dataKey="Memory"
                name="Memory Usage"
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
  );
}

