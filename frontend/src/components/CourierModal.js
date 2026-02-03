import React, { useState, useEffect } from 'react';

const CourierModal = ({ isOpen, onClose, courier, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: 'delhivery',
    display_name: '',
    courier_type: 'standard',
    is_active: true,
    is_cod_available: false,
    markup_percentage: 0,
    api_key: '',
    api_secret: '',
    test_mode: true
  });

  useEffect(() => {
    if (courier) {
      setFormData({
        name: courier.name || 'delhivery',
        display_name: courier.display_name || '',
        courier_type: courier.courier_type || 'standard',
        is_active: courier.is_active !== undefined ? courier.is_active : true,
        is_cod_available: courier.is_cod_available || false,
        markup_percentage: courier.markup_percentage || 0,
        api_key: courier.api_key || '',
        api_secret: courier.api_secret || '',
        test_mode: courier.test_mode !== undefined ? courier.test_mode : true
      });
    } else {
      setFormData({
        name: 'delhivery',
        display_name: '',
        courier_type: 'standard',
        is_active: true,
        is_cod_available: false,
        markup_percentage: 0,
        api_key: '',
        api_secret: '',
        test_mode: true
      });
    }
  }, [courier]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {courier ? 'Configure Courier' : 'Add Courier Partner'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="text-xl">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Courier Service
            </label>
            <select
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="delhivery">Delhivery</option>
              <option value="bluedart">Blue Dart</option>
              <option value="dtdc">DTDC</option>
              <option value="ecom_express">Ecom Express</option>
              <option value="xpressbees">XpressBees</option>
              <option value="shadowfax">Shadowfax</option>
              <option value="fedex">FedEx</option>
              <option value="ups">UPS</option>
              <option value="dhl">DHL</option>
              <option value="custom">Custom Courier</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Custom display name (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Type
            </label>
            <select
              name="courier_type"
              value={formData.courier_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="same_day">Same Day</option>
              <option value="hyperlocal">Hyperlocal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Markup Percentage
            </label>
            <input
              type="number"
              name="markup_percentage"
              value={formData.markup_percentage}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          {formData.name !== 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="text"
                  name="api_key"
                  value={formData.api_key}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter API key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Secret
                </label>
                <input
                  type="password"
                  name="api_secret"
                  value={formData.api_secret}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter API secret"
                />
              </div>
            </>
          )}

          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">Active</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_cod_available"
                checked={formData.is_cod_available}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">COD Available</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="test_mode"
                checked={formData.test_mode}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">Test Mode</label>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourierModal;