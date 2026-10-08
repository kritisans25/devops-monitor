import React, { useState, useEffect, useCallback } from 'react';
import EndpointTable from '../components/EndpointTable';
import AddEndpointModal from '../components/AddEndpointModal';
import { TableSkeleton } from '../components/LoadingSkeleton';
import ErrorCard from '../components/ErrorCard';
import { getMonitors, getApiHistory, getApiUptime } from '../api/api';

export default function Endpoints({ refreshSignal, autoRefresh }) {
  const [monitors, setMonitors] = useState([]);
  const [histories, setHistories] = useState({});
  const [uptimes, setUptimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEndpointsData = useCallback(async () => {
    try {
      const monitorList = await getMonitors();
      const list = Array.isArray(monitorList) ? monitorList : [];
      setMonitors(list);
      setError(null);

      const historyMap = {};
      const uptimeMap = {};

      await Promise.all(
        list.map(async (m) => {
          try {
            const [historyData, uptimeData] = await Promise.all([
              getApiHistory(m.url).catch(() => []),
              getApiUptime(m.url).catch(() => null),
            ]);

            if (Array.isArray(historyData) && historyData.length > 0) {
              historyMap[m.url] = historyData[0];
            }
            if (uptimeData) {
              uptimeMap[m.url] = uptimeData;
            }
          } catch {
            // ignore
          }
        })
      );

      setHistories(historyMap);
      setUptimes(uptimeMap);
    } catch (err) {
      console.error('Error loading endpoints:', err);
      setError(err.message || 'Failed to retrieve monitored endpoints');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEndpointsData();
  }, [fetchEndpointsData]);

  useEffect(() => {
    if (refreshSignal > 0) {
      fetchEndpointsData();
    }
  }, [refreshSignal, fetchEndpointsData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchEndpointsData, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchEndpointsData]);

  // Compute stats
  const totalMonitors = monitors.length;
  const upMonitors = monitors.filter(
    (m) => histories[m.url]?.status === 'UP'
  ).length;
  const downMonitors = monitors.filter(
    (m) => histories[m.url]?.status === 'DOWN'
  ).length;

  return (
    <div className="space-y-3.5">
      {/* Horizontal Information Strip */}
      <div className="ops-card px-4 py-3 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center flex-wrap gap-5 sm:gap-7">
          <div className="flex items-center space-x-2">
            <span className="text-[#A1A4A5] uppercase tracking-wider text-[11px] font-medium">
              Total Monitored
            </span>
            <span className="font-bold text-sm text-[#FFFFFF]">
              {totalMonitors.toString().padStart(2, '0')}
            </span>
          </div>

          <div className="h-3.5 w-px bg-[#292D30] hidden sm:block" />

          <div className="flex items-center space-x-2">
            <span className="text-[#A1A4A5] uppercase tracking-wider text-[11px] font-medium">
              Operational
            </span>
            <span className="font-bold text-sm text-[#3AD389] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3AD389]" />
              {upMonitors.toString().padStart(2, '0')}
            </span>
          </div>

          <div className="h-3.5 w-px bg-[#292D30] hidden sm:block" />

          <div className="flex items-center space-x-2">
            <span className="text-[#A1A4A5] uppercase tracking-wider text-[11px] font-medium">
              Disrupted
            </span>
            <span
              className={`font-bold text-sm flex items-center gap-1.5 ${
                downMonitors > 0 ? 'text-[#FF6465]' : 'text-[#6E727A]'
              }`}
            >
              {downMonitors > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6465]" />}
              {downMonitors.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="text-[11px] text-[#6E727A]">
          Telemetry Interval: <span className="text-[#FFFFFF] font-medium">30s cycle</span>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : error ? (
        <ErrorCard
          title="Endpoint Directory Unavailable"
          message={error}
          onRetry={fetchEndpointsData}
        />
      ) : (
        <EndpointTable
          monitors={monitors}
          histories={histories}
          uptimes={uptimes}
          onAddEndpoint={() => setIsModalOpen(true)}
          onRefresh={fetchEndpointsData}
          title="Configured Endpoints"
          subtitle="Click on any endpoint row to inspect deep historical telemetry"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showSearch={true}
          showFullColumns={true}
        />
      )}

      {/* Add Endpoint Modal */}
      <AddEndpointModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEndpointsData}
      />
    </div>
  );
}

