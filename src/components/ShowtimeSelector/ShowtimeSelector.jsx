import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const getDayOfWeek = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay(); // 0: CN, 1: T2, ...
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[dayOfWeek];
};

const formatDayMonth = (dateStr) => {
    const [day, month] = dateStr.split('/');
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}`;
};

const ShowtimeSelector = ({ showtimes }) => {
    const navigate = useNavigate();
    const now = new Date();

    // Lọc chỉ những suất chiếu từ 00 giờ hôm nay trở đi
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const filteredShowtimes = showtimes.filter((showtime) => {
        const [day, month, year] = showtime.date.split('/').map(Number);
        const showtimeDate = new Date(year, month - 1, day);
        return showtimeDate >= todayStart;
    });

    // Sắp xếp các suất chiếu
    const sortedShowtimes = [...filteredShowtimes].sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('/').map(Number);
        const [dayB, monthB, yearB] = b.date.split('/').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);

        if (dateA.getTime() !== dateB.getTime()) {
            return dateA - dateB;
        }

        const [hA, mA] = a.startTime.split(':').map(Number);
        const [hB, mB] = b.startTime.split(':').map(Number);
        return hA * 60 + mA - (hB * 60 + mB);
    });

    // Nhóm theo ngày
    const groupedShowtimes = sortedShowtimes.reduce((acc, showtime) => {
        const { date } = showtime;
        if (!acc[date]) acc[date] = [];
        acc[date].push(showtime);
        return acc;
    }, {});

    const dates = Object.keys(groupedShowtimes);
    const [selectedDate, setSelectedDate] = useState(dates[0] || null);


    return (
        <div className="p-4">
            {/* Tab ngày */}
            <div className="flex flex-wrap border-b mb-6">
                {dates.map((date) => (
                    <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`flex flex-col items-center cursor-pointer py-2 ${selectedDate === date
                            ? "text-[#337ab7] font-bold border-b-2 border-blue-400"
                            : "text-gray-600"
                            } basis-1/3 md:basis-1/7`}
                    >
                        <span className="text-lg">{getDayOfWeek(date)}</span>
                        <span className="text-sm">{formatDayMonth(date)}</span>
                    </button>
                ))}
            </div>

            {/* Các suất chiếu */}
            <div className="flex flex-wrap">
                {groupedShowtimes[selectedDate].map((showtime) => {
                    const [day, month, year] = showtime.date.split('/').map(Number);
                    const [hour, minute] = showtime.startTime.split(':').map(Number);
                    const showtimeDate = new Date(year, month - 1, day, hour, minute);
                    const isPast = showtimeDate < now;

                    return (
                        <div
                            key={showtime._id}
                            className="flex flex-col items-center py-2 basis-1/3 md:basis-1/7"
                        >
                            <button
                                className={`w-4/5 py-2 rounded-md text-base font-semibold transition 
                                    ${isPast
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-100 hover:bg-blue-100 cursor-pointer"
                                    }`}
                                disabled={isPast}
                                onClick={() =>
                                    !isPast && navigate('/dat-ve/chon-ghe', {
                                        state: { showtimeId: showtime._id }
                                    })
                                }
                            >
                                {showtime.startTime}
                            </button>
                            <span className={`text-xs mt-1 ${isPast ? "text-gray-400" : "text-gray-500"}`}>
                                {showtime.emptySeats} ghế trống
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ShowtimeSelector;
