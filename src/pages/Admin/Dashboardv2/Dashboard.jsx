import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer, LabelList
} from 'recharts';
import TicketSalesChart from '@components/TicketSalesChart/TicketSalesChart';
import RevenueByCinemaChart from '@components/RevenueByCinemaChart/RevenueByCinemaChart';
import RevenueByMovieChart from '@components/RevenueByMovieChart/RevenueByMovieChart';
import { Helmet } from "react-helmet";

// Fake dữ liệu cụm rạp
const clusterRevenue = [
    { name: 'CGV', revenue: 120000 },
    { name: 'Lotte', revenue: 95000 },
    { name: 'Beta', revenue: 70000 },
    { name: 'Galaxy', revenue: 85000 },
    { name: 'BHD Star', revenue: 60000 },
];


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
                    <div className="bg-white p-6 rounded-xl shadow">
                        <h3 className="text-lg font-semibold mb-4">Doanh thu theo Cụm Rạp</h3>
                        <div className="h-72 overflow-x-auto">
                            <div className="min-w-[500px] h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={clusterRevenue}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `${value.toLocaleString()}₫`} />
                                        <Bar dataKey="revenue" fill="#10b981" barSize={40}>
                                            <LabelList
                                                dataKey="revenue"
                                                position="top"
                                                formatter={(value) => `${(value / 1000).toFixed(1)}k`}
                                            />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                <TicketSalesChart cinema={storedCine} province={storedProv} />

            </div>
        </>
    );
};

export default Dashboard;
