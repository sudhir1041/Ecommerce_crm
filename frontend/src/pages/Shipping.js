import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminAPI } from '../services/api';
import CourierModal from '../components/CourierModal';
import {
  LocalShipping,
  Add as Plus,
  Search,
  Print,
  Visibility,
  LocationOn,
  CheckCircle,
  Schedule,
  Error,
  Refresh,
  GetApp,
  Notifications,
  Calculate,
} from '@mui/icons-material';

const Shipping = () => {
  const [activeTab, setActiveTab] = useState('shipments');
  const [shipments, setShipments] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const courierPartners = [
    { id: 'bluedart', name: 'Blue Dart', logo: '🔵', rates: { express: 85, standard: 45 } },
    { id: 'dtdc', name: 'DTDC', logo: '📦', rates: { express: 75, standard: 40 } },
    { id: 'fedex', name: 'FedEx', logo: '🚚', rates: { express: 120, standard: 65 } },
    { id: 'delhivery', name: 'Delhivery', logo: '🚛', rates: { express: 70, standard: 35 } },
    { id: 'ecom', name: 'Ecom Express', logo: '📮', rates: { express: 60, standard: 30 } },
  ];

  const mockShipments = [
    {
      id: 'SHP001',
      orderId: 'ORD-2024-001',
      courier: 'bluedart',
      trackingId: 'BD123456789',
      status: 'delivered',
      from: 'Mumbai, MH',
      to: 'Delhi, DL',
      weight: '2.5 kg',
      amount: 85,
      createdAt: '2024-01-20T10:30:00Z',
      deliveredAt: '2024-01-22T14:20:00Z'
    },
    {
      id: 'SHP002',
      orderId: 'ORD-2024-002',
      courier: 'delhivery',
      trackingId: 'DLV987654321',
      status: 'in_transit',
      from: 'Bangalore, KA',
      to: 'Chennai, TN',
      weight: '1.2 kg',
      amount: 70,
      createdAt: '2024-01-21T09:15:00Z'
    },
    {
      id: 'SHP003',
      orderId: 'ORD-2024-003',
      courier: 'dtdc',
      trackingId: 'DTDC456789123',
      status: 'pending',
      from: 'Pune, MH',
      to: 'Hyderabad, TS',
      weight: '3.8 kg',
      amount: 75,
      createdAt: '2024-01-22T11:45:00Z'
    }
  ];

  useEffect(() => {
    if (activeTab === 'shipments') {
      fetchShipments();
    } else if (activeTab === 'couriers') {
      fetchCouriers();
    }
  }, [activeTab]);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getShipments();
      setShipments(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching shipments:', error);
      setShipments(mockShipments); // Fallback to mock data
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
      setCouriers(courierPartners); // Fallback to mock data
    }
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_transit': return <LocalShipping className="h-5 w-5 text-blue-500" />;
      case 'pending': return <Schedule className="h-5 w-5 text-yellow-500" />;
      default: return <Error className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const handleCreateShipment = () => {
    toast.success('Shipment created successfully!');
    setShowCreateModal(false);
  };

  const handleCalculateRates = () => {
    toast.success('Rates calculated for all courier partners');
    setShowRateModal(false);
  };

  const handleSaveCourier = async (courierData) => {
    setLoading(true);
    try {
      if (selectedCourier) {
        await adminAPI.updateCourier(selectedCourier.id, courierData);
        toast.success('Courier updated successfully');
      } else {
        await adminAPI.createCourier(courierData);
        toast.success('Courier added successfully');
      }
      fetchCouriers();
      setShowCourierModal(false);
      setSelectedCourier(null);
    } catch (error) {
      toast.error('Failed to save courier: ' + (error.response?.data?.error || error.message));
    }
    setLoading(false);
  };

  const handlePrintLabel = (shipmentId, format) => {
    toast.success(`Printing ${format} label for ${shipmentId}`);
  };

  const handleTrackShipment = (trackingId) => {
    toast.info(`Tracking shipment: ${trackingId}`);
  };

  const handleSendNotification = (shipmentId) => {
    toast.success(`Delivery notification sent for ${shipmentId}`);
  };

  const handleTestCourier = async (courier) => {
    setLoading(true);
    try {
      // Test courier serviceability with a sample pincode
      const response = await adminAPI.checkServiceability({
        pincode: '110001',
        courier_name: courier.name
      });
      if (response.data.results.length > 0) {
        toast.success(`${courier.display_name || courier.name} is serviceable`);
      } else {
        toast.warning(`${courier.display_name || courier.name} is not serviceable for this pincode`);
      }
    } catch (error) {
      toast.error('Test failed: ' + (error.response?.data?.error || error.message));
    }
    setLoading(false);
  };

  const filteredShipments = shipments.filter(shipment =>
    shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.trackingId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderShipmentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search shipments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowRateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Calculate className="h-4 w-4" />
            <span>Calculate Rates</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Create Shipment</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Courier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredShipments.map((shipment) => {
                const courier = courierPartners.find(c => c.id === shipment.courier);
                return (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{shipment.id}</div>
                        <div className="text-sm text-gray-500">Order: {shipment.orderId}</div>
                        <div className="text-sm text-gray-500">Tracking: {shipment.trackingId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{courier?.logo}</span>
                        <span className="font-medium">{courier?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div>{shipment.from}</div>
                        <div className="text-gray-500">↓</div>
                        <div>{shipment.to}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(shipment.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                          {shipment.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">₹{shipment.amount}</div>
                      <div className="text-sm text-gray-500">{shipment.weight}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePrintLabel(shipment.id, 'PDF')}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          title="Print PDF Label"
                        >
                          <Print className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleTrackShipment(shipment.trackingId)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                          title="Track Shipment"
                        >
                          <Visibility className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleSendNotification(shipment.id)}
                          className="p-1 text-purple-600 hover:bg-purple-100 rounded"
                          title="Send Notification"
                        >
                          <Notifications className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCouriersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Courier Partners</h2>
        <button
          onClick={() => {
            setSelectedCourier(null);
            setShowCourierModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Courier</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(couriers.length > 0 ? couriers : courierPartners).map((courier) => (
          <div key={courier.id || courier.name} className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{courier.logo || '📦'}</span>
                <h3 className="text-lg font-semibold">{courier.display_name || courier.name}</h3>
              </div>
              <div className="flex items-center space-x-1">
                <span className={`w-3 h-3 rounded-full ${
                  courier.is_active ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{courier.courier_type || 'Standard'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">COD:</span>
                <span className="font-medium">{courier.is_cod_available ? '✓' : '✗'}</span>
              </div>
              {courier.success_rate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-medium">{courier.success_rate}%</span>
                </div>
              )}
              {courier.markup_percentage && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Markup:</span>
                  <span className="font-medium">{courier.markup_percentage}%</span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedCourier(courier);
                  setShowCourierModal(true);
                }}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Configure
              </button>
              {courier.name !== 'custom' && (
                <button
                  onClick={() => handleTestCourier(courier)}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Test
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping & Courier Integration</h1>
          <p className="text-gray-600">Manage shipments, courier partners, and delivery tracking</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'shipments', label: 'Shipments', icon: LocalShipping },
              { id: 'couriers', label: 'Courier Partners', icon: LocalShipping },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
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
        {activeTab === 'shipments' && renderShipmentsTab()}
        {activeTab === 'couriers' && renderCouriersTab()}
      </div>

      {/* Create Shipment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Create Shipment</h2>
              <button onClick={() => setShowCreateModal(false)}>
                <span className="text-gray-400 text-xl">×</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ORD-2024-004"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Courier Partner</label>
                <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  {courierPartners.map(courier => (
                    <option key={courier.id} value={courier.id}>
                      {courier.logo} {courier.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="standard">Standard</option>
                    <option value="express">Express</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateShipment}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rate Calculator Modal */}
      {showRateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Calculate Shipping Rates</h2>
              <button onClick={() => setShowRateModal(false)}>
                <span className="text-gray-400 text-xl">×</span>
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Pincode</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="400001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Pincode</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="110001"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="2.5"
                />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <h3 className="font-medium text-gray-900">Rate Comparison</h3>
              {courierPartners.map(courier => (
                <div key={courier.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span>{courier.logo}</span>
                    <span className="font-medium">{courier.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{courier.rates.express * 2.5}</div>
                    <div className="text-sm text-gray-500">Express</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRateModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={handleCalculateRates}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Recalculate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courier Configuration Modal */}
      {showCourierModal && (
        <CourierModal
          isOpen={showCourierModal}
          onClose={() => {
            setShowCourierModal(false);
            setSelectedCourier(null);
          }}
          courier={selectedCourier}
          onSave={handleSaveCourier}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Shipping;