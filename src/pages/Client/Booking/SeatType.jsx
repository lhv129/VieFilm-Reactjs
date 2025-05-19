function SeatType({ timeLeft, seats, selectedSeats }) {

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60).toString().padStart(2, "0");
        const sec = (seconds % 60).toString().padStart(2, "0");
        return `${min}:${sec}`;
    };

    // Import và các hooks giữ nguyên như bạn đã có...

    // Trong component Booking, thêm function để tính tổng tiền và phân loại ghế:
    const getSeatSummary = () => {
        const summary = {};

        selectedSeats.forEach(code => {
            const seat = seats.find(s => s.seatCode === code);
            if (seat) {
                const type = seat.type;
                if (!summary[type]) {
                    summary[type] = { count: 0, total: 0, price: seat.price };
                }
                summary[type].count += 1;
                summary[type].total += seat.price;
            }
        });

        return summary;
    };

    const seatSummary = getSeatSummary();

    return (
        <div className="w-full p-4 bg-white shadow-md mt-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">

                {/* Seat Types */}
                <div className="flex flex-wrap justify-center md:justify-start items-start gap-4">
                    {[
                        { type: "Ghế thường", image: "/images/showtimes/seats/seatnormal.png" },
                        { type: "Ghế VIP", image: "/images/showtimes/seats/Seat.png" },
                        { type: "Ghế đôi", image: "/images/showtimes/seats/seatcouple.png" }
                    ].map(({ type, image }) => (
                        <div key={type} className="flex flex-col items-center text-center space-y-1 w-[100px]">
                            <img src={image} className="w-8 mx-auto" alt={type} />
                            <p className="text-sm">{type}</p>
                            {seatSummary[type] && (
                                <p className="text-xs text-gray-600">
                                    {seatSummary[type].count} x {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(seatSummary[type].price)}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Total Price */}
                <div className="flex flex-col items-center">
                    <p className="text-sm md:text-base">Tổng tiền</p>
                    <span className="font-bold text-[#337ab7] text-lg md:text-xl">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                            selectedSeats.reduce((total, code) => {
                                const seat = seats.find(s => s.seatCode === code);
                                return seat ? total + seat.price : total;
                            }, 0)
                        )}
                    </span>
                </div>

                {/* Countdown */}
                <div className="flex flex-col items-center">
                    <h3 className="text-sm md:text-base">Thời gian còn lại</h3>
                    <div className="font-semibold text-lg md:text-xl">
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SeatType;