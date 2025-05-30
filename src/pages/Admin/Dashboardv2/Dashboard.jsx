import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer, LabelList
} from 'recharts';
import TicketSalesChart from '@components/TicketSalesChart/TicketSalesChart';
import RevenueByCinemaChart from '@components/RevenueByCinemaChart/RevenueByCinemaChart';
import { Helmet } from "react-helmet";


const allMovieRevenue = [
    { name: 'Nhà Bà Nữ', revenue: 459.6 },
    { name: 'Lật Mặt 6', revenue: 273.1 },
    { name: 'Đất Rừng Phương Nam', revenue: 140.4 },
    { name: 'Siêu Lừa Gặp Siêu Lầy', revenue: 121.6 },
    { name: 'Chị Chị Em Em 2', revenue: 121.1 },
    { name: 'Người Vợ Cuối Cùng', revenue: 100 },
    { name: 'Phim A', revenue: 98 },
    { name: 'Phim B', revenue: 95 },
    { name: 'Phim C', revenue: 88 },
    { name: 'Phim D', revenue: 70 },
];


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

    const [movieCount, setMovieCount] = useState(5);
    const topMovies = [...allMovieRevenue]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, movieCount);



    return (
        <>
            <Helmet>
                <title>Trang quản trị</title>
            </Helmet>
            <div className="p-6 space-y-6">
                {/* Doanh thu theo Rạp */}
                <RevenueByCinemaChart cinema={storedCine} province={storedProv}/>

                {/* Doanh thu theo Phim */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Top phim theo doanh thu</h3>
                        <div className="flex items-center space-x-2">
                            <label className="text-sm">Hiển thị</label>
                            <select
                                value={movieCount}
                                onChange={(e) => setMovieCount(Number(e.target.value))}
                                className="border px-2 py-1 rounded text-sm"
                            >
                                {allMovieRevenue.map((_, index) => (
                                    <option key={index + 1} value={index + 1}>
                                        {index + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{ height: `${movieCount * 50}px` }} className="overflow-x-auto">
                        <div className="min-w-[500px] h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    layout="vertical"
                                    data={topMovies}
                                    margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" unit=" tỷ đồng" />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={150}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <Tooltip formatter={(value) => `${value} tỷ đồng`} />
                                    <Bar dataKey="revenue" fill="#ec4899" barSize={30}>
                                        <LabelList dataKey="revenue" position="right" formatter={(value) => `${value} tỷ`} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

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
