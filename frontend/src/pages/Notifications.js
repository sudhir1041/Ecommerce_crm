import React, { useState, useEffect } from 'react';
import {
  Add as Plus,
  Search,
  Send,
  Group as Users,
  Person as User,
  Warning as AlertCircle,
  CheckCircle,
  Info,
  Close as X
} from '@mui/icons-material';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    recipients: 'all'
  });

  useEffect(() => {
    // Mock data
    setNotifications([
      {
        id: 1,
        title: 'System Maintenance',
        message: 'Scheduled maintenance on Sunday 2AM-4AM',
        type: 'warning',
        recipients: 'all',
        sent: true,
        createdAt: '2024-01-15T10:30:00Z',
        sentCount: 156
      },
      {
        id: 2,
        title: 'New Feature Release',
        message: 'Analytics dashboard v2.0 is now available',
        type: 'success',
        recipients: 'employees',
        sent: true,
        createdAt: '2024-01-14T14:20:00Z',
        sentCount: 89
      },
      {
        id: 3,
        title: 'Security Alert',
        message: 'Please update your passwords',
        type: 'error',
        recipients: 'all',
        sent: false,
        createdAt: '2024-01-13T09:15:00Z',
        sentCount: 0
      }
    ]);
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-sm text-green-500" />;
      case 'warning': return <AlertCircle className="text-sm text-yellow-500" />;
      case 'error': return <AlertCircle className="text-sm text-red-500" />;
      default: return <Info className="text-sm text-blue-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const handleCreateNotification = () => {
    const notification = {
      id: Date.now(),
      ...newNotification,
      sent: false,
      createdAt: new Date().toISOString(),
      sentCount: 0
    };
    setNotifications([notification, ...notifications]);
    setNewNotification({ title: '', message: '', type: 'info', recipients: 'all' });
    setShowCreateModal(false);
  };

  const handleSendNotification = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, sent: true, sentCount: Math.floor(Math.random() * 200) + 50 } : n
    ));
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || notification.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Manage system notifications and announcements</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="text-sm" />
          Create Notification
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b flex gap-4">
          <div className="relative flex-1">
            <Search className="text-sm absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        <div className="divide-y">
          {filteredNotifications.map((notification) => (
            <div key={notification.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(notification.type)}
                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                      {notification.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{notification.message}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      {notification.recipients === 'all' ? <Users className="text-xs" /> : <User className="text-xs" />}
                      {notification.recipients === 'all' ? 'All Users' : 'Employees'}
                    </span>
                    <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                    {notification.sent && <span>Sent to {notification.sentCount} users</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {notification.sent ? (
                    <span className="text-green-600 text-sm font-medium">Sent</span>
                  ) : (
                    <button
                      onClick={() => handleSendNotification(notification.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Send className="text-xs" />
                      Send
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Create Notification</h2>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="text-lg text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Notification title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Notification message"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                <select
                  value={newNotification.recipients}
                  onChange={(e) => setNewNotification({...newNotification, recipients: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Users</option>
                  <option value="employees">Employees Only</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNotification}
                disabled={!newNotification.title || !newNotification.message}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;