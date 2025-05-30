import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer
} from 'recharts';
import { revenueByCinema } from '@apis/dashboard';

function RevenueByCinemaChart({ cinema }) {
    const [revenueByCinemaChart, setRevenueByCinema] = useState(null);
    const [selectedRange, setSelectedRange] = useState('week');

    const cinemaId = cinema?._id;

    useEffect(() => {
        if (!cinemaId) return;
        revenueByCinema(cinemaId).then((res) => {
            setRevenueByCinema(res.data);
        });
    }, [cinemaId]);

    const cinemaData = revenueByCinemaChart?.[selectedRange] || [];

    const tooltipFormatter = (value) => [`${value} triệu đồng`, 'Doanh thu'];

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                <h3 className="text-lg font-semibold">Doanh thu theo Rạp</h3>
                <div className="w-full sm:w-auto">
                    <select
                        value={selectedRange}
                        onChange={(e) => setSelectedRange(e.target.value)}
                        className="text-sm border rounded px-2 py-1 w-full cursor-pointer"
                    >
                        <option value="week">Tuần</option>
                        <option value="month">Tháng</option>
                        <option value="year">Năm</option>
                    </select>
                </div>
            </div>
            {!cinemaData.length ? (
                <div className="text-center text-gray-500 h-72 flex items-center justify-center">
                    Rạp này chưa có doanh thu
                </div>
            ) : (
                <div className="h-72 overflow-x-auto">
                    <div className="min-w-[500px] h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={cinemaData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis
                                    label={{
                                        angle: -90,
                                        position: 'insideLeft',
                                        offset: 10
                                    }}
                                />
                                <Tooltip formatter={tooltipFormatter} />
                                <Bar dataKey="revenue" fill="#4f46e5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RevenueByCinemaChart;
