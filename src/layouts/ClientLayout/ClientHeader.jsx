import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from 'react-router-dom';
import ChooseCinema from "@components/ChooseCinema/ChooseCinema";
import AuthMenu from "@components/Header/Client/AuthMenu/AuthMenu";

export default function ClientHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { label: "LỊCH CHIẾU THEO RẠP", path: "/lich-chieu-theo-rap" },
        { label: "PHIM", path: "/phim" },
        { label: "RẠP", path: "/thong-tin-rap-phim" },
        { label: "GIÁ VÉ", path: "/gia-ve-xem-phim" },
        { label: "TIN MỚI VÀ ƯU ĐÃI", path: "/tin-moi-va-uu-dai" },
        { label: "THÀNH VIÊN", path: "/thong-tin-tai-khoan" },
    ];


    return (
        <header className="w-full shadow-md">
            <div className="bg-black text-white text-xs flex justify-end items-center py-2">
                <div className="container">
                    <div className="flex float-right">
                        <AuthMenu />
                    </div>
                </div>
            </div>
            <div className="container bg-white flex justify-between items-center px-4 md:px-8 py-3">
                <div className="flex w-full md:w-1/3">
                    <div className="items-center space-x-2  w-1/4">
                        <Link to="/">
                            <img
                                src="/images/header/logo.png"
                                alt="VieFilm"
                                className="h-16"
                            />
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <ChooseCinema />
                    </div>
                </div>

                <nav className="hidden md:flex space-x-6 font-bold text-xs uppercase text-gray-800 w-2/3 justify-between">
                    <Link to="/lich-chieu-theo-rap"><p className="hover:hover:text-[#337ab7]">LỊCH CHIẾU THEO RẠP</p></Link>
                    <Link to="/phim"><p className="hover:hover:text-[#337ab7]">PHIM</p></Link>
                    <Link to="/thong-tin-rap-phim"><p className="hover:hover:text-[#337ab7]">RẠP</p></Link>
                    <Link to="/gia-ve-xem-phim"><p className="hover:hover:text-[#337ab7]">GIÁ VÉ</p></Link>
                    <Link to="/tin-moi-va-uu-dai"><p className="hover:hover:text-[#337ab7]">TIN MỚI VÀ ƯU ĐÃI</p></Link>
                    <Link to="/thong-tin-tai-khoan"><p className="hover:hover:text-[#337ab7]">THÀNH VIÊN</p></Link>
                </nav>

                <div className="md:hidden">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Menu mobile */}
            <div
                className={`container text-left md:hidden overflow-hidden transform transition-all duration-500 origin-top ${mobileMenuOpen ? 'scale-y-100 max-h-screen py-4' : 'scale-y-0 max-h-0 py-0'
                    } bg-white px-6 border-t border-gray-200 z-50 font-semibold text-sm text-gray-800`}
            >
                {navItems.map((item, idx) => (
                    <Link
                        to={item.path}
                        key={idx}
                        onClick={() => setMobileMenuOpen(false)} // đóng menu sau khi click
                        className="block hover:text-[#337ab7] py-2"
                    >
                        {item.label}
                    </Link>
                ))}
            </div>

        </header>
    );
}