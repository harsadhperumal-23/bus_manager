import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Operations from './pages/Operations';
import Analytics from './pages/Analytics';
import Performance from './pages/Performance';
import DriverTracker from './pages/DriverTracker';
import AccessLogs from './pages/AccessLogs';
import NotAuthorized from './pages/NotAuthorized';

function App() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <Router>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/not-authorized" element={<NotAuthorized />} />

                            {/* Protected Routes */}
                            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                                <Route path="/operations" element={<Operations />} />
                                <Route path="/analytics" element={<Analytics />} />
                                <Route path="/performance" element={<Performance />} />
                                <Route path="/driver-tracker" element={<DriverTracker />} />
                                <Route path="/access-logs" element={<AccessLogs />} />
                            </Route>

                            {/* Default Route */}
                            <Route path="/" element={<Navigate to="/login" replace />} />
                            <Route path="*" element={<Navigate to="/login" replace />} />
                        </Routes>
                    </Router>
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}

export default App;