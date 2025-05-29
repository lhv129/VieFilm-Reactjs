import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Button, Form, Input, InputNumber, message, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import { createPromo } from "@apis/promoService"; // Thay đổi API tương ứng

const create = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Chuẩn bị payload gửi API
            const payload = {
                description: values.description,
                price: values.price,
                startDate: values.startDate,
                endDate: values.endDate,
                status: values.status ? "active" : "inactive",
            };

            const res = await createPromo(payload);
            message.success(res.data.message || "Tạo mã giảm giá thành công!");
            form.resetFields();
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
            setLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Helmet>
                <title>Thêm mới mã giảm giá</title>
            </Helmet>

            <h3 className="mb-4">Thêm mới mã giảm giá</h3>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ maxWidth: 500 }}
                initialValues={{ status: true }}
            >
                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
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
                    rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
                >
                    <Input type="date" />
                </Form.Item>

                <Form.Item
                    label="Ngày kết thúc"
                    name="endDate"
                    rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
                >
                    <Input type="date" />
                </Form.Item>

                <Form.Item label="Trạng thái" name="status" valuePropName="checked">
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Tạo mới
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default create;
