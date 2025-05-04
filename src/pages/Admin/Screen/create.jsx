import React, { useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Button, Form, Input, message } from 'antd';
import { createScreen } from "@apis/screenService";
import { useNavigate } from "react-router-dom";


const create = () => {

    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values) => {
        const { name } = values;
        try {
            const storedCinema = localStorage.getItem("cinema");
            const parsedProvince = storedCinema ? JSON.parse(storedCinema) : null;

            const data = {
                name:name,
                cinemaId: parsedProvince._id
            }

            const res = await createScreen(data);
            message.success(res.data.message);
            navigate("/admin/phong-chieu");
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
                    label="Tên phòng chiếu"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên phòng chiếu!' }]}
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

export default create;