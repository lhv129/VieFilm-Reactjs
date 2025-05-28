import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
    Form,
    Input,
    Button,
    DatePicker,
    InputNumber,
    Select,
    Upload,
    message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getOne, updateMovie } from "@apis/movieService";

const { TextArea } = Input;
const { Option } = Select;

function EditMovie() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [movieStatus, setMovieStatus] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await getOne(slug);
                const movie = res.data;

                setMovieStatus(movie.status);

                form.setFieldsValue({
                    title: movie.title,
                    description: movie.description,
                    trailer: movie.trailer,
                    directors: movie.directors,
                    actors: movie.actors,
                    genres: movie.genres,
                    language: movie.language,
                    duration: movie.duration,
                    rating: movie.rating,
                    releaseDate: dayjs(movie.releaseDate),
                    endDate: dayjs(movie.endDate),
                    ageRating: movie.ageRating,
                });

                setFileList([
                    {
                        uid: "-1",
                        name: "poster.png",
                        status: "done",
                        url: movie.poster,
                    },
                ]);
            } catch (error) {
                message.error("Không thể tải thông tin phim.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovie();
    }, [slug, form]);

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const onFinish = async (values) => {
        setIsSubmitting(true);

        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (key === "releaseDate" || key === "endDate") {
                formData.append(key, value.format("DD/MM/YYYY"));
            } else {
                formData.append(key, value);
            }
        });

        const poster = fileList.find(file => !!file.originFileObj);
        if (poster) {
            formData.append("poster", poster.originFileObj);
        }

        try {
            const res = await updateMovie(slug, formData);
            message.success(res.data.message);
            navigate("/admin/phim");
        } catch (error) {
            const errors = error?.response?.data?.errors;
            if (Array.isArray(errors)) {
                form.setFields(
                    errors.map(err => ({
                        name: [err.field],
                        errors: [err.message],
                    }))
                );
            } else {
                messageApi.open({
                    type: "error",
                    content: error?.response?.data?.message || "Đã xảy ra lỗi!",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Helmet><title>Chỉnh sửa phim</title></Helmet>
            <h3 className="mb-4">Chỉnh sửa phim</h3>

            {!isLoading && (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ maxWidth: 600 }}
                >
                    <Form.Item name="title" label="Tên phim" rules={[{ required: true, message: "Vui lòng nhập tên phim!" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}>
                        <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item name="trailer" label="Trailer" rules={[{ required: true, message: "Vui lòng nhập trailer!" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Poster">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={handleChange}
                            beforeUpload={() => false}
                            maxCount={1}
                        >
                            {fileList.length < 1 && <div><PlusOutlined /> Tải ảnh lên</div>}
                        </Upload>
                    </Form.Item>

                    <Form.Item name="directors" label="Đạo diễn" rules={[{ required: true, message: "Vui lòng nhập tên đạo diễn!" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="actors" label="Diễn viên" rules={[{ required: true, message: "Vui lòng nhập tên diễn viên!" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="genres" label="Thể loại" rules={[{ required: true, message: "Vui lòng nhập thể loại!" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="language" label="Ngôn ngữ" rules={[{ required: true, message: "Vui lòng nhập ngôn ngữ!" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true, message: "Vui lòng nhập thời lượng phim!" }]}>
                        <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item name="rating" label="Đánh giá IMDb" rules={[{ required: true, message: "Vui lòng nhập điểm IMDb!" }]}>
                        <InputNumber min={0} max={10} step={0.1} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item name="releaseDate" label="Ngày khởi chiếu" rules={[{ required: true, message: "Vui lòng chọn ngày khởi chiếu!" }]}>
                        <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} disabled={movieStatus === "active"}/>
                    </Form.Item>

                    <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}>
                        <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} disabled={movieStatus === "active"}/>
                    </Form.Item>

                    <Form.Item name="ageRating" label="Giới hạn tuổi" rules={[{ required: true, message: "Vui lòng chọn giới hạn độ tuổi!" }]}>
                        <Select placeholder="Chọn độ tuổi">
                            <Option value="P">P</Option>
                            <Option value="T13">T13</Option>
                            <Option value="T16">T16</Option>
                            <Option value="T18">T18</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isSubmitting}>
                            Cập nhật phim
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </>
    );
}

export default EditMovie;
