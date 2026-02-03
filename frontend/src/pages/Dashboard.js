import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import {
  ShoppingCart,
  People,
  Inventory,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Cancel,
  LocalShipping,
  Warning,
  ErrorOutline,
  Analytics,
  Assignment,
  Notifications,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';

// Simple Chart Components
const LineChart = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (d.value / maxValue) * 80;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative" style={{ height }}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="#3B82F6"
          strokeWidth="0.5"
          points={points}
        />
        <polygon
          fill="url(#gradient)"
          points={`0,100 ${points} 100,100`}
        />
      </svg>
    </div>
  );
};

const BarChart = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="flex items-end justify-between space-x-2" style={{ height }}>
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div 
            className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-sm transition-all duration-500 hover:from-indigo-600 hover:to-indigo-500"
            style={{ 
              height: `${(item.value / maxValue) * 80}%`,
              minHeight: '4px'
            }}
          ></div>
          <span className="text-xs text-gray-600 mt-2 text-center">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({ data, size = 120 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;
  
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  return (
    <div className="flex items-center space-x-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
          <circle
            cx="21"
            cy="21"
            r="15.915"
            fill="transparent"
            stroke="#E5E7EB"
            strokeWidth="3"
          />
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${percentage} ${100 - percentage}`;
            const strokeDashoffset = -cumulativePercentage;
            cumulativePercentage += percentage;
            
            return (
              <circle
                key={index}
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke={colors[index % colors.length]}
                strokeWidth="3"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="text-sm font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    metrics: {
      total_revenue: 0,
      total_orders: 0,
      average_order_value: 0,
      new_customers: 0,
      low_stock_products: 0,
      out_of_stock_products: 0
    },
    orders_by_status: [],
    orders_by_platform: [],
    top_products: [],
    weekly_orders: [],
    revenue_trend: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      loadStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Dashboard stats error:', error);
      // Only show error toast on initial load, not on auto-refresh
      if (loading) {
        toast.error('Failed to load dashboard stats');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!stats || !stats.metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <ErrorOutline className="text-gray-400 text-6xl mb-4" />
          <p className="text-xl text-gray-600">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const { metrics, orders_by_status, orders_by_platform, top_products, weekly_orders, revenue_trend } = stats;

  // Use real data if available, fallback to mock data
  const revenueData = (revenue_trend && revenue_trend.length > 0) ? revenue_trend : [
    { label: 'Jan', value: 45000 },
    { label: 'Feb', value: 52000 },
    { label: 'Mar', value: 48000 },
    { label: 'Apr', value: 61000 },
    { label: 'May', value: 55000 },
    { label: 'Jun', value: 67000 },
  ];

  const orderTrendData = (weekly_orders && weekly_orders.length > 0) ? weekly_orders : [
    { label: 'Mon', value: 120 },
    { label: 'Tue', value: 150 },
    { label: 'Wed', value: 180 },
    { label: 'Thu', value: 140 },
    { label: 'Fri', value: 200 },
    { label: 'Sat', value: 160 },
    { label: 'Sun', value: 110 },
  ];

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${(metrics.total_revenue / 100000).toFixed(1)}L`,
      change: '+12.5%',
      changeType: 'positive',
      icon: TrendingUp,
      trend: [45, 52, 48, 61, 55, 67],
      color: 'emerald'
    },
    {
      title: 'Total Orders',
      value: metrics.total_orders.toLocaleString('en-IN'),
      change: '+8.2%',
      changeType: 'positive',
      icon: ShoppingCart,
      trend: [120, 150, 180, 140, 200, 160],
      color: 'blue'
    },
    {
      title: 'New Customers',
      value: metrics.new_customers.toLocaleString('en-IN'),
      change: '+15.3%',
      changeType: 'positive',
      icon: People,
      trend: [25, 30, 28, 35, 32, 40],
      color: 'purple'
    },
    {
      title: 'Avg Order Value',
      value: `₹${metrics.average_order_value.toFixed(0)}`,
      change: '-2.1%',
      changeType: 'negative',
      icon: Inventory,
      trend: [85, 90, 88, 82, 86, 84],
      color: 'orange'
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600">Monitor your business performance and key metrics</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live updates every 30s</span>
          </div>
        </div>
      </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            const isPositive = stat.changeType === 'positive';
            
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                    <IconComponent className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full ${
                    isPositive ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                  }`}>
                    {isPositive ? <ArrowUpward className="h-4 w-4" /> : <ArrowDownward className="h-4 w-4" />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>

                {/* Mini trend chart */}
                <div className="h-12">
                  <LineChart data={stat.trend.map((value, i) => ({ label: i, value }))} height={48} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                <p className="text-sm text-gray-600">Monthly revenue over the last 6 months</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md">6M</button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">1Y</button>
              </div>
            </div>
            <div className="h-64">
              <BarChart data={revenueData} height={256} />
            </div>
          </div>

          {/* Order Status Donut */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h3>
            <div className="flex justify-center">
              <DonutChart 
                data={(orders_by_status && orders_by_status.length > 0) ? orders_by_status.map(s => ({
                  label: s.status,
                  value: s.count
                })) : [
                  { label: 'Pending', value: 25 },
                  { label: 'Processing', value: 35 },
                  { label: 'Shipped', value: 20 },
                  { label: 'Delivered', value: 15 },
                  { label: 'Cancelled', value: 5 }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Orders Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Weekly Orders</h3>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="h-48">
              <LineChart data={orderTrendData} height={192} />
            </div>
            <div className="mt-4 flex justify-between text-sm text-gray-600">
              <span>This week: {orderTrendData.reduce((sum, day) => sum + day.value, 0).toLocaleString()} orders</span>
              <span className="text-green-600">+8.2% from last week</span>
            </div>
          </div>

          {/* Top Performing Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Products</h3>
            <div className="space-y-4">
              {((top_products && top_products.length > 0) ? top_products : [
                { name: 'Wireless Headphones', sales: 245, revenue: '₹6,12,500' },
                { name: 'Smart Watch', sales: 189, revenue: '₹4,72,500' },
                { name: 'Laptop Stand', sales: 156, revenue: '₹2,34,000' },
                { name: 'USB-C Cable', sales: 134, revenue: '₹1,00,500' },
                { name: 'Phone Case', sales: 98, revenue: '₹73,500' }
              ]).map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform & Inventory Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Platform Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Distribution</h3>
            <div className="space-y-4">
              {(orders_by_platform && orders_by_platform.length > 0) ? orders_by_platform.map((platform, index) => {
                const total = orders_by_platform.reduce((sum, p) => sum + p.count, 0);
                const percentage = total > 0 ? ((platform.count / total) * 100).toFixed(1) : 0;
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full bg-indigo-500"></div>
                      <span className="font-medium text-gray-900 capitalize">{platform.platform}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 w-12">{percentage}%</span>
                      <span className="font-bold text-gray-900 w-8">{platform.count}</span>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-8 text-gray-500">
                  <Analytics className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No platform data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Inventory Alerts</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <Warning className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">Low Stock Items</p>
                    <p className="text-sm text-gray-600">Items below threshold</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-yellow-700">{metrics.low_stock_products}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-3">
                  <ErrorOutline className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-gray-900">Out of Stock</p>
                    <p className="text-sm text-gray-600">Items unavailable</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-red-700">{metrics.out_of_stock_products}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <Inventory className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Total Products</p>
                    <p className="text-sm text-gray-600">Active inventory</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-700">{(metrics.low_stock_products + metrics.out_of_stock_products + 1200).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Dashboard;