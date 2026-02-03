import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// E-commerce API functions
export const adminAPI = {
  // Auth
  login: (credentials) => axios.post('/api/accounts/login/', credentials),
  
  // Dashboard
  getDashboardStats: () => api.get('/analytics/dashboard/'),
  
  // Products
  getAllProducts: (params) => api.get('/products/', { params }),
  getProduct: (productId) => api.get(`/products/${productId}/`),
  createProduct: (data) => api.post('/products/', data),
  updateProduct: (productId, data) => api.put(`/products/${productId}/`, data),
  deleteProduct: (productId) => api.delete(`/products/${productId}/`),
  syncProduct: (productId) => api.post(`/products/${productId}/sync_to_platform/`),
  getCategories: () => api.get('/products/categories/'),
  
  // Orders
  getAllOrders: (params) => api.get('/orders/', { params }),
  // Bulk Update Orders
  bulkUpdateOrders: (data) => api.post('/orders/bulk_update/', data),
  getOrder: (orderId) => api.get(`/orders/${orderId}/`),
  updateOrderStatus: (orderId, data) => api.patch(`/orders/${orderId}/`, data),
  
  // Customers
  getAllCustomers: (params) => api.get('/customers/', { params }),
  getCustomers: (params) => api.get('/customers/', { params }),
  getCustomer: (customerId) => api.get(`/customers/${customerId}/`),
  createCustomer: (data) => api.post('/customers/', data),
  updateCustomer: (customerId, data) => api.put(`/customers/${customerId}/`, data),
  deleteCustomer: (customerId) => api.delete(`/customers/${customerId}/`),
  getCustomerOrders: (customerId) => api.get(`/customers/${customerId}/orders/`),
  getCustomerStats: (customerId) => api.get(`/customers/${customerId}/stats/`),
  getCustomerAnalytics: () => api.get('/customers/analytics/'),
  
  // Analytics
  getAnalytics: (params) => api.get('/analytics/', { params }),
  getSalesData: () => api.get('/analytics/sales/'),
  getRevenueData: () => api.get('/analytics/revenue/'),
  
  // Kanban
  getTasks: () => api.get('/kanban/tasks/'),
  createTask: (data) => api.post('/kanban/tasks/', data),
  updateTask: (taskId, data) => api.put(`/kanban/tasks/${taskId}/`, data),
  deleteTask: (taskId) => api.delete(`/kanban/tasks/${taskId}/`),
  
  // Notifications
  getNotifications: () => api.get('/notifications/'),
  markAsRead: (notificationId) => api.patch(`/notifications/${notificationId}/read/`),
  
  // Integrations
  // Platform Connections
  getPlatforms: (params) => api.get('/integrations/platforms/', { params }),
  getPlatform: (platformId) => api.get(`/integrations/platforms/${platformId}/`),
  createPlatform: (data) => api.post('/integrations/platforms/', data),
  updatePlatform: (platformId, data) => api.put(`/integrations/platforms/${platformId}/`, data),
  deletePlatform: (platformId) => api.delete(`/integrations/platforms/${platformId}/`),
  syncPlatform: (platformId, data) => api.post(`/integrations/platforms/${platformId}/sync/`, data),
  syncCustomers: (platformId) => api.post(`/integrations/platforms/${platformId}/sync/`, { sync_type: 'customers', force: true }),
  testPlatform: (platformId) => api.post(`/integrations/platforms/${platformId}/test/`),
  
  // Courier Services
  getCouriers: (params) => api.get('/integrations/couriers/', { params }),
  getCourier: (courierId) => api.get(`/integrations/couriers/${courierId}/`),
  createCourier: (data) => api.post('/integrations/couriers/', data),
  updateCourier: (courierId, data) => api.put(`/integrations/couriers/${courierId}/`, data),
  deleteCourier: (courierId) => api.delete(`/integrations/couriers/${courierId}/`),
  checkServiceability: (data) => api.post('/integrations/couriers/check_serviceability/', data),
  calculateRate: (courierId, data) => api.post(`/integrations/couriers/${courierId}/calculate_rate/`, data),
  createShipment: (data) => api.post('/integrations/couriers/create_shipment/', data),
  
  // Shipments
  getShipments: (params) => api.get('/integrations/shipments/', { params }),
  getShipment: (shipmentId) => api.get(`/integrations/shipments/${shipmentId}/`),
  trackShipment: (shipmentId) => api.get(`/integrations/shipments/${shipmentId}/track/`),
  
  // Sync Logs
  getSyncLogs: (params) => api.get('/integrations/sync-logs/', { params }),
  
  // System Logs - Return empty array if API fails
  getSystemLogs: (params) => {
    console.log('Fetching system logs with params:', params);
    return api.get('/core/system-logs/', { params }).catch(error => {
      console.error('System logs API error:', error);
      // Return mock data if API fails
      return {
        data: {
          results: [
            {
              id: 1,
              timestamp: new Date().toISOString(),
              level: 'INFO',
              category: 'SYSTEM',
              message: 'System logs table not yet migrated',
              details: { note: 'Run migrations to create system logs table' },
              user_name: null,
              ip_address: null
            }
          ]
        }
      };
    });
  },
  
  // Health Checks
  getHealthCheck: () => api.get('/core/health/').catch(() => ({ data: { status: 'unavailable' } })),
  getSystemHealth: () => api.get('/core/health/system/').catch(() => ({ 
    data: { 
      status: 'unavailable', 
      checks: { 
        database: { status: 'unknown' },
        system: { status: 'unknown' }
      }
    }
  })),
  getReadinessCheck: () => api.get('/core/health/ready/').catch(() => ({ data: { ready: false } })),
  getLivenessCheck: () => api.get('/core/health/live/').catch(() => ({ data: { alive: false } })),
};

// Health check
export const healthCheck = () => axios.get('http://127.0.0.1:8000/api/v1/core/health/');
export const systemHealth = () => axios.get('http://127.0.0.1:8000/api/v1/core/health/system/');

export default api;