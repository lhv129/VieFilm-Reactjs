import React, { useEffect, useState } from "react";
import { getAllByDate } from "@apis/showtimeService";
import MovieItem from "./MovieItem";
import { Helmet } from "react-helmet";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

function Showtime() {
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [movies, setMovies] = useState([]);
    const cinema = JSON.parse(localStorage.getItem("cinema"));
    const cinemaId = cinema?._id;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const today = dayjs();
        const weekDates = Array.from({ length: 7 }).map((_, index) => {
            const date = today.add(index, "day");
            return {
                label: date.format("DD/MM"),
                fullDate: date.format("DD/MM/YYYY"),
                dayOfWeek: date.format("dd").toUpperCase(),
            };
        });
        setDates(weekDates);
        setSelectedDate(weekDates[0].fullDate);
    }, []);

    useEffect(() => {
        if (!selectedDate) return;
        const body = { cinemaId, date: selectedDate };

        setLoading(true);
        getAllByDate(body)
            .then((res) => {
                setMovies(res.data || []);
            })
            .catch((err) => {
                console.error("Error fetching movies:", err);
                setMovies([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedDate]);

    return (
        <>
            <Helmet>
                <title>Lịch chiếu theo rạp</title>
            </Helmet>
            <div className="container">
                {/* Date Selector */}
                <div className="grid grid-cols-3 sm:flex items-center border-b border-gray-300 mb-6 justify-center">
                    {dates.map((date) => (
                        <button
                            key={date.fullDate}
                            className={`flex flex-col items-center px-4 py-2 font-medium text-sm border-b-2 cursor-pointer ${selectedDate === date.fullDate
                                ? "border-blue-600 text-[#337ab7]"
                                : "border-transparent text-gray-500 hover:text-black"
                                }`}
                            onClick={() => { if (!loading) setSelectedDate(date.fullDate); }}
                        >
                            <span>{date.label}</span>
                            <span className="text-xs">{date.dayOfWeek}</span>
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <svg
                            className="animate-spin h-8 w-8 text-[#337ab7]"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                        </svg>
                    </div>
                ) : movies.length > 0 ? (
                    <div className="space-y-10">
                        {/* Phim đầu tiên full width */}
                        {movies[0] && (
                            <div className="w-full">
                                <MovieItem movie={movies[0]} isFirst />
                            </div>
                        )}

                        {/* Các phim còn lại chia 2 cột */}
                        <div className="flex flex-wrap gap-6">
                            {movies.slice(1).map((movie, index) => (
                                <div key={index} className="w-full md:w-[calc(50%-12px)]">
                                    <MovieItem movie={movie} compact />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center mt-10">
                        Không có suất chiếu cho ngày này.
                    </p>
                )}
            </div>
        </>
    );
}

export default Showtime;
