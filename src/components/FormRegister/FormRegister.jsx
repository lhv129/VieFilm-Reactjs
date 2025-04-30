import React, { useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { register } from '@apis/authService';
import { toast } from 'react-toastify';

const FormRegister = () => {

    const [isLoading, setIsLoading] = useState(false);

    const onFinish = async (values) => {
        if (isLoading) return;
        const { username, fullname, email, password, password_confirm } = values;

        setIsLoading(true);
        await register({ username, fullname, email, password, password_confirm }).then((res) => {
            setIsLoading(false);
            toast.success(res.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }).catch((err) => {
            setIsLoading(false);
            toast.error(err.response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored", // thêm dòng này để đổi màu nền theo kiểu cảnh báo
            });

        });
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
                        message: 'Vui lòng nhập username!',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="fullname"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập họ và tên!',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Họ và tên" />
            </Form.Item>
            <Form.Item
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập email!',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email đăng nhập" />
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

            <Form.Item
                name="password_confirm"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập xác nhận mật khẩu!',
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Xác nhận mật khẩu"
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

            <Form.Item
                style={{ textAlign: 'center' }}
            >
                <Button type="primary" htmlType="submit" className="login-form-button" loading={isLoading} >
                    {isLoading ? 'Loading...' : 'Đăng ký'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default FormRegister;