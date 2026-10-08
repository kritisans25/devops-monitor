import React from 'react';
import { Globe, Plus, Search } from 'lucide-react';
import EndpointRow from './EndpointRow';

export default function EndpointTable({
  monitors = [],
  histories = {},
  uptimes = {},
  onAddEndpoint,
  onRefresh,
  title = 'Monitored Endpoints',
  subtitle = 'HTTP and API health checks',
  searchQuery = '',
  onSearchChange,
  showSearch = false,
  showFullColumns = true,
}) {
  const filteredMonitors = React.useMemo(() => {
    if (!searchQuery.trim()) return monitors;
    const q = searchQuery.toLowerCase();
    return monitors.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.url.toLowerCase().includes(q)
    );
  }, [monitors, searchQuery]);

  return (
    <div className="ops-card overflow-hidden">
      {/* Table Header Section */}
      <div className="p-3.5 sm:p-4 border-b border-[#292D30] bg-[#000000] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#FFFFFF] tracking-tight flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#9281F7]" />
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-[#A1A4A5] mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {showSearch && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6E727A]" />
              <input
                type="text"
                placeholder="Filter endpoints..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-7 pr-3 py-1 bg-[#000000] border border-[#292D30] focus:border-[#9281F7] rounded-[6px] text-xs text-[#FFFFFF] placeholder-[#6E727A] focus:outline-hidden font-mono w-44 sm:w-52 transition-colors duration-150"
              />
            </div>
          )}

          {onAddEndpoint && (
            <button
              onClick={onAddEndpoint}
              className="btn-ghost inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium cursor-pointer font-mono"
            >
              <Plus className="w-3.5 h-3.5 text-[#9281F7]" />
              <span>Add Endpoint</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {filteredMonitors.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center bg-[#000000]">
            <div className="w-9 h-9 rounded-[6px] bg-[#000000] border border-[#292D30] flex items-center justify-center text-[#A1A4A5] mb-2.5">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold text-[#FFFFFF] mb-1 font-mono">
              {searchQuery ? 'No matching endpoints' : 'No monitored endpoints configured'}
            </h3>
            <p className="text-xs text-[#A1A4A5] max-w-sm mb-3">
              {searchQuery
                ? 'Try refining your search filter.'
                : 'Add an endpoint to begin logging latency telemetry and HTTP status codes.'}
            </p>
            {onAddEndpoint && !searchQuery && (
              <button
                onClick={onAddEndpoint}
                className="btn-ghost inline-flex items-center space-x-1 px-3 py-1 text-xs font-medium cursor-pointer font-mono"
              >
                <Plus className="w-3.5 h-3.5 text-[#9281F7]" />
                <span>Add Endpoint</span>
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#292D30] bg-[#000000] text-[10px] font-semibold uppercase tracking-wider text-[#6E727A] font-mono">
                <th className="py-2 px-4">Name / URL</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Status Code</th>
                <th className="py-2 px-4">Response</th>
                <th className="py-2 px-4">Uptime 24h</th>
                <th className="py-2 px-4">Last Checked</th>
                <th className="py-2 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMonitors.map((monitor) => (
                <EndpointRow
                  key={monitor._id || monitor.url}
                  monitor={monitor}
                  historyItem={histories[monitor.url]}
                  uptimeData={uptimes[monitor.url]}
                  onChecked={onRefresh}
                  showUrl={showFullColumns}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

