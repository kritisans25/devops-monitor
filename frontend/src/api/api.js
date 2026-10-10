/**
 * Centralized API client for DevOps Monitor Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // ignore json parse error on non-json error responses
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function getServerStats() {
  const response = await fetch(`${API_BASE_URL}/api/server-stats`);
  return handleResponse(response);
}
export async function getContainers() {
  const response = await fetch(`${API_BASE_URL}/api/containers`);
  return handleResponse(response);
}

export async function getServerMetrics() {
  const response = await fetch(`${API_BASE_URL}/api/metrics`);
  return handleResponse(response);
}

export async function getMonitors() {
  const response = await fetch(`${API_BASE_URL}/api/monitors`);
  return handleResponse(response);
}

export async function getApiHistory(url) {
  const response = await fetch(`${API_BASE_URL}/api/api-history?url=${encodeURIComponent(url)}`);
  return handleResponse(response);
}

export async function getApiUptime(url) {
  const response = await fetch(`${API_BASE_URL}/api/uptime?url=${encodeURIComponent(url)}`);
  return handleResponse(response);
}

export async function createMonitor(name, url) {
  const response = await fetch(`${API_BASE_URL}/api/monitors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, url }),
  });
  return handleResponse(response);
}

export async function checkApi(url) {
  const response = await fetch(`${API_BASE_URL}/api/check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });
  return handleResponse(response);
}

export async function getBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/`);
  return handleResponse(response);
}
