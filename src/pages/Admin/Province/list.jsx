import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal } from 'antd';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { getProvinces, deleteProvince } from '@apis/provinceService';
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

function Province() {

    const [provinces, setProvinces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        getProvinces().then((res) => {
            if (res) {
                const dataWithKeys = res.data.map((item) => ({
                    ...item,
                    key: item._id, // 👈 sử dụng _id làm key
                }));
                setProvinces(dataWithKeys);
            }
            setLoading(false);
        })
    }, [])

    const showDeleteConfirm = (province) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn xóa tỉnh thành này?',
            content: `Tỉnh thành: ${province.name}`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                deleteProvince(province.slug).then(() => {
                    message.success("Xóa thành công");
                    // Cập nhật lại danh sách
                    setProvinces(prev => prev.filter(item => item._id !== province._id));
                });
                message.success("Xóa thành công");
            },
            onCancel() {
                console.log('Hủy xóa');
            },
        });
    };


    const columns = [
        {
            title: 'Tỉnh thành',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div className="flex gap-2">
                    {/* Ẩn nút, hiện icon khi responsive */}
                    <Link to={`/admin/tinh-thanh/${record.slug}/chinh-sua`}>
                        <button className="hidden sm:inline-block px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer">
                            Sửa
                        </button>
                    </Link>
                    <button onClick={() => showDeleteConfirm(record)} className="hidden sm:inline-block px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer">
                        Xóa
                    </button>

                    {/* Icon hiển thị trên mobile */}
                    <Link to={`/admin/tinh-thanh/${record.slug}/chinh-sua`}>
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
                <title>Danh sách tỉnh thành</title>
            </Helmet>
            <div className="p-4">
                {/* Nút thêm mới */}
                <div className="flex justify-end mb-4">
                    <Link to={`/admin/tinh-thanh/them-moi`}>
                        <Button type="primary" className="bg-blue-500 hover:bg-blue-600 cursor-pointer">
                            Thêm mới
                        </Button>
                    </Link>
                </div>

                {/* Bảng dữ liệu */}
                <Table
                    dataSource={provinces}
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
