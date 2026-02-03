import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  Work,
  Business
} from '@mui/icons-material';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'employee' // Default to employee
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password, formData.role);
      
      if (result.success) {
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Business className="text-indigo-600 text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-indigo-200">Employee & Super Admin Access</p>
        </div>

        {/* Role Selector */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 mb-6">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData({...formData, role: 'employee'})}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                formData.role === 'employee'
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Work className="text-sm" />
              Employee
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, role: 'super_admin'})}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                formData.role === 'super_admin'
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <AdminPanelSettings className="text-sm" />
              Super Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Email className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </div>
              ) : (
                `Sign in as ${formData.role === 'super_admin' ? 'Super Admin' : 'Employee'}`
              )}
            </button>
          </form>

          {/* Info Note */}
          <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
            <p className="text-indigo-200 text-sm text-center">
              <strong>Note:</strong> This portal is for authorized personnel only.
              {formData.role === 'employee' ? ' Employee access to manage operations.' : ' Super Admin access to full system.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;