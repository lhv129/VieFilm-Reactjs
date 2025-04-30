import React from 'react';
import { FaBell, FaUserCircle, FaBars } from 'react-icons/fa';

const AdminHeader = ({ setSidebarOpen }) => {
    return (
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
            {/* Sidebar toggle button on mobile */}
            <button
                className="text-gray-600 lg:hidden hover:text-blue-600 transition"
                onClick={() => setSidebarOpen(true)}
            >
                <FaBars size={20} />
            </button>

            {/* Spacer div that grows to push right side to edge */}
            <div className="flex-1" />

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
                <FaBell className="text-gray-600 hover:text-blue-600 transition" />
                <FaUserCircle className="text-gray-600 hover:text-blue-600 transition" size={24} />
                <span className="font-semibold text-gray-800 hidden sm:inline">Musharof</span>
            </div>
        </header>
    );
};

export default AdminHeader;
