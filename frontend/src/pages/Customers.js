import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminAPI } from '../services/api';
import {
  Search,
  FilterList,
  GetApp,
  Add as Plus,
  Edit,
  Delete,
  Visibility,
  Person,
  Email,
  Phone,
  LocationOn,
  ShoppingCart,
  AttachMoney,
  TrendingUp,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [analytics, setAnalytics] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    platform: 'all',
  });

  useEffect(() => {
    fetchCustomers();
    fetchAnalytics();
  }, []);

  const fetchCustomers = async (page = 1) => {
    setLoading(true);
    try {
      const params = { 
        page, 
        page_size: pagination.pageSize,
        ordering: '-platform_customer_id' // Sort by store ID descending
      };
      
      // Only add filters if they have values
      if (filters.search) params.search = filters.search;
      if (filters.platform !== 'all') params.platform = filters.platform;
      
      console.log('Fetching customers with params:', params);
      const response = await adminAPI.getCustomers(params);
      console.log('Customers response:', response.data);
      
      // Handle both paginated and non-paginated responses
      let customersData = [];
      let totalCount = 0;
      
      if (response.data.results) {
        // Paginated response
        customersData = response.data.results;
        totalCount = response.data.count;
      } else if (Array.isArray(response.data)) {
        // Direct array response
        customersData = response.data;
        totalCount = response.data.length;
      }
      
      console.log('Processed customers data:', customersData);
      setCustomers(customersData);
      // Don't apply filters here since we're already filtering on the backend
      setFilteredCustomers(customersData);
      setPagination({
        ...pagination,
        page,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pagination.pageSize)
      });
    } catch (error) {
      console.error('Error fetching customers:', error);
      console.error('Error details:', error.response?.data);
      toast.error(`Failed to load customers: ${error.response?.data?.detail || error.message}`);
      // Set empty data on error
      setCustomers([]);
      setFilteredCustomers([]);
    }
    setLoading(false);
  };

  const fetchAnalytics = async () => {
    try {
      console.log('Fetching customer analytics...');
      const response = await adminAPI.getCustomerAnalytics();
      console.log('Analytics response:', response.data);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      console.error('Analytics error response:', error.response?.data);
      // Set default analytics if API fails
      setAnalytics({
        total_customers: 0,
        active_customers: 0,
        new_customers_this_month: 0,
        avg_order_value: 0
      });
    }
  };

  useEffect(() => {
    fetchCustomers(1); // Refetch from API when filters change
  }, [filters]);

  const applyFilters = () => {
    let filtered = customers.filter(customer => {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        (customer.first_name || '').toLowerCase().includes(searchTerm) ||
        (customer.last_name || '').toLowerCase().includes(searchTerm) ||
        (customer.email || '').toLowerCase().includes(searchTerm) ||
        (customer.phone || '').toLowerCase().includes(searchTerm);
      
      const matchesPlatform = filters.platform === 'all' || customer.platform === filters.platform;

      return matchesSearch && matchesPlatform;
    });

    // Sort by latest order date (most recent first)
    filtered.sort((a, b) => {
      const dateA = a.last_order_date ? new Date(a.last_order_date) : new Date(0);
      const dateB = b.last_order_date ? new Date(b.last_order_date) : new Date(0);
      return dateB - dateA; // Descending order (latest first)
    });

    setFilteredCustomers(filtered);
  };

  const handleCustomerAction = async (customerId, action) => {
    const customer = customers.find(c => c.id === customerId);
    
    switch (action) {
      case 'view':
        setSelectedCustomer(customer);
        setShowCustomerModal(true);
        await fetchCustomerOrders(customerId);
        break;
      case 'edit':
        toast.info('Edit functionality coming soon');
        break;
      case 'delete':
        if (window.confirm(`Delete customer ${customer.first_name} ${customer.last_name}?`)) {
          await handleDeleteCustomer(customerId);
        }
        break;
    }
  };

  const fetchCustomerOrders = async (customerId) => {
    setLoadingOrders(true);
    try {
      console.log('Fetching orders for customer:', customerId);
      const response = await adminAPI.getCustomerOrders(customerId);
      console.log('Customer orders response:', response.data);
      
      let ordersData = [];
      if (response.data.results) {
        ordersData = response.data.results;
      } else if (Array.isArray(response.data)) {
        ordersData = response.data;
      } else {
        ordersData = response.data || [];
      }
      
      // Sort orders by ID in descending order (highest ID first)
      ordersData.sort((a, b) => b.id - a.id);
      
      console.log('Processed orders data:', ordersData);
      setCustomerOrders(ordersData);
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      console.error('Error response:', error.response?.data);
      setCustomerOrders([]);
      toast.error('Failed to load customer orders');
    }
    setLoadingOrders(false);
  };

  const handleOrderClick = async (orderId) => {
    try {
      const response = await adminAPI.getOrder(orderId);
      setSelectedOrder(response.data);
      setShowOrderModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    }
  };

  const handleSyncCustomers = async () => {
    setSyncing(true);
    try {
      const platformsResponse = await adminAPI.getPlatforms();
      const wooConnection = platformsResponse.data.results?.find(p => p.platform_type === 'woocommerce' && p.is_active);
      
      if (!wooConnection) {
        toast.error('No active WooCommerce connection found');
        return;
      }

      await adminAPI.syncCustomers(wooConnection.id);
      toast.success('Customers synced from WooCommerce successfully');
      fetchCustomers(pagination.page);
      fetchAnalytics();
    } catch (error) {
      console.error('Customer sync error:', error);
      toast.error('Failed to sync customers');
    }
    setSyncing(false);
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await adminAPI.deleteCustomer(customerId);
      setCustomers(customers.filter(c => c.id !== customerId));
      toast.success('Customer deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete customer');
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'woocommerce': return '🛒';
      case 'shopify': return '🛍️';
      case 'direct': return '👤';
      default: return '📱';
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '₹0.00';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(amount));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
          <p className="text-gray-600">Manage customer relationships and analyze customer data</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <FilterList className="h-4 w-4" />
            <span>Filters</span>
          </button>
          
          <button
            onClick={handleSyncCustomers}
            disabled={syncing}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <TrendingUp className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Customers'}</span>
          </button>
          
          <button
            onClick={() => {}}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <GetApp className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.total_customers || 0}</p>
            </div>
            <Person className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-green-600">{analytics.active_customers || 0}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New This Month</p>
              <p className="text-2xl font-bold text-purple-600">{analytics.new_customers_this_month || 0}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(analytics.avg_order_value || 0)}
              </p>
            </div>
            <AttachMoney className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name, email, phone..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
              <select
                value={filters.platform}
                onChange={(e) => setFilters({...filters, platform: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Platforms</option>
                <option value="woocommerce">WooCommerce</option>
                <option value="shopify">Shopify</option>
                <option value="direct">Direct</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Customers Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading customers...</span>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center p-8">
            <Person className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500 mb-4">Try syncing customers from your WooCommerce store</p>
            <button
              onClick={handleSyncCustomers}
              disabled={syncing}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {syncing ? 'Syncing...' : 'Sync Customers'}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Person className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <button
                          onClick={() => handleCustomerAction(customer.id, 'view')}
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {customer.full_name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unknown Customer'}
                        </button>
                        <div className="text-sm text-gray-500">Store ID: {customer.platform_customer_id || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Email className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{customer.email || 'No email'}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getPlatformIcon(customer.platform)}</span>
                      <span className="text-sm capitalize">{customer.platform}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{customer.total_orders || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-green-600">
                      {formatCurrency(customer.total_spent || 0)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleCustomerAction(customer.id, 'view')}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="View Details"
                      >
                        <Visibility className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleCustomerAction(customer.id, 'edit')}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                        title="Edit Customer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleCustomerAction(customer.id, 'delete')}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Delete Customer"
                      >
                        <Delete className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg border p-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.pageSize) + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} customers
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchCustomers(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                const pageNum = Math.max(1, pagination.page - 2) + i;
                if (pageNum > pagination.totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => fetchCustomers(pageNum)}
                    className={`px-3 py-1 border rounded ${
                      pageNum === pagination.page 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => fetchCustomers(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {showCustomerModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {selectedCustomer.first_name} {selectedCustomer.last_name}
              </h2>
              <button onClick={() => setShowCustomerModal(false)}>
                <span className="text-gray-400 text-xl">×</span>
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <Person className="h-5 w-5 mr-2" />
                  Contact Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {(selectedCustomer.first_name || '') + ' ' + (selectedCustomer.last_name || '')}</p>
                  <p><strong>Email:</strong> {selectedCustomer.email || 'No email'}</p>
                  <p><strong>Phone:</strong> {selectedCustomer.phone || 'Not provided'}</p>
                  <p><strong>Platform:</strong> {getPlatformIcon(selectedCustomer.platform)} {selectedCustomer.platform}</p>
                  <p><strong>Status:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      selectedCustomer.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedCustomer.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                  <p><strong>Joined:</strong> {new Date(selectedCustomer.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* Order Stats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Order Statistics
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Total Orders:</strong> {selectedCustomer.total_orders || 0}</p>
                  <p><strong>Total Spent:</strong> {formatCurrency(selectedCustomer.total_spent || 0)}</p>
                  <p><strong>Average Order:</strong> {formatCurrency((selectedCustomer.total_spent || 0) / Math.max(selectedCustomer.total_orders || 1, 1))}</p>
                  <p><strong>Last Order:</strong> {selectedCustomer.last_order_date ? new Date(selectedCustomer.last_order_date).toLocaleDateString() : 'Never'}</p>
                </div>
              </div>
              
              {/* Platform Data */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Platform Details
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Platform ID:</strong> {selectedCustomer.platform_customer_id || 'N/A'}</p>
                  <p><strong>Guest Customer:</strong> {selectedCustomer.is_guest ? 'Yes' : 'No'}</p>
                  <p><strong>Last Updated:</strong> {new Date(selectedCustomer.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            {/* Customer Orders */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Order History ({customerOrders.length} orders)</h3>
              {loadingOrders ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Loading orders...</span>
                </div>
              ) : customerOrders.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No orders found for this customer</p>
                  <p className="text-sm text-gray-400 mt-1">Orders will appear here once the customer makes a purchase</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {customerOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleOrderClick(order.id)}
                              className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {order.order_number || order.woocommerce_id || `#${order.id}`}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {order.created_at ? 
                              new Date(order.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) : 'N/A'
                            }
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {order.items_count || 0} items
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {formatCurrency(order.total_amount || order.total || 0)}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleOrderClick(order.id)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                              title="View Order Details"
                            >
                              <Visibility className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Order {selectedOrder.order_number || selectedOrder.woocommerce_id || `#${selectedOrder.id}`}
              </h2>
              <button onClick={() => setShowOrderModal(false)}>
                <span className="text-gray-400 text-xl">×</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Order Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-3">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Order Date:</strong> {
                    selectedOrder.created_at ? 
                      new Date(selectedOrder.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'
                  }</p>
                  <p><strong>Status:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      selectedOrder.status === 'completed' ? 'bg-green-100 text-green-800' :
                      selectedOrder.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </p>
                  <p><strong>Payment Method:</strong> {selectedOrder.payment_method || 'N/A'}</p>
                  <p><strong>Payment Status:</strong> {selectedOrder.payment_status || 'N/A'}</p>
                  <p><strong>Platform:</strong> {selectedOrder.platform}</p>
                </div>
              </div>
              
              {/* Order Totals */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-3">Order Totals</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Subtotal:</strong> {formatCurrency(selectedOrder.subtotal || 0)}</p>
                  <p><strong>Tax:</strong> {formatCurrency(selectedOrder.tax_amount || 0)}</p>
                  <p><strong>Shipping:</strong> {formatCurrency(selectedOrder.shipping_amount || 0)}</p>
                  <p><strong>Discount:</strong> {formatCurrency(selectedOrder.discount_amount || 0)}</p>
                  <p className="border-t pt-2"><strong>Total:</strong> {formatCurrency(selectedOrder.total_amount || selectedOrder.total || 0)}</p>
                </div>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Order Items</h3>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium">{item.product_name}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {item.sku || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {formatCurrency(item.unit_price || 0)}
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {formatCurrency(item.total_price || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center p-4">No items found for this order</p>
              )}
            </div>
            
            {/* Addresses */}
            {(selectedOrder.billing_address || selectedOrder.shipping_address) && (
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium mb-4">Addresses</h3>
                <div className="grid grid-cols-2 gap-6">
                  {selectedOrder.billing_address && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Billing Address</h4>
                      <div className="text-sm space-y-1">
                        <p>{selectedOrder.billing_address.first_name} {selectedOrder.billing_address.last_name}</p>
                        <p>{selectedOrder.billing_address.address_1}</p>
                        {selectedOrder.billing_address.address_2 && <p>{selectedOrder.billing_address.address_2}</p>}
                        <p>{selectedOrder.billing_address.city}, {selectedOrder.billing_address.state} {selectedOrder.billing_address.postcode}</p>
                        <p>{selectedOrder.billing_address.country}</p>
                        {selectedOrder.billing_address.phone && <p>Phone: {selectedOrder.billing_address.phone}</p>}
                      </div>
                    </div>
                  )}
                  
                  {selectedOrder.shipping_address && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Shipping Address</h4>
                      <div className="text-sm space-y-1">
                        <p>{selectedOrder.shipping_address.first_name} {selectedOrder.shipping_address.last_name}</p>
                        <p>{selectedOrder.shipping_address.address_1}</p>
                        {selectedOrder.shipping_address.address_2 && <p>{selectedOrder.shipping_address.address_2}</p>}
                        <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postcode}</p>
                        <p>{selectedOrder.shipping_address.country}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;