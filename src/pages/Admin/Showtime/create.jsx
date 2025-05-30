import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker, message } from "antd";
import { Helmet } from "react-helmet";
import dayjs from "dayjs";
import { getMovies } from "@apis/movieService";
import { getAllByCinema } from "@apis/screenService";
import { createShowtime, getAllByScreen, getEmptyShowtimeByScreen } from "@apis/showtimeService";
import { useNavigate } from "react-router-dom";

const Create = () => {
    const [movies, setMovies] = useState([]);
    const [screens, setScreens] = useState([]);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedScreen, setSelectedScreen] = useState(null);
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);

    const [existingShowtimes, setExistingShowtimes] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);

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

    const fetchShowtimes = async () => {
        if (selectedMovie && selectedScreen && date) {
            try {
                const res = await getAllByScreen({
                    movieId: selectedMovie._id,
                    screenId: selectedScreen._id,
                    date: dayjs(date).format("DD/MM/YYYY"),
                });
                setExistingShowtimes(res.data.data || []);
            } catch (err) {
                console.error("Lỗi lấy suất chiếu:", err);
                setExistingShowtimes([]);
            }
        } else {
            setExistingShowtimes([]);
        }
    };

    const fetchAvailableTimes = async () => {
        if (selectedMovie && selectedScreen && date) {
            try {
                const res = await getEmptyShowtimeByScreen({
                    movieId: selectedMovie._id,
                    screenId: selectedScreen._id,
                    date: dayjs(date).format("DD/MM/YYYY"),
                });
                setAvailableTimes(res.data.data || []);
            } catch (err) {
                console.error("Lỗi lấy giờ trống:", err);
                setAvailableTimes([]);
            }
        } else {
            setAvailableTimes([]);
        }
    };

    useEffect(() => {
        fetchShowtimes();
        fetchAvailableTimes();
    }, [selectedMovie, selectedScreen, date]);



    const onFinish = async (values) => {
        const { movieId, screenId, date, times } = values;
        const cinema = JSON.parse(localStorage.getItem("cinema") || "{}");

        const payloads = times.map(time => ({
            movieId,
            screenId,
            cinemaId: cinema._id,
            date: dayjs(date).format("DD/MM/YYYY"),
            startTime: time
        }));

        try {
            for (const payload of payloads) {
                await createShowtime(payload);
            }
            message.success("Tạo nhiều suất chiếu thành công!");
            await fetchShowtimes();
            await fetchAvailableTimes();
            // Xóa lựa chọn giờ nếu cần
            form.setFieldValue("times", []);
            setTime([]);
        } catch (err) {
            await fetchShowtimes();
            await fetchAvailableTimes();
            form.setFieldValue("times", []);
            setTime([]);
            message.error(err?.response?.data?.message || "Lỗi tạo suất chiếu");
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
                    className="w-full md:w-2/5"
                >
                    <Form.Item
                        label="Phim"
                        name="movieId"
                        rules={[{ required: true, message: "Vui lòng chọn phim" }]}
                    >
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
                        rules={[{ required: true, message: "Vui lòng chọn phòng chiếu" }]}
                    >
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
                        rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
                    >
                        <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} onChange={handleDateChange} />
                    </Form.Item>

                    <Form.Item
                        label="Giờ chiếu"
                        name="times"
                        rules={[{ required: true, message: "Vui lòng chọn ít nhất một giờ" }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Chọn nhiều giờ chiếu"
                            style={{ width: "100%" }}
                            onChange={setTime}
                        >
                            {Array.from({ length: 24 }, (_, hour) =>
                                ["00","05","10", "15", "20", "25", "30", "35", "40", "45"].map(min => {
                                    const time = `${hour.toString().padStart(2, "0")}:${min}`;
                                    return (
                                        <Select.Option key={time} value={time}>
                                            {time}
                                        </Select.Option>
                                    );
                                })
                            ).flat()}
                        </Select>
                    </Form.Item>

                    <Form.Item className="flex gap-4">
                        <Button type="primary" htmlType="submit">
                            Thêm suất chiếu
                        </Button>
                    </Form.Item>
                </Form>

                <div className="mt-6 p-6 border bg-white rounded-lg shadow-md w-full md:w-2/5 space-y-4 text-sm">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">🎟️ Thông tin suất chiếu</h4>

                    {selectedMovie && (
                        <div className="space-y-2">
                            <p><strong>🎬 Phim:</strong> {selectedMovie.title}</p>
                            <p><strong>🕐 Thời lượng:</strong> {selectedMovie.duration} phút</p>
                            <p><strong>📅 Ngày công chiếu:</strong> {dayjs(selectedMovie.releaseDate).format("DD/MM/YYYY")}</p>
                            <img
                                src={selectedMovie.poster}
                                alt="Poster"
                                className="w-full max-w-[180px] rounded-md border shadow"
                            />
                        </div>
                    )}

                    {selectedScreen && (
                        <p><strong>🏢 Phòng chiếu:</strong> {selectedScreen.name}</p>
                    )}

                    {date && (
                        <p><strong>📅 Ngày chiếu:</strong> {dayjs(date).format("DD/MM/YYYY")}</p>
                    )}

                    {Array.isArray(time) && time.length > 0 && (
                        <p><strong>🕐 Giờ chiếu:</strong> {time.join(", ")}</p>
                    )}

                    {selectedMovie && selectedScreen && date && (
                        <div className="p-4 border bg-blue-50 rounded-lg space-y-2">
                            <p className="text-sm font-medium text-gray-700">
                                📅 Ngày <span className="font-semibold">{dayjs(date).format("DD/MM/YYYY")}</span> {selectedScreen.name} đang có{" "}
                                <span className="text-blue-600 font-bold">{existingShowtimes.length}</span> suất chiếu:
                            </p>
                            {existingShowtimes.length > 0 && (
                                <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                                    {existingShowtimes
                                        .slice()
                                        .sort((a, b) => {
                                            const [aH, aM] = a.startTime.split(":").map(Number);
                                            const [bH, bM] = b.startTime.split(":").map(Number);
                                            return aH !== bH ? aH - bH : aM - bM;
                                        })
                                        .map((st) => (
                                            <span
                                                key={st._id}
                                                className="inline-block px-2 py-1 bg-white border border-blue-300 rounded"
                                            >
                                                {st.startTime}
                                            </span>
                                        ))}
                                </div>
                            )}
                        </div>
                    )}

                    {availableTimes.length > 0 ? (
                        <div className="p-4 border bg-green-50 rounded-lg">
                            <h4 className="font-medium mb-2 text-green-800">✅ Giờ chiếu khả dụng:</h4>
                            <div className="flex flex-wrap gap-2 text-xs text-green-700">
                                {availableTimes
                                    .slice()
                                    .sort((a, b) => {
                                        const [aH, aM] = a.split(":").map(Number);
                                        const [bH, bM] = b.split(":").map(Number);
                                        return aH !== bH ? aH - bH : aM - bM;
                                    })
                                    .map((time) => (
                                        <span
                                            key={time}
                                            className="inline-block px-2 py-1 bg-green-100 border border-green-400 rounded"
                                        >
                                            {time}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500">Không có giờ chiếu khả dụng</p>
                    )}
                </div>

            </div>
        </>
    );
};

export default Create;
