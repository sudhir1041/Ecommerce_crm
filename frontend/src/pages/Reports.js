import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Assessment,
  TrendingUp,
  LocalShipping,
  Person,
  GetApp,
  DateRange,
  FilterList,
  PictureAsPdf,
  TableChart,
  MonetizationOn,
  ShoppingCart,
  Inventory,
  Speed,
  Star,
  Timeline,
} from '@mui/icons-material';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  });
  const [filters, setFilters] = useState({
    period: 'month',
    status: 'all',
    category: 'all'
  });

  const orderReports = {
    totalOrders: 1247,
    totalRevenue: 2847650,
    avgOrderValue: 2284,
    completedOrders: 1089,
    pendingOrders: 98,
    cancelledOrders: 60,
    completionRate: 87.3,
    topProducts: [
      { name: 'Smartphone Pro Max', orders: 234, revenue: 567800 },
      { name: 'Wireless Headphones', orders: 189, revenue: 234500 },
      { name: 'Laptop Gaming', orders: 156, revenue: 789600 },
      { name: 'Smart Watch', orders: 145, revenue: 345600 },
      { name: 'Tablet Pro', orders: 123, revenue: 456700 }
    ],
    ordersByStatus: [
      { status: 'Completed', count: 1089, percentage: 87.3 },
      { status: 'Pending', count: 98, percentage: 7.9 },
      { status: 'Cancelled', count: 60, percentage: 4.8 }
    ],
    dailyOrders: [
      { date: '2024-01-01', orders: 45, revenue: 98750 },
      { date: '2024-01-02', orders: 52, revenue: 112340 },
      { date: '2024-01-03', orders: 38, revenue: 87650 },
      { date: '2024-01-04', orders: 61, revenue: 134560 },
      { date: '2024-01-05', orders: 47, revenue: 103450 }
    ]
  };

  const revenueReports = {
    totalRevenue: 2847650,
    totalProfit: 1138650,
    profitMargin: 40.0,
    avgOrderValue: 2284,
    revenueGrowth: 15.6,
    profitGrowth: 18.2,
    revenueByCategory: [
      { category: 'Electronics', revenue: 1423825, profit: 569530 },
      { category: 'Fashion', revenue: 854295, profit: 341718 },
      { category: 'Home & Garden', revenue: 426148, profit: 170459 },
      { category: 'Sports', revenue: 143382, profit: 57353 }
    ],
    monthlyRevenue: [
      { month: 'Jan', revenue: 2847650, profit: 1138650 },
      { month: 'Dec', revenue: 2634520, profit: 1053808 },
      { month: 'Nov', revenue: 2456780, profit: 982712 },
      { month: 'Oct', revenue: 2234560, profit: 893824 }
    ]
  };

  const shippingReports = {
    totalShipments: 1089,
    onTimeDelivery: 94.2,
    avgDeliveryTime: 2.8,
    shippingCost: 87650,
    deliveredOrders: 1026,
    inTransitOrders: 63,
    delayedOrders: 34,
    courierPerformance: [
      { courier: 'BlueDart', orders: 456, onTime: 96.5, avgTime: 2.3 },
      { courier: 'DTDC', orders: 334, onTime: 93.7, avgTime: 2.9 },
      { courier: 'Delhivery', orders: 299, onTime: 92.1, avgTime: 3.2 }
    ],
    deliveryByRegion: [
      { region: 'North India', orders: 387, onTime: 95.6 },
      { region: 'South India', orders: 298, onTime: 94.3 },
      { region: 'West India', orders: 234, onTime: 93.2 },
      { region: 'East India', orders: 170, onTime: 91.8 }
    ]
  };

  const employeeReports = {
    totalEmployees: 24,
    activeEmployees: 22,
    avgPerformance: 4.6,
    totalOrdersHandled: 1247,
    topPerformers: [
      { name: 'Rajesh Kumar', orders: 234, revenue: 567800, rating: 4.8 },
      { name: 'Priya Sharma', orders: 198, revenue: 456700, rating: 4.6 },
      { name: 'Amit Singh', orders: 187, revenue: 423500, rating: 4.5 },
      { name: 'Sneha Patel', orders: 156, revenue: 378900, rating: 4.7 }
    ],
    departmentPerformance: [
      { department: 'Sales', employees: 8, orders: 567, revenue: 1234500 },
      { department: 'Support', employees: 6, orders: 234, revenue: 567800 },
      { department: 'Operations', employees: 5, orders: 298, revenue: 678900 },
      { department: 'Marketing', employees: 3, orders: 148, revenue: 366450 }
    ]
  };

  const handleExport = (format, reportType) => {
    toast.success(`Exporting ${reportType} report as ${format.toUpperCase()}`);
  };

  const renderOrderReports = () => (
    <div className="space-y-6">
      {/* Order Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orderReports.totalOrders.toLocaleString()}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{orderReports.totalRevenue.toLocaleString()}</p>
            </div>
            <MonetizationOn className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{orderReports.avgOrderValue.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{orderReports.completionRate}%</p>
            </div>
            <Assessment className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {orderReports.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{product.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Order Status Distribution</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {orderReports.ordersByStatus.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    status.status === 'Completed' ? 'bg-green-500' :
                    status.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium text-gray-900">{status.status}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">{status.count} orders</span>
                  <span className="font-semibold text-gray-900">{status.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRevenueReports = () => (
    <div className="space-y-6">
      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{revenueReports.totalRevenue.toLocaleString()}</p>
            </div>
            <MonetizationOn className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Profit</p>
              <p className="text-2xl font-bold text-gray-900">₹{revenueReports.totalProfit.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit Margin</p>
              <p className="text-2xl font-bold text-gray-900">{revenueReports.profitMargin}%</p>
            </div>
            <Assessment className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue Growth</p>
              <p className="text-2xl font-bold text-green-600">+{revenueReports.revenueGrowth}%</p>
            </div>
            <Timeline className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Revenue by Category */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Revenue by Category</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {revenueReports.revenueByCategory.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{category.category}</p>
                  <p className="text-sm text-gray-600">Profit: ₹{category.profit.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{category.revenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600">
                    {((category.profit / category.revenue) * 100).toFixed(1)}% margin
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderShippingReports = () => (
    <div className="space-y-6">
      {/* Shipping Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Shipments</p>
              <p className="text-2xl font-bold text-gray-900">{shippingReports.totalShipments.toLocaleString()}</p>
            </div>
            <LocalShipping className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On-Time Delivery</p>
              <p className="text-2xl font-bold text-gray-900">{shippingReports.onTimeDelivery}%</p>
            </div>
            <Speed className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Delivery Time</p>
              <p className="text-2xl font-bold text-gray-900">{shippingReports.avgDeliveryTime} days</p>
            </div>
            <Timeline className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shipping Cost</p>
              <p className="text-2xl font-bold text-gray-900">₹{shippingReports.shippingCost.toLocaleString()}</p>
            </div>
            <MonetizationOn className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Courier Performance */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Courier Performance</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {shippingReports.courierPerformance.map((courier, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{courier.courier}</p>
                  <p className="text-sm text-gray-600">{courier.orders} orders</p>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">On-Time</p>
                    <p className="font-semibold text-green-600">{courier.onTime}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Avg Time</p>
                    <p className="font-semibold text-gray-900">{courier.avgTime} days</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmployeeReports = () => (
    <div className="space-y-6">
      {/* Employee Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employeeReports.totalEmployees}</p>
            </div>
            <Person className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employeeReports.activeEmployees}</p>
            </div>
            <Person className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Performance</p>
              <p className="text-2xl font-bold text-gray-900">{employeeReports.avgPerformance}/5</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Orders Handled</p>
              <p className="text-2xl font-bold text-gray-900">{employeeReports.totalOrdersHandled.toLocaleString()}</p>
            </div>
            <Assessment className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {employeeReports.topPerformers.map((employee, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{employee.name}</p>
                    <p className="text-sm text-gray-600">{employee.orders} orders handled</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="font-semibold text-gray-900">₹{employee.revenue.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="font-semibold text-yellow-600">{employee.rating}/5</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">Comprehensive business reports and performance analytics</p>
      </div>

      {/* Date Range & Export Controls */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <DateRange className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                className="border rounded-lg px-3 py-2 text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                className="border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('csv', activeTab)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <TableChart className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleExport('pdf', activeTab)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <PictureAsPdf className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'orders', name: 'Order Reports', icon: ShoppingCart },
              { id: 'revenue', name: 'Revenue & Profit', icon: MonetizationOn },
              { id: 'shipping', name: 'Shipping Performance', icon: LocalShipping },
              { id: 'employee', name: 'Employee Performance', icon: Person }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'orders' && renderOrderReports()}
          {activeTab === 'revenue' && renderRevenueReports()}
          {activeTab === 'shipping' && renderShippingReports()}
          {activeTab === 'employee' && renderEmployeeReports()}
        </div>
      </div>
    </div>
  );
};

export default Reports;