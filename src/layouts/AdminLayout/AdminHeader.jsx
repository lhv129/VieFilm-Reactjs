import React, { useState, useRef, useEffect, use } from 'react';
import { FaBell, FaBars } from 'react-icons/fa';
import { useAuth } from "@/contexts/AuthContext";
import ModalSelect from '@components/Header/Admin/ModalSelect/ModalSelect';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ setSidebarOpen }) => {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef();
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const cinemaStor = JSON.parse(localStorage.getItem('cinema') || 'null');

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("user");
        setUser(null);
        navigate("/");
    };

    return (
        <header className="bg-white shadow-sm p-4 flex flex-col gap-4 items-center justify-center lg:flex-row lg:items-center lg:justify-between relative">
            <div className="flex items-center justify-between lg:hidden">
                <button
                    className="text-gray-600 hover:text-blue-600 transition"
                    onClick={() => setSidebarOpen(true)}
                >
                    <FaBars size={20} />
                </button>
            </div>

            {user.roleName === 'Admin' ? (
                <ModalSelect />
            ) : (
                <div className="flex">
                    <span className="font-semibold text-gray-800 hidden sm:inline text-[10px]">Rạp: {cinemaStor.name}</span>
                </div>
            )}

            <div className="flex items-center space-x-4 relative mt-2 lg:mt-0" ref={userMenuRef}>
                <FaBell className="text-gray-600 hover:text-blue-600 transition cursor-pointer" />
                <div className="relative">
                    <img
                        src={user.images}
                        className="cursor-pointer w-10 rounded-full"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                    />
                    {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Thông tin cá nhân</button>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Đổi mật khẩu</button>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500" onClick={handleLogout}>Đăng xuất</button>
                        </div>
                    )}
                </div>
                <div className="flex flex-col text-center">
                    <span className="font-semibold text-gray-800 hidden sm:inline">{user.fullname}</span>
                    <span className="font-semibold text-gray-800 hidden sm:inline text-[10px]">{user.roleName}</span>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
