import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ExternalLink, RefreshCw } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatTimeAgo, getResponseTimeClassification } from '../utils/formatters';
import { checkApi } from '../api/api';

export default function EndpointRow({
  monitor,
  historyItem,
  uptimeData,
  onChecked,
  showUrl = false,
}) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  const status = historyItem?.status || 'UNKNOWN';
  const responseTime = historyItem?.responseTime;
  const statusCode = historyItem?.statusCode;
  const lastChecked = historyItem?.timestamp;
  const uptime = uptimeData?.uptimePercentage;

  const rtClassification = getResponseTimeClassification(responseTime);

  const handleManualCheck = async (e) => {
    e.stopPropagation();
    if (checking) return;

    try {
      setChecking(true);
      await checkApi(monitor.url);
      if (onChecked) onChecked();
    } catch (err) {
      console.error('Manual check failed:', err);
    } finally {
      setChecking(false);
    }
  };

  const handleRowClick = () => {
    navigate(`/endpoints/${encodeURIComponent(monitor.url)}`);
  };

  return (
    <tr
      onClick={handleRowClick}
      className="border-b border-[#292D30] hover:bg-[#0A0A0C] cursor-pointer transition-colors duration-150 group text-xs"
    >
      {/* Name & URL */}
      <td className="py-2.5 px-4">
        <div className="flex flex-col">
          <span className="font-semibold text-xs text-[#FFFFFF] group-hover:text-[#9281F7] transition-colors">
            {monitor.name}
          </span>
          <span className="text-[11px] font-mono text-[#9281F7] truncate max-w-xs mt-0.5 opacity-90">
            {monitor.url}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="py-2.5 px-4 whitespace-nowrap">
        <StatusBadge status={status} size="sm" />
      </td>

      {/* Status Code */}
      <td className="py-2.5 px-4 whitespace-nowrap font-mono text-xs text-[#FFFFFF]">
        {statusCode ? (
          <span>{statusCode}</span>
        ) : (
          <span className="text-[#6E727A]">—</span>
        )}
      </td>

      {/* Response Time */}
      <td className="py-2.5 px-4 whitespace-nowrap font-mono text-xs">
        {responseTime !== null && responseTime !== undefined ? (
          <span className={`font-medium ${rtClassification.color}`}>
            {responseTime} ms
          </span>
        ) : (
          <span className="text-[#6E727A]">—</span>
        )}
      </td>

      {/* Uptime 24h */}
      <td className="py-2.5 px-4 whitespace-nowrap font-mono text-xs">
        {uptime !== undefined && uptime !== null ? (
          <span
            className={`font-medium ${
              uptime >= 99
                ? 'text-[#3AD389]'
                : uptime >= 95
                ? 'text-[#FFCA16]'
                : 'text-[#FF6465]'
            }`}
          >
            {Number(uptime).toFixed(1)}%
          </span>
        ) : (
          <span className="text-[#6E727A]">—</span>
        )}
      </td>

      {/* Last Checked */}
      <td className="py-2.5 px-4 whitespace-nowrap text-xs font-mono text-[#A1A4A5]">
        {formatTimeAgo(lastChecked)}
      </td>

      {/* Actions */}
      <td className="py-2.5 px-4 whitespace-nowrap text-right text-xs">
        <div className="flex items-center justify-end space-x-1">
          <button
            onClick={handleManualCheck}
            disabled={checking}
            className="p-1 rounded-[4px] text-[#A1A4A5] hover:text-[#FFFFFF] hover:bg-[#111419] border border-transparent hover:border-[#292D30] transition-colors disabled:opacity-50 cursor-pointer"
            title="Check this endpoint immediately"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${checking ? 'animate-spin text-[#9281F7]' : ''}`}
            />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(monitor.url, '_blank', 'noopener,noreferrer');
            }}
            className="p-1 rounded-[4px] text-[#A1A4A5] hover:text-[#FFFFFF] hover:bg-[#111419] transition-colors cursor-pointer"
            title="Open URL in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <span className="text-[#6E727A] group-hover:text-[#A1A4A5] transition-colors pl-0.5">
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </td>
    </tr>
  );
}

