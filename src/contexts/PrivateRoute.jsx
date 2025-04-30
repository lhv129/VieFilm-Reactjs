// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";

const PrivateRoute = ({ children }) => {
    const user = useAuth();

    if (!user?.user) {
        return <Navigate to="/dang-nhap" replace />;
    }

    return children;
};

export default PrivateRoute;
