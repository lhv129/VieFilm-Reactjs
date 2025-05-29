import React, { useState } from "react";
import { Table, Switch, message, Modal } from "antd";
import dayjs from "dayjs";
import { updateStatus, deletePromo } from "@apis/promoService"; // Giả sử bạn có API xóa nếu cần
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const PromoTable = ({ promos, onReload }) => {
    const [loading, setLoading] = useState(false);

    const handleToggleStatus = async (record) => {
        if (loading) return;
        setLoading(true);

        const newStatus = record.status === "active" ? "inactive" : "active";
        try {
            await updateStatus({promoId:record._id,status: newStatus });
            message.success("Cập nhật trạng thái thành công");
            onReload?.();
        } catch (error) {
            message.error("Cập nhật thất bại");
        } finally {
            setLoading(false);
        }
    };

    const showDeleteConfirm = (promo) => {
        Modal.confirm({
            title: "Bạn có chắc muốn xóa mã giảm giá này?",
            content: `Mã: ${promo.name}`,
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk() {
                // Nếu bạn có hàm deletePromo, xóa promo rồi reload
                return deletePromo(promo._id)
                    .then(() => {
                        message.success("Xóa thành công");
                        onReload?.();
                    })
                    .catch(() => {
                        message.error("Xóa thất bại");
                    });
            },
            onCancel() {
                // console.log('Hủy xóa');
            },
        });
    };

    const columns = [
        {
            title: "Tên mã",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
        },
        {
            title: "Giá giảm",
            dataIndex: "price",
            key: "price",
            render: (value) => `${value.toLocaleString("vi-VN")} ₫`,
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "startDate",
            key: "startDate",
            render: (date) => dayjs(date).format("DD/MM/YYYY"),
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "endDate",
            key: "endDate",
            render: (date) => dayjs(date).format("DD/MM/YYYY"),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status, record) => (
                <Switch
                    checked={status === "active"}
                    checkedChildren="Bật"
                    unCheckedChildren="Tắt"
                    onChange={() => handleToggleStatus(record)}
                    disabled={loading}
                />
            ),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Link to={`/admin/ma-giam-gia/${record._id}/chinh-sua`}>
                        <button className="hidden sm:inline-block px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer">
                            Sửa
                        </button>
                    </Link>

                    <button
                        onClick={() => showDeleteConfirm(record)}
                        className="hidden sm:inline-block px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                    >
                        Xóa
                    </button>

                    <Link to={`/admin/ma-giam-gia/${record._id}/chinh-sua`}>
                        <button className="sm:hidden text-yellow-500 hover:text-yellow-700 cursor-pointer">
                            <FaEdit />
                        </button>
                    </Link>

                    <button
                        onClick={() => showDeleteConfirm(record)}
                        className="sm:hidden text-red-500 hover:text-red-700 cursor-pointer"
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={promos}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content" }}
            bordered
        />
    );
};

export default PromoTable;
