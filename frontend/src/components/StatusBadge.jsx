import React from 'react';

export default function StatusBadge({ status, size = 'md', pulse = true, showLabel = true }) {
  const normStatus = (status || '').toString().toUpperCase();

  let dotColor = 'bg-[#A1A4A5]';
  let textColor = 'text-[#A1A4A5]';
  let label = status || 'Unknown';

  if (
    normStatus === 'UP' ||
    normStatus === 'ONLINE' ||
    normStatus === 'HEALTHY' ||
    normStatus === 'ACTIVE' ||
    normStatus === 'CONNECTED' ||
    normStatus === 'ALL SYSTEMS OPERATIONAL'
  ) {
    dotColor = 'bg-[#3AD389]';
    textColor = 'text-[#3AD389]';
    label = normStatus === 'UP' ? 'UP' : status;
  } else if (
    normStatus === 'WARNING' ||
    normStatus === 'MODERATE' ||
    normStatus === 'DEGRADED' ||
    normStatus === 'PERFORMANCE DEGRADED'
  ) {
    dotColor = 'bg-[#FFCA16]';
    textColor = 'text-[#FFCA16]';
  } else if (
    normStatus === 'DOWN' ||
    normStatus === 'CRITICAL' ||
    normStatus === 'OFFLINE' ||
    normStatus === 'ERROR' ||
    normStatus === 'FAILED' ||
    normStatus === 'INCIDENT DETECTED'
  ) {
    dotColor = 'bg-[#FF6465]';
    textColor = 'text-[#FF6465]';
    label = normStatus === 'DOWN' ? 'DOWN' : status;
  }

  const sizeClasses = size === 'sm' 
    ? 'text-[11px] px-2 py-0.5 space-x-1.5' 
    : 'text-xs px-2.5 py-0.5 space-x-1.5';

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded-[6px] bg-[#000000] border border-[#292D30] ${textColor} ${sizeClasses}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dotColor} ${
          pulse && (normStatus === 'UP' || normStatus === 'ONLINE' || normStatus === 'ACTIVE')
            ? 'animate-pulse-live'
            : ''
        }`}
      />
      {showLabel && <span className="tracking-tight">{label}</span>}
    </span>
  );
}

