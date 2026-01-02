import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Login from './components/Login';
import Layout from './components/Layout';
import SkipLink from './components/SkipLink';
import ProtectedRoute from './components/ProtectedRoute';
import NotAuthorized from './pages/NotAuthorized';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';

// Admin Pages
import Operations from './pages/Operations';
import Performance from './pages/Performance';
import Analytics from './pages/Analytics';
import AccessLogs from './pages/AccessLogs';

// Dashboard Redirect Component
const DashboardRedirect = () => {
  const { user } = useAuth();

  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user?.role === 'CUSTOMER') {
    return <Navigate to="/customer/dashboard" replace />;
  } else {
    // Default to operations for VIEWER role
    return <Navigate to="/operations" replace />;
  }
};

function AppRoutes() {
  return (
    <Router>
      <SkipLink />
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />

        {/* Not Authorized Route */}
        <Route path="/not-authorized" element={<NotAuthorized />} />

        {/* Protected Routes with Layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard Redirect */}
          <Route path="dashboard" element={<DashboardRedirect />} />

          {/* Customer Routes */}
          <Route
            path="customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="admin/dashboard"
            element={
              <ProtectedRoute allowedRoles="ADMIN">
                <Operations />
              </ProtectedRoute>
            }
          />
          <Route
            path="operations"
            element={
              <ProtectedRoute allowedRoles="ADMIN">
                <Operations />
              </ProtectedRoute>
            }
          />
          <Route
            path="performance"
            element={
              <ProtectedRoute allowedRoles="ADMIN">
                <Performance />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <ProtectedRoute allowedRoles="ADMIN">
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="access-logs"
            element={
              <ProtectedRoute allowedRoles="ADMIN">
                <AccessLogs />
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}
          <Route path="*" element={<DashboardRedirect />} />
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
