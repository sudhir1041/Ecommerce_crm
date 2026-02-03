import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import {
  Add,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Block,
} from '@mui/icons-material';

const Tokens = () => {
  const [tokens, setTokens] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  useEffect(() => {
    loadTokens();
    loadPlans();
  }, [filter]);

  const loadTokens = async () => {
    try {
      const params = filter ? { status: filter } : {};
      const response = await adminAPI.getAllTokens(params);
      setTokens(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to load tokens');
    } finally {
      setLoading(false);
    }
  };

  const loadPlans = async () => {
    try {
      const response = await adminAPI.getPlans();
      setPlans(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to load plans');
    }
  };

  const handleActivate = async (tokenId) => {
    if (!window.confirm('Are you sure you want to activate this token?')) {
      return;
    }

    try {
      await adminAPI.activateToken(tokenId, {});
      toast.success('Token activated successfully!');
      loadTokens();
    } catch (error) {
      toast.error('Failed to activate token');
    }
  };

  const handleDeactivate = async (tokenId) => {
    const reason = window.prompt('Enter reason for deactivation:');
    if (!reason) return;

    try {
      await adminAPI.deactivateToken(tokenId, { reason });
      toast.success('Token deactivated successfully!');
      loadTokens();
    } catch (error) {
      toast.error('Failed to deactivate token');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="text-green-500" />;
      case 'inactive':
        return <HourglassEmpty className="text-gray-500" />;
      case 'expired':
        return <Cancel className="text-red-500" />;
      case 'revoked':
        return <Block className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'revoked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tokens</h1>
          <p className="text-gray-600 mt-1">Manage user access tokens</p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Add />
          Generate Token
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex gap-3">
          <button
            onClick={() => setFilter('')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === ''
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'inactive'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Inactive
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'active'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('expired')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'expired'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Expired
          </button>
        </div>
      </div>

      {/* Tokens Grid */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          </div>
        ) : tokens.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
            No tokens found
          </div>
        ) : (
          tokens.map((token) => (
            <div
              key={token.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon(token.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        token.status
                      )}`}
                    >
                      {token.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Token:
                      </span>
                      <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                        {token.token}
                      </code>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        User:
                      </span>
                      <span className="ml-2 text-sm">
                        {token.user_details?.username} ({token.user_details?.email})
                      </span>
                    </div>
                    
                    {token.plan_details && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Plan:
                        </span>
                        <span className="ml-2 text-sm">
                          {token.plan_details.name}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex gap-6">
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Bookings:
                        </span>
                        <span className="ml-2 text-sm">
                          {token.bookings_used} / {token.total_bookings_allowed}
                        </span>
                      </div>
                      
                      {token.days_remaining !== null && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            Days Left:
                          </span>
                          <span className="ml-2 text-sm font-semibold">
                            {token.days_remaining}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-2">
                      Generated: {new Date(token.generated_at).toLocaleString()}
                      {token.activated_at && (
                        <> • Activated: {new Date(token.activated_at).toLocaleString()}</>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {token.status === 'inactive' && (
                    <button
                      onClick={() => handleActivate(token.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      Activate
                    </button>
                  )}
                  {token.status === 'active' && (
                    <button
                      onClick={() => handleDeactivate(token.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      Deactivate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Generate Token Modal */}
      {showGenerateModal && (
        <GenerateTokenModal
          plans={plans}
          onClose={() => setShowGenerateModal(false)}
          onSuccess={() => {
            loadTokens();
            setShowGenerateModal(false);
          }}
        />
      )}
    </div>
  );
};

// Generate Token Modal Component
const GenerateTokenModal = ({ plans, onClose, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminAPI.generateToken({
        user_id: selectedUser,
        plan_id: selectedPlan,
      });
      toast.success('Token generated successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Generate Token</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select User
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
            >
              <option value="">Choose a user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username} - {user.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Plan
            </label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
            >
              <option value="">Choose a plan...</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - ₹{plan.price} ({plan.duration_days} days, {plan.max_bookings} bookings)
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Token'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Tokens;