import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Sync, BugReport } from '@mui/icons-material';

const SystemLogs = () => {
  const [systemLogs, setSystemLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSystemLogs();
  }, []);

  const fetchSystemLogs = async () => {
    setLoading(true);
    try {
      console.log('Fetching system logs...');
      const response = await adminAPI.getSystemLogs({ page_size: 100 });
      console.log('System logs response:', response.data);
      setSystemLogs(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching system logs:', error);
      console.error('Error response:', error.response);
      toast.error('Failed to load system logs: ' + (error.response?.data?.detail || error.message));
    }
    setLoading(false);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'ERROR': return 'bg-red-100 text-red-800';
      case 'WARNING': return 'bg-yellow-100 text-yellow-800';
      case 'INFO': return 'bg-blue-100 text-blue-800';
      case 'DEBUG': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'AUTH': return 'bg-purple-100 text-purple-800';
      case 'SYNC': return 'bg-green-100 text-green-800';
      case 'API': return 'bg-blue-100 text-blue-800';
      case 'SYSTEM': return 'bg-gray-100 text-gray-800';
      case 'DATABASE': return 'bg-orange-100 text-orange-800';
      case 'INTEGRATION': return 'bg-indigo-100 text-indigo-800';
      case 'ORDER': return 'bg-teal-100 text-teal-800';
      case 'PRODUCT': return 'bg-pink-100 text-pink-800';
      case 'CUSTOMER': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">System Logs</h3>
            <p className="text-sm text-gray-600">All system activities and events</p>
          </div>
          <button
            onClick={fetchSystemLogs}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            <Sync className="h-4 w-4" />
            <span>{loading ? 'Loading...' : 'Refresh'}</span>
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading system logs...</p>
          </div>
        ) : systemLogs.length > 0 ? (
          <div className="space-y-3">
            {systemLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(log.category)}`}>
                        {log.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      {log.user_name && (
                        <span className="text-xs text-gray-500">
                          User: {log.user_name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-900 mb-2">{log.message}</p>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="bg-gray-100 rounded p-2 text-xs">
                        <pre className="whitespace-pre-wrap">{JSON.stringify(log.details, null, 2)}</pre>
                      </div>
                    )}
                    {log.ip_address && (
                      <div className="text-xs text-gray-500 mt-2">
                        IP: {log.ip_address}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BugReport className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No system logs found</p>
            <p className="text-sm">System activities will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemLogs;