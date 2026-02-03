import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import IntegrationModal from '../components/IntegrationModal';

const Integrations = () => {
  const [activeTab, setActiveTab] = useState('platforms');
  const [platforms, setPlatforms] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (activeTab === 'platforms') {
      fetchPlatforms();
    } else if (activeTab === 'couriers') {
      fetchCouriers();
    }
  }, [activeTab]);

  const fetchPlatforms = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getPlatforms();
      setPlatforms(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching platforms:', error);
    }
    setLoading(false);
  };

  const fetchCouriers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getCouriers();
      setCouriers(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching couriers:', error);
    }
    setLoading(false);
  };

  const handleSync = async (platformId) => {
    try {
      await adminAPI.syncPlatform(platformId, { sync_type: 'orders' });
      alert('Sync initiated successfully');
      fetchPlatforms();
    } catch (error) {
      alert('Sync failed: ' + error.response?.data?.error);
    }
  };

  const handleTest = async (platformId) => {
    try {
      const response = await adminAPI.testPlatform(platformId);
      alert(response.data.message);
    } catch (error) {
      alert('Test failed: ' + error.response?.data?.error);
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSave = (savedItem) => {
    if (modalType === 'platform') {
      fetchPlatforms();
    } else {
      fetchCouriers();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-600">Manage platform connections and courier services</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['platforms', 'couriers', 'shipments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Platform Connections */}
      {activeTab === 'platforms' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Platform Connections</h2>
            <button
              onClick={() => openModal('platform')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Platform
            </button>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Store Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Sync</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {platforms.map((platform) => (
                  <tr key={platform.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize">{platform.platform_type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{platform.store_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        platform.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {platform.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {platform.last_sync_at ? new Date(platform.last_sync_at).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleTest(platform.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Test
                      </button>
                      <button
                        onClick={() => handleSync(platform.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Sync
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Courier Services */}
      {activeTab === 'couriers' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Courier Services</h2>
            <button
              onClick={() => openModal('courier')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Courier
            </button>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">COD</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {couriers.map((courier) => (
                  <tr key={courier.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{courier.display_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{courier.courier_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        courier.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {courier.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {courier.is_cod_available ? '✓' : '✗'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{courier.success_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Shipments */}
      {activeTab === 'shipments' && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Shipments</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500">Shipment tracking will be displayed here</p>
          </div>
        </div>
      )}

      {/* Modal */}
      <IntegrationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
        item={selectedItem}
        onSave={handleSave}
      />

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;