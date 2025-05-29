import React, { useEffect, useState, useCallback } from "react";
import { Table, Tag, message, Input, DatePicker, Select, Row, Col, Button } from "antd";
import { Link } from "react-router-dom";
import { getAll } from "@apis/ticketService";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Helmet } from "react-helmet";

const { Option } = Select;

const List = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState("");
    const [debouncedFilterCode, setDebouncedFilterCode] = useState("");
    const [date, setDate] = useState(null);
    const [status, setStatus] = useState(null);

    // Debounce code input 500ms
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilterCode(code);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [code]);

    const fetchData = useCallback(() => {
        const storedCinema = JSON.parse(localStorage.getItem("cinema") || "null");
        const cinemaId = storedCinema?._id;

        if (!cinemaId) {
            message.error("Vui lòng chọn rạp phim");
            return;
        }

        setLoading(true);

        const params = {
            cinemaId,
        };
        if (debouncedFilterCode.trim()) params.code = debouncedFilterCode.trim();
        if (date) params.date = date.format("DD/MM/YYYY");
        if (status) params.status = status;

        getAll(params)
            .then((res) => {
                if (res && res.data?.data) {
                    setData(res.data.data);
                }
            })
            .catch(() => {
                message.error("Lấy dữ liệu thất bại");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [debouncedFilterCode, date, status]);

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

    const columns = [
        {
            title: "Mã đặt vé",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Khách hàng",
            dataIndex: "customer",
            key: "customer",
        },
        {
            title: "Phim",
            dataIndex: "movie",
            key: "movie",
        },
        {
            title: "Suất chiếu",
            key: "showtime",
            render: (_, record) => {
                const { showtime } = record;
                return `${showtime?.startTime || "--"} - ${showtime?.date || "--"}`;
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                let color = status === "paid" ? "green" : status === "used" ? "blue" : "volcano";
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: "Giá vé",
            key: "totalAmount",
            render: (_, record) => {
                return `${record.totalAmount?.toLocaleString()}₫`;
            },
        },
        {
            title: "Giảm giá",
            key: "discountPrice",
            render: (_, record) => {
                return `${record.discountPrice?.toLocaleString()}₫`;
            },
        },
        {
            title: "Thanh toán",
            dataIndex: "payment",
            key: "payment",
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div className="flex gap-2">
                    {/* Ẩn nút, hiện icon khi responsive */}
                    <Link to={`/admin/ve/${record._id}/chi-tiet`}>
                        <button className="hidden sm:inline-block px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                            Chi tiết
                        </button>
                    </Link>
                    {/* Icon hiển thị trên mobile */}
                    <Link to={`/admin/ve/${record._id}/chi-tiet`}>
                        <button className="sm:hidden text-blue-500 hover:text-blue-700 cursor-pointer">
                            <FaEdit />
                        </button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <>
            <Helmet>
                <title>Danh sách vé</title>
            </Helmet>
            <div>
                {/* Filter row */}
                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col xs={24} sm={8} style={{ marginBottom: 16 }}>
                        <Input
                            placeholder="Mã đặt vé"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            allowClear
                        />
                    </Col>

                    <Col xs={24} sm={8} style={{ marginBottom: 16 }}>
                        <DatePicker
                            style={{ width: "100%" }}
                            placeholder="Ngày đặt"
                            value={date}
                            onChange={(date) => setDate(date)}
                            allowClear
                            format="DD/MM/YYYY"
                        />
                    </Col>

                    <Col xs={24} sm={8} style={{ marginBottom: 16 }}>
                        <Select
                            placeholder="Trạng thái"
                            value={status}
                            onChange={(value) => setStatus(value)}
                            allowClear
                            style={{ width: "100%" }}
                        >
                            <Option value="paid">Đã thanh toán</Option>
                            <Option value="used">Đã sử dụng</Option>
                        </Select>
                    </Col>
                </Row>

                {/* Table */}
                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={data}
                    pagination={{ pageSize: 5 }}
                    loading={loading}
                    scroll={{ x: "max-content" }}
                />
            </div>
        </>
    );
};

export default List;
