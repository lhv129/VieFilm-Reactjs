import React, { useState } from 'react';
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
    Skeleton
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createMovie } from '@apis/movieService';

const { TextArea } = Input;
const { Option } = Select;

const create = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const onFinish = async (values) => {
        setIsLoading(true);

        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (key === 'releaseDate' || key === 'endDate') {
                formData.append(key, value.format('DD/MM/YYYY'));
            } else {
                formData.append(key, value);
            }
        });

        const poster = fileList.find(file => !!file.originFileObj);
        if (poster) {
            formData.append('poster', poster.originFileObj);
        }

        try {
            const res = await createMovie(formData);
            message.success(res.data.message);
            navigate("/admin/phim");
        } catch (error) {
            const errors = error?.response?.data?.errors;

            if (Array.isArray(errors)) {
                const formErrors = errors.map(err => ({
                    name: [err.field],
                    errors: [err.message],
                }));
                form.setFields(formErrors);
                messageApi.open({
                    type: 'error',
                    content: error?.response?.data?.message,
                });
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Đã xảy ra lỗi!',
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Helmet><title>Thêm mới phim</title></Helmet>
            <h3 className="mb-4">Thêm mới phim</h3>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
            >
                <Form.Item
                    name="title"
                    label="Tên phim"
                    rules={[{ required: true, message: 'Vui lòng nhập tên phim!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <TextArea rows={3} />
                </Form.Item>

                <Form.Item
                    name="trailer"
                    label="Trailer"
                    rules={[{ required: true, message: 'Vui lòng nhập trailer!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Poster">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleChange}
                        beforeUpload={() => false}
                    >
                        {fileList.length < 1 && (
                            <div><PlusOutlined /> Tải ảnh lên</div>
                        )}
                    </Upload>
                </Form.Item>

                <Form.Item
                    name="directors"
                    label="Đạo diễn"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đạo diễn!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="actors"
                    label="Diễn viên"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="genres"
                    label="Thể loại"
                    rules={[{ required: true, message: 'Vui lòng nhập thể loại!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="language"
                    label="Ngôn ngữ"
                    rules={[{ required: true, message: 'Vui lòng nhập ngôn ngữ!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="duration"
                    label="Thời lượng (phút)"
                    rules={[{ required: true, message: 'Vui lòng nhập thời lượng phim!' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="rating"
                    label="Đánh giá IMDb"
                    rules={[{ required: true, message: 'Vui lòng nhập điểm IMDb!' }]}
                >
                    <InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="releaseDate"
                    label="Ngày khởi chiếu"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày khởi chiếu!' }]}
                >
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="endDate"
                    label="Ngày kết thúc"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                >
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="ageRating"
                    label="Giới hạn tuổi"
                    rules={[{ required: true, message: 'Vui lòng chọn giới hạn độ tuổi!' }]}
                >
                    <Select placeholder="Chọn độ tuổi">
                        <Option value="P">P</Option>
                        <Option value="T13">T13</Option>
                        <Option value="T16">T16</Option>
                        <Option value="T18">T18</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Thêm phim
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default create;
