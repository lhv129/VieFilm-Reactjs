import React from "react";
import { Modal, Form, Input, message } from "antd";
import { forgetPassword } from "@apis/authService";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ResetPasswordModal = ({ open, onClose }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const res = await forgetPassword(values);

            message.success("Đặt lại mật khẩu thành công!");

            const { access_token, refresh_token, user } = res.data;

            // ✅ Tự động đăng nhập
            Cookies.set("access_token", access_token);
            Cookies.set("refresh_token", refresh_token);
            Cookies.set("user", JSON.stringify(user));
            setUser(user);

            // ✅ Điều hướng theo vai trò
            if (user?.roleName === "Admin" || user?.roleName === "Staff") {
                navigate("/admin/thong-ke");
            } else {
                navigate("/");
            }

            onClose();

        } catch (err) {
            message.error(err?.response?.data?.message || "Có lỗi xảy ra!");
        }
    };

    return (
        <Modal
            title="Đặt lại mật khẩu"
            open={open}
            onOk={handleOk}
            onCancel={onClose}
            okText="Xác nhận"
        >
            <Form layout="vertical" form={form}>
                <Form.Item
                    label="Mã xác thực"
                    name="token"
                    rules={[{ required: true, message: "Nhập mã xác thực!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Mật khẩu mới"
                    name="password"
                    rules={[{ required: true, message: "Nhập mật khẩu mới!" }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: "Xác nhận mật khẩu!" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Mật khẩu không khớp!"));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ResetPasswordModal;
