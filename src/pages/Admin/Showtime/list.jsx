import { Helmet } from "react-helmet";
import { DatePicker, Space, Button, Table, Select, message, Modal } from 'antd';
import { getAll, deleteShowtime } from "@apis/showtimeService";
import { getAllByCinema } from "@apis/screenService";
import { getMovies } from "@apis/movieService";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from 'react-icons/fa';

function List() {
    const [messageApi, contextHolder] = message.useMessage();

    const storedCinema = localStorage.getItem("cinema");
    const parsedProvince = storedCinema ? JSON.parse(storedCinema) : null;
    const cinemaIdFromStorage = parsedProvince?._id;

    const [date, setDate] = useState('');
    const [cinemaId, setCinemaId] = useState(cinemaIdFromStorage);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [screens, setScreens] = useState([]);
    const [movies, setMovies] = useState([]);
    const [selectedScreen, setSelectedScreen] = useState("");
    const [selectedMovie, setSelectedMovie] = useState("");

    const onChange = (date, dateString) => {
        setDate(dateString);
    };

    const fetchShowtimes = () => {
        setLoading(true);

        const data = {
            date: date || "",
            cinemaId: cinemaId || "",
            screenId: selectedScreen || "",
            movieId: selectedMovie || "",
        };

        if (!cinemaId) {
            console.error("Không có cinemaId!");
            setLoading(false);
            return;
        }

        getAll(data)
            .then((res) => {
                setShowtimes(res.data);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy suất chiếu:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchShowtimes();
    }, [date, cinemaId, selectedScreen, selectedMovie]);

    useEffect(() => {
        if (cinemaId) {
            getAllByCinema(cinemaId)
                .then((res) => setScreens(res.data))
                .catch((error) => console.error("Lỗi khi lấy danh sách phòng chiếu:", error));
        } else {
            setScreens([]);
        }
    }, [cinemaId]);

    useEffect(() => {
        getMovies()
            .then((res) => setMovies(res.data))
            .catch((error) => console.error("Lỗi khi lấy danh sách phim:", error));
    }, []);

    // Listen to cinemaChanged and storage
    useEffect(() => {
        const handleCinemaChange = () => {
            const stored = localStorage.getItem("cinema");
            const parsed = stored ? JSON.parse(stored) : null;
            const newCinemaId = parsed?._id || "";
            setCinemaId(newCinemaId);
        };

        window.addEventListener("cinemaChanged", handleCinemaChange);
        window.addEventListener("storage", handleCinemaChange);

        return () => {
            window.removeEventListener("cinemaChanged", handleCinemaChange);
            window.removeEventListener("storage", handleCinemaChange);
        };
    }, []);

    const handleScreenChange = (value) => {
        setSelectedScreen(value);
    };

    const handleMovieChange = (value) => {
        setSelectedMovie(value);
    };

    const showDeleteConfirm = (record) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa suất chiếu này?",
            content: `Phim: ${record.movieTitle} | Phòng: ${record.screenName}`,
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk() {
                const data = {
                    cinemaId: cinemaId,
                    showtimeId: record._id
                };
                return deleteShowtime(data)
                    .then((res) => {
                        message.success(res.message);
                        fetchShowtimes();
                    })
                    .catch(() => {
                        message.error("Xóa suất chiếu thất bại!");
                    });
            }
        });
    };

    const columns = [
        {
            title: 'Phim',
            dataIndex: 'movieTitle',
            key: 'movieTitle',
        },
        {
            title: 'Phòng chiếu',
            dataIndex: 'screenName',
            key: 'screenName',
        },
        {
            title: 'Giờ chiếu',
            dataIndex: 'startTime',
            key: 'startTime',
        },
        {
            title: 'Kết thúc',
            dataIndex: 'endTime',
            key: 'endTime',
        },
        {
            title: 'Thời gian',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div className="flex gap-2">
                    <Link to={`/admin/suat-chieu/${record._id}/chinh-sua`}>
                        <button className="hidden sm:inline-block px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer">
                            Sửa
                        </button>
                    </Link>
                    <button onClick={() => showDeleteConfirm(record)} className="hidden sm:inline-block px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer">
                        Xóa
                    </button>
                    <Link to={`/admin/suat-chieu/${record._id}/chinh-sua`}>
                        <button className="sm:hidden text-yellow-500 hover:text-yellow-700 cursor-pointer">
                            <FaEdit />
                        </button>
                    </Link>
                    <button onClick={() => showDeleteConfirm(record)} className="sm:hidden text-red-500 hover:text-red-700 cursor-pointer">
                        <FaTrash />
                    </button>
                </div>
            ),
        }
    ];

    return (
        <>
            {contextHolder}
            <Helmet>
                <title>Suất chiếu</title>
            </Helmet>
            <h2>Danh sách suất chiếu</h2>
            <div className="p-4">
                <div className="flex mb-4 justify-between flex-wrap gap-4">
                    <Space direction="vertical">
                        <DatePicker onChange={onChange} format="DD/MM/YYYY" />
                    </Space>
                    <div className="flex gap-4 flex-wrap">
                        <Select
                            placeholder="Chọn phòng chiếu"
                            value={selectedScreen}
                            onChange={handleScreenChange}
                            options={[
                                { label: "Không chọn phòng chiếu", value: "" },
                                ...screens.map(screen => ({
                                    label: screen.name,
                                    value: screen._id
                                }))
                            ]}
                            style={{ width: 200 }}
                        />
                        <Select
                            placeholder="Chọn phim"
                            value={selectedMovie}
                            onChange={handleMovieChange}
                            options={[
                                { label: "Không chọn phim", value: "" },
                                ...movies.map(movie => ({
                                    label: movie.title,
                                    value: movie._id
                                }))
                            ]}
                            style={{ width: 200 }}
                        />
                    </div>
                    <Link to={`/admin/suat-chieu/them-moi`}>
                        <Button type="primary">Thêm mới</Button>
                    </Link>
                </div>

                <Table
                    dataSource={showtimes.map(item => ({ ...item, key: item._id }))}
                    columns={columns}
                    pagination={{ position: ['bottomCenter'] }}
                    scroll={{ x: 'max-content' }}
                    loading={loading}
                />
            </div>
        </>
    );
}

export default List;
