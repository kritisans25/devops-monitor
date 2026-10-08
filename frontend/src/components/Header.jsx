import React from 'react';
import { RefreshCw, Menu, Radio } from 'lucide-react';

export default function Header({
  title = 'Overview',
  subtitle = 'Infrastructure and endpoint telemetry',
  lastUpdatedSeconds = 0,
  autoRefresh = true,
  onToggleAutoRefresh,
  onManualRefresh,
  isRefreshing = false,
  onOpenMobileSidebar,
  systemStatus = 'UP',
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#000000] border-b border-[#292D30] px-4 md:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      {/* Title & Mobile Toggle */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-1.5 rounded-[6px] text-[#A1A4A5] hover:text-[#FFFFFF] hover:bg-[#111419] border border-[#292D30] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div>
          <h1 className="text-sm font-bold text-[#FFFFFF] tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-[#A1A4A5]">{subtitle}</p>
        </div>
      </div>

      {/* Control Strip */}
      <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
        {/* Global Operational Status */}
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-[6px] bg-[#000000] border border-[#292D30] text-[#FFFFFF]">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              systemStatus === 'DOWN'
                ? 'bg-[#FF6465]'
                : systemStatus === 'WARNING'
                ? 'bg-[#FFCA16]'
                : 'bg-[#3AD389] animate-pulse-live'
            }`}
          />
          <span className="font-mono text-xs uppercase tracking-tight">
            {systemStatus === 'DOWN'
              ? 'Incident Detected'
              : systemStatus === 'WARNING'
              ? 'Degraded'
              : 'All systems operational'}
          </span>
        </div>

        {/* Last Updated Counter */}
        <div className="hidden lg:flex items-center text-[#A1A4A5] bg-[#000000] px-2.5 py-1 rounded-[6px] border border-[#292D30]">
          <span>Updated {lastUpdatedSeconds}s ago</span>
        </div>

        {/* Auto-Refresh Toggle Button */}
        <button
          onClick={onToggleAutoRefresh}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-[6px] border transition-colors duration-150 cursor-pointer ${
            autoRefresh
              ? 'bg-[#000000] text-[#9281F7] border-[#9281F7]/60 hover:border-[#9281F7]'
              : 'bg-[#000000] text-[#6E727A] border-[#292D30] hover:border-[#A1A4A5]'
          }`}
          title="Toggle automatic background telemetry fetching"
        >
          <Radio className={`w-3 h-3 ${autoRefresh ? 'text-[#9281F7]' : 'text-[#6E727A]'}`} />
          <span>{autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}</span>
        </button>

        {/* Manual Refresh Button - Signature Ghost Button */}
        <button
          onClick={onManualRefresh}
          disabled={isRefreshing}
          className="btn-ghost flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium cursor-pointer disabled:opacity-50"
          title="Manually fetch latest data from backend"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-[#A1A4A5] group-hover:text-white ${
              isRefreshing ? 'animate-spin text-[#9281F7]' : ''
            }`}
          />
          <span>Refresh</span>
        </button>
      </div>
    </header>
  );
}

