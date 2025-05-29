import React, { useState } from 'react';
import { Table, Tag, Image, Modal, Switch } from 'antd';
import Expandable20Text from '@components/ExpandableText/Expandable20Text';
import Expandable5Text from '@components/ExpandableText/Expandable5Text';
import renderAgeTag from '@components/renderAgeTag/renderAgeTag';
import dayjs from 'dayjs';
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { updateStatusMovie } from "@apis/movieService";

const MovieTable = ({ movies, onReload }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [loading, setLoading] = useState(false); // trạng thái loading để chặn spam

    const formatDate = (timestamp) => dayjs(timestamp).format('DD/MM/YYYY');

    const handleStatusClick = async (movieId, currentStatus) => {
        if (loading) return; // chặn nếu đang loading
        setLoading(true);
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            const data = {
                movieId: movieId,
                status: newStatus,
            };
            await updateStatusMovie(data);
            if (onReload) {
                await onReload();
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
        } finally {
            setLoading(false);
        }
    };

    const onTagClick = (record) => {
        if (loading) return; // chặn click khi đang loading

        if (record.status === 'active') {
            // Đang công chiếu => đổi luôn về chưa công chiếu
            handleStatusClick(record._id, record.status);
        } else {
            // Chưa công chiếu => hiện modal xác nhận
            setSelectedMovie(record);
            setModalVisible(true);
        }
    };

    const handleModalOk = () => {
        if (loading) return; // tránh ấn OK nhiều lần
        if (selectedMovie) {
            handleStatusClick(selectedMovie._id, selectedMovie.status);
        }
        setModalVisible(false);
        setSelectedMovie(null);
    };

    const handleModalCancel = () => {
        if (loading) return; // tránh đóng modal khi đang loading
        setModalVisible(false);
        setSelectedMovie(null);
    };

    const columns = [
        {
            title: 'Poster',
            dataIndex: 'poster',
            key: 'poster',
            render: (url) => <Image src={url} width={60} alt="Poster" />,
            fixed: 'left',
        },
        {
            title: 'Tên phim',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            responsive: ['md'],
            render: (text) => <Expandable20Text text={text} />,
        },
        {
            title: 'Đạo diễn',
            dataIndex: 'directors',
            key: 'directors',
            responsive: ['md'],
            render: (text) => <Expandable5Text text={text} />,
        },
        {
            title: 'Diễn viên',
            dataIndex: 'actors',
            key: 'actors',
            render: (text) => <Expandable5Text text={text} />,
        },
        {
            title: 'Ngày công chiếu',
            dataIndex: 'releaseDate',
            key: 'releaseDate',
            render: (timestamp) => formatDate(timestamp),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (timestamp) => formatDate(timestamp),
        },
        {
            title: 'Thể loại',
            dataIndex: 'genres',
            key: 'genres',
            responsive: ['md'],
        },
        {
            title: 'Thời lượng',
            dataIndex: 'duration',
            key: 'duration',
            render: (minutes) => `${minutes} phút`,
        },
        {
            title: 'Giới hạn tuổi',
            dataIndex: 'ageRating',
            key: 'ageRating',
            render: renderAgeTag,
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Switch
                    checked={status === 'active'}
                    checkedChildren="Đang chiếu"
                    unCheckedChildren="Chưa chiếu"
                    onChange={() => onTagClick(record)}
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
                    <Link to={`/admin/phim/${record.slug}/chinh-sua`}>
                        <button className="hidden sm:inline-block px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer">
                            Sửa
                        </button>
                    </Link>
                    {/* <button onClick={() => showDeleteConfirm(record)} className="hidden sm:inline-block px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer">
                        Xóa
                    </button> */}

                    {/* Icon hiển thị trên mobile */}
                    <Link to={`/admin/phim/${record.slug}/chinh-sua`}>
                        <button className="sm:hidden text-yellow-500 hover:text-yellow-700 cursor-pointer">
                            <FaEdit />
                        </button>
                    </Link>

                    {/* <button onClick={() => showDeleteConfirm(record)} className="sm:hidden text-red-500 hover:text-red-700 cursor-pointer">
                        <FaTrash />
                    </button> */}
                </div>
            ),
        }
    ];

    return (
        <>
            <div className="overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={movies}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 'max-content' }}
                    bordered
                    loading={loading} // bạn có thể để loading này cho Table nếu muốn
                />
            </div>

            <Modal
                title="Xác nhận thay đổi trạng thái"
                visible={modalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="OK"
                cancelText="Hủy"
                confirmLoading={loading} // hiện spinner trên nút OK khi đang gọi API
                maskClosable={!loading} // không cho click ngoài đóng modal khi loading
                closable={!loading} // không cho đóng modal khi loading
            >
                <p>Bạn muốn công chiếu phim này thì sẽ không thay đổi được thời gian chiếu? Bạn có chắc không?</p>
            </Modal>
        </>
    );
};

export default MovieTable;
