import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { getOne, removeRole } from "@apis/userService";
import { Spin, Avatar, Card, message, Button, Popconfirm } from "antd";
import GrantRoleModal from "@components/GrantRoleModal/GrantRoleModal";

function detail() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchUser = async () => {
        try {
            const res = await getOne(userId);
            setUser(res.data);
        } catch (err) {
            message.error("Không thể tải thông tin người dùng.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveRole = async () => {
        try {
            await removeRole({ userId });
            message.success("Giáng quyền thành công.");
            fetchUser();
        } catch (err) {
            message.error("Giáng quyền thất bại.");
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userId]);

    return (
        <>
            <Helmet>
                <title>Thông tin người dùng</title>
            </Helmet>

            <div className="max-w-xl mx-auto px-4 py-6">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Spin size="large" />
                    </div>
                ) : user ? (
                    <>
                        <Card
                            title="Thông tin người dùng"
                            bordered={false}
                            className="shadow-md"
                            extra={
                                <div className="flex gap-2">
                                    <Button type="primary" onClick={() => setShowModal(true)}>
                                        Cấp quyền
                                    </Button>
                                    <Popconfirm
                                        title="Bạn có chắc muốn giáng quyền người dùng này?"
                                        onConfirm={handleRemoveRole}
                                        okText="Có"
                                        cancelText="Không"
                                    >
                                        <Button danger>Giáng quyền</Button>
                                    </Popconfirm>
                                </div>
                            }
                        >
                            <div className="flex flex-col items-center mb-6">
                                <Avatar src={user.images} size={96} />
                                <h2 className="mt-4 text-lg font-semibold">{user.fullname}</h2>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>

                            <div className="space-y-3 text-sm sm:text-base">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Số điện thoại:</span>
                                    <span>{user.phone || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Địa chỉ:</span>
                                    <span className="text-right">{user.address || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ngày sinh:</span>
                                    <span>
                                        {user.birthday
                                            ? new Date(user.birthday).toLocaleDateString("vi-VN")
                                            : "—"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Chức vụ:</span>
                                    <span>{user.role?.name || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Trạng thái:</span>
                                    <span>{user.status}</span>
                                </div>
                            </div>
                        </Card>

                        <GrantRoleModal
                            visible={showModal}
                            onClose={() => setShowModal(false)}
                            user={user}
                            currentRole={user.role?.code || "user"}
                            onSuccess={fetchUser}
                        />
                    </>
                ) : (
                    <p className="text-center text-red-500">Không tìm thấy người dùng.</p>
                )}
            </div>
        </>
    );
}

export default detail;
