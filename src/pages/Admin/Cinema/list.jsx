import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal } from 'antd';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { getAllByProvince, deleteCinema } from "@apis/cinemaService";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

function list() {
    const [cinemas, setCinemas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const fetchData = () => {
            const storedProv = JSON.parse(localStorage.getItem('province') || 'null');
            const provinceId = storedProv?._id;

            if (provinceId) {
                setLoading(true);
                getAllByProvince(provinceId).then((res) => {
                    if (res) {
                        const dataWithKeys = res.data.map((item) => ({
                            ...item,
                            key: item._id,
                        }));
                        setCinemas(dataWithKeys);
                    }
                    setLoading(false);
                }).catch(() => setLoading(false));
            } else {
                message.error("Vui lòng chọn tỉnh thành");
            }
        };

        // Lắng nghe cả custom event và storage event (cho tab khác)
        window.addEventListener('provinceChanged', fetchData);
        window.addEventListener('storage', fetchData); // storage event cho tab khác

        // Tải dữ liệu ban đầu
        fetchData();

        return () => {
            window.removeEventListener('provinceChanged', fetchData);
            window.removeEventListener('storage', fetchData);
        };
    }, []);

    const showDeleteConfirm = (cinema) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn xóa rạp phim này?',
            content: `Rạp phim: ${cinema.name}`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                deleteCinema(cinema.slug).then(() => {
                    message.success("Xóa thành công");
                    setCinemas(prev => prev.filter(item => item._id !== cinema._id));
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
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Ảnh',
            dataIndex: 'images',
            key: 'images',
            render: (url) => (
                <img src={url} alt="Ảnh rạp" className="w-50 h-auto object-cover rounded" />
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div className="flex gap-2">
                    {/* Ẩn nút, hiện icon khi responsive */}
                    <Link to={`/admin/rap/${record.slug}/chinh-sua`}>
                        <button className="hidden sm:inline-block px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer">
                            Sửa
                        </button>
                    </Link>
                    <button onClick={() => showDeleteConfirm(record)} className="hidden sm:inline-block px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer">
                        Xóa
                    </button>

                    {/* Icon hiển thị trên mobile */}
                    <Link to={`/admin/rap/${record.slug}/chinh-sua`}>
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
                    <Link to={`/admin/rap/them-moi`}>
                        <Button type="primary">Thêm mới</Button>
                    </Link>
                </div>

                <Table
                    dataSource={cinemas}
                    columns={columns}
                    pagination={{ position: ['bottomCenter'] }}
                    scroll={{ x: 'max-content' }}
                    loading={loading}
                />
            </div>
        </>
    );
}

export default list;
