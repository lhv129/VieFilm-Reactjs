import React, { useEffect, useState } from 'react';
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
import { getOne, updateProduct } from "@apis/productService";
import { useParams, useNavigate } from 'react-router-dom';

const edit = () => {
    const { slug } = useParams();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getOne(slug);
                const data = res.data;
                form.setFieldsValue({
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    status: data.status === 'active',
                });
                if (data.images) {
                    setFileList([{
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: data.images,
                    }]);
                }
            } catch (error) {
                message.error('Không thể tải dữ liệu sản phẩm');
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [slug, form]);

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
        formData.append("status", status ? "active" : "inactive");

        const imageFile = fileList.find(file => !!file.originFileObj);
        if (imageFile) {
            formData.append("images", imageFile.originFileObj);
        }

        try {
            const res = await updateProduct(slug, formData);
            message.success(res.data.message);
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Helmet><title>Chỉnh sửa sản phẩm</title></Helmet>
            <h3 className="mb-4">Chỉnh sửa sản phẩm</h3>

            {isFetching ? (
                <Skeleton active />
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ maxWidth: 500 }}
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
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </>
    );
};

export default edit;
