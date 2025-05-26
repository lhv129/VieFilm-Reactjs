import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    Row,
    Col,
    Upload,
    message,
    Modal
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { updateProfile, changePassword } from "@apis/authService";

const { Option } = Select;

function Profile() {
    const [form] = Form.useForm();
    const [user, setUser] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null); // có thể là File hoặc null
    const [avatarUrl, setAvatarUrl] = useState(null);   // URL của ảnh hiện tại
    const [changePassForm] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const rawUser = Cookies.get("user");
        if (rawUser) {
            const parsedUser = JSON.parse(rawUser);
            setUser(parsedUser);

            // Gán form values
            form.setFieldsValue({
                username: parsedUser.username,
                fullname: parsedUser.fullname,
                email: parsedUser.email,
                phone: parsedUser.phone,
                birthday: parsedUser.birthday ? dayjs(parsedUser.birthday) : null,
                address: parsedUser.address,
            });

            // Gán ảnh từ user.images
            if (parsedUser.images) {
                setAvatarUrl(parsedUser.images);
            }
        }
    }, [form]);

    const onFinish = async (values) => {
        let formattedValues = {
            ...values,
            birthday: values.birthday ? dayjs(values.birthday).format("DD/MM/YYYY") : null,
        };
        delete formattedValues.email;

        // Thêm ảnh nếu có thay đổi
        if (avatarFile) {
            formattedValues.images = avatarFile;
        }

        try {
            const res = await updateProfile(formattedValues);
            Cookies.set("user", JSON.stringify(res.data.data));
            message.success(res.data.message);
            window.location.reload();
        } catch (err) {
            const resData = err.response?.data;

            if (Array.isArray(resData?.errors)) {
                const errorFields = resData.errors.map((e) => ({
                    name: [e.field], // AntD expects an array
                    errors: [e.message],
                }));

                form.setFields(errorFields); // 🎯 Hiển thị lỗi dưới ô input
            } else {
                message.error(resData?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
            }
        }

    };

    const handleBeforeUpload = (file) => {
        setAvatarFile(file);
        setAvatarUrl(URL.createObjectURL(file)); // Tạo preview tạm
        return false; // chặn upload tự động
    };

    const showChangePasswordModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return (
        <>
            <Helmet>
                <title>Thông tin tài khoản</title>
            </Helmet>

            <div className="max-w-5xl mx-auto p-6 bg-white mt-6 shadow-md rounded-md">
                <h2 className="text-xl font-semibold mb-6 border-b pb-2">Thông tin tài khoản</h2>

                {/* Ảnh đại diện */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                No image
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Upload
                            beforeUpload={handleBeforeUpload}
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined />}>TẢI ẢNH LÊN</Button>
                        </Upload>
                    </div>
                </div>

                {/* Form */}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={24}>
                        {/* Left Column */}
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[{ required: true, message: "Vui lòng nhập username" }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Họ tên"
                                name="fullname"
                                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item label="Số điện thoại" name="phone">
                                <Input placeholder="Số điện thoại" />
                            </Form.Item>
                        </Col>

                        {/* Right Column */}
                        <Col xs={24} md={12}>
                            <Form.Item label="Email" name="email">
                                <Input disabled />
                            </Form.Item>

                            <Form.Item label="Địa chỉ" name="address">
                                <Input placeholder="Địa chỉ" />
                            </Form.Item>

                            <Form.Item label="Ngày sinh" name="birthday">
                                <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Đổi mật khẩu & Nút cập nhật */}
                    <div className="flex justify-between items-center mt-4">
                        <a
                            onClick={showChangePasswordModal}
                            className="text-blue-600 hover:underline text-sm cursor-pointer"
                        >
                            Đổi mật khẩu?
                        </a>

                        <Button type="primary" htmlType="submit">
                            CẬP NHẬT
                        </Button>
                    </div>
                </Form>
                <Modal
                    title="ĐỔI MẬT KHẨU"
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Form
                        layout="vertical"
                        form={changePassForm}
                        onFinish={async (values) => {
                            try {
                                const res = await changePassword(values);
                                message.success(res.data.message);
                                changePassForm.resetFields();
                                setIsModalOpen(false); // đóng modal sau khi submit
                            } catch (err) {
                                const resData = err.response?.data;

                                if (Array.isArray(resData?.errors)) {
                                    const errorFields = resData.errors.map((e) => ({
                                        name: [e.field], // AntD expects an array
                                        errors: [e.message],
                                    }));

                                    changePassForm.setFields(errorFields);
                                } else {
                                    message.error(resData?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
                                }
                            }
                        }}
                    >
                        <Form.Item
                            label="Mật khẩu hiện tại"
                            name="password"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu mới"
                            name="newPassword"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu mới" />
                        </Form.Item>

                        <Form.Item
                            label="Xác nhận mật khẩu mới"
                            name="confirmPassword"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Nhập xác nhận mật khẩu mới" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                CẬP NHẬT
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

            </div>
        </>
    );
}

export default Profile;
