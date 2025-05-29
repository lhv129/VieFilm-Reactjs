import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import {
    Button,
    Form,
    Input,
    InputNumber,
    Upload,
    message,
    Skeleton,
    Switch
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createProduct } from "@apis/productService";
import { useNavigate } from 'react-router-dom';

const create = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const onFinish = async (values) => {
        const { name, description, price, status } = values;
        setIsLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("status", status ? "active" : "inactive"); // ✅ Truyền dạng chuỗi

        const imageFile = fileList.find(file => !!file.originFileObj);
        if (imageFile) {
            formData.append("images", imageFile.originFileObj);
        }

        try {
            const res = await createProduct(formData);
            message.success(res.data.message);
            form.resetFields();
            setFileList([]);
            navigate("/admin/san-pham");
        } catch (err) {
            const resData = err.response?.data;
            if (Array.isArray(resData?.errors)) {
                const errorFields = resData.errors.map((e) => ({
                    name: [e.field],
                    errors: [e.message],
                }));
                form.setFields(errorFields);
            } else {
                messageApi.open({
                    type: "error",
                    content: err?.response?.data?.message || "Lỗi không xác định!",
                });
            }
        }
    };

    return (
        <>
            {contextHolder}
            <Helmet><title>Thêm mới sản phẩm</title></Helmet>
            <h3 className="mb-4">Thêm mới sản phẩm</h3>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ maxWidth: 500 }}
                initialValues={{ status: true }} // ✅ Mặc định là "active"
            >
                <Form.Item
                    label="Tên sản phẩm"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    label="Giá"
                    name="price"
                    rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Trạng thái"
                    name="status"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
                </Form.Item>

                <Form.Item label="Ảnh">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleChange}
                        beforeUpload={() => false}
                    >
                        {fileList.length < 1 && (
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Thêm mới
                    </Button>
                </Form.Item>

            </Form>
        </>
    );
};

export default create;
