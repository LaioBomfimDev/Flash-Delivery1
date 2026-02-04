import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DeliveryProvider } from './context/DeliveryContext';
import { NotificationProvider } from './context/NotificationContext';
import Toast from './components/Toast';

// Pages
import Login from './pages/Login';
import MerchantHome from './pages/merchant/MerchantHome';
import MotoboyHome from './pages/motoboy/MotoboyHome';
import MotoboyHistory from './pages/motoboy/MotoboyHistory';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DeliveryManagement from './pages/admin/DeliveryManagement';
import TrackingPage from './pages/TrackingPage';

import './index.css';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate home based on role
    const redirects = {
      merchant: '/merchant',
      motoboy: '/motoboy',
      admin: '/admin',
    };
    return <Navigate to={redirects[user?.role] || '/login'} replace />;
  }

  return children;
}

// Redirect authenticated users to their home
function PublicRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    const redirects = {
      merchant: '/merchant',
      motoboy: '/motoboy',
      admin: '/admin',
    };
    return <Navigate to={redirects[user?.role] || '/'} replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />

      {/* Public Tracking Page (no login required) */}
      <Route path="/rastreio/:trackingCode" element={<TrackingPage />} />

      {/* Merchant Routes */}
      <Route path="/merchant" element={
        <ProtectedRoute allowedRoles={['merchant']}>
          <MerchantHome />
        </ProtectedRoute>
      } />
      <Route path="/merchant/history" element={
        <ProtectedRoute allowedRoles={['merchant']}>
          <MerchantHome />
        </ProtectedRoute>
      } />

      {/* Motoboy Routes */}
      <Route path="/motoboy" element={
        <ProtectedRoute allowedRoles={['motoboy']}>
          <MotoboyHome />
        </ProtectedRoute>
      } />
      <Route path="/motoboy/history" element={
        <ProtectedRoute allowedRoles={['motoboy']}>
          <MotoboyHistory />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <UserManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/deliveries" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DeliveryManagement />
        </ProtectedRoute>
      } />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DeliveryProvider>
          <NotificationProvider>
            <AppRoutes />
            <Toast />
          </NotificationProvider>
        </DeliveryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
