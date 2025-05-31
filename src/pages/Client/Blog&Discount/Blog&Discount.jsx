import React, { useEffect, useState } from "react";
import { getAll } from "@apis/promoService";
import { message } from "antd";
import { Helmet } from "react-helmet";

function Card({ children }) {
    return <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative">{children}</div>;
}

function CardContent({ children }) {
    return <div className="p-4">{children}</div>;
}

function Button({ children, onClick }) {
    return (
        <button
            onClick={onClick}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
            {children}
        </button>
    );
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

export default function PromotionsPage() {
    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        async function fetchPromotions() {
            try {
                const data = await getAll();
                const promo = data.data;

                const placeholderImages = [
                    "/images/coupon/Ve-Xem-Phim-Galaxy.jpg",
                    "/images/coupon/voucher-xem-phim-galaxy.jpg",
                    "/images/coupon/xem-phim-galaxy-1.jpg",
                    "/images/coupon/san-sale-shopee.png",
                    "/images/coupon/ma-giam-gia-shopee.jpg",
                    "/images/coupon/LDP-voucher-1236x700.png",
                    "/images/coupon/cach-tao-ma-giam-gia-shopee_3e56f40178a34bc9b6d83deb86a12ab1_grande.webp",
                    "/images/coupon/998b7f4a-1.png"
                ];

                const enriched = promo.map((item, index) => ({
                    ...item,
                    img: placeholderImages[index % placeholderImages.length],
                }));

                setPromotions(enriched);
            } catch (error) {
                console.error("Failed to fetch promotions:", error);
            }
        }

        fetchPromotions();
    }, []);

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            message.success(`Đã sao chép mã: ${text}`);
        } catch (err) {
            console.error("Failed to copy:", err);
            message.error("Sao chép thất bại");
        }
    };

    return (
        <>
            <Helmet>
                <title>Tin mới và giảm giá</title>
            </Helmet>
            <div className="container px-4 py-8">
                {promotions.length === 0 ? (
                    <p className="text-gray-600 text-center w-full mt-6">Hiện chưa có mã khuyến mãi nào.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {promotions.map((promo, index) => (
                            <Card key={index}>
                                <img
                                    src={promo.img}
                                    alt={promo.name}
                                    className="w-full object-cover h-48"
                                />
                                {promo.status !== "active" && (
                                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow">
                                        Mã đã hết
                                    </div>
                                )}
                                <CardContent>
                                    <h2 className="text-lg font-semibold text-black mb-2">
                                        {promo.name}
                                    </h2>
                                    <p className="text-sm text-gray-600 mb-1">{promo.description}</p>
                                    <p className="text-sm text-gray-800 font-medium">Giá: {promo.price}đ</p>
                                    <p className="text-sm text-gray-500">
                                        Từ {formatDate(promo.startDate)} đến {formatDate(promo.endDate)}
                                    </p>
                                    {promo.status === "active" && (
                                        <Button onClick={() => copyToClipboard(promo.name)}>Sao chép mã</Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
