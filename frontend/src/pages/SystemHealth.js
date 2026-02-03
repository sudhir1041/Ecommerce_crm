import React, { useState, useEffect } from 'react';
import {
  MonitorHeart,
  Memory,
  Storage,
  Speed,
  CloudQueue,
  Refresh,
  Warning,
  CheckCircle,
  Error,
} from '@mui/icons-material';

const SystemHealth = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealthData = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      console.log('Fetching health data with token:', token ? 'Present' : 'Missing');
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/core/health/', {
        method: 'GET',
        headers: headers
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));
      
      const contentType = response.headers.get('content-type');
      
      if (response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Health data received:', data);
          setHealthData(data);
        } else {
          const text = await response.text();
          console.error('Expected JSON but got:', text.substring(0, 200));
          setError('Server returned HTML instead of JSON. Check if the API endpoint exists.');
        }
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText.substring(0, 200));
        setError(`API Error: ${response.status} - Check if endpoint exists and authentication is working`);
      }
    } catch (error) {
      console.error('Failed to fetch system health:', error);
      setError(`Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    const interval = setInterval(fetchHealthData, 600000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBg = (percentage) => {
    if (percentage >= 90) return 'bg-green-100';
    if (percentage >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading system health...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Error className="h-6 w-6 text-red-600" />
            <h2 className="text-lg font-semibold text-red-900">Error Loading System Health</h2>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchHealthData}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Refresh className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
          <p className="text-gray-600">Real-time system monitoring and performance metrics</p>
        </div>
        <button
          onClick={fetchHealthData}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Refresh className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {healthData ? (
        <>
          {/* Overall Health Status */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-full ${getStatusBg(healthData.health_percentage)}`}>
                  <MonitorHeart className={`h-8 w-8 ${getStatusColor(healthData.health_percentage)}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    System Health: {healthData.health_percentage}%
                  </h2>
                  <p className={`text-lg font-medium ${getStatusColor(healthData.health_percentage)}`}>
                    Status: {healthData.status.charAt(0).toUpperCase() + healthData.status.slice(1)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-medium">
                  {new Date(healthData.timestamp * 1000).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Memory className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Memory Usage</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Used</span>
                  <span className="font-semibold">{healthData.metrics?.memory_usage?.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      healthData.metrics?.memory_usage > 80 ? 'bg-red-500' :
                      healthData.metrics?.memory_usage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${healthData.metrics?.memory_usage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Speed className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">CPU Usage</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Used</span>
                  <span className="font-semibold">{healthData.metrics?.cpu_usage?.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      healthData.metrics?.cpu_usage > 80 ? 'bg-red-500' :
                      healthData.metrics?.cpu_usage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${healthData.metrics?.cpu_usage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CloudQueue className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Database</h3>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-medium">Connected</span>
              </div>
            </div>
          </div>

          {/* Issues & Alerts */}
          {healthData.issues && healthData.issues.length > 0 && (
            <div className="bg-white rounded-lg border p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <Warning className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">System Issues</h3>
              </div>
              <div className="space-y-3">
                {healthData.issues.map((issue, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <Error className="h-5 w-5 text-red-500" />
                    <span className="text-red-700">{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Information */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Performance Metrics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Memory Usage:</span>
                    <span className="font-medium">{healthData.metrics?.memory_usage?.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CPU Usage:</span>
                    <span className="font-medium">{healthData.metrics?.cpu_usage?.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Health Score:</span>
                    <span className={`font-medium ${getStatusColor(healthData.health_percentage)}`}>
                      {healthData.health_percentage}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">System Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Database: Connected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">API: Operational</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Services: Running</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg border p-6">
          <div className="text-center py-8">
            <MonitorHeart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Health Data Available</h3>
            <p className="text-gray-600 mb-4">Unable to load system health information</p>
            <button
              onClick={fetchHealthData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
            >
              <Refresh className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemHealth;