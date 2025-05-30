import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer, LabelList
} from 'recharts';
import { Spin } from 'antd';
import { revenueByMovie } from '@apis/dashboard';

function RevenueByMovieChart({ cinema }) {
    const [allMovieRevenue, setAllMovieRevenue] = useState([]);
    const cinemaId = cinema?._id;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!cinemaId) return;
        setLoading(true);
        revenueByMovie(cinemaId).then((res) => {
            setAllMovieRevenue(res.data);
        }).finally(() => setLoading(false));
    }, [cinemaId]);

    const [movieCount, setMovieCount] = useState(5);
    const topMovies = [...allMovieRevenue]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, movieCount);

    return (
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
            {loading ? (
                <div className="flex justify-center items-center h-72">
                    <Spin tip="Đang tải dữ liệu..." size="large" />
                </div>
            ) : (
                <div style={{ height: `${movieCount * 50}px` }} className="overflow-x-auto">
                    <div className="min-w-[500px] h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={topMovies}
                                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" unit=" triệu đồng" />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={150}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip formatter={(value) => [`${value} triệu đồng`, 'Doanh thu']} />
                                <Bar dataKey="revenue" fill="#ec4899" barSize={30}>
                                    <LabelList dataKey="revenue" position="right" formatter={(value) => `${value}`} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RevenueByMovieChart;
