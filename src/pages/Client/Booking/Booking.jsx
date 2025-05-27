import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSeats } from "@apis/showtimeService";
import { getOneById } from "@apis/movieService";
import { Helmet } from "react-helmet";
import { holdSeats, deleteHoldSeats, checkOut } from "@apis/ticketService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import MovieInfo from "./MovieInfo";
import SelectSeat from "./SelectSeat";
import Checkout from "./Checkout";

function Booking() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { showtimeId } = location.state || {};
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [timeLeft, setTimeLeft] = useState(600);
    const [movie, setMovie] = useState(null);
    const [showtime, setShowtime] = useState([]);
    const storedCinema = localStorage.getItem("cinema");
    const parsedCinema = storedCinema ? JSON.parse(storedCinema) : null;
    const cinemaId = parsedCinema?._id;
    const { user } = useAuth();
    const [isHolding, setIsHolding] = useState(false);
    const [step, setStep] = useState(() => Cookies.get("bookingStep") || "select-seat");
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [promoName, setPromoName] = useState("");
    const initialLoadDone = useRef(false);

    const holdSeatsKey = `holdSeats-${showtimeId}`;

    const fetchSeats = () => {
        if (!showtimeId) return;
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

                // Chỉ cập nhật selectedSeats nếu đây là lần đầu load (không phải polling)
                // Bạn có thể kiểm tra bằng biến state hoặc ref
                // Ví dụ dùng một ref để đánh dấu lần đầu fetch
                if (!initialLoadDone.current) {
                    const myHeldSeats = sortedSeats
                        .filter((s) => s.isBooked === "hold" && s.bookedBy === user?._id)
                        .map((s) => s.seatCode);
                    setSelectedSeats(myHeldSeats);
                    initialLoadDone.current = true;
                }

                const movieId = res.data.movieId;
                return getOneById(movieId);
            })
            .then((res) => {
                setMovie(res.data);
            })
            .catch((err) => {
                console.error("Error fetching seats or movie", err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (!showtimeId) return;

        // Đọc cookie để khôi phục thời gian còn lại và ghế đã giữ (nếu có)
        try {
            const holdSeatsData = JSON.parse(Cookies.get(holdSeatsKey) || "[]");
            if (holdSeatsData.length > 0 && holdSeatsData[0].expireAt) {
                const expireTimestamp = new Date(holdSeatsData[0].expireAt).getTime();
                const now = Date.now();
                const diffSeconds = Math.floor((expireTimestamp - now) / 1000);

                if (diffSeconds > 0) {
                    setTimeLeft(diffSeconds);
                    setSelectedSeats(holdSeatsData.map((s) => s.seatCode));
                } else {
                    Cookies.remove(holdSeatsKey);
                    setTimeLeft(0);
                    toast.error("Thời gian giữ ghế đã hết, vui lòng chọn lại");
                    navigate("/");
                }
            }
        } catch (error) {
            console.error("Lỗi khi đọc holdSeats cookie", error);
        }

        fetchSeats();
    }, [showtimeId, user, navigate]);



    const toggleSeat = (seatCode) => {
        if (isHolding) return;
        const seat = seats.find((s) => s.seatCode === seatCode);
        if (!seat) return;

        const isSelected = selectedSeats.includes(seatCode);
        const newSelectedSeats = isSelected
            ? selectedSeats.filter((code) => code !== seatCode)
            : [...selectedSeats, seatCode];
        setSelectedSeats(newSelectedSeats);

        const seatIds = newSelectedSeats
            .map((code) => seats.find((s) => s.seatCode === code))
            .filter(Boolean)
            .map((seat) => seat._id);

        const data = { showtimeId, seatIds, cinemaId };

        setIsHolding(true);
        holdSeats(data)
            .then((res) => {
                const holdData = res.data.data;
                if (holdData?.length > 0 && holdData[0].expireAt) {
                    Cookies.set(holdSeatsKey, JSON.stringify(holdData), { expires: 1 / 144 });
                    const expireTimestamp = new Date(holdData[0].expireAt).getTime();
                    const now = Date.now();
                    const diffSeconds = Math.floor((expireTimestamp - now) / 1000);
                    setTimeLeft(diffSeconds > 0 ? diffSeconds : 0);
                }
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message || "Lỗi giữ ghế", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "colored",
                });
            })
            .finally(() => {
                fetchSeats();
                setIsHolding(false);
            });
    };

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        if (timeLeft === 0) {
            toast.error("Hết thời gian giữ ghế, vui lòng chọn lại", {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });

            let holdSeatsData = null;
            try {
                holdSeatsData = JSON.parse(Cookies.get(holdSeatsKey) || "[]");
            } catch (error) {
                console.error("Invalid holdSeats cookie", error);
            }

            const ticketId = Array.isArray(holdSeatsData) && holdSeatsData.length > 0 ? holdSeatsData[0]._id : null;

            const cleanUpAndGoBack = () => {
                Cookies.remove(holdSeatsKey);
                Cookies.remove("bookingStep");
                navigate("/");
            };

            if (ticketId) {
                deleteHoldSeats({ ticketId })
                    .catch((err) => {
                        console.error("Lỗi xóa vé giữ:", err);
                    })
                    .finally(() => {
                        cleanUpAndGoBack();
                    });
            } else {
                cleanUpAndGoBack();
            }
        }
    }, [timeLeft, navigate]);

    useEffect(() => {
        Cookies.set("bookingStep", step, { expires: 1 / 144 });
    }, [step]);

    useEffect(() => {
        const pathnameWhenMounted = window.location.pathname;
        return () => {
            if (pathnameWhenMounted === "/dat-ve") {
                Cookies.remove("bookingStep");
            }
        };
    }, []);

    const handleContinue = () => {
        if (selectedSeats.length === 0) {
            toast.error("Vui lòng chọn ghế", {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
            return;
        }

        if (step === "select-seat") {
            setStep("payment");
        } else if (step === "payment") {
            setShowTermsModal(true);
        }
    };

    useEffect(() => {
        if (step !== "select-seat") return;

        // Polling every 3 seconds
        const intervalId = setInterval(() => {
            fetchSeats();
        }, 3000);

        // Clean up on step change or unmount
        return () => clearInterval(intervalId);
    }, [step, showtimeId, user]);

    return (
        <>
            <Helmet>
                <title>Chọn ghế</title>
            </Helmet>
            <div className="container flex flex-col md:flex-row p-4">
                {step === "select-seat" && (
                    <SelectSeat
                        selectedSeats={selectedSeats}
                        seats={seats}
                        timeLeft={timeLeft}
                        user={user}
                        toggleSeat={toggleSeat}
                    />
                )}
                {step === "payment" && (
                    <Checkout
                        timeLeft={timeLeft}
                        user={user}
                        selectedSeats={selectedSeats}
                        seats={seats}
                        onProductsChange={setSelectedProducts}
                        onPromoChange={setPromoName}
                    />
                )}
                <div className="md:w-1/3 bg-white shadow-md p-4 space-y-4">
                    <MovieInfo
                        movie={movie}
                        parsedCinema={parsedCinema}
                        showtime={showtime}
                        selectedSeats={selectedSeats}
                        handleContinue={handleContinue}
                        goBackToSelectSeat={step === "payment" ? () => setStep("select-seat") : null}
                    />
                </div>
            </div>
            {showTermsModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">ĐIỀU KHOẢN THANH TOÁN</h2>
                        <div className="max-h-[300px] overflow-y-auto text-sm space-y-2">
                            <p><strong>1.</strong> Thẻ phải được kích hoạt chức năng thanh toán trực tuyến...</p>
                            <p><strong>2.</strong> Vé đã thanh toán không hoàn, không đổi.</p>
                            <p><strong>3.</strong> Trong vòng 30 phút sau khi thanh toán sẽ gửi Quý khách mã xác nhận thông tin vé/đơn hàng qua email.</p>
                            <p><strong>4.</strong> VieFilm không chịu trách nhiệm nếu thông tin email/số điện thoại sai khiến Quý khách không nhận được mã xác nhận.</p>
                        </div>
                        <div className="flex items-center mt-4 gap-2">
                            <input
                                type="checkbox"
                                id="agreeTerms"
                                checked={agreed}
                                onChange={() => setAgreed(!agreed)}
                            />
                            <label htmlFor="agreeTerms" className="text-sm">Tôi đồng ý với điều khoản</label>
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <button onClick={() => setShowTermsModal(false)} className="px-4 py-2 bg-gray-300 rounded">
                                Hủy
                            </button>
                            <button
                                onClick={() => {
                                    if (!agreed) {
                                        toast.error("Bạn cần đồng ý với điều khoản", { autoClose: 3000 });
                                        return;
                                    }

                                    const holdSeatsData = JSON.parse(Cookies.get(holdSeatsKey) || "[]");
                                    const ticketId = holdSeatsData.length > 0 ? holdSeatsData[0]._id : null;

                                    const data = {
                                        ticketId,
                                        products: selectedProducts,
                                        paymentMethodId: "6806803aecea502ee1874bb5",
                                        promoName
                                    };

                                    checkOut(data).then((res) => {
                                        window.location.href = res.data.data;
                                    });

                                    setShowTermsModal(false);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Booking;
