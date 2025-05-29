import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import {
    Button,
    Form,
    Input,
    InputNumber,
    DatePicker,
    message,
    Switch
} from 'antd';
import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router-dom';
import { getOneBySlug, updatePromo } from "@apis/promoService";

const edit = () => {
    const { slug } = useParams();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [id, setId] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getOneBySlug(slug);
                const data = res.data;
                setId(data._id);
                form.setFieldsValue({
                    description: data.description,
                    price: data.price,
                    startDate: dayjs(data.startDate),
                    endDate: dayjs(data.endDate),
                    status: data.status === 'active',
                });
            } catch (error) {
                message.error('Không thể tải dữ liệu mã giảm giá');
            }
        };

        fetchData();
    }, [slug, form]);

    const onFinish = async (values) => {
        const { description, price, startDate, endDate, status } = values;
        setIsLoading(true);
        const body = {
            description,
            price,
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
            status: status ? "active" : "inactive",
        };

        try {
            const res = await updatePromo(id, body);
            message.success(res.data.message);
            navigate("/admin/ma-giam-gia");
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
            <Helmet><title>Chỉnh sửa mã giảm giá</title></Helmet>
            <h3 className="mb-4">Chỉnh sửa mã giảm giá</h3>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ maxWidth: 500 }}
            >
                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    label="Giá giảm"
                    name="price"
                    rules={[
                        { required: true, message: "Vui lòng nhập giá giảm!" },
                        { type: "number", min: 0, message: "Giá phải lớn hơn hoặc bằng 0" },
                    ]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        formatter={(value) =>
                            value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                </Form.Item>

                <Form.Item
                    label="Ngày bắt đầu"
                    name="startDate"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                >
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Ngày kết thúc"
                    name="endDate"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                >
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Trạng thái"
                    name="status"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default edit;
