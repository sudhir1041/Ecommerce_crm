import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  Sync, 
  CheckCircle, 
  Error, 
  Warning, 
  Memory, 
  Storage, 
  Speed,
  DataUsage,
  CloudDone,
  CloudOff
} from '@mui/icons-material';

const SystemHealth = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHealthData();
    const interval = setInterval(fetchHealthData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchHealthData = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getSystemHealth();
      setHealthData(response.data);
    } catch (error) {
      console.error('Error fetching health data:', error);
      toast.error('Failed to load system health data');
    }
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <Warning className="h-5 w-5 text-yellow-500" />;
      case 'unhealthy': return <Error className="h-5 w-5 text-red-500" />;
      default: return <Error className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unhealthy': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading && !healthData) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading system health...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(healthData?.status)}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
                <p className="text-sm text-gray-600">Overall system status and monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(healthData?.status)}`}>
                {healthData?.status?.toUpperCase()}
              </span>
              <button
                onClick={fetchHealthData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={loading}
              >
                <Sync className="h-4 w-4" />
                <span>{loading ? 'Checking...' : 'Refresh'}</span>
              </button>
            </div>
          </div>
        </div>

        {healthData && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Database Health */}
              {healthData.checks?.database && (
                <div className={`border rounded-lg p-4 ${getStatusColor(healthData.checks.database.status)}`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <Storage className="h-6 w-6" />
                    <h4 className="font-medium">Database</h4>
                    {getStatusIcon(healthData.checks.database.status)}
                  </div>
                  {healthData.checks.database.latency_ms && (
                    <div className="text-sm">
                      <p>Latency: {healthData.checks.database.latency_ms}ms</p>
                      <p>Connections: {healthData.checks.database.connection_count}</p>
                    </div>
                  )}
                  {healthData.checks.database.error && (
                    <p className="text-sm text-red-600">{healthData.checks.database.error}</p>
                  )}
                </div>
              )}

              {/* Cache Health */}
              {healthData.checks?.cache && (
                <div className={`border rounded-lg p-4 ${getStatusColor(healthData.checks.cache.status)}`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <Memory className="h-6 w-6" />
                    <h4 className="font-medium">Cache</h4>
                    {getStatusIcon(healthData.checks.cache.status)}
                  </div>
                  {healthData.checks.cache.error && (
                    <p className="text-sm text-red-600">{healthData.checks.cache.error}</p>
                  )}
                </div>
              )}

              {/* System Resources */}
              {healthData.checks?.system && (
                <div className={`border rounded-lg p-4 ${getStatusColor(healthData.checks.system.status)}`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <Speed className="h-6 w-6" />
                    <h4 className="font-medium">System Resources</h4>
                    {getStatusIcon(healthData.checks.system.status)}
                  </div>
                  <div className="text-sm space-y-1">
                    <p>CPU: {healthData.checks.system.cpu_percent}%</p>
                    <p>Memory: {healthData.checks.system.memory?.percent_used}% used</p>
                    <p>Disk: {healthData.checks.system.disk?.percent_used}% used</p>
                  </div>
                </div>
              )}

              {/* Integrations */}
              {healthData.checks?.integrations && (
                <div className={`border rounded-lg p-4 ${getStatusColor(healthData.checks.integrations.status)}`}>
                  <div className="flex items-center space-x-3 mb-3">
                    {healthData.checks.integrations.active_platforms > 0 ? 
                      <CloudDone className="h-6 w-6" /> : 
                      <CloudOff className="h-6 w-6" />
                    }
                    <h4 className="font-medium">Integrations</h4>
                    {getStatusIcon(healthData.checks.integrations.status)}
                  </div>
                  <div className="text-sm">
                    <p>Active: {healthData.checks.integrations.active_platforms}</p>
                    <p>Total: {healthData.checks.integrations.total_platforms}</p>
                  </div>
                </div>
              )}

              {/* Data Integrity */}
              {healthData.checks?.data && (
                <div className={`border rounded-lg p-4 ${getStatusColor(healthData.checks.data.status)}`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <DataUsage className="h-6 w-6" />
                    <h4 className="font-medium">Data</h4>
                    {getStatusIcon(healthData.checks.data.status)}
                  </div>
                  <div className="text-sm space-y-1">
                    <p>Products: {healthData.checks.data.products}</p>
                    <p>Orders: {healthData.checks.data.orders}</p>
                    <p>Customers: {healthData.checks.data.customers}</p>
                    <p>Recent Orders (24h): {healthData.checks.data.recent_orders_24h}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Detailed System Info */}
            {healthData.checks?.system && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Detailed System Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Memory</h5>
                    <p>Total: {healthData.checks.system.memory?.total_gb} GB</p>
                    <p>Available: {healthData.checks.system.memory?.available_gb} GB</p>
                    <p>Used: {healthData.checks.system.memory?.percent_used}%</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Disk</h5>
                    <p>Total: {healthData.checks.system.disk?.total_gb} GB</p>
                    <p>Free: {healthData.checks.system.disk?.free_gb} GB</p>
                    <p>Used: {healthData.checks.system.disk?.percent_used}%</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 text-xs text-gray-500">
              Last updated: {new Date(healthData.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemHealth;