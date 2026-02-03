import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Dashboard as DashboardIcon,
  ShoppingCart,
  ShoppingCartOutlined,
  People,
  Inventory,
  Analytics,
  Assignment,
  Notifications,
  Settings,
  LocalShipping,
  Assessment,
  AccountCircle,
  Business,
  ExitToApp,
  Menu as MenuIcon,
  Group,
  Receipt,
  Store,
  Timeline,
  Close,
  Circle,
  CheckCircle,
  MonitorHeart,
  Campaign,
  Chat,
} from '@mui/icons-material';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [systemHealth, setSystemHealth] = useState(95);

  const isSuperAdmin = user?.role === 'super_admin';

  const notifications = [
    {
      id: 1,
      title: 'New Order Received',
      message: 'Order #ORD-2024-001 has been placed',
      time: '2 minutes ago',
      type: 'order',
      read: false
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      message: 'Product "Smartphone Pro" is running low on stock',
      time: '15 minutes ago',
      type: 'inventory',
      read: false
    },
    {
      id: 3,
      title: 'Payment Received',
      message: 'Payment of ₹25,000 received for Order #ORD-2024-002',
      time: '1 hour ago',
      type: 'payment',
      read: true
    },
    {
      id: 4,
      title: 'New Customer Registration',
      message: 'Rahul Sharma has registered as a new customer',
      time: '2 hours ago',
      type: 'customer',
      read: true
    },
    {
      id: 5,
      title: 'System Update',
      message: 'System maintenance completed successfully',
      time: '1 day ago',
      type: 'system',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Fetch system health for super admin
  useEffect(() => {
    if (isSuperAdmin) {
      const fetchSystemHealth = async () => {
        try {
          const response = await fetch('/api/v1/core/health/', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('admin_token') || localStorage.getItem('token')}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setSystemHealth(data.health_percentage || 95);
          } else {
            setSystemHealth(85); // Default fallback
          }
        } catch (error) {
          console.error('Failed to fetch system health:', error);
          setSystemHealth(80); // Error fallback
        }
      };
      
      fetchSystemHealth();
      const interval = setInterval(fetchSystemHealth, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isSuperAdmin]);

  const superAdminMenuItems = [
    { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/orders', label: 'Orders', icon: <ShoppingCart /> },
    { path: '/kanban', label: 'Tasks', icon: <Assignment /> },
    { path: '/products', label: 'Products', icon: <Inventory /> },
    { path: '/customers', label: 'Customers', icon: <People /> },
    { path: '/shipping', label: 'Shipping', icon: <LocalShipping /> },
    { path: '/reports', label: 'Reports', icon: <Receipt /> },
    { path: '/marketing', label: 'Marketing', icon: <Campaign /> },
    { path: '/chats', label: 'Chats', icon: <Chat /> },
    { path: '/employees', label: 'Employees', icon: <Group /> },
    { path: '/system-logs', label: 'System Logs', icon: <Timeline /> },
    { path: '/notifications', label: 'Notifications', icon: <Notifications /> },
    { path: '/settings', label: 'Settings', icon: <Settings /> },
  ];

  const employeeMenuItems = [
    { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/my-orders', label: 'My Orders', icon: <ShoppingCart /> },
    { path: '/kanban', label: 'Tasks', icon: <Assignment /> },
    { path: '/products', label: 'Products', icon: <Inventory /> },
    { path: '/customers', label: 'Customers', icon: <People /> },
    { path: '/shipping', label: 'Shipping', icon: <LocalShipping /> },
    { path: '/performance', label: 'Performance', icon: <Assessment /> },
    { path: '/notifications', label: 'Notifications', icon: <Notifications /> },
    { path: '/profile', label: 'Profile', icon: <AccountCircle /> },
  ];

  const menuItems = isSuperAdmin ? superAdminMenuItems : employeeMenuItems;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm overflow-y-auto`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-indigo-600 rounded-lg p-2 mr-3">
              <Business className="text-white text-xl" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">E-commerce</h1>
                <p className="text-sm text-gray-500">
                  {isSuperAdmin ? 'Super Admin' : 'Employee'} Panel
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-6">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center px-6 py-3 mx-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`text-xl ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-6 border-t border-gray-200">
          {sidebarOpen && (
            <div className="mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-semibold text-sm">
                    {user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            <ExitToApp className="text-xl" />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg mr-4"
            >
              <MenuIcon className="text-gray-600" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* System Health - Only for Super Admin */}
            {isSuperAdmin && (
              <Link 
                to="/settings?tab=health"
                className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MonitorHeart className={`h-5 w-5 ${
                  systemHealth >= 90 ? 'text-green-600' :
                  systemHealth >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`} />
                <div className="text-sm">
                  <span className="text-gray-600">Health:</span>
                  <span className={`ml-1 font-semibold ${
                    systemHealth >= 90 ? 'text-green-600' :
                    systemHealth >= 70 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {systemHealth}%
                  </span>
                </div>
              </Link>
            )}
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-lg relative"
              >
                <Notifications className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Close className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {notification.read ? (
                              <CheckCircle className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Circle className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t">
                    <Link
                      to="/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View All Notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* User Info */}
            <Link to="/profile" className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role === 'super_admin' ? 'Super Admin' : 'Employee'}
                </p>
              </div>
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-sm">
                  {user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;