import React, { useState } from 'react';
import AdminHeader from './AdminHeader';
import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <AdminHeader setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-y-auto p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;