import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useState, useEffect, useRef } from "react";

function AuthMenu() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const menuRef = useRef();

    const handleLogout = () => {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("user");
        setUser(null);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left cursor-pointer" ref={menuRef}>
            {user ? (
                <>
                    <div className="flex">
                        <button
                            onClick={() => setOpen((prev) => !prev)}
                            className="flex items-center text-sm font-medium focus:outline-none cursor-pointer mr-2"
                        >
                            👋 Xin chào: {user.username}
                            <svg
                                className="w-4 h-4 ml-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <button className="cursor-pointer text-right" onClick={handleLogout}>
                            <img src="/images/header/icons8-logout-64.png" className="w-[18px]" />
                        </button>
                    </div>

                    {open && (
                        <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded shadow-lg z-50">
                            <ul className="text-sm text-gray-700">
                                <li className="px-4 py-2 hover:bg-gray-100">
                                    <Link to="/tai-khoan">👤 Thông tin tài khoản</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100">
                                    <Link to="/the-thanh-vien">💳 Thẻ thành viên</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100">
                                    <Link to="/hanh-trinh">📍 Hành trình điện ảnh</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100">
                                    <Link to="/diem-beta">📌 Điểm Beta</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100">
                                    <Link to="/voucher">🎟️ Voucher của tôi</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100 text-red-500 font-medium border-t border-gray-200">
                                    <button className="cursor-pointer" onClick={handleLogout}>🚪 Đăng xuất</button>
                                </li>
                            </ul>
                        </div>
                    )}
                </>
            ) : (
                <div className="space-x-2">
                    <Link to="/dang-nhap" className="hover:underline">Đăng nhập</Link>
                    <span>|</span>
                    <Link to="/dang-ky" className="hover:underline">Đăng ký</Link>
                </div>
            )}
        </div>
    );
}

export default AuthMenu;
