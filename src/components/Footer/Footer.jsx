import React from 'react';

function Footer() {
    return (
        <>
            <div className='w-full h-[1px] bg-gray-300 mt-8'></div>
            <div className='container'>
                <footer className="bg-white text-gray-700 text-sm">
                    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Logo và Thông tin */}
                        <div>
                            <img src="/images/header/logo.png" alt="VieFilm" className="h-30 mb-4" />
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:underline">Giới thiệu</a></li>
                                <li><a href="#" className="hover:underline">Tuyển dụng</a></li>
                                <li><a href="#" className="hover:underline">Liên hệ</a></li>
                                <li><a href="#" className="hover:underline">F.A.Q</a></li>
                                <li><a href="#" className="hover:underline">Hoạt động xã hội</a></li>
                                <li><a href="#" className="hover:underline">Điều khoản sử dụng</a></li>
                                <li><a href="#" className="hover:underline">Chính sách thanh toán, đổi trả - hoàn vé</a></li>
                                <li><a href="#" className="hover:underline">Liên hệ quảng cáo</a></li>
                                <li><a href="#" className="hover:underline">Điều khoản bảo mật</a></li>
                                <li><a href="#" className="hover:underline">Hướng dẫn đặt vé online</a></li>
                            </ul>
                        </div>

                        {/* Cụm Rạp */}
                        <div>
                            <h3 className="font-bold mb-4">Cụm Rạp VieFilm</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:underline">VieFilm Xuân Thủy, Hà Nội</a></li>
                                <li><a href="#" className="hover:underline">VieFilm Tây Sơn, Hà Nội</a></li>
                                <li><a href="#" className="hover:underline">VieFilm Vĩnh Yên, Vĩnh Phúc</a></li>
                                <li><a href="#" className="hover:underline">VieFilm Dĩ An, Bình Dương</a></li>
                                <li><a href="#" className="hover:underline">VieFilm Long Khánh, Đồng Nai</a></li>
                                {/* Thêm các rạp khác tùy ý */}
                            </ul>
                        </div>

                        {/* Kết Nối */}
                        <div>
                            <h3 className="font-bold mb-4">Kết Nối Với Chúng Tôi</h3>
                            <div className="flex space-x-4">
                                <a href="#"><img src="/images/footer/facebook.png" alt="Facebook" className="h-6" /></a>
                                <a href="#"><img src="/images/footer/Instagram_icon.png" alt="Instagram" className="h-6" /></a>
                                <a href="#"><img src="/images/footer/youtube.png" alt="YouTube" className="h-6" /></a>
                            </div>
                            <img src="/images/footer/dathongbao.png" alt="Bộ Công Thương" className="h-12 mt-4" />
                        </div>

                        {/* Liên hệ */}
                        <div>
                            <h3 className="font-bold mb-4">Liên hệ</h3>
                            <p className="mb-2">Công ty cổ phần VieFilm Media</p>
                            <p className="mb-2 text-gray-500 text-xs">
                                Địa chỉ: Số nhà 67 - Miêu Nha - Tây Mỗ - Nam Từ Liêm - Hà Nội
                            </p>
                            <p className="mb-2">Hotline: 1900 636807 / 1800 646420</p>
                            <p className="mb-2">Email: mkt@viefilm.vn</p>
                            <p className="mt-4 font-semibold">Liên hệ quảng cáo:</p>
                            <p className="mb-2">Hotline: 0934 632 682</p>
                            <p className="mb-2">Email: ad@viefilm.vn</p>
                            <p className="mt-4 font-semibold">Liên hệ hợp tác kinh doanh:</p>
                            <p className="mb-2">Hotline: 1800 646420</p>
                            <p className="mb-2">Email: phuongdh@viefilm.vn</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Footer;
