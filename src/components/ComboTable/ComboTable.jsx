import React, { useState } from 'react';
import { Table, Switch, Image, Tag, message, Modal } from 'antd';
import Expandable5Text from '@components/ExpandableText/Expandable5Text';
import { updateStatus, deleteProduct } from '@apis/productService';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ComboTable = ({ combos, onReload }) => {
    const [loading, setLoading] = useState(false);

    const handleToggleStatus = async (record) => {
        if (loading) return;
        setLoading(true);

        const newStatus = record.status === 'active' ? 'inactive' : 'active';
        try {
            await updateStatus({ slug: record.slug, status: newStatus });
            message.success('Cập nhật trạng thái thành công');
            onReload?.();
        } catch (error) {
            // console.error('Lỗi cập nhật trạng thái:', error);
            message.error('Cập nhật thất bại');
        } finally {
            setLoading(false);
        }
    };

    const showDeleteConfirm = (product) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn xóa sản phẩm này?',
            content: `Sản phẩm: ${product.name}`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                deleteProduct(product.slug).then(() => {
                    message.success("Xóa thành công");
                    onReload?.();
                })
                    .catch(() => message.error("Xóa thất bại"));
            },
            onCancel() {
                console.log('Hủy xóa');
            },
        });
    };

    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'images',
            key: 'images',
            render: (url) => (
                <div style={{ textAlign: 'center' }}>
                    <Image src={url} width={80} alt="Combo" />
                </div>
            ),
        },

        {
            title: 'Tên combo',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (text) => <Expandable5Text text={text} />,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => Number(price).toLocaleString('vi-VN') + ' ₫',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Switch
                    checked={status === 'active'}
                    checkedChildren="Bật"
                    unCheckedChildren="Tắt"
                    onChange={() => handleToggleStatus(record)}
                    disabled={loading}
                />
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div className="flex gap-2">
                    {/* Ẩn nút, hiện icon khi responsive */}
                    <Link to={`/admin/san-pham/${record.slug}/chinh-sua`}>
                        <button className="hidden sm:inline-block px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer">
                            Sửa
                        </button>
                    </Link>
                    <button onClick={() => showDeleteConfirm(record)} className="hidden sm:inline-block px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer">
                        Xóa
                    </button>

                    {/* Icon hiển thị trên mobile */}
                    <Link to={`/admin/san-pham/${record.slug}/chinh-sua`}>
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
        <Table
            columns={columns}
            dataSource={combos}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
            bordered
        />
    );
};

export default ComboTable;
