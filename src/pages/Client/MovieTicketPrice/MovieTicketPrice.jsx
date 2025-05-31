import React from 'react';
import { Helmet } from 'react-helmet';

const seatTypes = [
    {
        name: 'Ghế Thường',
        price: 65000,
        image: '/images/showtimes/seats/seatnormal.png',
        description: 'Ghế đơn tiêu chuẩn, phù hợp cho mọi đối tượng.',
    },
    {
        name: 'Ghế VIP',
        price: 85000,
        image: '/images/showtimes/seats/Seat.png',
        description: 'Ghế đệm cao cấp, không gian rộng rãi và thoải mái.',
    },
    {
        name: 'Ghế Đôi',
        price: 120000,
        image: '/images/showtimes/seats/seatcouple.png',
        description: 'Thiết kế dành cho cặp đôi, không gian riêng tư.',
    },
];

const MovieTicketPrice = () => {
    return (
        <>
            <Helmet>
                <title>Giá vé xem phim</title>
            </Helmet>

            <div className="min-h-screen py-12 px-4">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-wide">
                        Thông Báo Giá Vé
                    </h1>

                    <div className="grid md:grid-cols-3 gap-8">
                        {seatTypes.map((seat) => (
                            <div
                                key={seat.name}
                                className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
                            >
                                <div className="flex justify-center items-center h-44 bg-gray-50 px-4">
                                    <img
                                        src={seat.image}
                                        alt={seat.name}
                                        className="h-32 object-contain"
                                    />
                                </div>

                                <div className="p-5 text-center">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-1">
                                        {seat.name}
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-4">{seat.description}</p>
                                    <div className="text-lg font-bold text-red-600">
                                        {seat.price.toLocaleString('vi-VN')}đ
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs text-center text-gray-500 mt-12">
                        * Giá vé có thể thay đổi theo suất chiếu, khu vực hoặc chương trình khuyến mãi.
                    </p>
                </div>
            </div>
        </>
    );
};

export default MovieTicketPrice;
