//TicketCard dùng cho card ticket details của user lẫn admin

import { useRef } from "react";
import html2canvas from 'html2canvas-pro';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { updateStatus } from "@apis/ticketService";
import { message, Button, Modal } from "antd";

const TicketCard = ({ ticketData }) => {
    const ticketRef = useRef();
    const user = JSON.parse(Cookies.get("user"));
    const printRef = useRef();
    const navigate = useNavigate();

    if (!ticketData) return null;

    const { code, totalAmount, details = {}, showtime, movie, cinema, screen } = ticketData;
    const { seats = [], products = [] } = details;

    const handleSaveInvoice = () => {
        if (!ticketRef.current) return;

        html2canvas(ticketRef.current, {
            backgroundColor: '#fff',
            useCORS: true,
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `${code}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    };

    return (
        <>
            <div className="mx-2 max-w-md sm:mx-auto mt-10 p-4 rounded-lg shadow-lg border border-gray-300 font-sans text-gray-800">
                <div ref={ticketRef}
                    style={{
                        all: 'unset',
                        padding: '20px',
                        backgroundColor: '#fff',
                        color: '#000',
                        fontFamily: 'sans-serif',
                        display: 'block',
                        filter: 'none',
                        mixBlendMode: 'normal',
                    }}

                >
                    {/* Header: mã vé + logo */}
                    <div className="flex justify-between items-center rounded-t-lg pb-4 border-b border-dashed border-gray-300">
                        <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase">Mã đặt vé</p>
                            <p className="text-xl font-bold text-blue-600 tracking-widest">{code || "XXXXXXXXXXXXX"}</p>
                            <p className="text-xs italic text-gray-500 mt-1">
                                Đưa mã này cho nhân viên soát vé để nhận vé vào rạp
                            </p>
                        </div>
                        <img src="/images/header/logo.png" alt="VieFilm Cineplex Logo" className="w-14 h-14 object-contain" />
                    </div>

                    {/* Thông tin phim & suất chiếu */}
                    {showtime && (
                        <div className="py-4 border-b border-dashed border-gray-300">
                            <h2 className="text-lg font-semibold uppercase mb-1">{movie?.title || "Tên Phim"}</h2>
                            <p className="text-sm font-medium text-gray-600">{cinema?.name || "Viefilm Cineplex"}</p>
                            <div className="grid grid-cols-3 gap-4 mt-3 text-sm text-gray-700">
                                <div>
                                    <p className="font-semibold">Ngày chiếu</p>
                                    <p>{showtime.date}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Thời gian</p>
                                    <p>{showtime.startTime}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Phòng chiếu</p>
                                    <p>{screen?.name || "N/A"}</p>
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="font-semibold">Ghế đã đặt:</p>
                                <p>{seats.length > 0
                                    ? seats.map(seat => seat.seatCode || seat._id || "XX").join(", ")
                                    : "Chưa chọn ghế"}</p>
                            </div>
                        </div>
                    )}

                    {/* Thông tin rạp */}
                    <div className="py-4 border-b border-dashed border-gray-300 text-sm">
                        <p className="font-semibold mb-1">Thông tin rạp chiếu</p>
                        <p>{cinema?.name || "VieFilm Cineplex"}</p>
                        <p className="text-gray-500">{cinema?.address || "Địa chỉ rạp"}</p>
                    </div>

                    {/* Sản phẩm đi kèm */}
                    {products.length > 0 && (
                        <div className="py-4 border-b border-dashed border-gray-300">
                            <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                                <span role="img" aria-label="popcorn">🍿</span> Sản phẩm đi kèm
                            </h3>
                            <div className="space-y-2 text-sm">
                                {products.map(product => (
                                    <div key={product._id} className="flex justify-between">
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-gray-500">Số lượng: {product.quantity}</p>
                                        </div>
                                        <div className="font-semibold text-gray-700">
                                            {(product.price * product.quantity).toLocaleString()}đ
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tổng tiền + Nút lưu hóa đơn */}
                    <div className="text-right font-bold text-lg text-gray-900 pt-4">
                        {totalAmount ? totalAmount.toLocaleString() + 'đ' : '0đ'}
                    </div>

                </div>

                <div
                    className={`flex mt-6 ${user?.roleName === 'Admin' || user?.roleName === 'Staff'
                        ? 'justify-between'
                        : 'justify-center'
                        }`}
                >
                    <button
                        onClick={handleSaveInvoice}
                        className="text-sm text-blue-600 font-medium border border-blue-500 px-3 py-1 rounded hover:bg-blue-50 transition cursor-pointer"
                    >
                        💾 Lưu hóa đơn
                    </button>

                    {(user?.roleName === 'Admin' || user?.roleName === 'Staff') && (
                        <Button onClick={() => {
                            Modal.confirm({
                                title: "In vé",
                                content: "Xác nhận để cập nhật trạng thái vé.",
                                okText: "Đã in",
                                cancelText: "Huỷ",
                                onOk: async () => {
                                    try {
                                        const storedCinema = JSON.parse(localStorage.getItem("cinema") || "null");
                                        const cinemaId = storedCinema?._id;
                                        const ticketId = ticketData?._id;

                                        if (!cinemaId || !ticketId) return;

                                        const res = await updateStatus({ cinemaId, ticketId });
                                        message.success(res.data.message);
                                        navigate("/admin/ve");
                                    } catch (error) {
                                        // console.error("Cập nhật trạng thái in vé thất bại:", error);
                                        message.error(error.response.data.message);
                                    }
                                }
                            });
                        }}>
                            🖨️ In hóa đơn
                        </Button>

                    )}
                </div>

            </div>
        </>
    );
};

export default TicketCard;
