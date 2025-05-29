import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { getOne } from "@apis/ticketService";
import { useEffect, useState, useCallback } from "react";
import { message } from "antd";
import TicketCard from "@components/TicketCard/TicketCard";

function detail() {
    const ticketId = useParams();

    const [loading, setLoading] = useState(false);
    const [ticket, setTicket] = useState([]);

    const fetchData = useCallback(() => {
        const storedCinema = JSON.parse(localStorage.getItem("cinema") || "null");
        const cinemaId = storedCinema?._id;
        if (!cinemaId) {
            message.error("Vui lòng chọn rạp phim");
            return;
        }
        setLoading(true);
        const data = {
            ...ticketId,
            cinemaId: cinemaId
        }

        getOne(data)
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

    // Fetch data on mount and when filters change
    useEffect(() => {
        fetchData();

        const onCinemaChange = () => {
            fetchData();
        };
        window.addEventListener("cinemaChanged", onCinemaChange);
        window.addEventListener("storage", (e) => {
            if (e.key === "cinema") fetchData();
        });

        return () => {
            window.removeEventListener("cinemaChanged", onCinemaChange);
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
    )
}

export default detail;