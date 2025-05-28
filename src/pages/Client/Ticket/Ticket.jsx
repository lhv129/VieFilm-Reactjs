import TicketList from "@components/TicketList/TicketList";
import { useEffect, useState } from "react";
import { getAllByUser } from "@apis/ticketService";
import { Pagination, DatePicker, Spin } from "antd";
import dayjs from "dayjs";
import { Helmet } from "react-helmet";

function Ticket() {
    const [tickets, setTickets] = useState([]);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const limit = 5;

    useEffect(() => {
        setLoading(true);
        getAllByUser({ page, limit, date: selectedDate ? selectedDate.format("DD/MM/YYYY") : undefined })
            .then((res) => {
                setTickets(res.data);
                setTotalItems(
                    res.pagination.totalItems ?? (res.pagination.totalPages * limit) ?? 0
                );
            })
            .finally(() => setLoading(false));
    }, [page, selectedDate]);

    const handlePageChange = (page) => {
        setPage(page);
    };

    const handleDateChange = (date) => {
        setPage(1); // reset page khi đổi ngày
        setSelectedDate(date);
    };

    return (
        <>
            <Helmet>
                <title>Lịch sử mua vé</title>
            </Helmet>
            <div className="max-w-2xl mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Vé đã mua</h2>
                    <DatePicker
                        format="DD/MM/YYYY"
                        onChange={handleDateChange}
                        allowClear
                        placeholder="Chọn ngày"
                    />
                </div>

                <Spin spinning={loading}>
                    <TicketList tickets={tickets} />

                    {/* Pagination */}
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            current={page}
                            total={totalItems}
                            pageSize={limit}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                            showLessItems={true}  // Giới hạn hiển thị tối đa 5 trang
                        />
                    </div>
                </Spin>
            </div>
        </>
    );
}

export default Ticket;
