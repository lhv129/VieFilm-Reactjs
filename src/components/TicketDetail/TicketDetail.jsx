
const TicketDetail = ({ data }) => {
    if (!data) {
        return (
            <div className="p-4 border rounded bg-white text-black max-w-md mx-auto">
                <p className="text-red-500">Không có dữ liệu để hiển thị</p>
            </div>
        );
    }

    const {
        code,
        cinema,
        movie,
        screen,
        showtime,
        details = { seats: [], products: [] },
    } = data;

    const seats = details.seats || [];
    const products = details.products || [];

    // Hàm render vé riêng cho mỗi ghế
    const renderTicket = (uniqueId, seatCode) => (
        <div
            key={uniqueId}
            className="max-w-md mx-auto bg-white rounded-lg shadow-sm text-black font-sans mb-8"
        >
            {/* Header: mã vé + logo */}
            <div className="flex justify-between items-center rounded-t-lg pb-4 px-6 border-b border-dashed border-gray-300">
                <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase pt-4">Mã đặt vé</p>
                    <p className="text-xl font-bold text-blue-600 tracking-widest">{code || 'XXXXXXXXXXXXX'}</p>
                    <p className="text-xs italic text-gray-500 mt-1">
                        Đưa mã này cho nhân viên soát vé để nhận vé vào rạp
                    </p>
                </div>
                <img
                    src="/images/header/logo.png"
                    alt="VieFilm Cineplex Logo"
                    className="w-14 h-14 object-contain"
                />
            </div>

            {/* Thông tin phim & suất chiếu */}
            {showtime && (
                <div className="py-4 px-6 border-b border-dashed border-gray-300">
                    <h2 className="text-lg font-semibold uppercase mb-1">{movie?.title || 'Tên Phim'}</h2>
                    <p className="text-sm font-medium text-gray-600">{cinema?.name || 'Viefilm Cineplex'}</p>
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
                            <p>{screen?.name || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="font-semibold">Ghế đã đặt:</p>
                        <p>{seatCode || 'XX'}</p>
                    </div>
                </div>
            )}

            {/* Thông tin rạp */}
            <div className="py-4 px-6 border-b border-dashed border-gray-300 text-sm">
                <p className="font-semibold mb-1">Thông tin rạp chiếu</p>
                <p>{cinema?.name || 'VieFilm Cineplex'}</p>
                <p className="text-gray-500">{cinema?.address || 'Địa chỉ rạp'}</p>
            </div>
        </div>
    );

    return (
        <div>
            {/* Render vé riêng cho từng ghế */}
            {seats.length > 0 &&
                seats.map((seat, idx) => renderTicket(seat._id || idx, seat.seatCode || 'XX'))}

            {/* Render vé riêng cho từng sản phẩm */}
            {products.length > 0 && (
                <div className="mx-2 max-w-md sm:mx-auto mt-10 p-4 rounded-lg shadow-lg border border-gray-300 font-sans text-gray-800">
                    <div
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
                                    Đưa vé này cho nhân viên để lấy bỏng nước
                                </p>
                            </div>
                            <img src="/images/header/logo.png" alt="VieFilm Cineplex Logo" className="w-14 h-14 object-contain" />
                        </div>
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketDetail;