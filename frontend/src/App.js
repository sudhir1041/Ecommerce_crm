import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import SystemLogs from './pages/SystemLogs';
import Notifications from './pages/Notifications';
import Shipping from './pages/Shipping';
import KanbanBoard from './pages/KanbanBoard';
import Employees from './pages/Employees';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import SystemHealth from './pages/SystemHealth';
import CartAbandoned from './pages/CartAbandoned';
import Marketing from './pages/Marketing';
import Chats from './pages/Chats';
import UserDetail from './pages/UserDetail';
import Tokens from './pages/Tokens';
import Bookings from './pages/Bookings';
import Pricing from './pages/Pricing';
import Logs from './pages/Logs';
import Layout from './components/Layout';

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<Profile />} />
            <Route path="system-logs" element={<SystemLogs />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="kanban" element={<KanbanBoard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="cart-abandoned" element={<CartAbandoned />} />
            <Route path="customers" element={<Customers />} />
            <Route path="reports" element={<Reports />} />
            <Route path="marketing" element={<Marketing />} />
            <Route path="chats" element={<Chats />} />
            <Route path="settings" element={<Settings />} />
            <Route path="system-health" element={<SystemHealth />} />
            <Route path="users/:userId" element={<UserDetail />} />
            <Route path="tokens" element={<Tokens />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="logs" element={<Logs />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;