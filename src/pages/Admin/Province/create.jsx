import React, { useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Button, Checkbox, Form, Input, message } from 'antd';
import { create } from "@apis/provinceService";
import { useNavigate } from "react-router-dom";


const createProvince = () => {

    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values) => {
        const { name } = values;
        try {
            const res = await create(slug, body);
            message.success(res.data.message);
            navigate("/admin/tinh-thanh");
        } catch (err) {
            if (err.response) {
                messageApi.open({
                    type: "error",
                    content: err.response.data.message,
                });
            } else {
                console.error("Lỗi không xác định:", err);
            }
        }

    };
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Helmet>
                <title>Thêm mới</title>
            </Helmet>
            <h3 className='mb-4'>Thêm mới</h3>
            <Form
                name="basic"
                wrapperCol={{ span: 8 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                {contextHolder}
                <Form.Item
                    label="Tỉnh thành"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tỉnh thành!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Thêm mới
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default createProvince;