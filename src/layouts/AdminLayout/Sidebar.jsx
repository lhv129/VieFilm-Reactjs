import React from 'react';
import {
    FaChartBar,
    FaTimes,
    FaMapMarkerAlt,
} from 'react-icons/fa';
import { RiMovie2AiFill } from "react-icons/ri";
import { BiSolidCameraMovie } from "react-icons/bi";
import { PiProjectorScreenFill } from "react-icons/pi";
import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const { user } = useAuth();

    const allNavItems = [
        {
            icon: <FaChartBar />,
            label: 'Thống kê',
            to: '/admin/thong-ke',
            roles: ['Admin'],
        },
        {
            icon: <FaMapMarkerAlt />,
            label: 'Tỉnh thành',
            to: '/admin/tinh-thanh',
            roles: ['Admin'],
        },
        {
            icon: <RiMovie2AiFill />,
            label: 'Rạp',
            to: '/admin/rap',
            roles: ['Admin'],
        },
        {
            icon: <BiSolidCameraMovie />,
            label: 'Phòng chiếu',
            to: '/admin/phong-chieu',
            roles: ['Admin','Staff'],
        },
        {
            icon: <PiProjectorScreenFill />,
            label: 'Suất chiếu',
            to: '/admin/suat-chieu',
            roles: ['Admin', 'Staff'],
        },
    ];

    const navItems = allNavItems.filter((item) =>
        item.roles.includes(user.roleName)
    );

    return (
        <>
            {/* Overlay khi mở sidebar trên mobile */}
            <div
                className={classNames(
                    'fixed inset-0 z-40 transition-opacity lg:hidden',
                    {
                        hidden: !sidebarOpen,
                    }
                )}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar chính */}
            <div
                className={classNames(
                    'fixed z-50 h-full w-64 bg-white transition-transform transform border-r border-gray-200 lg:translate-x-0 lg:static',
                    {
                        '-translate-x-full': !sidebarOpen,
                        'translate-x-0': sidebarOpen,
                    }
                )}
            >
                {/* Logo và nút đóng */}
                <div className="flex items-center justify-between lg:justify-center p-4">
                    <img
                        src="/images/header/logo.png"
                        className="w-20 cursor-pointer"
                        alt="Logo"
                    />
                    <button
                        className="lg:hidden text-gray-600 hover:text-red-500 transition cursor-pointer"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {navItems.map((item, index) => (
                        <NavItem
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            to={item.to}
                            active={location.pathname.startsWith(item.to)}
                            onClick={() => setSidebarOpen(false)} // auto-close on mobile
                        />
                    ))}
                </nav>
            </div>
        </>
    );
};

const NavItem = ({ icon, label, to, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={classNames(
            'flex items-center space-x-3 px-3 py-2 rounded-lg transition cursor-pointer',
            active
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
        )}
    >
        <div>{icon}</div>
        <div>{label}</div>
    </Link>
);

export default Sidebar;
