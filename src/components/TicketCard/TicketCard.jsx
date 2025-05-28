
const TicketCard = ({ ticketData }) => {
    if (!ticketData) return null;

    const { customer, code, totalAmount, details = {}, showtime, movie, cinema, screen } = ticketData;
    const { seats = [], products = [] } = details;

    return (
        <>
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                <div className="flex justify-between bg-gray-100 rounded-lg p-3">
                    <div>
                        <p className="text-xs font-semibold text-gray-700">Mã đặt vé:</p>
                        <p className="text-sm text-blue-500 font-bold">{code || "XXXXXXXXXXXXX"}</p>
                        <p className="text-xs italic text-gray-500 mb-2">
                            Đưa mã này cho nhân viên soát vé để nhận vé vào rạp
                        </p>
                    </div>
                    <img src="/images/header/logo.png" alt="VieFilm Cineplex Logo" className="w-10 h-10" />
                </div>

                {showtime && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h6 className="text-xs text-gray-500">{cinema?.name || "Viefilm Cineplex"}</h6>
                                    <p className="text-sm font-semibold text-gray-600 uppercase">{movie?.title || "Tên Phim"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700 mb-3">
                                <div>
                                    <p className="font-semibold">Thời gian:</p>
                                    <p>{showtime.startTime}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Ngày:</p>
                                    <p>{showtime.date}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Phòng chiếu:</p>
                                    <p>{screen?.name || "N/A"}</p>
                                </div>
                            </div>

                            <div className="mb-3">
                                <p className="font-semibold mb-1">Ghế đã đặt:</p>
                                <p className="text-sm text-gray-700">
                                    {seats.length > 0
                                        ? seats.map(seat => seat.seatCode || seat._id || "XX").join(", ")
                                        : "Chưa chọn ghế"}
                                </p>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200">
                            <p className="text-xs font-semibold text-gray-700">Rạp chiếu:</p>
                            <p className="text-sm text-gray-800">{cinema?.name || "VieFilm Cineplex"}</p>
                            <p className="text-xs text-gray-500">{cinema?.address || "Địa chỉ rạp"}</p>
                        </div>
                    </div>
                )}

                {products.length > 0 && (
                    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
                        <h3 className="text-lg font-semibold mb-4">🍿 Sản phẩm đi kèm</h3>
                        <div className="space-y-3 text-sm text-gray-700">
                            {products.map(product => (
                                <div key={product._id} className="flex items-center justify-between px-4 py-2">
                                    <div>
                                        <p className="font-semibold">{product.name}</p>
                                        <p className="text-gray-500">Số lượng: {product.quantity}</p>
                                    </div>
                                    <div className="text-right text-gray-600">
                                        {(product.price * product.quantity).toLocaleString()}đ
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-2 border-t border-gray-200 text-sm text-gray-700 text-right">
                            <p>
                                <span className="font-semibold">Tổng tiền sản phẩm:</span>{' '}
                                {products.reduce((sum, p) => sum + p.price * p.quantity, 0).toLocaleString()}đ
                            </p>
                        </div>
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-700 text-right">
                    <p>
                        <span className="font-semibold">Tổng tiền:</span>{' '}
                        {totalAmount ? totalAmount.toLocaleString() + 'đ' : '0đ'}
                    </p>
                </div>
            </div>
        </>
    );
};

export default TicketCard;
