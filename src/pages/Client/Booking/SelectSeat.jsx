import SeatType from "./SeatType";


function SelectSeat({ selectedSeats, movie, seats, timeLeft ,user, toggleSeat}) {

    const getSeatClass = (seat) => {
        const isSelected = selectedSeats.includes(seat.seatCode);
        const isHeldByUser = seat.isBooked === "hold" && user._id === seat.bookedBy;

        if (seat.isBooked === "paid" || seat.isBooked === "used") {
            if (seat.type === "Ghế thường") {
                return "bg-[url('/images/showtimes/seats/seat-error-normal.png')] bg-cover bg-center cursor-not-allowed text-white w-8 h-8";
            }
            if (seat.type === "Ghế VIP") {
                return "bg-[url('/images/showtimes/seats/seat-error-vip.png')] bg-cover bg-center cursor-not-allowed text-white w-8 h-8";
            }
            if (seat.type === "Ghế đôi") {
                return "bg-[url('/images/showtimes/seats/seat-error-double.png')] bg-cover bg-center cursor-not-allowed text-white w-18 h-9";
            }
        } else if (seat.isBooked === "hold" && user._id !== seat.bookedBy) {
            if (seat.type === "Ghế thường") {
                return "bg-[url('/images/showtimes/seats/seat-process-normal.png')] bg-cover bg-center text-white w-8 h-8";
            }
            if (seat.type === "Ghế VIP") {
                return "bg-[url('/images/showtimes/seats/seat-process-vip.png')] bg-cover bg-center text-white w-8 h-8";
            }
            if (seat.type === "Ghế đôi") {
                return "bg-[url('/images/showtimes/seats/seat-process-vip.png')] bg-cover bg-center text-white w-18 h-9";
            }
        } else if (isHeldByUser) {
            if (seat.type === "Ghế thường") {
                return "bg-[url('/images/showtimes/seats/seat-select-normal.png')] bg-cover bg-center hover:bg-blue-200 cursor-pointer text-white w-8 h-8";
            }
            if (seat.type === "Ghế VIP") {
                return "bg-[url('/images/showtimes/seats/seat-select-vip.png')] bg-cover bg-center hover:bg-blue-200 cursor-pointer text-white w-8 h-8";
            }
            if (seat.type === "Ghế đôi") {
                return "bg-[url('/images/showtimes/seats/seat-select-double.png')] bg-cover bg-center hover:bg-blue-200 cursor-pointer text-white w-18 h-9";
            }
        }

        // Lớp khi ghế được chọn hoặc có sẵn để chọn
        if (isSelected) {
            if (seat.type === "Ghế thường") {
                return "bg-[url('/images/showtimes/seats/seat-select-normal.png')] bg-cover bg-center cursor-pointer w-8 h-8";
            }
            if (seat.type === "Ghế VIP") {
                return "bg-[url('/images/showtimes/seats/seat-select-vip.png')] bg-cover bg-center cursor-pointer w-8 h-8";
            }
            if (seat.type === "Ghế đôi") {
                return "bg-[url('/images/showtimes/seats/seat-select-double.png')] bg-cover bg-center cursor-pointer w-18 h-9";
            }
        }

        // Lớp cho ghế không chọn
        if (seat.type === "Ghế thường") {
            return "bg-[url('/images/showtimes/seats/seatnormal.png')] bg-cover bg-center hover:bg-blue-200 cursor-pointer w-8 h-8";
        }
        if (seat.type === "Ghế VIP") {
            return "bg-[url('/images/showtimes/seats/Seat.png')] bg-cover bg-center hover:bg-blue-200 cursor-pointer w-8 h-8";
        }
        if (seat.type === "Ghế đôi") {
            return "bg-[url('/images/showtimes/seats/seatcouple.png')] bg-cover bg-center hover:bg-blue-200 cursor-pointer w-18 h-9";
        }
    };

    return (
        <div className="md:w-2/3 flex flex-col items-center p-4">
            <div className="flex flex-wrap justify-between w-full gap-y-2">
                <div className="flex items-center w-1/2 md:w-auto">
                    <img src="/images/showtimes/seats/seatnormal.png" className="w-8 mr-2" />
                    <p>Ghế trống</p>
                </div>

                <div className="flex items-center w-1/2 md:w-auto md:justify-center">
                    <img src="/images/showtimes/seats/seat-select-normal.png" className="w-8 mr-2" />
                    <p>Ghế đang chọn</p>
                </div>

                <div className="flex items-center w-1/2 md:w-auto md:justify-center">
                    <img src="/images/showtimes/seats/seat-process-normal.png" className="w-8 mr-2" />
                    <p>Ghế đang được giữ</p>
                </div>

                <div className="flex items-center w-1/2 md:w-auto md:justify-end">
                    <img src="/images/showtimes/seats/seat-error-normal.png" className="w-8 mr-2" />
                    <p>Ghế đã bán</p>
                </div>
            </div>

            {/* {Banner thông báo} */}
            {movie?.ageRating !== 'P' && movie?.ageRating && (
                <div className="w-full py-1 bg-amber-200 text-center mt-8">
                    {movie.ageRating === 'T13' && (
                        <p className="text-xs text-red-500 font-bold">
                            Theo quy định của cục điện ảnh, phim này không dành cho khán giả dưới 13 tuổi
                        </p>
                    )}
                    {movie.ageRating === 'T16' && (
                        <p className="text-xs text-red-500 font-bold">
                            Theo quy định của cục điện ảnh, phim này không dành cho khán giả dưới 16 tuổi
                        </p>
                    )}
                    {movie.ageRating === 'T18' && (
                        <p className="text-xs text-red-500 font-bold">
                            Theo quy định của cục điện ảnh, phim này không dành cho khán giả dưới 18 tuổi
                        </p>
                    )}
                </div>
            )}

            <div className="w-full overflow-x-auto">
                {/* Màn hình */}
                <div className="min-w-[800px] mb-8 mt-8">
                    <img src="/images/showtimes/ic-screen.png" />
                </div>
                <div className="inline-block min-w-[800px]">
                    <div className="flex justify-center">
                        <div className="w-full space-y-2 mb-8">
                            {Object.entries(
                                seats.reduce((acc, seat) => {
                                    const row = seat.seatCode.match(/^[A-Z]+/)[0]; // lấy chữ cái đầu (có thể là A, B... hay AA)
                                    if (!acc[row]) acc[row] = [];
                                    acc[row].push(seat);
                                    return acc;
                                }, {})
                            ).map(([row, rowSeats]) => (
                                <div key={row} className="flex gap-2 justify-center">
                                    {rowSeats
                                        .sort((a, b) => {
                                            const aNum = parseInt(a.seatCode.match(/\d+$/)[0]);
                                            const bNum = parseInt(b.seatCode.match(/\d+$/)[0]);
                                            return aNum - bNum;
                                        })
                                        .map((seat) => {
                                            // Nếu ghế hỏng, hiển thị khung trống giữ vị trí
                                            if (seat.status === 'broken') {
                                                return (
                                                    <div
                                                        key={seat.seatCode}
                                                        className="w-8 h-8 rounded-md"
                                                        title="Ghế hỏng"
                                                    />
                                                );
                                            }

                                            return (
                                                <div
                                                    key={seat.seatCode}
                                                    className={`flex items-center justify-center text-[10px] rounded-md ${getSeatClass(seat)}`}
                                                    onClick={() => {
                                                        if (seat.bookedBy === user._id || !seat.isBooked) toggleSeat(seat.seatCode);
                                                    }}
                                                >
                                                    {seat.seatCode}
                                                </div>
                                            );
                                        })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <SeatType timeLeft={timeLeft} seats={seats} selectedSeats={selectedSeats}/>
            
        </div>
    )

}

export default SelectSeat;