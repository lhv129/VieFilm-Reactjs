// src/components/AdminRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { getOneById } from "@apis/cinemaService";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [cinema, setCinema] = useState('');

    useEffect(() => {
        if (user?.roleName === 'Staff') {
            getOneById(user.cinemaId).then((res) => {
                const cinemaInfo = {
                    _id: res.data._id,
                    name: res.data.name,
                };
                setCinema(cinemaInfo);
                localStorage.setItem('cinema', JSON.stringify(cinemaInfo));
            });
        }
    }, [user]);

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
