import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 light:from-slate-50 light:via-slate-100 light:to-slate-50 overflow-hidden">
            {/* Sidebar - Fixed width */}
            <Sidebar />

            {/* Main Content Area - Flexes to fill remaining space */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header - Fixed height */}
                <Header />

                {/* Page Content - Scrollable area */}
                <main
                    id="main-content"
                    className="flex-1 overflow-y-auto p-6"
                    role="main"
                    aria-label="Main content"
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
