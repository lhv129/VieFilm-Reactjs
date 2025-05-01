import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaUserCircle, FaBars } from 'react-icons/fa';
import { useAuth } from "@/contexts/AuthContext";

const AdminHeader = ({ setSidebarOpen }) => {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef();

    const user = useAuth().user;

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white shadow-sm p-4 flex items-center justify-between relative">
            <button
                className="text-gray-600 lg:hidden hover:text-blue-600 transition cursor-pointer"
                onClick={() => setSidebarOpen(true)}
            >
                <FaBars size={20} />
            </button>

            <div className="flex-1" />

            <div className="flex items-center space-x-4 relative" ref={userMenuRef}>
                <FaBell className="text-gray-600 hover:text-blue-600 transition cursor-pointer" />

                <div className="relative">
                    <img
                        src={user.images}
                        className="text-gray-600 hover:text-blue-600 transition cursor-pointer w-10 rounded-full"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                    />
                    {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Thông tin cá nhân</button>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Đổi mật khẩu</button>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">Đăng xuất</button>
                        </div>
                    )}
                </div>

                <div className='flex flex-col text-center'>
                    <span className="font-semibold text-gray-800 hidden sm:inline">{user.fullname}</span>
                    <span className="font-semibold text-gray-800 hidden sm:inline text-[10px]">{user.roleName}</span>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
