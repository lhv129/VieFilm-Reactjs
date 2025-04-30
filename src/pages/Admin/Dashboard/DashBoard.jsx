import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer, LabelList,
} from 'recharts';

const revenueByLocation = {
    'Hà Nội': {
        'Rạp A': {
            week: [
                { name: 'Mon', revenue: 1200 },
                { name: 'Tue', revenue: 1400 },
                { name: 'Wed', revenue: 1000 },
                { name: 'Thu', revenue: 1600 },
                { name: 'Fri', revenue: 2000 },
                { name: 'Sat', revenue: 2200 },
                { name: 'Sun', revenue: 1800 },
            ],
            month: [
                { name: 'Week 1', revenue: 7000 },
                { name: 'Week 2', revenue: 8000 },
                { name: 'Week 3', revenue: 9000 },
                { name: 'Week 4', revenue: 10000 },
            ],
            year: [
                { name: 'Jan', revenue: 8000 },
                { name: 'Feb', revenue: 8500 },
                { name: 'Mar', revenue: 9000 },
                { name: 'Apr', revenue: 9500 },
            ],
        },
        'Rạp B': {
            week: [
                { name: 'Mon', revenue: 1000 },
                { name: 'Tue', revenue: 1100 },
                { name: 'Wed', revenue: 1200 },
                { name: 'Thu', revenue: 1400 },
                { name: 'Fri', revenue: 1600 },
                { name: 'Sat', revenue: 1500 },
                { name: 'Sun', revenue: 1300 },
            ],
            month: [
                { name: 'Week 1', revenue: 6000 },
                { name: 'Week 2', revenue: 7000 },
                { name: 'Week 3', revenue: 7500 },
                { name: 'Week 4', revenue: 7800 },
            ],
            year: [
                { name: 'Jan', revenue: 7000 },
                { name: 'Feb', revenue: 7200 },
                { name: 'Mar', revenue: 7400 },
                { name: 'Apr', revenue: 7600 },
            ],
        },
    },
    'TP.HCM': {
        'Rạp C': {
            week: [
                { name: 'Mon', revenue: 1300 },
                { name: 'Tue', revenue: 1500 },
                { name: 'Wed', revenue: 1600 },
                { name: 'Thu', revenue: 1700 },
                { name: 'Fri', revenue: 1900 },
                { name: 'Sat', revenue: 2000 },
                { name: 'Sun', revenue: 2100 },
            ],
            month: [
                { name: 'Week 1', revenue: 8000 },
                { name: 'Week 2', revenue: 8200 },
                { name: 'Week 3', revenue: 8500 },
                { name: 'Week 4', revenue: 9000 },
            ],
            year: [
                { name: 'Jan', revenue: 10000 },
                { name: 'Feb', revenue: 10500 },
                { name: 'Mar', revenue: 11000 },
                { name: 'Apr', revenue: 11500 },
            ],
        },
        'Rạp D': {
            week: [
                { name: 'Mon', revenue: 900 },
                { name: 'Tue', revenue: 1000 },
                { name: 'Wed', revenue: 1100 },
                { name: 'Thu', revenue: 1200 },
                { name: 'Fri', revenue: 1300 },
                { name: 'Sat', revenue: 1400 },
                { name: 'Sun', revenue: 1500 },
            ],
            month: [
                { name: 'Week 1', revenue: 5000 },
                { name: 'Week 2', revenue: 5500 },
                { name: 'Week 3', revenue: 5800 },
                { name: 'Week 4', revenue: 6000 },
            ],
            year: [
                { name: 'Jan', revenue: 6500 },
                { name: 'Feb', revenue: 6700 },
                { name: 'Mar', revenue: 6900 },
                { name: 'Apr', revenue: 7100 },
            ],
        },
    },
};

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

const latestBookings = [
    { movie: 'Movie X', cinema: 'Rạp A', time: '10:30 AM' },
    { movie: 'Movie Y', cinema: 'Rạp C', time: '11:00 AM' },
    { movie: 'Movie Z', cinema: 'Rạp D', time: '01:45 PM' },
];

const Dashboard = () => {
    const [selectedProvince, setSelectedProvince] = useState('Hà Nội');
    const [selectedCinema, setSelectedCinema] = useState('Rạp A');
    const [selectedRange, setSelectedRange] = useState('week');
    const [movieCount, setMovieCount] = useState(5);

    const provinces = Object.keys(revenueByLocation);
    const cinemas = Object.keys(revenueByLocation[selectedProvince] || {});
    const cinemaData =
        revenueByLocation[selectedProvince]?.[selectedCinema]?.[selectedRange] || [];

    const handleProvinceChange = (e) => {
        const newProvince = e.target.value;
        setSelectedProvince(newProvince);
        const firstCinema = Object.keys(revenueByLocation[newProvince])[0];
        setSelectedCinema(firstCinema);
    };

    const topMovies = [...allMovieRevenue]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, movieCount);

    return (
        <div className="p-6 space-y-6">
            {/* Revenue by Cinema */}
            <div className="bg-white p-6 rounded-xl shadow">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
                    <h3 className="text-lg font-semibold">Revenue by Cinema</h3>
                    <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                        <select
                            value={selectedProvince}
                            onChange={handleProvinceChange}
                            className="text-sm border rounded px-2 py-1 w-full"
                        >
                            {provinces.map((province) => (
                                <option key={province} value={province}>
                                    {province}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedCinema}
                            onChange={(e) => setSelectedCinema(e.target.value)}
                            className="text-sm border rounded px-2 py-1 w-full"
                        >
                            {cinemas.map((cinema) => (
                                <option key={cinema} value={cinema}>
                                    {cinema}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedRange}
                            onChange={(e) => setSelectedRange(e.target.value)}
                            className="text-sm border rounded px-2 py-1 w-full"
                        >
                            <option value="week">Tuần</option>
                            <option value="month">Tháng</option>
                            <option value="year">Năm</option>
                        </select>
                    </div>

                </div>
                <div className="h-72 overflow-x-auto">
                    <div className="min-w-[500px] h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={cinemaData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="revenue" fill="#4f46e5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Revenue by Movie */}
            <div className="bg-white p-6 rounded-xl shadow">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Top Movies by Revenue</h3>
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
                                <Tooltip />
                                <Bar dataKey="revenue" fill="#ec4899" barSize={30}>
                                    <LabelList dataKey="revenue" position="right" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Latest Bookings */}
            <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-4">Latest Bookings</h3>
                <ul className="space-y-2">
                    {latestBookings.map((booking, index) => (
                        <li key={index} className="border-b pb-2">
                            <strong>{booking.movie}</strong> tại {booking.cinema} –{' '}
                            <span>{booking.time}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
