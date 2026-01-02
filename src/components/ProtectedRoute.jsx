import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protected Route Component
 * Wraps routes that require authentication and specific roles
 * 
 * @param {ReactNode} children - Child components to render if authorized
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { authenticated, loading, user } = useAuth();

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!authenticated) {
        return <Navigate to="/" replace />;
    }

    // Check if user has required role
    if (allowedRoles) {
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        if (!roles.includes(user?.role)) {
            // User doesn't have required role, redirect to not authorized page
            return <Navigate to="/not-authorized" replace />;
        }
    }

    // User is authenticated and has required role
    return children;
};

export default ProtectedRoute;
