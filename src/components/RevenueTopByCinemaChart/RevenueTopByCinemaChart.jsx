import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer, LabelList
} from 'recharts';
import { Spin } from 'antd';
import { getRevenueTopByCinema } from '@apis/dashboard';

function RevenueTopByCinemaChart({ cinema }) {
    const [clusterRevenue, setClusterRevenue] = useState([]);
    const cinemaId = cinema?._id;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!cinemaId) return;
        setLoading(true);
        getRevenueTopByCinema(cinemaId).then((res) => {
            setClusterRevenue(res.data);
        }).finally(() => setLoading(false));
    }, [cinemaId]);

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Doanh thu theo Cụm Rạp</h3>
            <div className="h-72 overflow-x-auto">
                <div className="min-w-[500px] h-full">

                    {loading ? (
                        <div className="flex justify-center items-center h-72">
                            <Spin tip="Đang tải dữ liệu..." size="large" />
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={clusterRevenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value.toLocaleString()} triệu`,'Doanh thu']} />
                                <Bar dataKey="revenue" fill="#10b981" barSize={40}>
                                    <LabelList
                                        dataKey="revenue"
                                        position="top"
                                        formatter={(value) => `${(value / 1000).toFixed(1)} tỷ`}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RevenueTopByCinemaChart;
