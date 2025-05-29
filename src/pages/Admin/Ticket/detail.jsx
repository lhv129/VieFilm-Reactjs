import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { getOne } from "@apis/ticketService";
import { useEffect, useState, useCallback } from "react";
import { message } from "antd";
import TicketCard from "@components/TicketCard/TicketCard";

function TicketDetail() {
    const { ticketId } = useParams(); // giả sử route là /ticket/:id

    const [loading, setLoading] = useState(false);
    const [ticket, setTicket] = useState(null);

    const fetchData = useCallback(() => {
        const storedCinema = JSON.parse(localStorage.getItem("cinema") || "null");
        const cinemaId = storedCinema?._id;
        if (!cinemaId) {
            message.error("Vui lòng chọn rạp phim");
            return;
        }
        setLoading(true);
        setTicket(null); // reset trước khi fetch

        getOne({ ticketId: ticketId, cinemaId })
            .then((res) => {
                if (res && res.data?.data) {
                    setTicket(res.data.data[0]);
                }
            })
            .catch(() => {
                message.error("Lấy dữ liệu thất bại");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [ticketId]);

    useEffect(() => {
        fetchData();

        const onCinemaChange = () => fetchData();
        const onStorageChange = (e) => {
            if (e.key === "cinema") fetchData();
        };

        window.addEventListener("cinemaChanged", onCinemaChange);
        window.addEventListener("storage", onStorageChange);

        return () => {
            window.removeEventListener("cinemaChanged", onCinemaChange);
            window.removeEventListener("storage", onStorageChange);
        };
    }, [fetchData]);

    return (
        <>
            <Helmet>
                <title>Chi tiết vé</title>
            </Helmet>
            {loading ? (
                <div className="text-center mt-10 text-gray-500">Đang tải dữ liệu vé...</div>
            ) : ticket ? (
                <TicketCard ticketData={ticket} />
            ) : (
                <div className="text-center mt-10 text-red-500">Không tìm thấy dữ liệu vé</div>
            )}
        </>
    );
}

export default TicketDetail;
