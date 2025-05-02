import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Button, Form, Input, message, Skeleton } from 'antd';
import { getOneById, editScreen } from "@apis/screenService";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function edit() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [screen, setScreen] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const cinema = JSON.parse(localStorage.getItem('cinema') || 'null');
    
    

    useEffect(() => {
        const body = {
            cinemaId: cinema._id,
            screenId: id
        }
        getOneById(body).then((res) => {
            form.setFieldsValue(res.data);
            setScreen(res.data);
        })
            .finally(() => setIsLoading(false));
    }, [id])

    const onFinish = async (values) => {

        const data = {
            ...values,
            cinemaId: screen.cinemaId,
            screenId: screen._id
        }

        try {
            const res = await editScreen(data);
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
            {contextHolder}
            <Helmet><title>Chỉnh sửa</title></Helmet>
            <h3 className="mb-4">Chỉnh sửa</h3>

            {/* Form luôn ở đây, luôn có form={form} */}
            <Form
                form={form}
                name="edit-screen"
                wrapperCol={{ span: 8 }}
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                autoComplete="off"
            >
                {/* Skeleton sẽ che phần nội dung form khi isLoading */}
                <Skeleton loading={isLoading} active>
                    <Form.Item
                        label="Phòng chiếu"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên phòng chiếu!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Skeleton>
            </Form>
        </>
    );
}

export default edit;