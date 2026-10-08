import React, { useState } from 'react';
import { formatDateTime } from '../utils/formatters';

export default function UptimeBars({ history = [], maxBars = 50 }) {
  const [hoveredCheck, setHoveredCheck] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const chronologicalHistory = React.useMemo(() => {
    if (!history || history.length === 0) return [];
    return [...history].slice(0, maxBars).reverse();
  }, [history, maxBars]);

  const handleMouseEnter = (check, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 6,
    });
    setHoveredCheck(check);
  };

  const handleMouseLeave = () => {
    setHoveredCheck(null);
  };

  if (chronologicalHistory.length === 0) {
    return (
      <div className="py-4 text-center text-xs font-mono text-[#A1A4A5] bg-[#000000] rounded-[6px] border border-dashed border-[#292D30]">
        No check logs available. Checks execute periodically.
      </div>
    );
  }

  const upCount = chronologicalHistory.filter((c) => c.status === 'UP').length;
  const uptimeRatio = ((upCount / chronologicalHistory.length) * 100).toFixed(1);

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 text-xs font-mono">
        <span className="text-[#A1A4A5]">
          Last {chronologicalHistory.length} checks
        </span>
        <div className="flex items-center space-x-1.5">
          <span className="text-[#A1A4A5]">Calculated Uptime:</span>
          <span
            className={`font-medium ${
              uptimeRatio >= 99
                ? 'text-[#3AD389]'
                : uptimeRatio >= 95
                ? 'text-[#FFCA16]'
                : 'text-[#FF6465]'
            }`}
          >
            {uptimeRatio}%
          </span>
        </div>
      </div>

      {/* Bars container */}
      <div className="flex items-center justify-between gap-0.5 p-2 rounded-[6px] bg-[#000000] border border-[#292D30] overflow-x-auto">
        {chronologicalHistory.map((check, index) => {
          const isUp = check.status === 'UP';
          return (
            <div
              key={check._id || index}
              onMouseEnter={(e) => handleMouseEnter(check, e)}
              onMouseLeave={handleMouseLeave}
              className={`flex-1 min-w-[5px] max-w-[10px] h-6 rounded-none transition-opacity cursor-pointer hover:opacity-75 ${
                isUp
                  ? 'bg-[#3AD389]'
                  : 'bg-[#FF6465]'
              }`}
            />
          );
        })}
      </div>

      {/* Axis timestamps */}
      <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-[#6E727A]">
        <span>{chronologicalHistory[0]?.timestamp ? formatDateTime(chronologicalHistory[0].timestamp) : 'Earliest'}</span>
        <span className="text-[#A1A4A5] font-medium">100% Operational Target</span>
        <span>{chronologicalHistory[chronologicalHistory.length - 1]?.timestamp ? formatDateTime(chronologicalHistory[chronologicalHistory.length - 1].timestamp) : 'Latest'}</span>
      </div>

      {/* Clean Pure Black Tooltip */}
      {hoveredCheck && (
        <div
          className="fixed z-50 -translate-x-1/2 -translate-y-full pointer-events-none"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="bg-[#000000] border border-[#292D30] rounded-[6px] p-2 text-xs font-mono shadow-none text-[#FFFFFF] min-w-[160px]">
            <div className="flex items-center justify-between space-x-2 pb-1 border-b border-[#292D30] mb-1">
              <span
                className={`font-medium ${
                  hoveredCheck.status === 'UP' ? 'text-[#3AD389]' : 'text-[#FF6465]'
                }`}
              >
                ● {hoveredCheck.status}
              </span>
              <span className="text-[#A1A4A5] text-[11px]">
                {hoveredCheck.statusCode ? `HTTP ${hoveredCheck.statusCode}` : 'No Code'}
              </span>
            </div>

            <div className="space-y-0.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#6E727A]">Latency:</span>
                <span className="font-medium text-[#FFFFFF]">
                  {hoveredCheck.responseTime !== null ? `${hoveredCheck.responseTime} ms` : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E727A]">Timestamp:</span>
                <span className="text-[#A1A4A5]">
                  {formatDateTime(hoveredCheck.timestamp)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

