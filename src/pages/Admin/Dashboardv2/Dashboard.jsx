import React, { useState, useEffect } from 'react';
import TicketSalesChart from '@components/TicketSalesChart/TicketSalesChart';
import RevenueByCinemaChart from '@components/RevenueByCinemaChart/RevenueByCinemaChart';
import RevenueByMovieChart from '@components/RevenueByMovieChart/RevenueByMovieChart';
import RevenueTopByCinemaChart from '@components/RevenueTopByCinemaChart/RevenueTopByCinemaChart';
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";

function Dashboard() {
    const { user, cinema: staffCinema } = useAuth();
    const [storedCine, setStoredCine] = useState(null);
    const [storedProv, setStoredProv] = useState(null);

    useEffect(() => {
        if (user?.roleName === 'Staff') {
            setStoredCine(staffCinema); // lấy trực tiếp từ context
        } else {
            setStoredCine(JSON.parse(localStorage.getItem('cinema') || 'null')); // Admin lấy từ localStorage
        }
    }, [user, staffCinema]);

    const handleLocalStorageChange = () => {
        setStoredProv(JSON.parse(localStorage.getItem('province') || 'null'));
        if (user?.roleName !== 'Staff') {
            setStoredCine(JSON.parse(localStorage.getItem('cinema') || 'null'));
        }
    };

    useEffect(() => {
        window.addEventListener('storage', handleLocalStorageChange);
        window.addEventListener('cinemaChanged', handleLocalStorageChange);

        return () => {
            window.removeEventListener('storage', handleLocalStorageChange);
            window.removeEventListener('cinemaChanged', handleLocalStorageChange);
        };
    }, [user]);

    return (
        <>
            <Helmet>
                <title>Trang quản trị</title>
            </Helmet>
            <div className="p-6 space-y-6">
                <RevenueByCinemaChart cinema={storedCine} storedProv={storedProv}/>
                <RevenueByMovieChart cinema={storedCine} />
                <div className="p-6 space-y-6">
                    <RevenueTopByCinemaChart cinema={storedCine} />
                </div>
                <TicketSalesChart cinema={storedCine} />
            </div>
        </>
    );
}

export default Dashboard;
