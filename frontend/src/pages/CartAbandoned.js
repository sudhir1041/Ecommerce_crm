import React, { useState } from 'react';
import {
  ShoppingCartOutlined,
  Delete,
  CheckCircle,
  NoteAdd,
  Edit,
  Phone,
  Email,
  Person,
  Inventory,
  AccessTime,
  FilterList,
  Search,
} from '@mui/icons-material';

const CartAbandoned = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCarts, setSelectedCarts] = useState([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);
  const [note, setNote] = useState('');

  const abandonedCarts = [
    {
      id: 1,
      customer: {
        name: 'Rahul Sharma',
        phone: '+91 9876543210',
        email: 'rahul.sharma@email.com'
      },
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
      products: [
        { name: 'MacBook Air M2', price: 114900, quantity: 1 }
      ],
      totalAmount: 114900,
      abandonedAt: '2024-01-14 11:20',
      status: 'recovered',
      notes: 'Customer completed purchase after discount offer'
    }
  ];

  const filteredCarts = abandonedCarts.filter(cart => {
    const matchesSearch = cart.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cart.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cart.customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || cart.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (cartId, newStatus) => {
    console.log(`Changing status of cart ${cartId} to ${newStatus}`);
  };

  const handleDelete = (cartId) => {
    if (window.confirm('Are you sure you want to delete this abandoned cart?')) {
      console.log(`Deleting cart ${cartId}`);
    }
  };

  const handleMarkRecovered = (cartId) => {
    handleStatusChange(cartId, 'recovered');
  };

  const handleAddNote = (cart) => {
    setSelectedCart(cart);
    setNote(cart.notes || '');
    setShowNoteModal(true);
  };

  const saveNote = () => {
    console.log(`Saving note for cart ${selectedCart.id}: ${note}`);
    setShowNoteModal(false);
    setSelectedCart(null);
    setNote('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'recovered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cart Abandoned</h1>
          <p className="text-gray-600">Manage abandoned shopping carts and recover lost sales</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by customer name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="recovered">Recovered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Abandoned Carts List */}
      <div className="space-y-4">
        {filteredCarts.map((cart) => (
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
                      <AccessTime className="h-4 w-4" />
                      <span>Abandoned: {cart.abandonedAt}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cart.status)}`}>
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
                onClick={() => handleMarkRecovered(cart.id)}
                className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Mark Recovered</span>
              </button>
              
              <button
                onClick={() => handleAddNote(cart)}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <NoteAdd className="h-4 w-4" />
                <span>Add Note</span>
              </button>
              
              <select
                onChange={(e) => handleStatusChange(cart.id, e.target.value)}
                value={cart.status}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="recovered">Recovered</option>
              </select>
              
              <button
                onClick={() => handleDelete(cart.id)}
                className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                <Delete className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Note Modal */}
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
                onClick={saveNote}
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

export default CartAbandoned;