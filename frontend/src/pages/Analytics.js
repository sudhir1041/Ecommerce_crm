import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  TrendingUp,
  ShoppingCart,
  People,
  Inventory,
  Assessment,
  Receipt,
  LocalShipping,
  PictureAsPdf,
  TableChart,
  Description,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [timeRange, setTimeRange] = useState('30d');

  const reportTabs = [
    { id: 'sales', label: 'Sales & Revenue', icon: TrendingUp },
    { id: 'orders', label: 'Order Fulfillment', icon: ShoppingCart },
    { id: 'employees', label: 'Employee Performance', icon: People },
    { id: 'inventory', label: 'Inventory Turnover', icon: Inventory },
  ];

  const exportFormats = [
    { id: 'pdf', label: 'PDF', icon: PictureAsPdf, color: 'red' },
    { id: 'csv', label: 'CSV', icon: TableChart, color: 'green' },
    { id: 'excel', label: 'Excel', icon: Description, color: 'blue' },
  ];

  const salesData = {
    totalRevenue: 8473920,
    totalOrders: 12847,
    avgOrderValue: 6592,
    growthRate: 12.5,
    monthlyData: [
      { month: 'Jan', revenue: 450000, orders: 892 },
      { month: 'Feb', revenue: 520000, orders: 1043 },
      { month: 'Mar', revenue: 480000, orders: 967 },
      { month: 'Apr', revenue: 610000, orders: 1234 },
      { month: 'May', revenue: 550000, orders: 1156 },
      { month: 'Jun', revenue: 670000, orders: 1389 },
    ]
  };

  const orderFulfillmentData = {
    totalOrders: 12847,
    pendingOrders: 234,
    processingOrders: 456,
    shippedOrders: 789,
    deliveredOrders: 11368,
    avgFulfillmentTime: 2.3,
    onTimeDelivery: 94.2
  };

  const employeeData = [
    { name: 'Rajesh Kumar', orders: 234, revenue: 156780, rating: 4.8 },
    { name: 'Priya Sharma', orders: 198, revenue: 134560, rating: 4.6 },
    { name: 'Amit Singh', orders: 187, revenue: 123450, rating: 4.5 },
    { name: 'Sneha Patel', orders: 176, revenue: 118900, rating: 4.7 },
  ];

  const inventoryData = [
    { product: 'Wireless Headphones', turnover: 8.5, stock: 45, sold: 382 },
    { product: 'Smart Watch', turnover: 6.2, stock: 23, sold: 143 },
    { product: 'Laptop Stand', turnover: 4.8, stock: 67, sold: 321 },
    { product: 'USB-C Cable', turnover: 12.3, stock: 156, sold: 1920 },
  ];

  const handleExport = (format) => {
    toast.success(`Exporting ${activeTab} report as ${format.toUpperCase()}...`);
  };

  const renderSalesReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{(salesData.totalRevenue / 100000).toFixed(1)}L</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <ArrowUpward className="h-4 w-4 text-green-500" />
            <span className="text-green-600">+{salesData.growthRate}%</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{salesData.totalOrders.toLocaleString()}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{salesData.avgOrderValue}</p>
            </div>
            <Receipt className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">{salesData.growthRate}%</p>
            </div>
            <Assessment className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Monthly Sales Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Month</th>
                <th className="text-right py-2">Revenue</th>
                <th className="text-right py-2">Orders</th>
                <th className="text-right py-2">Avg Order Value</th>
              </tr>
            </thead>
            <tbody>
              {salesData.monthlyData.map((month, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3">{month.month}</td>
                  <td className="text-right py-3">₹{month.revenue.toLocaleString()}</td>
                  <td className="text-right py-3">{month.orders}</td>
                  <td className="text-right py-3">₹{Math.round(month.revenue / month.orders)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOrderFulfillmentReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Fulfillment Time</p>
              <p className="text-2xl font-bold text-gray-900">{orderFulfillmentData.avgFulfillmentTime} days</p>
            </div>
            <LocalShipping className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">On-Time Delivery</p>
              <p className="text-2xl font-bold text-gray-900">{orderFulfillmentData.onTimeDelivery}%</p>
            </div>
            <Assessment className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orderFulfillmentData.totalOrders.toLocaleString()}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Order Status Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-700">{orderFulfillmentData.pendingOrders}</p>
            <p className="text-sm text-yellow-600">Pending</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-700">{orderFulfillmentData.processingOrders}</p>
            <p className="text-sm text-blue-600">Processing</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-700">{orderFulfillmentData.shippedOrders}</p>
            <p className="text-sm text-orange-600">Shipped</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-700">{orderFulfillmentData.deliveredOrders}</p>
            <p className="text-sm text-green-600">Delivered</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmployeeReport = () => (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Employee Performance</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Employee</th>
              <th className="text-right py-2">Orders Handled</th>
              <th className="text-right py-2">Revenue Generated</th>
              <th className="text-right py-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((employee, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-indigo-600 font-semibold text-sm">{employee.name.charAt(0)}</span>
                    </div>
                    {employee.name}
                  </div>
                </td>
                <td className="text-right py-3">{employee.orders}</td>
                <td className="text-right py-3">₹{employee.revenue.toLocaleString()}</td>
                <td className="text-right py-3">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    {employee.rating}/5
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInventoryReport = () => (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Inventory Turnover Analysis</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Product</th>
              <th className="text-right py-2">Turnover Rate</th>
              <th className="text-right py-2">Current Stock</th>
              <th className="text-right py-2">Units Sold</th>
              <th className="text-right py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3">{item.product}</td>
                <td className="text-right py-3">{item.turnover}x</td>
                <td className="text-right py-3">{item.stock}</td>
                <td className="text-right py-3">{item.sold}</td>
                <td className="text-right py-3">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    item.turnover > 8 ? 'bg-green-100 text-green-800' :
                    item.turnover > 5 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.turnover > 8 ? 'High' : item.turnover > 5 ? 'Medium' : 'Low'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
          <p className="text-gray-600">Comprehensive business reports and performance analytics</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            {exportFormats.map((format) => (
              <button
                key={format.id}
                onClick={() => handleExport(format.id)}
                className={`flex items-center space-x-2 px-3 py-2 bg-${format.color}-600 text-white rounded-lg hover:bg-${format.color}-700 transition-colors`}
              >
                <format.icon className="h-4 w-4" />
                <span>{format.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {reportTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div>
        {activeTab === 'sales' && renderSalesReport()}
        {activeTab === 'orders' && renderOrderFulfillmentReport()}
        {activeTab === 'employees' && renderEmployeeReport()}
        {activeTab === 'inventory' && renderInventoryReport()}
      </div>
    </div>
  );
};

export default Analytics;