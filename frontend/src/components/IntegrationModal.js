import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const IntegrationModal = ({ isOpen, onClose, type, item, onSave }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData(getDefaultFormData(type));
    }
  }, [item, type]);

  const getDefaultFormData = (type) => {
    if (type === 'platform') {
      return {
        platform_type: 'woocommerce',
        store_name: '',
        store_url: '',
        is_active: true,
        sync_frequency: 15
      };
    } else if (type === 'courier') {
      return {
        name: 'delhivery',
        display_name: '',
        courier_type: 'standard',
        is_active: true,
        is_cod_available: false,
        markup_percentage: 0
      };
    }
    return {};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let response;
      if (item) {
        // Update
        if (type === 'platform') {
          response = await adminAPI.updatePlatform(item.id, formData);
        } else {
          response = await adminAPI.updateCourier(item.id, formData);
        }
      } else {
        // Create
        if (type === 'platform') {
          response = await adminAPI.createPlatform(formData);
        } else {
          response = await adminAPI.createCourier(formData);
        }
      }
      
      onSave(response.data);
      onClose();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {item ? 'Edit' : 'Add'} {type === 'platform' ? 'Platform' : 'Courier'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'platform' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform Type
                </label>
                <select
                  name="platform_type"
                  value={formData.platform_type || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="woocommerce">WooCommerce</option>
                  <option value="shopify">Shopify</option>
                  <option value="bigcommerce">BigCommerce</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  name="store_name"
                  value={formData.store_name || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store URL
                </label>
                <input
                  type="url"
                  name="store_url"
                  value={formData.store_url || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sync Frequency (minutes)
                </label>
                <input
                  type="number"
                  name="sync_frequency"
                  value={formData.sync_frequency || 15}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min="1"
                />
              </div>
            </>
          )}
          
          {type === 'courier' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Courier Service
                </label>
                <select
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="delhivery">Delhivery</option>
                  <option value="bluedart">Blue Dart</option>
                  <option value="dtdc">DTDC</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  name="display_name"
                  value={formData.display_name || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Courier Type
                </label>
                <select
                  name="courier_type"
                  value={formData.courier_type || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="standard">Standard</option>
                  <option value="express">Express</option>
                  <option value="same_day">Same Day</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Markup Percentage
                </label>
                <input
                  type="number"
                  name="markup_percentage"
                  value={formData.markup_percentage || 0}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min="0"
                  step="0.01"
                />
              </div>
            </>
          )}
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name={type === 'platform' ? 'is_active' : 'is_active'}
              checked={formData.is_active || false}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm text-gray-700">Active</label>
          </div>
          
          {type === 'courier' && (
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_cod_available"
                checked={formData.is_cod_available || false}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">COD Available</label>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IntegrationModal;