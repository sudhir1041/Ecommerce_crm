import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  ShoppingCart,
  AttachMoney,
  Close,
  Store
} from '@mui/icons-material';

const CustomerDetailModal = ({ customerId, onClose }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);

  const fetchCustomerDetails = async () => {
    try {
      const response = await adminAPI.getCustomer(customerId);
      setCustomer(response.data);
    } catch (error) {
      console.error('Error fetching customer details:', error);
      toast.error('Failed to load customer details');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading customer details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
          <div className="text-center py-8">
            <p className="text-gray-500">Customer not found</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Person className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{customer.full_name}</h2>
              <p className="text-gray-600">Customer Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Close className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Customer Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Person className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{customer.full_name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Email className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{customer.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CalendarToday className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Customer Since</p>
                    <p className="font-medium">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Platform Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Store className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Platform</p>
                    <p className="font-medium capitalize">{customer.platform || 'Manual'}</p>
                  </div>
                </div>
                {customer.platform_customer_id && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-600">#</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Platform Customer ID</p>
                      <p className="font-medium">{customer.platform_customer_id}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          {(customer.billing_address || customer.shipping_address) && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customer.billing_address && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <LocationOn className="h-4 w-4 mr-1" />
                      Billing Address
                    </h4>
                    <div className="text-sm text-gray-600">
                      <p>{customer.billing_address.address_1}</p>
                      {customer.billing_address.address_2 && <p>{customer.billing_address.address_2}</p>}
                      <p>{customer.billing_address.city}, {customer.billing_address.state} {customer.billing_address.postcode}</p>
                      <p>{customer.billing_address.country}</p>
                    </div>
                  </div>
                )}
                {customer.shipping_address && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <LocationOn className="h-4 w-4 mr-1" />
                      Shipping Address
                    </h4>
                    <div className="text-sm text-gray-600">
                      <p>{customer.shipping_address.address_1}</p>
                      {customer.shipping_address.address_2 && <p>{customer.shipping_address.address_2}</p>}
                      <p>{customer.shipping_address.city}, {customer.shipping_address.state} {customer.shipping_address.postcode}</p>
                      <p>{customer.shipping_address.country}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Statistics */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Order Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <ShoppingCart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{customer.total_orders || 0}</p>
                <p className="text-sm text-blue-600">Total Orders</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <AttachMoney className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  ₹{(customer.total_spent || 0).toLocaleString()}
                </p>
                <p className="text-sm text-green-600">Total Spent</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <AttachMoney className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">
                  ₹{customer.total_orders > 0 ? Math.round((customer.total_spent || 0) / customer.total_orders) : 0}
                </p>
                <p className="text-sm text-purple-600">Average Order</p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          {customer.recent_orders && customer.recent_orders.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Recent Orders</h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customer.recent_orders.slice(0, 5).map((order) => (
                      <tr key={order.id}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">
                          {order.order_number}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                          ₹{order.total_amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;