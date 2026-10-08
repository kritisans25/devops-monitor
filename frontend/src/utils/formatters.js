/**
 * Utility formatters for OpsMonitor (Dark Industrial Theme)
 */

export function formatBytes(bytes, decimals = 1) {
  if (bytes === null || bytes === undefined || isNaN(bytes)) return '—';
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  if (i < 0) return `${bytes} B`;

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatUptime(seconds) {
  if (!seconds || isNaN(seconds) || seconds < 0) return '—';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  parts.push(`${hours.toString().padStart(2, '0')}h`);
  parts.push(`${minutes.toString().padStart(2, '0')}m`);

  return parts.join(' ');
}

export function formatTimeAgo(timestamp) {
  if (!timestamp) return 'Never';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '—';

  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now - date) / 1000));

  if (diffInSeconds < 5) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export function formatChartTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

export function formatDateTime(timestamp) {
  if (!timestamp) return '—';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

export function getResponseTimeClassification(ms) {
  if (ms === null || ms === undefined || isNaN(ms)) {
    return { label: 'Unknown', color: 'text-[#A1A4A5]' };
  }
  if (ms < 500) {
    return { label: 'Normal', color: 'text-[#3AD389]' };
  }
  if (ms <= 1000) {
    return { label: 'Warning', color: 'text-[#FFCA16]' };
  }
  return { label: 'Slow', color: 'text-[#FF6465]' };
}

export function getUtilizationStatus(percent) {
  const num = typeof percent === 'string' ? parseFloat(percent) : percent;
  if (isNaN(num)) return { label: 'Unknown', status: 'normal', color: 'text-[#A1A4A5]' };
  
  if (num >= 90) {
    return { label: 'Critical', status: 'critical', color: 'text-[#FF6465]' };
  }
  if (num >= 70) {
    return { label: 'Warning', status: 'warning', color: 'text-[#FFCA16]' };
  }
  return { label: 'Healthy', status: 'healthy', color: 'text-[#3AD389]' };
}

