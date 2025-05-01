import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { sign } from '@apis/authService';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const FormLogin = () => {

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const onFinish = async (values) => {
        if (isLoading) return;
        setIsLoading(true);

        const { email, password } = values;

        try {
            const res = await sign({ email, password });
            const { user, access_token, refresh_token } = res.data;

            Cookies.set("access_token", access_token);
            Cookies.set("refresh_token", refresh_token);
            Cookies.set("user", JSON.stringify(user));
            setUser(user);

            if (user?.roleName === "Admin" || user?.roleName === "Staff") {
                navigate("/admin/thong-ke");
            } else {
                navigate("/");
            }

            toast.success("Đăng nhập thành công", {
                position: "top-right",
                autoClose: 3000,
            });

        } catch (err) {
            console.error("Lỗi đăng nhập:", err);
            toast.error(err?.response?.data?.message || "Đăng nhập thất bại", {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
        } finally {
            setIsLoading(false);
        }
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
            style={{ maxWidth: 300, margin: 'auto', }} // Thêm style để căn giữa và giới hạn chiều rộng
        >
            <Form.Item
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập email đăng nhập!',
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
            <Form.Item>
                <a className="login-form-forgot" href="">
                    Quên mật khẩu
                </a>
            </Form.Item>

            <Form.Item
                style={{ textAlign: 'center' }}
            >
                <Button type="primary" htmlType="submit" className="login-form-button" loading={isLoading}>
                    {isLoading ? 'Loading...' : 'Đăng nhập bằng tài khoản'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default FormLogin;