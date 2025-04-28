import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Link } from "react-router-dom";

const MovieList = ({ movies }) => {
    const navigate = useNavigate();
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState("");

    const openTrailer = (url) => {
        setTrailerUrl(convertToEmbedUrl(url) + "?autoplay=1"); // Thêm autoplay
        setShowTrailer(true);
    };

    const convertToEmbedUrl = (url) => {
        if (!url) return "";
        return url.replace("watch?v=", "embed/");
    };

    const closeTrailer = () => {
        setShowTrailer(false);
        setTrailerUrl(""); // Reset URL tránh video vẫn phát ngầm
    };

    const handleBackdropClick = (e) => {
        if (e.target.id === "backdrop") {
            closeTrailer();
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
            {movies.map((movie) => (
                <div
                    key={movie._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
                    style={{ minHeight: '500px' }}
                >
                    <div className="relative group w-full h-full lg:h-80 cursor-pointer overflow-hidden rounded-xl shadow-md" onClick={() => openTrailer(movie.trailer)}>
                        {/* Ảnh + Tag + Lớp tối */}
                        <div className="relative w-full h-full">
                            {/* Ảnh Poster */}
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            {/* Thẻ tag tuổi */}
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

                            {/* Lớp phủ nền tối */}
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300"></div>
                        </div>

                        {/* Icon Play */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                            <div className="bg-white bg-opacity-75 p-4 rounded-full">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-10 w-10 text-black"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between flex-1 p-4">
                        <div>
                            <h2 className="text-[#337ab7] font-bold text-base leading-snug min-h-[48px] mb-2 line-clamp-2" >
                                <Link to={`/chi-tiet-phim/${movie.slug}`} className="hover:underline">
                                    {movie.title}
                                </Link>
                            </h2>
                            <p className="text-sm text-gray-700">
                                <strong>Thể loại:</strong> {movie.genres}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>Thời lượng:</strong> {movie.duration} phút
                            </p>
                        </div>
                        <button
                            className="w-full relative bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition cursor-pointer mt-4"
                            onClick={() => navigate(`/chi-tiet-phim/${movie.slug}`)}
                        >
                            <img
                                src="/images/movies/tickets-icon.svg"
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-[30px] h-[30px]"
                                alt="ticket icon"
                            />
                            <span className="block text-center">MUA VÉ</span>
                        </button>
                    </div>
                </div>
            ))}

            {showTrailer && (
                <div
                    id="backdrop"
                    onClick={handleBackdropClick}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
                >
                    <div className="bg-white rounded-lg overflow-hidden w-full max-w-3xl relative">
                        {/* Nút đóng */}
                        <button
                            onClick={closeTrailer}
                            className="absolute top-2 right-2 text-gray-700 hover:text-black text-2xl font-bold cursor-pointer"
                        >
                            &times;
                        </button>

                        {/* Trailer */}
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
};

export default MovieList;
