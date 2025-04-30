import React from 'react';
import { FaChartBar, FaShoppingCart, FaCalendar, FaTasks, FaUser, FaTimes } from 'react-icons/fa';
import classNames from 'classnames';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    return (
        <>
            <div
                className={classNames(
                    'fixed inset-0 z-40 transition-opacity lg:hidden',
                    { hidden: !sidebarOpen }
                )}
                onClick={() => setSidebarOpen(false)}
            />

            <div
                className={classNames(
                    'fixed z-50 h-full w-64 bg-white transition-transform transform border-r border-gray-200 lg:translate-x-0 lg:static',
                    {
                        '-translate-x-full': !sidebarOpen,
                        'translate-x-0': sidebarOpen,
                    }
                )}
            >
                <div className="flex items-center justify-between p-4">
                    <span className="text-xl font-bold text-blue-600 select-none">TailAdmin</span>
                    <button className="lg:hidden text-gray-600 hover:text-red-500 transition" onClick={() => setSidebarOpen(false)}>
                        <FaTimes />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    <NavItem icon={<FaChartBar />} label="Dashboard" />
                    <NavItem icon={<FaShoppingCart />} label="Ecommerce" />
                    <NavItem icon={<FaCalendar />} label="Calendar" />
                    <NavItem icon={<FaTasks />} label="Task" />
                    <NavItem icon={<FaUser />} label="User Profile" />
                    <NavItem icon={<FaChartBar />} label="Dashboard" />
                    <NavItem icon={<FaShoppingCart />} label="Ecommerce" />
                    <NavItem icon={<FaCalendar />} label="Calendar" />
                    <NavItem icon={<FaTasks />} label="Task" />
                    <NavItem icon={<FaUser />} label="User Profile" />
                    <NavItem icon={<FaChartBar />} label="Dashboard" />
                    <NavItem icon={<FaShoppingCart />} label="Ecommerce" />
                    <NavItem icon={<FaCalendar />} label="Calendar" />
                    <NavItem icon={<FaTasks />} label="Task" />
                    <NavItem icon={<FaUser />} label="User Profile" />
                </nav>
            </div>
        </>
    );
};

const NavItem = ({ icon, label }) => (
    <div
        className="flex items-center space-x-3 text-gray-700 px-3 py-2 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition cursor-pointer"
    >
        <div>{icon}</div>
        <div>{label}</div>
    </div>
);

export default Sidebar;