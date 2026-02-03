import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminAPI } from '../services/api';
import CustomerDetailModal from '../components/CustomerDetailModal';
import {
  Search,
  FilterList,
  GetApp,
  Edit,
  Delete,
  Assignment,
  Note,
  Undo,
  AttachMoney,
  CheckBox,
  CheckBoxOutlineBlank,
  Visibility,
  Person,
  CalendarToday,
  ShoppingCart,
  ShoppingCartOutlined,
  LocalShipping,
  Store,
  Phone,
  Email,
  Inventory,
  AccessTime,
  CheckCircle,
  NoteAdd,
  Sync,
} from '@mui/icons-material';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [note, setNote] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    status: 'processing', // Default to processing instead of all
    platform: 'all',
    employee: 'all',
    dateFrom: '',
    dateTo: '',
  });

  const employees = [
    { id: 1, name: 'Rajesh Kumar', avatar: 'RK' },
    { id: 2, name: 'Priya Sharma', avatar: 'PS' },
    { id: 3, name: 'Amit Singh', avatar: 'AS' },
    { id: 4, name: 'Sneha Patel', avatar: 'SP' },
  ];

  const platforms = [
    { id: 'woocommerce', name: 'WooCommerce', icon: '🛒' },
    { id: 'shopify', name: 'Shopify', icon: '🛍️' },
    { id: 'manual', name: 'Manual', icon: '📝' },
  ];

  const orderStatuses = [
    { id: 'pending', name: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'confirmed', name: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { id: 'processing', name: 'Processing', color: 'bg-purple-100 text-purple-800' },
    { id: 'packed', name: 'Packed', color: 'bg-orange-100 text-orange-800' },
    { id: 'shipped', name: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'delivered', name: 'Delivered', color: 'bg-green-100 text-green-800' },
    { id: 'cancelled', name: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { id: 'returned', name: 'Returned', color: 'bg-gray-100 text-gray-800' },
  ];

  const mockOrders = [
    {
      id: 'ORD-2024-001',
      customer: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      platform: 'website',
      status: 'pending',
      assignee: 1,
      items: [{ name: 'Wireless Headphones', qty: 1, price: 2500 }],
      total: 2500,
      createdAt: '2024-01-24T10:30:00Z',
      shippingAddress: 'Mumbai, Maharashtra',
      notes: 'Customer requested express delivery',
      paymentMethod: 'UPI',
      trackingId: null
    },
    {
      id: 'ORD-2024-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+91 9876543211',
      platform: 'amazon',
      status: 'processing',
      assignee: 2,
      items: [{ name: 'Smart Watch', qty: 1, price: 15000 }],
      total: 15000,
      createdAt: '2024-01-24T09:15:00Z',
      shippingAddress: 'Delhi, Delhi',
      notes: 'Gift wrapping requested',
      paymentMethod: 'Credit Card',
      trackingId: 'AMZ123456789'
    },
    {
      id: 'ORD-2024-003',
      customer: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+91 9876543212',
      platform: 'flipkart',
      status: 'shipped',
      assignee: 3,
      items: [{ name: 'Laptop Stand', qty: 1, price: 2500 }, { name: 'USB Hub', qty: 1, price: 1000 }],
      total: 3500,
      createdAt: '2024-01-23T14:20:00Z',
      shippingAddress: 'Bangalore, Karnataka',
      notes: '',
      paymentMethod: 'COD',
      trackingId: 'FLP987654321'
    },
    {
      id: 'ORD-2024-004',
      customer: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+91 9876543213',
      platform: 'myntra',
      status: 'delivered',
      assignee: 4,
      items: [{ name: 'Gaming Mouse', qty: 1, price: 2200 }, { name: 'Keyboard', qty: 1, price: 2000 }],
      total: 4200,
      createdAt: '2024-01-22T11:45:00Z',
      shippingAddress: 'Chennai, Tamil Nadu',
      notes: 'Delivered successfully',
      paymentMethod: 'Net Banking',
      trackingId: 'MYN456789123'
    },
    {
      id: 'ORD-2024-005',
      customer: 'David Brown',
      email: 'david@example.com',
      phone: '+91 9876543214',
      platform: 'offline',
      status: 'cancelled',
      assignee: 1,
      items: [{ name: 'Phone Case', qty: 1, price: 800 }, { name: 'Screen Protector', qty: 1, price: 400 }],
      total: 1200,
      createdAt: '2024-01-21T08:30:00Z',
      shippingAddress: 'Pune, Maharashtra',
      notes: 'Customer cancelled due to delay',
      paymentMethod: 'UPI',
      trackingId: null
    }
  ];

  const abandonedCarts = [
    {
      id: 1,
      customer: {
        name: 'Rahul Sharma',
        phone: '+91 9876543210',
        email: 'rahul.sharma@email.com'
      },
      platform: 'website',
      products: [
        { name: 'iPhone 15 Pro', price: 134900, quantity: 1 },
        { name: 'AirPods Pro', price: 24900, quantity: 1 }
      ],
      totalAmount: 159800,
      abandonedAt: '2024-01-15 14:30',
      status: 'pending',
      notes: 'Customer was comparing prices'
    },
    {
      id: 2,
      customer: {
        name: 'Priya Patel',
        phone: '+91 8765432109',
        email: 'priya.patel@email.com'
      },
      platform: 'amazon',
      products: [
        { name: 'Samsung Galaxy S24', price: 79999, quantity: 1 },
        { name: 'Galaxy Buds', price: 12999, quantity: 1 }
      ],
      totalAmount: 92998,
      abandonedAt: '2024-01-15 16:45',
      status: 'contacted',
      notes: 'Sent follow-up email'
    },
    {
      id: 3,
      customer: {
        name: 'Amit Kumar',
        phone: '+91 7654321098',
        email: 'amit.kumar@email.com'
      },
      platform: 'flipkart',
      products: [
        { name: 'MacBook Air M2', price: 114900, quantity: 1 }
      ],
      totalAmount: 114900,
      abandonedAt: '2024-01-14 11:20',
      status: 'recovered',
      notes: 'Customer completed purchase after discount offer'
    }
  ];

  useEffect(() => {
    fetchOrders();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchOrders();
    }, 300000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, ordering: '-created_at' }; // Order by latest created date first
      // Only add filter params if they have values
      if (filters.search) params.search = filters.search;
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.platform !== 'all') params.platform = filters.platform;
      if (filters.employee !== 'all') params.employee = filters.employee;
      if (filters.dateFrom) params.date_from = filters.dateFrom;
      if (filters.dateTo) params.date_to = filters.dateTo;
      
      const response = await adminAPI.getAllOrders(params);
      const data = response.data;
      
      setOrders(data.results || data);
      setTotalCount(data.count || data.length);
      setTotalPages(Math.ceil((data.count || data.length) / 20));
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setOrders([]);
      setTotalCount(0);
      setTotalPages(0);
    }
    setLoading(false);
  };

  const handleSyncOrders = async () => {
    setLoading(true);
    try {
      // Get active platforms
      const platformsResponse = await adminAPI.getPlatforms();
      const platforms = platformsResponse.data.results || platformsResponse.data;
      const activePlatforms = platforms.filter(p => p.is_active);
      
      if (activePlatforms.length === 0) {
        toast.error('No active platforms found');
        setLoading(false);
        return;
      }
      
      // Sync orders from all active platforms
      for (const platform of activePlatforms) {
        try {
          await adminAPI.syncPlatform(platform.id, { sync_type: 'orders', force: true });
          toast.success(`Order sync started for ${platform.platform_type}`);
        } catch (error) {
          console.error(`Error syncing ${platform.platform_type}:`, error);
          toast.error(`Failed to sync ${platform.platform_type} orders`);
        }
      }
      
      // Refresh orders after sync
      setTimeout(() => {
        fetchOrders();
      }, 2000);
      
    } catch (error) {
      console.error('Error syncing orders:', error);
      toast.error('Failed to sync orders: ' + (error.response?.data?.error || error.message));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (currentPage === 1) {
      fetchOrders(1);
    } else {
      setCurrentPage(1);
      fetchOrders(1);
    }
  }, [filters]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchOrders(pageNumber);
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkAction = async (action) => {
    if (selectedOrders.length === 0) {
      toast.warning('Please select orders first');
      return;
    }

    try {
      switch (action) {
        case 'assign':
          const employeeId = prompt('Enter employee ID:');
          if (employeeId) {
            await adminAPI.bulkUpdateOrders({
              order_ids: selectedOrders,
              action: 'assign',
              data: { employee_id: parseInt(employeeId) }
            });
            toast.success(`${selectedOrders.length} orders assigned`);
            fetchOrders();
          }
          break;
        case 'status':
          const status = prompt('Enter new status (pending, confirmed, processing, packed, shipped, delivered, cancelled):');
          if (status) {
            await adminAPI.bulkUpdateOrders({
              order_ids: selectedOrders,
              action: 'update_status',
              data: { status }
            });
            toast.success(`Status updated for ${selectedOrders.length} orders`);
            fetchOrders();
          }
          break;
        case 'export':
          toast.success(`Exporting ${selectedOrders.length} orders`);
          break;
        case 'delete':
          if (window.confirm(`Delete ${selectedOrders.length} selected orders?`)) {
            // Note: Implement delete API call if needed
            toast.success('Orders deleted successfully');
            fetchOrders();
          }
          break;
      }
      setSelectedOrders([]);
    } catch (error) {
      toast.error('Failed to perform bulk action: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleOrderAction = async (orderId, action) => {
    const order = orders.find(o => o.id === orderId);
    
    try {
      switch (action) {
        case 'view':
          setSelectedOrder(order);
          setShowOrderModal(true);
          break;
        case 'view_customer':
          setSelectedCustomerId(order.customer_id);
          setShowCustomerModal(true);
          break;
        case 'refund':
          // Implement refund API call
          toast.success(`Refund initiated for ${orderId}`);
          break;
        case 'return':
          // Implement return API call
          toast.success(`Return processed for ${orderId}`);
          break;
        case 'note':
          const note = prompt('Add note:', order.notes);
          if (note !== null) {
            // Update order with note via API
            await adminAPI.updateOrderStatus(orderId, { notes: note });
            toast.success('Note updated');
            fetchOrders();
          }
          break;
        case 'status':
          const newStatus = prompt('Enter new status:', order.status);
          if (newStatus && newStatus !== order.status) {
            await adminAPI.updateOrderStatus(orderId, { status: newStatus });
            toast.success('Order status updated');
            fetchOrders();
          }
          break;
      }
    } catch (error) {
      toast.error('Failed to perform action: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleCartAction = (cartId, action) => {
    switch (action) {
      case 'delete':
        if (window.confirm('Are you sure you want to delete this abandoned cart?')) {
          toast.success(`Cart ${cartId} deleted`);
        }
        break;
      case 'recovered':
        toast.success(`Cart ${cartId} marked as recovered`);
        break;
      case 'note':
        const cart = abandonedCarts.find(c => c.id === cartId);
        setSelectedCart(cart);
        setNote(cart.notes || '');
        setShowNoteModal(true);
        break;
    }
  };

  const saveCartNote = () => {
    toast.success(`Note saved for cart ${selectedCart.id}`);
    setShowNoteModal(false);
    setSelectedCart(null);
    setNote('');
  };

  const getStatusBadge = (status) => {
    const statusObj = orderStatuses.find(s => s.id === status);
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusObj?.color || 'bg-gray-100 text-gray-800'}`}>
        {statusObj?.name || status}
      </span>
    );
  };

  const getPlatformIcon = (platform) => {
    const platformObj = platforms.find(p => p.id === platform);
    return platformObj?.icon || '🌐';
  };

  const getEmployeeById = (id) => {
    return employees.find(emp => emp.id === id);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">Unified order listing from all platforms</p>
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
            onClick={handleSyncOrders}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            disabled={loading}
          >
            <Sync className="h-4 w-4" />
            <span>{loading ? 'Syncing...' : 'Sync Orders'}</span>
          </button>
          
          <button
            onClick={() => handleBulkAction('export')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <GetApp className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4" />
                <span>Orders</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('abandoned')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'abandoned'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ShoppingCartOutlined className="h-4 w-4" />
                <span>Cart Abandoned</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <>
          {/* Orders Content */}

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Order ID, Customer..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                {orderStatuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
              <select
                value={filters.platform}
                onChange={(e) => setFilters({...filters, platform: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Platforms</option>
                {platforms.map(platform => (
                  <option key={platform.id} value={platform.id}>
                    {platform.icon} {platform.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
              <select
                value={filters.employee}
                onChange={(e) => setFilters({...filters, employee: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Employees</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedOrders.length} orders selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('assign')}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Assign Employee
              </button>
              <button
                onClick={() => handleBulkAction('status')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Update Status
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
              >
                Export Selected
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading orders...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button onClick={handleSelectAll}>
                    {selectedOrders.length === orders.length ? 
                      <CheckBox className="h-5 w-5 text-blue-600" /> : 
                      <CheckBoxOutlineBlank className="h-5 w-5 text-gray-400" />
                    }
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => {
                const employee = getEmployeeById(order.assignee);
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <button onClick={() => handleSelectOrder(order.id)}>
                        {selectedOrders.includes(order.id) ? 
                          <CheckBox className="h-5 w-5 text-blue-600" /> : 
                          <CheckBoxOutlineBlank className="h-5 w-5 text-gray-400" />
                        }
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">#{order.order_number}</div>
                        <div className="text-sm text-blue-600">
                          {order.platform === 'shopify' ? 'Shopify ID:' : 
                           order.platform === 'woocommerce' ? 'WC ID:' : 'Platform ID:'} {order.woocommerce_id || order.platform_order_id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {(order.items || []).length} item{(order.items || []).length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{order.customer}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                        <div className="text-sm text-gray-500">{order.phone}</div>
                        <button
                          onClick={() => handleOrderAction(order.id, 'view_customer')}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-1 flex items-center"
                        >
                          <Visibility className="h-3 w-3 mr-1" />
                          View Details
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getPlatformIcon(order.platform)}</span>
                        <span className="text-sm capitalize">{order.platform}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-indigo-600">{employee?.avatar}</span>
                        </div>
                        <span className="text-sm">{employee?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">₹{(order.total || order.total_amount || 0).toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{order.paymentMethod || order.payment_method || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.createdAt || order.created_at ? 
                          new Date(order.createdAt || order.created_at).toLocaleDateString() : 'N/A'
                        }
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.createdAt || order.created_at ? 
                          new Date(order.createdAt || order.created_at).toLocaleTimeString() : 'N/A'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleOrderAction(order.id, 'view')}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          title="View Details"
                        >
                          <Visibility className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOrderAction(order.id, 'note')}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                          title="Add Note"
                        >
                          <Note className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOrderAction(order.id, 'refund')}
                          className="p-1 text-orange-600 hover:bg-orange-100 rounded"
                          title="Process Refund"
                        >
                          <AttachMoney className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOrderAction(order.id, 'return')}
                          className="p-1 text-purple-600 hover:bg-purple-100 rounded"
                          title="Process Return"
                        >
                          <Undo className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-end">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages} ({totalCount} total)
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + index;
                    } else {
                      pageNumber = currentPage - 2 + index;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`px-3 py-1 border text-sm ${
                          currentPage === pageNumber
                            ? 'bg-blue-50 border-blue-500 text-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Order Details - #{selectedOrder.order_number}</h2>
              <button onClick={() => setShowOrderModal(false)}>
                <span className="text-gray-400 text-xl">×</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Customer Information</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Name:</strong> {selectedOrder.customer || selectedOrder.customer_name || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedOrder.email || selectedOrder.customer_email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {selectedOrder.phone || selectedOrder.customer_phone || 'N/A'}</p>
                  <p><strong>Address:</strong> {selectedOrder.shippingAddress || selectedOrder.shipping_address || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Order Information</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Platform:</strong> {getPlatformIcon(selectedOrder.platform)} {selectedOrder.platform}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedOrder.status)}</p>
                  <p><strong>Payment:</strong> {selectedOrder.paymentMethod || selectedOrder.payment_method || 'N/A'}</p>
                  <p><strong>Tracking:</strong> {selectedOrder.trackingId || selectedOrder.tracking_id || 'Not assigned'}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-right">Qty</th>
                      <th className="px-4 py-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedOrder.items || []).map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{item.name || item.product_name || 'N/A'}</td>
                        <td className="px-4 py-2 text-right">{item.qty || item.quantity || 0}</td>
                        <td className="px-4 py-2 text-right">₹{(item.price || item.unit_price || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td className="px-4 py-2 font-medium" colSpan="2">Total</td>
                      <td className="px-4 py-2 text-right font-medium">₹{(selectedOrder.total || selectedOrder.total_amount || 0).toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            {selectedOrder.notes && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
        </>
      ) : (
        <>
          {/* Cart Abandoned Content */}
          <div className="space-y-4">
            {abandonedCarts.map((cart) => (
              <div key={cart.id} className="bg-white rounded-lg border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <ShoppingCartOutlined className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Cart #{cart.id}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <span className="text-lg">{getPlatformIcon(cart.platform)}</span>
                          <span className="capitalize">{cart.platform}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <AccessTime className="h-4 w-4" />
                          <span>Abandoned: {cart.abandonedAt}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cart.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          cart.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {cart.status.charAt(0).toUpperCase() + cart.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">₹{cart.totalAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{cart.products.length} items</p>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Person className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Customer</p>
                      <p className="font-medium text-gray-900">{cart.customer.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{cart.customer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Email className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{cart.customer.email}</p>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Inventory className="h-4 w-4 mr-1" />
                    Products in Cart
                  </h4>
                  <div className="space-y-2">
                    {cart.products.map((product, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900">₹{product.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {cart.notes && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> {cart.notes}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCartAction(cart.id, 'recovered')}
                    className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Mark Recovered</span>
                  </button>
                  
                  <button
                    onClick={() => handleCartAction(cart.id, 'note')}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <NoteAdd className="h-4 w-4" />
                    <span>Add Note</span>
                  </button>
                  
                  <select
                    value={cart.status}
                    onChange={(e) => {
                      // Handle status change
                      toast.success(`Status updated to ${e.target.value}`);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="recovered">Recovered</option>
                  </select>
                  
                  <button
                    onClick={() => handleCartAction(cart.id, 'delete')}
                    className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    <Delete className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Customer Detail Modal */}
      {showCustomerModal && selectedCustomerId && (
        <CustomerDetailModal
          customerId={selectedCustomerId}
          onClose={() => {
            setShowCustomerModal(false);
            setSelectedCustomerId(null);
          }}
        />
      )}

      {/* Cart Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add Note for Cart #{selectedCart?.id}
            </h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter your note here..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={saveCartNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;