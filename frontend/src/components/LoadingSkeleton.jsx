import React from 'react';

export function CardSkeleton({ height = 'h-28' }) {
  return (
    <div className={`ops-card p-4 animate-pulse bg-[#000000] border-[#292D30] ${height} flex flex-col justify-between`}>
      <div className="flex items-center justify-between">
        <div className="h-3.5 bg-[#14171A] rounded-[4px] w-20"></div>
        <div className="h-4 w-4 bg-[#14171A] rounded-[4px]"></div>
      </div>
      <div className="space-y-1.5">
        <div className="h-6 bg-[#14171A] rounded-[4px] w-28"></div>
        <div className="h-2.5 bg-[#14171A] rounded-[4px] w-16"></div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="ops-card p-5 animate-pulse bg-[#000000] border-[#292D30] h-72 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1.5">
          <div className="h-4 bg-[#14171A] rounded-[4px] w-36"></div>
          <div className="h-2.5 bg-[#14171A] rounded-[4px] w-48"></div>
        </div>
        <div className="h-3.5 bg-[#14171A] rounded-[4px] w-24"></div>
      </div>
      <div className="h-48 bg-[#000000] rounded-[6px] border border-[#292D30] flex items-center justify-center">
        <div className="text-xs text-[#A1A4A5] font-mono">Loading telemetry stream...</div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 4 }) {
  return (
    <div className="ops-card p-4 animate-pulse bg-[#000000] border-[#292D30]">
      <div className="flex justify-between items-center mb-3">
        <div className="h-4 bg-[#14171A] rounded-[4px] w-32"></div>
        <div className="h-6 bg-[#14171A] rounded-[4px] w-24"></div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-9 bg-[#000000] rounded-[4px] flex items-center justify-between px-3 border border-[#292D30]">
            <div className="h-3 bg-[#14171A] rounded-[4px] w-1/4"></div>
            <div className="h-3 bg-[#14171A] rounded-[4px] w-1/6"></div>
            <div className="h-3 bg-[#14171A] rounded-[4px] w-1/6"></div>
            <div className="h-3 bg-[#14171A] rounded-[4px] w-1/12"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

