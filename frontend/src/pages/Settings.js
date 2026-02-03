import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminAPI } from '../services/api';
import SystemLogs from '../components/SystemLogs';
import SystemHealth from '../components/SystemHealth';
import {
  Store,
  Email,
  Sms,
  WhatsApp,
  Palette,
  Settings as SettingsIcon,
  Save,
  Science,
  Link,
  Security,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
  Sync,
  CreditCard,
  Star,
  Help,
  Close,
  BugReport,
  MonitorHeart,
} from '@mui/icons-material';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('integrations');
  const [showPasswords, setShowPasswords] = useState({});
  const [platforms, setPlatforms] = useState([]);
  const [syncLogs, setSyncLogs] = useState([]);
  const [syncProgress, setSyncProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [helpModal, setHelpModal] = useState({ open: false, platform: '' });
  
  const [integrations, setIntegrations] = useState({
    woocommerce: {
      enabled: false,
      storeName: '',
      storeUrl: '',
      consumerKey: '',
      consumerSecret: '',
      status: 'disconnected'
    },
    shopify: {
      enabled: false,
      storeName: '',
      shopUrl: '',
      accessToken: '',
      apiKey: '',
      apiSecret: '',
      status: 'disconnected'
    },
    bigcommerce: {
      enabled: false,
      storeName: '',
      storeUrl: '',
      clientId: '',
      clientSecret: '',
      accessToken: '',
      storeHash: '',
      status: 'disconnected'
    },
    squarespace: {
      enabled: false,
      storeName: '',
      storeUrl: '',
      apiKey: '',
      status: 'disconnected'
    },
    square: {
      enabled: false,
      storeName: '',
      applicationId: '',
      accessToken: '',
      locationId: '',
      status: 'disconnected'
    },
    ecwid: {
      enabled: false,
      storeName: '',
      storeUrl: '',
      apiKey: '',
      storeId: '',
      status: 'disconnected'
    },
    wix: {
      enabled: false,
      storeName: '',
      storeUrl: '',
      apiKey: '',
      siteId: '',
      status: 'disconnected'
    },
    magento: {
      enabled: false,
      storeName: '',
      storeUrl: '',
      consumerKey: '',
      consumerSecret: '',
      accessToken: '',
      status: 'disconnected'
    }
  });

  const [emailConfig, setEmailConfig] = useState({
    provider: 'smtp',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: '',
    encryption: 'tls',
    enabled: false
  });

  const [smsConfig, setSmsConfig] = useState({
    provider: 'twilio',
    twilioSid: '',
    twilioToken: '',
    twilioPhone: '',
    msg91Key: '',
    msg91Sender: '',
    enabled: false
  });

  const [whatsappConfig, setWhatsappConfig] = useState({
    accessToken: '',
    phoneNumberId: '',
    businessAccountId: '',
    webhookToken: '',
    enabled: false
  });

  const [themeConfig, setThemeConfig] = useState({
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    backgroundColor: '#F9FAFB',
    sidebarColor: '#FFFFFF',
    textColor: '#111827',
    mode: 'light'
  });

  const [subscription, setSubscription] = useState({
    currentPlan: 'pro',
    status: 'active',
    nextBilling: '2024-02-24',
    amount: 2999
  });

  useEffect(() => {
    if (activeTab === 'integrations') {
      fetchPlatforms();
      fetchSyncLogs();
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        fetchPlatforms();
        fetchSyncLogs();
      }, 30000);
      
      return () => clearInterval(interval);
    }
    
    // Check URL params for tab
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['integrations', 'email', 'sms', 'whatsapp', 'subscription', 'theme', 'health', 'logs'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [activeTab]);

  const fetchSyncLogs = async () => {
    try {
      const response = await adminAPI.getSyncLogs();
      setSyncLogs(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching sync logs:', error);
    }
  };

  const fetchPlatforms = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getPlatforms();
      const platformData = response.data.results || response.data;
      setPlatforms(platformData);
      
      // Update integrations state with real data
      const updatedIntegrations = { ...integrations };
      platformData.forEach(platform => {
        if (updatedIntegrations[platform.platform_type]) {
          updatedIntegrations[platform.platform_type] = {
            ...updatedIntegrations[platform.platform_type],
            enabled: platform.is_active,
            status: platform.is_active ? 'connected' : 'disconnected',
            storeName: platform.store_name,
            storeUrl: platform.store_url,
            shopUrl: platform.store_url, // For Shopify compatibility
            consumerKey: platform.decrypted_consumer_key || '',
            apiKey: platform.decrypted_api_key || '',
            accessToken: platform.decrypted_access_token || '',
            lastSync: platform.last_sync_at
          };
        }
      });
      setIntegrations(updatedIntegrations);
    } catch (error) {
      console.error('Error fetching platforms:', error);
      toast.error('Failed to load platform integrations');
    }
    setLoading(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleIntegrationSave = async (platform) => {
    setLoading(true);
    try {
      const platformData = integrations[platform];
      
      // Handle Shopify URL format
      let storeUrl = platformData.storeUrl || platformData.shopUrl || '';
      if (platform === 'shopify' && storeUrl && !storeUrl.startsWith('http')) {
        // Ensure Shopify URL is in correct format
        if (!storeUrl.includes('.myshopify.com')) {
          storeUrl = `https://${storeUrl}.myshopify.com`;
        } else {
          storeUrl = `https://${storeUrl}`;
        }
      }
      
      const payload = {
        platform_type: platform,
        store_name: platformData.storeName || platformData.shopUrl || `${platform} Store`,
        store_url: storeUrl,
        is_active: platformData.enabled,
        consumer_key: platformData.consumerKey || '',
        consumer_secret: platformData.consumerSecret || '',
        access_token: platformData.accessToken || '',
        api_key: platformData.apiKey || '',
        api_secret: platformData.apiSecret || '',
        client_id: platformData.clientId || '',
        client_secret: platformData.clientSecret || '',
        store_hash: platformData.storeHash || '',
        application_id: platformData.applicationId || '',
        location_id: platformData.locationId || ''
      };
      
      // Check if platform already exists
      const existingPlatform = platforms.find(p => p.platform_type === platform);
      
      if (existingPlatform) {
        console.log('Updating platform with ID:', existingPlatform.id, 'Payload:', payload);
        await adminAPI.updatePlatform(existingPlatform.id, payload);
        toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} integration updated`);
      } else {
        console.log('Creating new platform. Payload:', payload);
        await adminAPI.createPlatform(payload);
        toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} integration created`);
      }
      
      fetchPlatforms();
    } catch (error) {
      console.error('Integration save error:', error);
      console.error('Error response:', error.response?.data);
      const errorData = error.response?.data;
      let errorMsg = 'Unknown error';
      
      if (typeof errorData === 'string') {
        errorMsg = errorData;
      } else if (errorData?.detail) {
        errorMsg = errorData.detail;
      } else if (errorData?.error) {
        errorMsg = errorData.error;
      } else if (errorData && typeof errorData === 'object') {
        // Handle validation errors
        const validationErrors = [];
        Object.entries(errorData).forEach(([field, errors]) => {
          if (Array.isArray(errors)) {
            validationErrors.push(`${field}: ${errors.join(', ')}`);
          } else {
            validationErrors.push(`${field}: ${errors}`);
          }
        });
        errorMsg = validationErrors.join('; ');
      } else {
        errorMsg = error.message;
      }
      
      toast.error('Failed to save integration: ' + errorMsg);
    }
    setLoading(false);
  };

  const handleTestConnection = async (type, config) => {
    const platform = platforms.find(p => p.platform_type === type.toLowerCase());
    if (!platform) {
      toast.error('Platform not configured');
      return;
    }
    
    setLoading(true);
    try {
      const response = await adminAPI.testPlatform(platform.id);
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Connection test failed: ' + (error.response?.data?.error || error.message));
    }
    setLoading(false);
  };

  const handleSyncOrders = async (platform) => {
    const platformData = platforms.find(p => p.platform_type === platform.toLowerCase());
    if (!platformData) {
      toast.error('Platform not configured');
      return;
    }
    
    const platformKey = platform.toLowerCase();
    setSyncProgress(prev => ({ ...prev, [platformKey]: { status: 'running', synced: 0, total: 0 } }));
    
    try {
      await adminAPI.syncPlatform(platformData.id, { sync_type: 'orders', force: true });
      
      // Show immediate success message
      toast.success(`Started syncing orders from ${platform}`);
      
      // Poll for sync completion
      const pollProgress = setInterval(async () => {
        try {
          const logs = await adminAPI.getSyncLogs();
          const recentSync = logs.data.results?.find(log => 
            log.platform_connection === platformData.id && 
            log.sync_type === 'orders' &&
            new Date(log.started_at) > new Date(Date.now() - 60000) // Within last minute
          );
          
          if (recentSync) {
            setSyncProgress(prev => ({ 
              ...prev, 
              [platformKey]: { 
                status: recentSync.status, 
                synced: recentSync.records_synced || 0,
                total: recentSync.records_synced || 0
              } 
            }));
            
            if (recentSync.status === 'success') {
              toast.success(`${recentSync.records_synced} orders synced from ${platform}`);
              clearInterval(pollProgress);
              fetchPlatforms();
              fetchSyncLogs();
            } else if (recentSync.status === 'failed') {
              toast.error(`Order sync failed for ${platform}`);
              clearInterval(pollProgress);
            }
          }
        } catch (error) {
          console.error('Error polling sync progress:', error);
        }
      }, 3000);
      
      // Clear polling after 2 minutes
      setTimeout(() => {
        clearInterval(pollProgress);
        setSyncProgress(prev => ({ ...prev, [platformKey]: null }));
      }, 120000);
      
    } catch (error) {
      setSyncProgress(prev => ({ ...prev, [platformKey]: { status: 'failed', synced: 0, total: 0 } }));
      toast.error('Order sync failed: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleSyncCustomers = async (platform) => {
    const platformData = platforms.find(p => p.platform_type === platform.toLowerCase());
    if (!platformData) {
      toast.error('Platform not configured');
      return;
    }
    
    const platformKey = platform.toLowerCase();
    setSyncProgress(prev => ({ ...prev, [platformKey]: { status: 'running', synced: 0, total: 0 } }));
    
    try {
      await adminAPI.syncPlatform(platformData.id, { sync_type: 'customers', force: true });
      
      toast.success(`Started syncing customers from ${platform}`);
      
      const pollProgress = setInterval(async () => {
        try {
          const logs = await adminAPI.getSyncLogs();
          const recentSync = logs.data.results?.find(log => 
            log.platform_connection === platformData.id && 
            log.sync_type === 'customers' &&
            new Date(log.started_at) > new Date(Date.now() - 60000)
          );
          
          if (recentSync) {
            setSyncProgress(prev => ({ 
              ...prev, 
              [platformKey]: { 
                status: recentSync.status, 
                synced: recentSync.records_synced || 0,
                total: recentSync.records_synced || 0
              } 
            }));
            
            if (recentSync.status === 'success') {
              toast.success(`${recentSync.records_synced} customers synced from ${platform}`);
              clearInterval(pollProgress);
              fetchPlatforms();
              fetchSyncLogs();
            } else if (recentSync.status === 'failed') {
              toast.error(`Customer sync failed for ${platform}`);
              clearInterval(pollProgress);
            }
          }
        } catch (error) {
          console.error('Error polling sync progress:', error);
        }
      }, 3000);
      
      setTimeout(() => {
        clearInterval(pollProgress);
        setSyncProgress(prev => ({ ...prev, [platformKey]: null }));
      }, 120000);
      
    } catch (error) {
      setSyncProgress(prev => ({ ...prev, [platformKey]: { status: 'failed', synced: 0, total: 0 } }));
      toast.error('Customer sync failed: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleSyncProducts = async (platform) => {
    const platformData = platforms.find(p => p.platform_type === platform.toLowerCase());
    if (!platformData) {
      toast.error('Platform not configured');
      return;
    }
    
    const platformKey = platform.toLowerCase();
    setSyncProgress(prev => ({ ...prev, [platformKey]: { status: 'running', synced: 0, total: 0 } }));
    
    try {
      await adminAPI.syncPlatform(platformData.id, { sync_type: 'products', force: true });
      
      // Show immediate success message
      toast.success(`Started syncing products from ${platform}`);
      
      // Poll for sync completion
      const pollProgress = setInterval(async () => {
        try {
          const logs = await adminAPI.getSyncLogs();
          const recentSync = logs.data.results?.find(log => 
            log.platform_connection === platformData.id && 
            log.sync_type === 'products' &&
            new Date(log.started_at) > new Date(Date.now() - 60000) // Within last minute
          );
          
          if (recentSync) {
            setSyncProgress(prev => ({ 
              ...prev, 
              [platformKey]: { 
                status: recentSync.status, 
                synced: recentSync.records_synced || 0,
                total: recentSync.records_synced || 0
              } 
            }));
            
            if (recentSync.status === 'success') {
              toast.success(`${recentSync.records_synced} products synced from ${platform}`);
              clearInterval(pollProgress);
              fetchPlatforms();
              fetchSyncLogs();
            } else if (recentSync.status === 'failed') {
              toast.error(`Sync failed for ${platform}`);
              clearInterval(pollProgress);
            }
          }
        } catch (error) {
          console.error('Error polling sync progress:', error);
        }
      }, 3000);
      
      // Clear polling after 2 minutes
      setTimeout(() => {
        clearInterval(pollProgress);
        setSyncProgress(prev => ({ ...prev, [platformKey]: null }));
      }, 120000);
      
    } catch (error) {
      setSyncProgress(prev => ({ ...prev, [platformKey]: { status: 'failed', synced: 0, total: 0 } }));
      toast.error('Sync failed: ' + (error.response?.data?.error || error.message));
    }
  };

  const platformDocs = {
    woocommerce: {
      title: 'WooCommerce Setup Guide',
      steps: [
        '1. Go to your WordPress admin dashboard',
        '2. Navigate to WooCommerce → Settings → Advanced → REST API',
        '3. Click "Add Key" to create new API credentials',
        '4. Set Description (e.g., "E-commerce Platform Integration")',
        '5. Set User to an Administrator account',
        '6. Set Permissions to "Read/Write"',
        '7. Click "Generate API Key"',
        '8. Copy the Consumer Key and Consumer Secret',
        '9. Your Store URL should be: https://yourstore.com'
      ],
      fields: {
        'Store URL': 'Your WooCommerce store URL (e.g., https://yourstore.com)',
        'Consumer Key': 'API Consumer Key from WooCommerce REST API settings',
        'Consumer Secret': 'API Consumer Secret from WooCommerce REST API settings'
      }
    },
    shopify: {
      title: 'Shopify Setup Guide',
      steps: [
        '1. Go to your Shopify admin dashboard',
        '2. Navigate to Apps → Manage private apps',
        '3. Click "Create a new private app"',
        '4. Enter App name (e.g., "E-commerce Platform")',
        '5. In Admin API section, enable required permissions:',
        '   - Products: Read and write',
        '   - Orders: Read and write',
        '   - Customers: Read and write',
        '6. Click "Save"',
        '7. Copy the API key and Password (Access Token)',
        '8. Your Shop URL should be: yourstore.myshopify.com'
      ],
      fields: {
        'Shop URL': 'Your Shopify store URL (e.g., yourstore.myshopify.com)',
        'Access Token': 'Private app password/access token from Shopify admin'
      }
    },
    bigcommerce: {
      title: 'BigCommerce Setup Guide',
      steps: [
        '1. Go to your BigCommerce admin dashboard',
        '2. Navigate to Advanced Settings → API Accounts',
        '3. Click "Create API Account"',
        '4. Enter Name (e.g., "E-commerce Platform")',
        '5. Set OAuth Scopes:',
        '   - Products: modify',
        '   - Orders: modify',
        '   - Customers: modify',
        '6. Click "Save"',
        '7. Copy Client ID, Client Secret, and Access Token',
        '8. Store Hash is in your store URL: store-{hash}.mybigcommerce.com'
      ],
      fields: {
        'Store URL': 'Your BigCommerce store URL',
        'Store Hash': 'Store hash from your BigCommerce URL',
        'Client ID': 'API Client ID from BigCommerce API settings',
        'Client Secret': 'API Client Secret from BigCommerce API settings',
        'Access Token': 'API Access Token from BigCommerce API settings'
      }
    },
    squarespace: {
      title: 'Squarespace Setup Guide',
      steps: [
        '1. Go to your Squarespace admin dashboard',
        '2. Navigate to Settings → Advanced → API Keys',
        '3. Click "Generate Key"',
        '4. Enter Key Name (e.g., "E-commerce Platform")',
        '5. Select required permissions for commerce',
        '6. Click "Generate"',
        '7. Copy the generated API Key',
        '8. Your Store URL is your Squarespace site URL'
      ],
      fields: {
        'Store URL': 'Your Squarespace site URL',
        'API Key': 'Generated API key from Squarespace settings'
      }
    },
    square: {
      title: 'Square Online Setup Guide',
      steps: [
        '1. Go to Square Developer Dashboard (developer.squareup.com)',
        '2. Create a new application or select existing one',
        '3. Go to OAuth tab and note Application ID',
        '4. Generate Access Token in Production or Sandbox',
        '5. Get Location ID from Locations API or Square Dashboard',
        '6. Copy Application ID, Access Token, and Location ID'
      ],
      fields: {
        'Application ID': 'Square application ID from developer dashboard',
        'Access Token': 'Square access token for API access',
        'Location ID': 'Square location ID for your business location'
      }
    },
    ecwid: {
      title: 'Ecwid Setup Guide',
      steps: [
        '1. Go to your Ecwid admin dashboard',
        '2. Navigate to Apps → My Apps',
        '3. Click "Create App" or use existing app',
        '4. Go to API tab and generate API token',
        '5. Set required permissions for products and orders',
        '6. Copy Store ID and API Key',
        '7. Store ID is visible in your Ecwid admin URL'
      ],
      fields: {
        'Store URL': 'Ecwid API base URL (https://app.ecwid.com/api/v3/)',
        'Store ID': 'Your Ecwid store ID (visible in admin URL)',
        'API Key': 'Generated API token from Ecwid app settings'
      }
    },
    wix: {
      title: 'Wix Setup Guide',
      steps: [
        '1. Go to Wix Developers (dev.wix.com)',
        '2. Create a new app or select existing one',
        '3. Configure OAuth settings and permissions',
        '4. Get Site ID from your Wix site dashboard',
        '5. Generate API Key with required permissions',
        '6. Copy Site ID and API Key'
      ],
      fields: {
        'Store URL': 'Your Wix site URL',
        'Site ID': 'Wix site ID from your site dashboard',
        'API Key': 'Generated API key from Wix Developers'
      }
    },
    magento: {
      title: 'Magento Setup Guide',
      steps: [
        '1. Go to your Magento admin dashboard',
        '2. Navigate to System → Extensions → Integrations',
        '3. Click "Add New Integration"',
        '4. Enter Name (e.g., "E-commerce Platform")',
        '5. Set API permissions for products, orders, customers',
        '6. Click "Save and Activate"',
        '7. Copy Consumer Key, Consumer Secret, and Access Token',
        '8. Your Store URL is your Magento store base URL'
      ],
      fields: {
        'Store URL': 'Your Magento store base URL',
        'Consumer Key': 'Integration consumer key from Magento admin',
        'Consumer Secret': 'Integration consumer secret from Magento admin',
        'Access Token': 'Integration access token from Magento admin'
      }
    }
  };

  const HelpModal = ({ platform, onClose }) => {
    const doc = platformDocs[platform];
    if (!doc) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{doc.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <Close className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Setup Steps</h3>
              <ol className="space-y-2">
                {doc.steps.map((step, index) => (
                  <li key={index} className="text-sm text-gray-700 leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Field Descriptions</h3>
              <div className="space-y-3">
                {Object.entries(doc.fields).map(([field, description]) => (
                  <div key={field} className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium text-gray-900 text-sm">{field}</div>
                    <div className="text-sm text-gray-600 mt-1">{description}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div className="text-sm text-blue-800">
                  <strong>Important:</strong> Make sure to test the connection after entering your credentials. 
                  Keep your API keys secure and never share them publicly.
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderIntegrations = () => {
    const getPlatformStatus = (platformType) => {
      const platform = platforms.find(p => p.platform_type === platformType);
      const recentSync = syncLogs.find(log => 
        log.platform_connection && 
        platforms.find(p => p.id === log.platform_connection)?.platform_type === platformType
      );
      
      return {
        connected: platform?.is_active || false,
        lastSync: platform?.last_sync_at,
        recentSyncStatus: recentSync?.status,
        syncInProgress: recentSync?.status === 'running'
      };
    };

    return (
    <div className="space-y-6">
      {/* Real-time Platform Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <h3 className="text-sm font-medium text-blue-900">Platform Integration Status</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {['woocommerce', 'shopify', 'bigcommerce', 'squarespace', 'square', 'ecwid', 'wix', 'magento'].map(platform => {
            const status = getPlatformStatus(platform);
            return (
              <div key={platform} className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  status.connected ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <span className="capitalize text-gray-700">{platform}</span>
                {status.syncInProgress && (
                  <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* WooCommerce */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Store className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">WooCommerce</h3>
                <p className="text-sm text-gray-600">Connect your WooCommerce store</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setHelpModal({ open: true, platform: 'woocommerce' })}
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="Setup Help"
              >
                <Help className="h-5 w-5" />
              </button>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                getPlatformStatus('woocommerce').connected
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {getPlatformStatus('woocommerce').connected ? 'Connected' : 'Disconnected'}
              </span>
              {getPlatformStatus('woocommerce').lastSync && (
                <span className="text-xs text-gray-500">
                  Last sync: {new Date(getPlatformStatus('woocommerce').lastSync).toLocaleString()}
                </span>
              )}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={integrations.woocommerce.enabled}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    woocommerce: { ...prev.woocommerce, enabled: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {integrations.woocommerce.enabled && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store URL</label>
                <input
                  type="url"
                  value={integrations.woocommerce.storeUrl}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    woocommerce: { ...prev.woocommerce, storeUrl: e.target.value }
                  }))}
                  placeholder="https://yourstore.com"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consumer Key</label>
                <input
                  type="text"
                  value={integrations.woocommerce.consumerKey}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    woocommerce: { ...prev.woocommerce, consumerKey: e.target.value }
                  }))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consumer Secret</label>
                <div className="relative">
                  <input
                    type={showPasswords.wooSecret ? "text" : "password"}
                    value={integrations.woocommerce.consumerSecret}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      woocommerce: { ...prev.woocommerce, consumerSecret: e.target.value }
                    }))}
                    className="w-full border rounded-lg px-3 py-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('wooSecret')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.wooSecret ? <VisibilityOff className="h-4 w-4" /> : <Visibility className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleIntegrationSave('woocommerce')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button
                onClick={() => handleTestConnection('WooCommerce', integrations.woocommerce)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Science className="h-4 w-4" />
                <span>Test</span>
              </button>
              <button
                onClick={() => handleSyncProducts('WooCommerce')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                disabled={syncProgress.woocommerce?.status === 'running'}
              >
                <Sync className="h-4 w-4" />
                <span>{syncProgress.woocommerce?.status === 'running' ? 'Syncing...' : 'Sync Products'}</span>
              </button>
              <button
                onClick={() => handleSyncOrders('WooCommerce')}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                disabled={syncProgress.woocommerce?.status === 'running'}
              >
                <Sync className="h-4 w-4" />
                <span>{syncProgress.woocommerce?.status === 'running' ? 'Syncing...' : 'Sync Orders'}</span>
              </button>
              <button
                onClick={() => handleSyncCustomers('WooCommerce')}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                disabled={syncProgress.woocommerce?.status === 'running'}
              >
                <Sync className="h-4 w-4" />
                <span>{syncProgress.woocommerce?.status === 'running' ? 'Syncing...' : 'Sync Customers'}</span>
              </button>
            </div>
            
            {/* Sync Progress */}
            {syncProgress.woocommerce && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Sync Progress</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    syncProgress.woocommerce.status === 'running' ? 'bg-blue-100 text-blue-800' :
                    syncProgress.woocommerce.status === 'success' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {syncProgress.woocommerce.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {syncProgress.woocommerce.synced} products synced
                  {syncProgress.woocommerce.total > 0 && ` of ${syncProgress.woocommerce.total}`}
                </div>
                {syncProgress.woocommerce.status === 'running' && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: syncProgress.woocommerce.total > 0 
                          ? `${(syncProgress.woocommerce.synced / syncProgress.woocommerce.total) * 100}%` 
                          : '0%' 
                      }}
                    ></div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Shopify */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Store className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Shopify</h3>
                <p className="text-sm text-gray-600">Connect your Shopify store</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setHelpModal({ open: true, platform: 'shopify' })}
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="Setup Help"
              >
                <Help className="h-5 w-5" />
              </button>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                getPlatformStatus('shopify').connected
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {getPlatformStatus('shopify').connected ? 'Connected' : 'Disconnected'}
              </span>
              {getPlatformStatus('shopify').lastSync && (
                <span className="text-xs text-gray-500">
                  Last sync: {new Date(getPlatformStatus('shopify').lastSync).toLocaleString()}
                </span>
              )}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={integrations.shopify.enabled}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    shopify: { ...prev.shopify, enabled: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {integrations.shopify.enabled && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop URL</label>
                <input
                  type="text"
                  value={integrations.shopify.shopUrl}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    shopify: { ...prev.shopify, shopUrl: e.target.value }
                  }))}
                  placeholder="yourstore.myshopify.com"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                <div className="relative">
                  <input
                    type={showPasswords.shopifyToken ? "text" : "password"}
                    value={integrations.shopify.accessToken}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      shopify: { ...prev.shopify, accessToken: e.target.value }
                    }))}
                    className="w-full border rounded-lg px-3 py-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('shopifyToken')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.shopifyToken ? <VisibilityOff className="h-4 w-4" /> : <Visibility className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleIntegrationSave('shopify')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button
                onClick={() => handleTestConnection('Shopify', integrations.shopify)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Science className="h-4 w-4" />
                <span>Test</span>
              </button>
              <button
                onClick={() => handleSyncProducts('Shopify')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                disabled={syncProgress.shopify?.status === 'running'}
              >
                <Sync className="h-4 w-4" />
                <span>{syncProgress.shopify?.status === 'running' ? 'Syncing...' : 'Sync Products'}</span>
              </button>
              <button
                onClick={() => handleSyncOrders('Shopify')}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                disabled={syncProgress.shopify?.status === 'running'}
              >
                <Sync className="h-4 w-4" />
                <span>{syncProgress.shopify?.status === 'running' ? 'Syncing...' : 'Sync Orders'}</span>
              </button>
              <button
                onClick={() => handleSyncCustomers('Shopify')}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                disabled={syncProgress.shopify?.status === 'running'}
              >
                <Sync className="h-4 w-4" />
                <span>{syncProgress.shopify?.status === 'running' ? 'Syncing...' : 'Sync Customers'}</span>
              </button>
            </div>
            
            {/* Sync Progress */}
            {syncProgress.shopify && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Sync Progress</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    syncProgress.shopify.status === 'running' ? 'bg-blue-100 text-blue-800' :
                    syncProgress.shopify.status === 'success' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {syncProgress.shopify.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {syncProgress.shopify.synced} products synced
                  {syncProgress.shopify.total > 0 && ` of ${syncProgress.shopify.total}`}
                </div>
                {syncProgress.shopify.status === 'running' && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: syncProgress.shopify.total > 0 
                          ? `${(syncProgress.shopify.synced / syncProgress.shopify.total) * 100}%` 
                          : '0%' 
                      }}
                    ></div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Amazon */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Store className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">BigCommerce</h3>
                <p className="text-sm text-gray-600">Connect your BigCommerce store</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setHelpModal({ open: true, platform: 'bigcommerce' })}
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="Setup Help"
              >
                <Help className="h-5 w-5" />
              </button>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                getPlatformStatus('bigcommerce').connected
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {getPlatformStatus('bigcommerce').connected ? 'Connected' : 'Disconnected'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={integrations.bigcommerce.enabled}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    bigcommerce: { ...prev.bigcommerce, enabled: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {integrations.bigcommerce.enabled && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store URL</label>
                <input
                  type="url"
                  value={integrations.bigcommerce.storeUrl}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    bigcommerce: { ...prev.bigcommerce, storeUrl: e.target.value }
                  }))}
                  placeholder="https://store-hash.mybigcommerce.com"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Hash</label>
                <input
                  type="text"
                  value={integrations.bigcommerce.storeHash}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    bigcommerce: { ...prev.bigcommerce, storeHash: e.target.value }
                  }))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
                <input
                  type="text"
                  value={integrations.bigcommerce.clientId}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    bigcommerce: { ...prev.bigcommerce, clientId: e.target.value }
                  }))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
                <div className="relative">
                  <input
                    type={showPasswords.bigSecret ? "text" : "password"}
                    value={integrations.bigcommerce.clientSecret}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      bigcommerce: { ...prev.bigcommerce, clientSecret: e.target.value }
                    }))}
                    className="w-full border rounded-lg px-3 py-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('bigSecret')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.bigSecret ? <VisibilityOff className="h-4 w-4" /> : <Visibility className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                <div className="relative">
                  <input
                    type={showPasswords.bigToken ? "text" : "password"}
                    value={integrations.bigcommerce.accessToken}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      bigcommerce: { ...prev.bigcommerce, accessToken: e.target.value }
                    }))}
                    className="w-full border rounded-lg px-3 py-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('bigToken')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.bigToken ? <VisibilityOff className="h-4 w-4" /> : <Visibility className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleIntegrationSave('bigcommerce')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button
                onClick={() => handleTestConnection('BigCommerce', integrations.bigcommerce)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Science className="h-4 w-4" />
                <span>Test</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Squarespace */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Store className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Squarespace</h3>
                <p className="text-sm text-gray-600">Connect your Squarespace store</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setHelpModal({ open: true, platform: 'squarespace' })}
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="Setup Help"
              >
                <Help className="h-5 w-5" />
              </button>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                getPlatformStatus('squarespace').connected
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {getPlatformStatus('squarespace').connected ? 'Connected' : 'Disconnected'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={integrations.squarespace.enabled}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    squarespace: { ...prev.squarespace, enabled: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {integrations.squarespace.enabled && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store URL</label>
                <input
                  type="url"
                  value={integrations.squarespace.storeUrl}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    squarespace: { ...prev.squarespace, storeUrl: e.target.value }
                  }))}
                  placeholder="https://yourstore.squarespace.com"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <div className="relative">
                  <input
                    type={showPasswords.squareKey ? "text" : "password"}
                    value={integrations.squarespace.apiKey}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      squarespace: { ...prev.squarespace, apiKey: e.target.value }
                    }))}
                    className="w-full border rounded-lg px-3 py-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('squareKey')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.squareKey ? <VisibilityOff className="h-4 w-4" /> : <Visibility className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleIntegrationSave('squarespace')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button
                onClick={() => handleTestConnection('Squarespace', integrations.squarespace)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Science className="h-4 w-4" />
                <span>Test</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Square */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Store className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Square Online</h3>
                <p className="text-sm text-gray-600">Connect your Square Online store</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setHelpModal({ open: true, platform: 'square' })}
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="Setup Help"
              >
                <Help className="h-5 w-5" />
              </button>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                getPlatformStatus('square').connected
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {getPlatformStatus('square').connected ? 'Connected' : 'Disconnected'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={integrations.square.enabled}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    square: { ...prev.square, enabled: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {integrations.square.enabled && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application ID</label>
                <input
                  type="text"
                  value={integrations.square.applicationId}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    square: { ...prev.square, applicationId: e.target.value }
                  }))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                <div className="relative">
                  <input
                    type={showPasswords.squareToken ? "text" : "password"}
                    value={integrations.square.accessToken}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      square: { ...prev.square, accessToken: e.target.value }
                    }))}
                    className="w-full border rounded-lg px-3 py-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('squareToken')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.squareToken ? <VisibilityOff className="h-4 w-4" /> : <Visibility className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location ID</label>
                <input
                  type="text"
                  value={integrations.square.locationId}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    square: { ...prev.square, locationId: e.target.value }
                  }))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleIntegrationSave('square')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button
                onClick={() => handleTestConnection('Square', integrations.square)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Science className="h-4 w-4" />
                <span>Test</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ecwid */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Store className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ecwid</h3>
                <p className="text-sm text-gray-600">Connect your Ecwid store</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setHelpModal({ open: true, platform: 'ecwid' })}
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="Setup Help"
              >
                <Help className="h-5 w-5" />
              </button>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                getPlatformStatus('ecwid').connected
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {getPlatformStatus('ecwid').connected ? 'Connected' : 'Disconnected'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={integrations.ecwid.enabled}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    ecwid: { ...prev.ecwid, enabled: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {integrations.ecwid.enabled && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store URL</label>
                <input
                  type="url"
                  value={integrations.ecwid.storeUrl}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    ecwid: { ...prev.ecwid, storeUrl: e.target.value }
                  }))}
                  placeholder="https://app.ecwid.com/api/v3/"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store ID</label>
                <input
                  type="text"
                  value={integrations.ecwid.storeId}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    ecwid: { ...prev.ecwid, storeId: e.target.value }
                  }))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <div className="relative">
                  <input
                    type={showPasswords.ecwidKey ? "text" : "password"}
                    value={integrations.ecwid.apiKey}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      ecwid: { ...prev.ecwid, apiKey: e.target.value }
                    }))}
                    className="w-full border rounded-lg px-3 py-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('ecwidKey')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.ecwidKey ? <VisibilityOff className="h-4 w-4" /> : <Visibility className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleIntegrationSave('ecwid')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button
                onClick={() => handleTestConnection('Ecwid', integrations.ecwid)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Science className="h-4 w-4" />
                <span>Test</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Wix */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Store className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Wix</h3>
                <p className="text-sm text-gray-600">Connect your Wix store</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setHelpModal({ open: true, platform: 'wix' })}
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="Setup Help"
              >
                <Help className="h-5 w-5" />
              </button>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                getPlatformStatus('wix').connected
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {getPlatformStatus('wix').connected ? 'Connected' : 'Disconnected'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={integrations.wix.enabled}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    wix: { ...prev.wix, enabled: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {integrations.wix.enabled && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store URL</label>
                <input
                  type="url"
                  value={integrations.wix.storeUrl}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    wix: { ...prev.wix, storeUrl: e.target.value }
                  }))}
                  placeholder="https://yourstore.wixsite.com"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site ID</label>
                <input
                  type="text"
                  value={integrations.wix.siteId}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    wix: { ...prev.wix, siteId: e.target.value }
                  }))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <div className="relative">
                  <input
                    type={showPasswords.wixKey ? "text" : "password"}
                    value={integrations.wix.apiKey}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      wix: { ...prev.wix, apiKey: e.target.value }
                    }))}
                    className="w-full border rounded-lg px-3 py-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('wixKey')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.wixKey ? <VisibilityOff className="h-4 w-4" /> : <Visibility className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleIntegrationSave('wix')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button
                onClick={() => handleTestConnection('Wix', integrations.wix)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Science className="h-4 w-4" />
                <span>Test</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Magento */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Store className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Magento</h3>
                <p className="text-sm text-gray-600">Connect your Magento store</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setHelpModal({ open: true, platform: 'magento' })}
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="Setup Help"
              >
                <Help className="h-5 w-5" />
              </button>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                getPlatformStatus('magento').connected
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {getPlatformStatus('magento').connected ? 'Connected' : 'Disconnected'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={integrations.magento.enabled}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    magento: { ...prev.magento, enabled: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {integrations.magento.enabled && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store URL</label>
                <input
                  type="url"
                  value={integrations.magento.storeUrl}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    magento: { ...prev.magento, storeUrl: e.target.value }
                  }))}
                  placeholder="https://yourstore.com"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consumer Key</label>
                <input
                  type="text"
                  value={integrations.magento.consumerKey}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    magento: { ...prev.magento, consumerKey: e.target.value }
                  }))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consumer Secret</label>
                <div className="relative">
                  <input
                    type={showPasswords.magentoSecret ? "text" : "password"}
                    value={integrations.magento.consumerSecret}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      magento: { ...prev.magento, consumerSecret: e.target.value }
                    }))}
                    className="w-full border rounded-lg px-3 py-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('magentoSecret')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.magentoSecret ? <VisibilityOff className="h-4 w-4" /> : <Visibility className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                <div className="relative">
                  <input
                    type={showPasswords.magentoToken ? "text" : "password"}
                    value={integrations.magento.accessToken}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      magento: { ...prev.magento, accessToken: e.target.value }
                    }))}
                    className="w-full border rounded-lg px-3 py-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('magentoToken')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.magentoToken ? <VisibilityOff className="h-4 w-4" /> : <Visibility className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleIntegrationSave('magento')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button
                onClick={() => handleTestConnection('Magento', integrations.magento)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Science className="h-4 w-4" />
                <span>Test</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Sync Logs */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Sync Activity</h3>
          <p className="text-sm text-gray-600">Latest synchronization logs from all platforms</p>
        </div>
        <div className="p-6">
          {syncLogs.length > 0 ? (
            <div className="space-y-3">
              {syncLogs.slice(0, 5).map((log, index) => {
                const platform = platforms.find(p => p.id === log.platform_connection);
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        log.status === 'success' ? 'bg-green-500' :
                        log.status === 'failed' ? 'bg-red-500' :
                        log.status === 'running' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <div className="text-sm font-medium">
                          {platform?.store_name || 'Unknown Platform'} - {log.sync_type}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(log.started_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        log.status === 'success' ? 'bg-green-100 text-green-800' :
                        log.status === 'failed' ? 'bg-red-100 text-red-800' :
                        log.status === 'running' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {log.status.toUpperCase()}
                      </div>
                      {log.records_synced > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {log.records_synced} records
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Sync className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No sync activity yet</p>
              <p className="text-sm">Sync logs will appear here after platform synchronization</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  };

  const renderEmailConfig = () => (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Email className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Email Configuration</h3>
              <p className="text-sm text-gray-600">Configure SMTP settings for email notifications</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={emailConfig.enabled}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, enabled: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      
      {emailConfig.enabled && (
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
              <input
                type="text"
                value={emailConfig.smtpHost}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, smtpHost: e.target.value }))}
                placeholder="smtp.gmail.com"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
              <input
                type="number"
                value={emailConfig.smtpPort}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, smtpPort: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="email"
                value={emailConfig.smtpUser}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, smtpUser: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPasswords.emailPass ? "text" : "password"}
                  value={emailConfig.smtpPassword}
                  onChange={(e) => setEmailConfig(prev => ({ ...prev, smtpPassword: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('emailPass')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPasswords.emailPass ? <VisibilityOff className="h-4 w-4" /> : <Visibility className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
              <input
                type="email"
                value={emailConfig.fromEmail}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, fromEmail: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
              <input
                type="text"
                value={emailConfig.fromName}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, fromName: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                toast.success('Email configuration saved');
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={() => handleTestConnection('Email', emailConfig)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Science className="h-4 w-4" />
              <span>Send Test Email</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderSMSConfig = () => (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sms className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">SMS Configuration</h3>
              <p className="text-sm text-gray-600">Configure SMS provider for notifications</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={smsConfig.enabled}
              onChange={(e) => setSmsConfig(prev => ({ ...prev, enabled: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      
      {smsConfig.enabled && (
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMS Provider</label>
            <select
              value={smsConfig.provider}
              onChange={(e) => setSmsConfig(prev => ({ ...prev, provider: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="twilio">Twilio</option>
              <option value="msg91">MSG91</option>
            </select>
          </div>

          {smsConfig.provider === 'twilio' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account SID</label>
                <input
                  type="text"
                  value={smsConfig.twilioSid}
                  onChange={(e) => setSmsConfig(prev => ({ ...prev, twilioSid: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auth Token</label>
                <div className="relative">
                  <input
                    type={showPasswords.twilioToken ? "text" : "password"}
                    value={smsConfig.twilioToken}
                    onChange={(e) => setSmsConfig(prev => ({ ...prev, twilioToken: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('twilioToken')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.twilioToken ? <VisibilityOff className="h-4 w-4" /> : <Visibility className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={smsConfig.twilioPhone}
                  onChange={(e) => setSmsConfig(prev => ({ ...prev, twilioPhone: e.target.value }))}
                  placeholder="+1234567890"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                toast.success('SMS configuration saved');
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={() => handleTestConnection('SMS', smsConfig)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Science className="h-4 w-4" />
              <span>Send Test SMS</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderWhatsAppConfig = () => (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <WhatsApp className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">WhatsApp Cloud API</h3>
              <p className="text-sm text-gray-600">Configure WhatsApp Business API</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={whatsappConfig.enabled}
              onChange={(e) => setWhatsappConfig(prev => ({ ...prev, enabled: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      
      {whatsappConfig.enabled && (
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
              <div className="relative">
                <input
                  type={showPasswords.whatsappToken ? "text" : "password"}
                  value={whatsappConfig.accessToken}
                  onChange={(e) => setWhatsappConfig(prev => ({ ...prev, accessToken: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('whatsappToken')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPasswords.whatsappToken ? <VisibilityOff className="h-4 w-4" /> : <Visibility className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number ID</label>
              <input
                type="text"
                value={whatsappConfig.phoneNumberId}
                onChange={(e) => setWhatsappConfig(prev => ({ ...prev, phoneNumberId: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Account ID</label>
              <input
                type="text"
                value={whatsappConfig.businessAccountId}
                onChange={(e) => setWhatsappConfig(prev => ({ ...prev, businessAccountId: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Token</label>
              <input
                type="text"
                value={whatsappConfig.webhookToken}
                onChange={(e) => setWhatsappConfig(prev => ({ ...prev, webhookToken: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                toast.success('WhatsApp configuration saved');
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={() => handleTestConnection('WhatsApp', whatsappConfig)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Science className="h-4 w-4" />
              <span>Send Test Message</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderThemeConfig = () => (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <Palette className="h-6 w-6 text-purple-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Theme Configuration</h3>
            <p className="text-sm text-gray-600">Customize dashboard colors and appearance</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={themeConfig.primaryColor}
                onChange={(e) => setThemeConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="w-12 h-10 border rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={themeConfig.primaryColor}
                onChange={(e) => setThemeConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={themeConfig.secondaryColor}
                onChange={(e) => setThemeConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="w-12 h-10 border rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={themeConfig.secondaryColor}
                onChange={(e) => setThemeConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={themeConfig.accentColor}
                onChange={(e) => setThemeConfig(prev => ({ ...prev, accentColor: e.target.value }))}
                className="w-12 h-10 border rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={themeConfig.accentColor}
                onChange={(e) => setThemeConfig(prev => ({ ...prev, accentColor: e.target.value }))}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme Mode</label>
            <select
              value={themeConfig.mode}
              onChange={(e) => setThemeConfig(prev => ({ ...prev, mode: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sidebar Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={themeConfig.sidebarColor}
                onChange={(e) => setThemeConfig(prev => ({ ...prev, sidebarColor: e.target.value }))}
                className="w-12 h-10 border rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={themeConfig.sidebarColor}
                onChange={(e) => setThemeConfig(prev => ({ ...prev, sidebarColor: e.target.value }))}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Theme Preview</h4>
          <div className="flex items-center space-x-4">
            <div 
              className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
              style={{ backgroundColor: themeConfig.primaryColor }}
            ></div>
            <div 
              className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
              style={{ backgroundColor: themeConfig.secondaryColor }}
            ></div>
            <div 
              className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
              style={{ backgroundColor: themeConfig.accentColor }}
            ></div>
            <div 
              className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
              style={{ backgroundColor: themeConfig.sidebarColor }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              toast.success('Theme configuration saved');
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            <span>Save Theme</span>
          </button>
          <button
            onClick={() => {
              setThemeConfig({
                primaryColor: '#3B82F6',
                secondaryColor: '#10B981',
                accentColor: '#F59E0B',
                backgroundColor: '#F9FAFB',
                sidebarColor: '#FFFFFF',
                textColor: '#111827',
                mode: 'light'
              });
              toast.info('Theme reset to default');
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <span>Reset to Default</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure platform integrations and system settings</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'integrations', name: 'Platform Integrations', icon: Store },
              { id: 'email', name: 'Email Config', icon: Email },
              { id: 'sms', name: 'SMS Config', icon: Sms },
              { id: 'whatsapp', name: 'WhatsApp Config', icon: WhatsApp },
              { id: 'subscription', name: 'Subscription', icon: CreditCard },
              { id: 'theme', name: 'Theme Settings', icon: Palette },
              { id: 'health', name: 'System Health', icon: MonitorHeart },
              { id: 'logs', name: 'System Logs', icon: BugReport }
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
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'integrations' && renderIntegrations()}
        {activeTab === 'email' && renderEmailConfig()}
        {activeTab === 'sms' && renderSMSConfig()}
        {activeTab === 'whatsapp' && renderWhatsAppConfig()}
        {activeTab === 'subscription' && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-6">
                <h4 className="text-xl font-bold mb-2">Basic</h4>
                <div className="text-3xl font-bold mb-4">₹999<span className="text-sm font-normal">/month</span></div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />100 orders/month</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />2 integrations</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Email support</li>
                </ul>
                <button className="w-full py-2 bg-gray-600 text-white rounded-lg">Select Plan</button>
              </div>
              <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50">
                <div className="text-center mb-2"><span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">Most Popular</span></div>
                <h4 className="text-xl font-bold mb-2">Professional</h4>
                <div className="text-3xl font-bold mb-4">₹2999<span className="text-sm font-normal">/month</span></div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />1000 orders/month</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Unlimited integrations</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Priority support</li>
                </ul>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg">Current Plan</button>
              </div>
              <div className="border rounded-lg p-6">
                <h4 className="text-xl font-bold mb-2">Enterprise</h4>
                <div className="text-3xl font-bold mb-4">₹9999<span className="text-sm font-normal">/month</span></div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Unlimited orders</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />All integrations</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />24/7 support</li>
                </ul>
                <button className="w-full py-2 bg-gray-600 text-white rounded-lg">Upgrade</button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'theme' && renderThemeConfig()}
        {activeTab === 'health' && <SystemHealth />}
        {activeTab === 'logs' && <SystemLogs />}
      </div>

      {/* Help Modal */}
      {helpModal.open && (
        <HelpModal
          platform={helpModal.platform}
          onClose={() => setHelpModal({ open: false, platform: '' })}
        />
      )}
    </div>
  );
};

export default Settings;