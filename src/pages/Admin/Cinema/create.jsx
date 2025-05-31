import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { Button, Form, Input, message, Upload, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createCinema } from "@apis/cinemaService";
import { useNavigate } from "react-router-dom";

const create = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [fileList, setFileList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    // Xử lý khi người dùng upload ảnh
    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    // Gửi FormData lên API
    const onFinish = async (values) => {
        setIsLoading(true); // Set loading

        const { name, address } = values;
        const formData = new FormData();
        formData.append("name", name);
        formData.append("address", address);

        // Gửi ảnh nếu có
        const newImage = fileList.find(file => !!file.originFileObj);
        if (newImage) {
            formData.append("images", newImage.originFileObj);
        }

        const storedProvince = localStorage.getItem("province");
        try {
            const parsedProvince = storedProvince ? JSON.parse(storedProvince) : null;
            if (parsedProvince?._id) {
                formData.append("provinceId", parsedProvince._id);
            }
        } catch (err) {
            console.warn("Không thể parse province từ localStorage:", err);
        }

        try {
            const res = await createCinema(formData);
            message.success(res.data.message);
            navigate("/admin/rap");
        } catch (err) {
            messageApi.open({
                type: "error",
                content: err?.response?.data?.message || "Lỗi không xác định!",
            });
        } finally {
            setIsLoading(false); // Tắt loading
        }
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            {contextHolder}
            <Helmet><title>Thêm mới</title></Helmet>
            <h3 className="mb-4">Thêm mới</h3>

            <Form
                form={form}
                name="create-province"
                style={{ maxWidth: 400}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Skeleton loading={isLoading} active>
                    <Form.Item
                        label="Rạp phim"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tỉnh thành!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Ảnh">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={handleChange}
                            beforeUpload={() => false} // Không tự động upload
                        >
                            {fileList.length < 1 && <div><PlusOutlined /> Tải ảnh lên</div>}
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading}>
                            Thêm mới
                        </Button>
                    </Form.Item>
                </Skeleton>
            </Form>
        </>
    );
};

export default create;
