import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  History,
  FilterList,
  Search,
  GetApp,
  Refresh,
  Info,
  Warning,
  Error,
  CheckCircle,
  Person,
  CalendarToday,
  Computer,
} from '@mui/icons-material';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    level: 'all',
    dateRange: '7d',
    search: ''
  });

  // Mock data for system logs
  const mockLogs = [
    {
      id: 1,
      timestamp: '2024-01-24T10:30:15Z',
      level: 'info',
      action: 'User Login',
      user: 'sudhir@gmail.com',
      details: 'User successfully logged in from IP 192.168.1.100',
      module: 'Authentication',
      ip_address: '192.168.1.100'
    },
    {
      id: 2,
      timestamp: '2024-01-24T10:25:42Z',
      level: 'success',
      action: 'Order Created',
      user: 'admin@example.com',
      details: 'New order #ORD-20240124-1001 created for customer John Doe',
      module: 'Orders',
      ip_address: '192.168.1.101'
    },
    {
      id: 3,
      timestamp: '2024-01-24T10:20:33Z',
      level: 'warning',
      action: 'Low Stock Alert',
      user: 'system',
      details: 'Product "Wireless Headphones" stock below threshold (5 remaining)',
      module: 'Inventory',
      ip_address: 'system'
    },
    {
      id: 4,
      timestamp: '2024-01-24T10:15:28Z',
      level: 'error',
      action: 'Payment Failed',
      user: 'customer@example.com',
      details: 'Payment processing failed for order #ORD-20240124-1000',
      module: 'Payments',
      ip_address: '203.0.113.45'
    },
    {
      id: 5,
      timestamp: '2024-01-24T10:10:15Z',
      level: 'info',
      action: 'Product Updated',
      user: 'admin@example.com',
      details: 'Product "Smart Watch" price updated from ₹15,000 to ₹14,500',
      module: 'Products',
      ip_address: '192.168.1.101'
    },
    {
      id: 6,
      timestamp: '2024-01-24T10:05:22Z',
      level: 'success',
      action: 'Backup Completed',
      user: 'system',
      details: 'Daily database backup completed successfully',
      module: 'System',
      ip_address: 'system'
    }
  ];

  useEffect(() => {
    loadLogs();
  }, [filters]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        let filteredLogs = mockLogs;
        
        if (filters.level !== 'all') {
          filteredLogs = filteredLogs.filter(log => log.level === filters.level);
        }
        
        if (filters.search) {
          filteredLogs = filteredLogs.filter(log => 
            log.action.toLowerCase().includes(filters.search.toLowerCase()) ||
            log.details.toLowerCase().includes(filters.search.toLowerCase()) ||
            log.user.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        setLogs(filteredLogs);
        setLoading(false);
      }, 500);
    } catch (error) {
      toast.error('Failed to load system logs');
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getLogIcon = (level) => {
    switch (level) {
      case 'error':
        return <Error className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <Warning className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getLogBadgeColor = (level) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const exportLogs = () => {
    toast.success('Logs exported successfully!');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Logs</h1>
          <p className="text-gray-600">Monitor system activities and track user actions</p>
        </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={loadLogs}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Refresh className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={exportLogs}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <GetApp className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FilterList className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
            
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <History className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
              <span className="text-sm text-gray-500">({logs.length} entries)</span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Module
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getLogIcon(log.level)}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLogBadgeColor(log.level)}`}>
                            {log.level.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 text-sm text-gray-900">
                          <CalendarToday className="h-4 w-4 text-gray-400" />
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{log.action}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {log.user === 'system' ? (
                            <Computer className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Person className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-900">{log.user}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{log.details}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {log.module}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && logs.length === 0 && (
            <div className="text-center py-12">
              <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No logs found matching your criteria</p>
            </div>
          )}
        </div>
    </div>
  );
};

export default SystemLogs;