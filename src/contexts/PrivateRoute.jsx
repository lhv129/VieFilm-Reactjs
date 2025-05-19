// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth(); // 🟢 lấy cả loading

    if (loading) {
        return <div>Đang kiểm tra đăng nhập...</div>; // hoặc spinner của bạn
    }

    if (!user) {
        return <Navigate to="/tai-khoan" replace />;
    }

    return children;
};

export default PrivateRoute;
