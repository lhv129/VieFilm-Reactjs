import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MovieItem({ movie, compact = false, isFirst = false }) {

    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState("");

    const openTrailer = (url) => {
        setTrailerUrl(convertToEmbedUrl(url) + "?autoplay=1");
        setShowTrailer(true);
    };

    const closeTrailer = () => {
        setShowTrailer(false);
        setTrailerUrl("");
    };

    const handleBackdropClick = (e) => {
        if (e.target.id === "backdrop") {
            closeTrailer();
        }
    };

    const convertToEmbedUrl = (url) => {
        if (!url) return "";
        return url.replace("watch?v=", "embed/");
    };

    const sortedShowtimes = [...movie.showtimes].sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
    );

    const navigate = useNavigate();
    const now = new Date();

    return (
        <div className="flex gap-6 pb-8">
            {/* Poster */}
            <div
                className={`relative group overflow-hidden rounded-xl shadow-md cursor-pointer transition duration-300 ${isFirst
                    ? 'w-40 h-40 sm:w-44 sm:h-64 md:w-72 md:h-92'
                    : 'w-40 h-40 sm:w-36 sm:h-52 md:w-40 md:h-56'} `}
                onClick={() => openTrailer(movie.trailer)}
            >
                <div className="relative w-full h-full">
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        loading="lazy" // 🔥 Lazy load image
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div
                        className="absolute top-2 left-2 w-[57px] h-[26px] bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${movie.ageRating === 'P' ? '/images/movies/tagsAge/p.png'
                                : movie.ageRating === 'T13' ? '/images/movies/tagsAge/c-13.png'
                                    : movie.ageRating === 'T16' ? '/images/movies/tagsAge/c-16.png'
                                        : movie.ageRating === 'T18' ? '/images/movies/tagsAge/c-18.png'
                                            : ''
                                })`
                        }}
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300"></div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <div className="bg-white bg-opacity-75 p-4 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className='w-full'>
                <h3 className={`font-bold ${isFirst ? 'text-xl md:text-3xl text-[#337ab7]' : 'text-xl text-[#337ab7]'}`}>
                    {movie.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                    {movie.genres} • {movie.duration} phút
                </p>

                {/* Các suất chiếu */}
                <div
                    className={`grid gap-y-3 gap-x-4 w-full ${compact
                        ? 'grid-cols-3'
                        : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-7'}`}
                >
                    {sortedShowtimes.map((showtime) => {
                        const [day, month, year] = showtime.date.split('/').map(Number);
                        const [hour, minute] = showtime.startTime.split(':').map(Number);
                        const showtimeDate = new Date(year, month - 1, day, hour, minute);
                        const isPast = showtimeDate < now;

                        return (
                            <div key={showtime._id} className="flex flex-col items-center">
                                <button
                                    className={`w-full py-2 rounded-md text-base font-semibold transition ${isPast
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-100 hover:bg-blue-100 cursor-pointer"
                                        }`}
                                    disabled={isPast}
                                    onClick={() =>
                                        !isPast && navigate('/dat-ve', {
                                            state: { showtimeId: showtime._id }
                                        })
                                    }
                                >
                                    {showtime.startTime}
                                </button>
                                <span className={`text-xs mt-1 text-center ${isPast ? "text-gray-400" : "text-gray-500"}`}>
                                    {showtime.emptySeats} ghế trống
                                </span>
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* Trailer Modal */}
            {showTrailer && (
                <div
                    id="backdrop"
                    onClick={handleBackdropClick}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
                >
                    <div className="bg-white rounded-lg overflow-hidden w-full max-w-3xl relative">
                        <button
                            onClick={closeTrailer}
                            className="absolute top-2 right-2 text-gray-700 hover:text-black text-2xl font-bold cursor-pointer"
                        >
                            &times;
                        </button>

                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-4">TRAILER</h2>
                            <div className="relative pt-[56.25%]">
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full"
                                    src={trailerUrl}
                                    title="Trailer"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default MovieItem;
