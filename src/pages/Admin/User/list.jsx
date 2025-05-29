import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { Button, message, Spin } from "antd";
import { Link } from "react-router-dom";
import { getAll } from "@apis/userService"; // API của bạn
import UserTable from "@components/UserTable/UserTable"; // Bảng riêng

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await getAll();
            setUsers(res.data || []);
        } catch {
            message.error("Không thể tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <>
            <Helmet>
                <title>Danh sách người dùng</title>
            </Helmet>

            <div className="p-4">

                <Spin spinning={loading}>
                    <UserTable users={users} onReload={fetchUsers} />
                </Spin>
            </div>
        </>
    );
}

export default UserList;
