import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { ReloadOutlined } from '@ant-design/icons';
import { generateCaptcha } from "@/utils/generateCaptcha";
import { sendTokenForgetPassword } from "@apis/authService";

const ForgotPasswordModal = ({ open, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [captcha, setCaptcha] = useState('');

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const res = await sendTokenForgetPassword({email:values.email});
            message.success(res.data.message);
            onSuccess(); // Mở modal đổi mật khẩu
        } catch (err) {
            console.log("Validation failed:", err);
        }
    };

    useEffect(() => {
        setCaptcha(generateCaptcha());
    }, []);

    const refreshCaptcha = () => {
        setCaptcha(generateCaptcha());
    };

    return (
        <Modal
            title="Lấy lại mật khẩu"
            open={open}
            onOk={handleOk}
            onCancel={onClose}
            okText="Lấy lại mật khẩu"
        >
            <Form layout="vertical" form={form}>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    required
                >
                    <div className="flex gap-2 items-center">
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
                            style={{ paddingTop: 25 }}
                        >
                            <Input
                                placeholder="Nhập mã"
                                style={{ width: 120 }}
                            />
                        </Form.Item>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ForgotPasswordModal;
