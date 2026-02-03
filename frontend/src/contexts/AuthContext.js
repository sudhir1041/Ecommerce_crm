import React, { createContext, useState, useContext, useEffect } from 'react';
import { adminAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('admin_user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const response = await adminAPI.login({ email, password, role });
      const responseData = response.data;
      
      console.log('Login response user:', responseData);
      
      // Handle different response structures
      let user, tokens;
      if (responseData.user && (responseData.access || responseData.refresh)) {
        // Structure: { user: {...}, access: '...', refresh: '...' }
        user = responseData.user;
        tokens = { access: responseData.access, refresh: responseData.refresh };
      } else if (responseData.access || responseData.refresh) {
        // Structure: { id, email, ..., access, refresh }
        const { access, refresh, ...userData } = responseData;
        user = userData;
        tokens = { access, refresh };
      } else {
        // Assume user data is directly in response
        user = responseData;
        tokens = { access: responseData.access_token || responseData.token };
      }
      
      // Check if employee or super admin
      if (user.role !== 'employee' && user.role !== 'super_admin') {
        return {
          success: false,
          message: 'Access denied. Employee or Super Admin access only.'
        };
      }
      
      if (tokens.access) {
        localStorage.setItem('admin_token', tokens.access);
      }
      if (tokens.refresh) {
        localStorage.setItem('admin_refresh', tokens.refresh);
      }
      localStorage.setItem('admin_user', JSON.stringify(user));
      
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data?.detail || 'Invalid credentials',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh');
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};