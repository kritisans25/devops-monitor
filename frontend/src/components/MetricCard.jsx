import React from 'react';
import { getUtilizationStatus } from '../utils/formatters';
import StatusBadge from './StatusBadge';

export default function MetricCard({
  title,
  value,
  subValue,
  unit = '',
  statusLabel,
  customStatusType, // 'healthy' | 'warning' | 'critical' | 'online'
  isPercentage = false,
  rawPercent = null,
  icon: Icon,
  sparklineData = [], // array of numbers
  sparklineColor = null, // optional override
}) {
  // Determine status
  let statusInfo;
  if (customStatusType) {
    statusInfo = {
      label: statusLabel || (customStatusType === 'online' ? 'Online' : customStatusType.toUpperCase()),
      status: customStatusType,
      color: customStatusType === 'critical' ? 'text-[#FF6465]' : customStatusType === 'warning' ? 'text-[#FFCA16]' : 'text-[#3AD389]',
    };
  } else if (isPercentage && rawPercent !== null && rawPercent !== undefined) {
    statusInfo = getUtilizationStatus(rawPercent);
    if (statusLabel) statusInfo.label = statusLabel;
  } else {
    statusInfo = {
      label: statusLabel || 'Healthy',
      status: 'healthy',
      color: 'text-[#3AD389]',
    };
  }

  // Determine line color (CPU/Disk: #3B9EFF, Memory: #9281F7)
  const defaultColor = title?.toLowerCase().includes('memory') ? '#9281F7' : '#3B9EFF';
  const strokeColor = statusInfo.status === 'critical'
    ? '#FF6465'
    : statusInfo.status === 'warning'
    ? '#FFCA16'
    : sparklineColor || defaultColor;

  // Generate SVG mini sparkline points (simple thin line, no fills)
  let sparklinePoints = '';
  if (sparklineData && sparklineData.length > 1) {
    const min = Math.min(...sparklineData, 0);
    const max = Math.max(...sparklineData, 100);
    const range = max - min || 1;
    const width = 76;
    const height = 18;
    
    sparklinePoints = sparklineData
      .map((val, idx) => {
        const x = (idx / (sparklineData.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  return (
    <div className="ops-card p-4 relative flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          {Icon && (
            <div className="p-1 rounded-[6px] bg-[#000000] border border-[#292D30] text-[#A1A4A5]">
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="text-[11px] font-semibold text-[#A1A4A5] tracking-wider uppercase font-mono">
            {title}
          </span>
        </div>
        <StatusBadge status={statusInfo.label} size="sm" />
      </div>

      {/* Value & Minimal Sparkline */}
      <div className="flex items-end justify-between mt-1">
        <div>
          <div className="flex items-baseline space-x-1">
            <span
              className={`text-2xl font-bold font-mono tracking-tight ${
                statusInfo.status === 'critical'
                  ? 'text-[#FF6465]'
                  : statusInfo.status === 'warning'
                  ? 'text-[#FFCA16]'
                  : 'text-[#FFFFFF]'
              }`}
            >
              {value}
            </span>
            {unit && <span className="text-xs font-mono text-[#A1A4A5]">{unit}</span>}
          </div>
          {subValue && (
            <p className="text-[11px] font-mono text-[#6E727A] mt-0.5 truncate max-w-[150px] sm:max-w-none">
              {subValue}
            </p>
          )}
        </div>

        {/* Minimal Sparkline graph (simple solid thin line) */}
        {sparklinePoints && (
          <div className="shrink-0 pl-2">
            <svg width="76" height="18" className="overflow-visible">
              <polyline
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sparklinePoints}
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

