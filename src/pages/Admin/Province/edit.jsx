import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Button, Form, Input, message, Skeleton } from 'antd';
import { getOne, editProvince } from "@apis/provinceService";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function edit() {

    const { slug } = useParams();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getOne(slug).then((res) => {
            form.setFieldsValue({
                name: res.data.name,
            })
        })
            .finally(() => setIsLoading(false));
    }, [slug])

    const onFinish = async (values) => {

        const { name } = values;
        try {
            const res = await editProvince(slug,{name});
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
            {contextHolder}
            <Helmet><title>Chỉnh sửa</title></Helmet>
            <h3 className="mb-4">Chỉnh sửa</h3>

            {/* Form luôn ở đây, luôn có form={form} */}
            <Form
                form={form}
                name="edit-province"
                wrapperCol={{ span: 8 }}
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                autoComplete="off"
            >
                {/* Skeleton sẽ che phần nội dung form khi isLoading */}
                <Skeleton loading={isLoading} active>
                    <Form.Item
                        label="Tỉnh thành"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tỉnh thành!' }]}
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