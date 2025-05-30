import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { ticketSalesChart } from '@apis/dashboard';


function TicketSalesChart() {
    const storedCin = JSON.parse(localStorage.getItem('cinema') || 'null');
    const cinemaId = storedCin?._id;
    const [ticketSales, setTicketSales] = useState([]);

    useEffect(() => {
        ticketSalesChart(cinemaId).then((res) => {
            setTicketSales(res.data);
        })
    },[]);

    const [range, setRange] = useState('daily');
    const data = range === 'daily' ? ticketSales.daily : ticketSales.monthly;

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Tổng số vé bán ra theo {range === 'daily' ? 'ngày' : 'tháng'}</h3>
                <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                >
                    <option value="daily">Theo ngày</option>
                    <option value="monthly">Theo tháng</option>
                </select>
            </div>
            <div className="h-72 overflow-x-auto">
                <div className="min-w-[500px] h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={range === 'daily' ? 'date' : 'month'} />
                            <YAxis />
                            <Tooltip formatter={(value) => `${value} vé`} />
                            <Legend />
                            <Bar dataKey="regular" stackId="a" fill="#60a5fa" name="Ghế thường" />
                            <Bar dataKey="vip" stackId="a" fill="#f59e0b" name="Ghế VIP" />
                            <Bar dataKey="couple" stackId="a" fill="#ec4899" name="Ghế đôi" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default TicketSalesChart;
