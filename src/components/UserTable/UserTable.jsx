import { Table, Switch, Avatar, message, Tag, Modal } from "antd";
import { updateStatus, deleteUser } from "@apis/userService";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from 'react-icons/fa';


function UserTable({ users, onReload }) {
    const handleStatusChange = async (checked, userId) => {
        const status = checked ? "active" : "block";
        try {
            await updateStatus({ userId, status });
            message.success("Cập nhật trạng thái thành công");
            onReload();
        } catch {
            message.error("Lỗi khi cập nhật trạng thái");
        }
    };


    const showDeleteConfirm = (user) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn xóa người dùng này?',
            content: `Người dùng: ${user.fullname}`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                deleteUser(user._id).then(() => {
                    message.success("Xóa người dùng thành công");
                    onReload?.();
                }).catch(() => message.error("Xóa thất bại"));
            },
            onCancel() {
                console.log('Hủy xóa');
            },
        });
    };

    const columns = [
        {
            title: "Ảnh",
            dataIndex: "images",
            key: "images",
            render: (url) => (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Avatar src={url} size={64} />
                </div>
            ),
        },
        {
            title: "Họ tên",
            dataIndex: "fullname",
            key: "fullname",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
            render: (phone) => phone || "—",
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
            render: (addr) => addr || "—",
        },
        {
            title: "Chức vụ",
            dataIndex: "role",
            key: "role",
            render: (role) => {
                const roleName = role?.name || "—";

                let color = "default";
                if (roleName === "Admin") color = "red";
                else if (roleName === "Staff") color = "blue";
                else if (roleName === "Member") color = "green";

                return roleName === "—" ? (
                    <div style={{ textAlign: "center" }}>—</div>
                ) : (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Tag color={color}>{roleName}</Tag>
                    </div>
                );
            }
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status, record) => (
                <Switch
                    checked={status === "active"}
                    onChange={(checked) => handleStatusChange(checked, record._id)}
                    checkedChildren="Active"
                    unCheckedChildren="Blocked"
                />
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div className="flex gap-2">
                    {/* Ẩn nút, hiện icon khi responsive */}
                    <Link to={`/admin/nguoi-dung/${record._id}/chi-tiet`}>
                        <button className="hidden sm:inline-block px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                            Chi tiết
                        </button>
                    </Link>
                    <button onClick={() => showDeleteConfirm(record)} className="hidden sm:inline-block px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer">
                        Xóa
                    </button>

                    {/* Icon hiển thị trên mobile */}
                    <Link to={`/admin/nguoi-dung/${record._id}/chi-tiet`}>
                        <button className="sm:hidden text-blue-500 hover:text-blue-700 cursor-pointer">
                            <FaEdit />
                        </button>
                    </Link>

                    <button onClick={() => showDeleteConfirm(record)} className="sm:hidden text-red-500 hover:text-red-700 cursor-pointer">
                        <FaTrash />
                    </button>
                </div>
            ),
        }
    ];

    return (
        <Table
            columns={columns}
            dataSource={users}
            rowKey="_id"
            bordered
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
        />
    );
}

export default UserTable;
