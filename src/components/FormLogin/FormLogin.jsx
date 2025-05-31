import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { sign } from '@apis/authService';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ForgotPasswordModal from '@components/auth/ForgotPasswordModal';
import ResetPasswordModal from '@components/auth/ResetPasswordModal';
import { ReloadOutlined } from '@ant-design/icons';
import { generateCaptcha } from "@/utils/generateCaptcha";
import { getOneById } from '@apis/cinemaService';

const FormLogin = () => {

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser, setCinema } = useAuth();
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [captcha, setCaptcha] = useState('');

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

            if (user?.roleName === 'Staff') {
                console.log(user?.cinema);
                setCinema(user?.cinema);
            }

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

    useEffect(() => {
        setCaptcha(generateCaptcha());
    }, []);

    const refreshCaptcha = () => {
        setCaptcha(generateCaptcha());
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

            <Form.Item
                required
            >
                <div className="flex gap-2 items-center align-c">
                    <div
                        className="px-4 py-1 border rounded text-lg font-mono tracking-widest select-none bg-gray-100"
                        style={{
                            backgroundImage: "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                            backgroundSize: "20px 20px",
                            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                            userSelect: "none",
                        }}
                    >
                        {captcha}
                    </div>
                    <ReloadOutlined
                        onClick={refreshCaptcha}
                        className="cursor-pointer text-xl text-blue-500 hover:text-blue-700 transition"
                        title="Làm mới mã"
                    />
                    <Form.Item
                        name="captcha"
                        rules={[
                            { required: true, message: "Nhập mã xác thực!" },
                            {
                                validator: (_, value) => {
                                    if (!value || value === captcha) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Mã xác thực không đúng!"));
                                },
                            },
                        ]}
                        validateTrigger="onSubmit"
                        style={{ marginTop: 25 }}
                    >
                        <Input
                            placeholder="Nhập mã"
                            style={{ width: 120 }}
                        />
                    </Form.Item>
                </div>
            </Form.Item>

            <Form.Item>
                <a onClick={() => setShowForgotModal(true)}>Quên mật khẩu</a>

                <ForgotPasswordModal
                    open={showForgotModal}
                    onClose={() => setShowForgotModal(false)}
                    onSuccess={() => {
                        setShowForgotModal(false);
                        setShowResetModal(true);
                    }}
                />

                <ResetPasswordModal
                    open={showResetModal}
                    onClose={() => setShowResetModal(false)}
                />
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