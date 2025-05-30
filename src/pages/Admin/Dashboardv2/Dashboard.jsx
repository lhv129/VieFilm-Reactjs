import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer, LabelList
} from 'recharts';
import TicketSalesChart from '@components/TicketSalesChart/TicketSalesChart';
import RevenueByCinemaChart from '@components/RevenueByCinemaChart/RevenueByCinemaChart';
import RevenueByMovieChart from '@components/RevenueByMovieChart/RevenueByMovieChart';
import RevenueTopByCinemaChart from '@components/RevenueTopByCinemaChart/RevenueTopByCinemaChart';
import { Helmet } from "react-helmet";

function Dashboard() {

    const [storedProv, setStoredProv] = useState(JSON.parse(localStorage.getItem('province') || 'null'));
    const [storedCine, setStoredCine] = useState(JSON.parse(localStorage.getItem('cinema') || 'null'));

    const handleLocalStorageChange = () => {
        setStoredProv(JSON.parse(localStorage.getItem('province') || 'null'));
        setStoredCine(JSON.parse(localStorage.getItem('cinema') || 'null'));
    };

    useEffect(() => {
        window.addEventListener('storage', handleLocalStorageChange);
        window.addEventListener('provinceChanged', handleLocalStorageChange);
        window.addEventListener('cinemaChanged', handleLocalStorageChange);

        return () => {
            window.removeEventListener('storage', handleLocalStorageChange);
            window.removeEventListener('provinceChanged', handleLocalStorageChange);
            window.removeEventListener('cinemaChanged', handleLocalStorageChange);
        };
    }, []);

    return (
        <>
            <Helmet>
                <title>Trang quản trị</title>
            </Helmet>
            <div className="p-6 space-y-6">
                {/* Doanh thu theo Rạp */}
                <RevenueByCinemaChart cinema={storedCine} province={storedProv}/>

                {/* Doanh thu theo Phim */}
                <RevenueByMovieChart cinema={storedCine}/>

                <div className="p-6 space-y-6">
                    {/* Biểu đồ doanh thu theo cụm rạp */}
                    <RevenueTopByCinemaChart cinema={storedCine}/>
                </div>
                
                <TicketSalesChart cinema={storedCine} province={storedProv} />

            </div>
        </>
    );
};

export default Dashboard;
