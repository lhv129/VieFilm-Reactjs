import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { returnVNPAY } from "@apis/ticketService";
import { AlertTriangle, CheckCircle } from "lucide-react";
import TicketCard from "@components/TicketCard/TicketCard";
import { Helmet } from "react-helmet";
import { CheckCircle } from "lucide-react";

function ReturnVNPAY() {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [ticketData, setTicketData] = useState(null);
    const [isError, setIsError] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const showtimeId = searchParams.get("showtimeId");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await returnVNPAY();

                Cookies.remove("bookingStep");
                Cookies.remove(`holdSeats-${showtimeId}`);

                if (res.status === true && res.data) {
                    setTicketData(res.data);
                } else {
                    setIsError(true);
                    setMessage(res.message || "Đã xảy ra lỗi khi thanh toán.");
                    setTimeout(() => {
                        navigate("/");
                    }, 3000);
                }
            } catch (error) {
                Cookies.remove("bookingStep");
                Cookies.remove(`holdSeats-${showtimeId}`);
                setIsError(true);
                setMessage("Không thể kết nối máy chủ.");
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate, showtimeId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center mt-10 animate-pulse">
                <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Đang xử lý thanh toán...</p>
            </div>
        );
    }

    if (ticketData) {
        return (
            <>
                <Helmet>
                    <title>Thanh toán</title>
                </Helmet>
                <div className="flex items-center justify-center text-green-600 mt-4">
                    <CheckCircle className="w-6 h-6 mr-2" />
                    <h2 className="text-xl font-bold">Thanh toán thành công</h2>
                    <p className="text-sm text-center mb-6">Có thể chụp lại hoặc vào danh sách vé đã mua để xem lại vé</p>
                </div>
                <TicketCard ticketData={ticketData} />;
            </>
        )

    }


    if (isError) {
        return (
            <>
                <Helmet>
                    <title>Thanh toán</title>
                </Helmet>
                <div className="flex flex-col items-center justify-center mt-10 text-red-600 animate-fade-in">
                    <AlertTriangle className="w-10 h-10 mb-2" />
                    <p className="text-lg font-medium">{message}</p>
                    <p className="text-sm text-gray-500 mt-2">Đang chuyển về trang chủ...</p>
                </div>
            </>
        );
    }

    return null;
}

export default ReturnVNPAY;