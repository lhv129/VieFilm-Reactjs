import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal } from 'antd';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { getAllByCinema } from "@apis/screenService";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

function Province() {
    const [screens, setScreens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const fetchData = () => {
            const storedCin = JSON.parse(localStorage.getItem('cinema') || 'null');
            const cinemaId = storedCin?._id;

            if (cinemaId) {
                setLoading(true);
                getAllByCinema(cinemaId)
                    .then((res) => {
                        const dataWithKeys = res.data.map((item) => ({
                            ...item,
                            key: item._id,
                        }));
                        setScreens(dataWithKeys);
                    })
                    .catch(() => {
                        message.error("Không thể tải dữ liệu phòng chiếu.");
                        setScreens([]); // fallback
                    })
                    .finally(() => setLoading(false));
            } else {
                // Nếu không có rạp (null cinema) thì xóa data cũ
                setScreens([]);
            }
        };

        window.addEventListener('cinemaChanged', fetchData);
        window.addEventListener('storage', fetchData); // tab khác

        // Initial load
        fetchData();

        return () => {
            window.removeEventListener('cinemaChanged', fetchData);
            window.removeEventListener('storage', fetchData);
        };
    }, []);

    const showDeleteConfirm = (screen) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn xóa phòng chiếu này?',
            content: `Phòng chiếu: ${screen.name}`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                deleteScreen(screen.screenCode).then(() => {
                    message.success("Xóa thành công");
                    setScreens(prev => prev.filter(item => item._id !== screen._id));
                }).catch(() => message.error("Xóa thất bại"));
            },
            onCancel() {
                console.log('Hủy xóa');
            },
        });
    };

    const columns = [
        {
            title: 'Rạp phim',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div className="flex gap-2">
                    {/* Ẩn nút, hiện icon khi responsive */}
                    <Link to={`/admin/rap/${record._id}/chinh-sua`}>
                        <button className="hidden sm:inline-block px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer">
                            Sửa
                        </button>
                    </Link>
                    <button onClick={() => showDeleteConfirm(record)} className="hidden sm:inline-block px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer">
                        Xóa
                    </button>

                    {/* Icon hiển thị trên mobile */}
                    <Link to={`/admin/rap/${record._id}/chinh-sua`}>
                        <button className="sm:hidden text-yellow-500 hover:text-yellow-700 cursor-pointer">
                            <FaEdit />
                        </button>
                    </Link>

                    <button onClick={() => showDeleteConfirm(record)} className="sm:hidden text-red-500 hover:text-red-700 cursor-pointer">
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            {contextHolder}
            <Helmet>
                <title>Danh sách rạp phim</title>
            </Helmet>
            <div className="p-4">
                <div className="flex justify-end mb-4">
                    <Link to={`/admin/phong-chieu/them-moi`}>
                        <Button type="primary">Thêm mới</Button>
                    </Link>
                </div>

                <Table
                    dataSource={screens}
                    columns={columns}
                    pagination={{ position: ['bottomCenter'] }}
                    scroll={{ x: 'max-content' }}
                    loading={loading}
                />
            </div>
        </>
    );
}

export default Province;
