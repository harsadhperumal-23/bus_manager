import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Home, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NotAuthorized = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleGoHome = () => {
        // Redirect based on user role
        if (user?.role === 'ADMIN') {
            navigate('/admin/dashboard');
        } else if (user?.role === 'CUSTOMER') {
            navigate('/customer/dashboard');
        } else {
            navigate('/operations');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 light:from-slate-50 light:via-slate-100 light:to-slate-50 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <div className="glass-card rounded-2xl p-8 text-center">
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-24 h-24 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center"
                    >
                        <ShieldAlert className="w-12 h-12 text-red-400" />
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-white light:text-slate-900 mb-3">
                        Access Denied
                    </h1>

                    {/* Message */}
                    <p className="text-slate-400 light:text-slate-600 mb-2">
                        You don't have permission to access this page.
                    </p>

                    {/* User Info */}
                    {user && (
                        <div className="mb-6 p-4 bg-white/5 light:bg-slate-100 rounded-lg">
                            <p className="text-sm text-slate-400 light:text-slate-600 mb-1">
                                Logged in as:
                            </p>
                            <p className="text-white light:text-slate-900 font-semibold">
                                {user.username}
                            </p>
                            <div className="mt-2">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN'
                                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    }`}>
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGoHome}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            <Home className="w-5 h-5" />
                            Go to Dashboard
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/5 light:bg-slate-200 hover:bg-white/10 light:hover:bg-slate-300 text-white light:text-slate-900 rounded-lg font-medium transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </motion.button>
                    </div>
                </div>

                {/* Help Text */}
                <p className="text-center text-slate-500 text-sm mt-6">
                    If you believe this is an error, please contact your administrator.
                </p>
            </motion.div>
        </div>
    );
};

export default NotAuthorized;
