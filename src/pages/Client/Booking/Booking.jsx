import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSeats } from "@apis/showtimeService";
import { getOneById } from "@apis/movieService";
import Preloader from "@components/Preloader/Preloader";
import { Helmet } from "react-helmet";


function Booking() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { showtimeId } = location.state || {};
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [timeLeft, setTimeLeft] = useState(600); // 600 giây = 10 phút
    const [movie, setMovie] = useState(null);
    const [showtime, setShowtime] = useState([]);
    const [minWidth, setMinWidth] = useState(900);

    useEffect(() => {
        if (showtimeId) {

            setIsLoading(true);

            getSeats(showtimeId)
                .then((res) => {
                    const seatsData = res.data.screen.seats;
                    const sortedSeats = seatsData.sort((a, b) => {
                        const [rowA, colA] = [a.seatCode.charAt(0), parseInt(a.seatCode.slice(1))];
                        const [rowB, colB] = [b.seatCode.charAt(0), parseInt(b.seatCode.slice(1))];

                        if (rowA < rowB) return -1;
                        if (rowA > rowB) return 1;
                        return colA - colB;
                    });

                    setSeats(sortedSeats);

                    setShowtime(res.data);

                    const movieId = res.data.movieId;
                    return getOneById(movieId);
                })
                .then((res) => {
                    setMovie(res.data); // lấy data phim
                })
                .catch((err) => {
                    console.error("Error fetching seats or movie", err);
                }).finally(() => {
                    setIsLoading(false);
                });
        }
    }, [showtimeId]);

    useEffect(() => {
        if (timeLeft <= 0) {
            alert("Hết thời gian giữ ghế! Vui lòng chọn lại.");
            navigate(-1);
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, navigate]);

    const toggleSeat = (seatCode) => {
        if (selectedSeats.includes(seatCode)) {
            setSelectedSeats(selectedSeats.filter((code) => code !== seatCode));
        } else {
            setSelectedSeats([...selectedSeats, seatCode]);
        }
    };

    const handleContinue = () => {
        if (selectedSeats.length === 0) {
            alert("Bạn chưa chọn ghế nào!");
            return;
        }
        navigate("/dat-ve/thanh-toan", {
            state: { showtimeId, selectedSeats },
        });
    };

    const getSeatClass = (seat) => {
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
        }

        if (selectedSeats.includes(seat.seatCode)) {
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

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60).toString().padStart(2, "0");
        const sec = (seconds % 60).toString().padStart(2, "0");
        return `${min}:${sec}`;
    };

    if (isLoading) {
        return <Preloader />;
    }

    return (
        <>
            <Helmet>
                <title>Chọn ghế</title>
            </Helmet>
            <div className="container flex flex-col md:flex-row p-4">
                {/* Khu vực chọn ghế */}
                <div className="md:w-2/3 flex flex-col items-center p-4">
                    {/* Countdown */}
                    {/* <div className="text-center text-red-600 font-semibold mb-6">
                        Thời gian giữ ghế còn lại: {formatTime(timeLeft)}
                    </div> */}

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
                                                                if (!seat.isBooked) toggleSeat(seat.seatCode);
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

                    {/* Tổng kết */}
                    <div className="text-center space-y-2 mb-6">
                        <div>
                            Ghế đã chọn:{" "}
                            <span className="font-semibold">
                                {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Chưa chọn"}
                            </span>
                        </div>
                        <div>
                            Tổng tiền:{" "}
                            <span className="font-bold text-green-600">
                                {selectedSeats.length * 65000} VND
                            </span>
                        </div>
                    </div>

                    {/* Button tiếp tục */}
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                        onClick={handleContinue}
                    >
                        Tiếp tục
                    </button>
                </div>

                {/* Khu vực thông tin phim */}
                <div className="md:w-1/3 p-4 space-y-4">
                    {movie && (
                        <>
                            <div className="flex">
                                <div className="w-1/2">
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="w-full rounded shadow-lg"
                                    />
                                </div>
                                <div className="w-1/2 px-4">
                                    <h2 className="text-xl font-bold text-[#337ab7]">{movie.title}</h2>
                                    <p className="text-sm">Ngôn ngữ {movie.language}</p>
                                </div>
                            </div>
                            <div>Thể loại: {movie.genres}</div>
                            <div>Thời lượng: {movie.duration} phút</div>
                            <div>Ngày chiếu: {showtime.date}</div>
                            <div>Giờ chiếu: {showtime.startTime}</div>
                            <div>Phòng chiếu: {showtime.screen.name}</div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default Booking;
