import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Landing from './pages/Landing';
import Overview from './pages/Overview';
import Endpoints from './pages/Endpoints';
import EndpointDetail from './pages/EndpointDetail';
import Containers from './pages/Containers';

export default function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdatedSeconds, setLastUpdatedSeconds] = useState(0);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isLandingPage = location.pathname === '/';

  // Determine current page title & subtitle based on route
  const getHeaderInfo = () => {
    const pathname = location.pathname;
    if (pathname === '/dashboard' || pathname === '/') {
      return {
        title: 'Overview',
        subtitle: 'Real-time infrastructure and endpoint health',
      };
    }
    if (pathname.startsWith('/endpoints/')) {
      return {
        title: 'Endpoint Telemetry',
        subtitle: 'Historical response time and uptime diagnostics',
      };
    }
    if (pathname === '/endpoints') {
      return {
        title: 'Endpoints',
        subtitle: 'Monitor and analyze your HTTP services',
      };
    }
    if (pathname === '/containers') {
      return {
        title: 'Containers',
        subtitle: 'Docker and microservice container health',
      };
    }
    return {
      title: 'Dashboard',
      subtitle: 'DevOps Operations Monitoring',
    };
  };

  // Timer counter for "Last updated X seconds ago"
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdatedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = useCallback(() => {
    setIsRefreshing(true);
    setRefreshSignal((prev) => prev + 1);
    setLastUpdatedSeconds(0);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  }, []);

  const { title, subtitle } = getHeaderInfo();

  // If on marketing landing page, render clean full-width landing view
  if (isLandingPage) {
    return <Landing />;
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-60 min-w-0">
        <Header
          title={title}
          subtitle={subtitle}
          lastUpdatedSeconds={lastUpdatedSeconds}
          autoRefresh={autoRefresh}
          onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
          onManualRefresh={handleManualRefresh}
          isRefreshing={isRefreshing}
          onOpenMobileSidebar={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          <Routes>
            <Route
              path="/dashboard"
              element={
                <Overview
                  refreshSignal={refreshSignal}
                  autoRefresh={autoRefresh}
                />
              }
            />
            <Route
              path="/endpoints"
              element={
                <Endpoints
                  refreshSignal={refreshSignal}
                  autoRefresh={autoRefresh}
                />
              }
            />
            <Route
              path="/endpoints/:url"
              element={
                <EndpointDetail
                  refreshSignal={refreshSignal}
                  autoRefresh={autoRefresh}
                />
              }
            />
            <Route
              path="/containers"
              element={<Containers />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}