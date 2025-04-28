import { useState } from "react";

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
    const groupedShowtimes = showtimes.reduce((acc, showtime) => {
        const { date } = showtime;
        if (!acc[date]) acc[date] = [];
        acc[date].push(showtime);
        return acc;
    }, {});

    const dates = Object.keys(groupedShowtimes).sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('/').map(Number);
        const [dayB, monthB, yearB] = b.split('/').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateA - dateB;
    });

    const [selectedDate, setSelectedDate] = useState(dates[0]);

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
                {groupedShowtimes[selectedDate].map((showtime) => (
                    <div
                        key={showtime._id}
                        className="flex flex-col items-center py-2 basis-1/3 md:basis-1/7"
                    >
                        <button className="w-4/5 py-2 bg-gray-100 cursor-pointer rounded-md text-base font-semibold hover:bg-blue-100 transition">
                            {showtime.startTime}
                        </button>
                        <span className="text-xs text-gray-500 mt-1">{showtime.emptySeats} ghế trống</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShowtimeSelector;
