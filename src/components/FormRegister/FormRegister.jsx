import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const FormRegister = () => {
    const onFinish = (values) => {
        console.log('Success:', values);
        // Xử lý logic đăng nhập ở đây (gọi API, lưu token, ...)
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            name="normal_login"
            className="login-form"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            style={{ maxWidth: 300, margin: 'auto' }} // Thêm style để căn giữa và giới hạn chiều rộng
        >
            <Form.Item
                name="username"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập tên đăng nhập!',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Tên đăng nhập" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập mật khẩu!',
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Mật khẩu"
                />
            </Form.Item>
            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Nhớ tài khoản</Checkbox>
                </Form.Item>

                <a className="login-form-forgot" href="">
                    Quên mật khẩu
                </a>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Đăng nhập
                </Button>
                Hoặc <a href="">Đăng ký ngay!</a>
            </Form.Item>
        </Form>
    );
};

export default FormRegister;