import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import {
  Search,
  Visibility,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, [search]);

  const loadUsers = async () => {
    try {
      const params = search ? { search } : {};
      const response = await adminAPI.getAllUsers(params);
      setUsers(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (userId) => {
    navigate(`/users/${userId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-600 mt-1">Manage all registered users</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by username, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No users found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {user.username}
                      </div>
                      {user.first_name && (
                        <div className="text-sm text-gray-500">
                          {user.first_name} {user.last_name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {user.phone || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {user.is_active ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle fontSize="small" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600">
                          <Cancel fontSize="small" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewUser(user.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        <Visibility fontSize="small" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;