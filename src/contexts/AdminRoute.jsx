// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return null; // hoặc <Spinner />
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    const roleName = user.roleName;

    if (!roleName) {
        return null;
    }

    const allowedRoles = ['Admin', 'Staff'];

    if (!allowedRoles.map(r => r.toLowerCase()).includes(roleName.toLowerCase())) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
