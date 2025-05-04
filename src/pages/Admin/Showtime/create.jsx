import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker, TimePicker, message } from "antd";
import { Helmet } from "react-helmet";
import dayjs from "dayjs";
import { getMovies } from "@apis/movieService";
import { getAllByCinema } from "@apis/screenService";
import { createShowtime } from "@apis/showtimeService";
import { useNavigate } from "react-router-dom";

const Create = () => {
    const [movies, setMovies] = useState([]);
    const [screens, setScreens] = useState([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedScreen, setSelectedScreen] = useState(null);
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cinemaStorage = localStorage.getItem("cinema");
                const cinema = cinemaStorage ? JSON.parse(cinemaStorage) : null;

                const movieRes = await getMovies();
                const screenRes = await getAllByCinema(cinema._id);

                setMovies(movieRes.data || []);
                setScreens(screenRes.data || []);
            } catch (error) {
                console.error("Lỗi khi load dropdown:", error);
            }
        };

        fetchData();
    }, []);

    const onFinish = async (values) => {
        const { movieId, screenId, date, time } = values;
        const cinema = JSON.parse(localStorage.getItem("cinema") || "{}");

        const payload = {
            movieId,
            screenId,
            cinemaId: cinema._id,
            date: dayjs(date).format("DD/MM/YYYY"),
            startTime: dayjs(time).format("HH:mm")
        };

        try {
            const res = await createShowtime(payload);
            message.success(res.data.message);
            navigate("/admin/suat-chieu");
        } catch (err) {
            messageApi.open({
                type: "error",
                content: err?.response?.data?.message || "Lỗi tạo suất chiếu",
            });
        }
    };

    const handleSelectChange = async (value, type) => {
        if (type === "movieId") {
            const movie = movies.find(m => m._id === value);
            setSelectedMovie(movie || null);
        } else if (type === "screenId") {
            const screen = screens.find(s => s._id === value);
            setSelectedScreen(screen || null);
        }
    };

    const handleDateChange = (date) => {
        setDate(date);
    };

    const handleTimeChange = (time) => {
        setTime(time);
    };

    return (
        <>
            <Helmet>
                <title>Thêm suất chiếu</title>
            </Helmet>
            {contextHolder}
            <h3 className="mb-4">Thêm suất chiếu</h3>
            <div className="flex flex-col md:flex-row justify-between">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="w-full md:w-2/5" // Chiếm 100% trên mobile và 45% trên tablet, pc
                >
                    <Form.Item
                        label="Phim"
                        name="movieId"
                        rules={[{ required: true, message: "Vui lòng chọn phim" }]}>
                        <Select placeholder="Chọn phim" onChange={(e) => handleSelectChange(e, "movieId")}>
                            {movies.map((movie) => (
                                <Select.Option key={movie._id} value={movie._id}>
                                    {movie.title}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Phòng chiếu"
                        name="screenId"
                        rules={[{ required: true, message: "Vui lòng chọn phòng chiếu" }]}>
                        <Select placeholder="Chọn phòng chiếu" onChange={(e) => handleSelectChange(e, "screenId")}>
                            {screens.map((screen) => (
                                <Select.Option key={screen._id} value={screen._id}>
                                    {screen.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Ngày chiếu"
                        name="date"
                        rules={[{ required: true, message: "Vui lòng chọn ngày" }]}>
                        <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} onChange={handleDateChange} />
                    </Form.Item>

                    <Form.Item
                        label="Giờ chiếu"
                        name="time"
                        rules={[{ required: true, message: "Vui lòng chọn giờ" }]}>
                        <TimePicker format="HH:mm" style={{ width: "100%" }} onChange={handleTimeChange} />
                    </Form.Item>


                    <Form.Item className="flex gap-4">
                        <Button type="primary" htmlType="submit">
                            Thêm suất chiếu
                        </Button>
                    </Form.Item>
                </Form>
                {/* Hiển thị thông tin suất chiếu */}
                <div className="mt-4 p-4 border bg-gray-100 rounded-md w-full md:w-2/5">
                    <h4 className="font-bold">Thông tin suất chiếu:</h4>
                    {selectedMovie && (
                        <div>
                            <p><strong>🎬 Phim:</strong> {selectedMovie.title}</p>
                            <img src={selectedMovie.poster} className="w-50" alt="Poster" />
                        </div>
                    )}
                    {selectedScreen && (
                        <p><strong>🏢 Phòng chiếu:</strong> {selectedScreen.name}</p>
                    )}
                    {date && (
                        <p><strong>📅 Ngày chiếu:</strong> {dayjs(date).format("DD/MM/YYYY")}</p>
                    )}
                    {time && (
                        <p><strong>🕐 Giờ chiếu:</strong> {dayjs(time).format("HH:mm")}</p>
                    )}
                </div>

            </div>

        </>
    );
};

export default Create;
