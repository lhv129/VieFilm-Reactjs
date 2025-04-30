import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Link } from "react-router-dom";
import { getAllByMovie } from "@apis/showtimeService";
import MovieSkeleton from "@components/MovieSkeleton/MovieSkeleton";

const ShowtimeSelector = lazy(() => import("@components/ShowtimeSelector/ShowtimeSelector"));

const MovieList = ({ movies }) => {
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState("");

    const [showBooking, setShowBooking] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [cinemaId, setCinemaId] = useState(null);
    const [cinemaName, setCinemaName] = useState('');
    const [loadingMovies, setLoadingMovies] = useState(true);
    const [loadingShowtimes, setLoadingShowtimes] = useState(false);
    const [moviesWithShowtimes, setMoviesWithShowtimes] = useState([]);
    const [showtimes, setShowtimes] = useState([]);

    useEffect(() => {
        const cinema = JSON.parse(localStorage.getItem('cinema'));
        if (cinema) {
            setCinemaId(cinema._id || null);
            setCinemaName(cinema.name || '');
        }
    }, []);

    useEffect(() => {
        const fetchShowtimesForMovies = async () => {
            if (!cinemaId || movies.length === 0) return;

            try {
                const promises = movies.map((movie) =>
                    getAllByMovie(cinemaId, movie._id)
                        .then(res => ({ movieId: movie._id, hasShowtimes: res.data.length > 0 }))
                        .catch(() => ({ movieId: movie._id, hasShowtimes: false }))
                );

                const results = await Promise.all(promises);

                const availableMovieIds = results
                    .filter(result => result.hasShowtimes)
                    .map(result => result.movieId);

                setMoviesWithShowtimes(availableMovieIds);
            } catch (error) {
                console.error("Error fetching showtimes for movies:", error);
            } finally {
                setLoadingMovies(false);
            }
        };

        fetchShowtimesForMovies();
    }, [cinemaId, movies]);

    useEffect(() => {
        if (showBooking && selectedMovie) {
            setLoadingShowtimes(true);
            getAllByMovie(cinemaId, selectedMovie._id)
                .then((res) => {
                    setShowtimes(res.data);
                })
                .finally(() => {
                    setLoadingShowtimes(false);
                });
        }
    }, [showBooking, selectedMovie, cinemaId]);

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

    return (
        <div className="relative">
            {/* Movie List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                {loadingMovies
                    ? Array.from({ length: 8 }).map((_, index) => <MovieSkeleton key={index} />)
                    : movies.map((movie) => (
                        <div
                            key={movie._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
                        >
                            {/* Poster */}
                            <div
                                className="relative group w-full h-[500px] lg:h-80 cursor-pointer overflow-hidden rounded-xl shadow-md"
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

                            {/* Movie Info */}
                            <div className="flex flex-col justify-between flex-1 p-4">
                                <div>
                                    <h2 className="text-[#337ab7] font-bold text-base leading-snug min-h-[48px] mb-2 line-clamp-2">
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

                                {/* MUA VÉ Button */}
                                {moviesWithShowtimes.includes(movie._id) && (
                                    <button
                                        onClick={() => {
                                            setSelectedMovie(movie);
                                            setShowBooking(true);
                                        }}
                                        className="w-full relative bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition cursor-pointer mt-4"
                                    >
                                        <img
                                            src="/images/movies/tickets-icon.svg"
                                            className="absolute left-2 top-1/2 -translate-y-1/2 w-[30px] h-[30px]"
                                            alt="ticket icon"
                                        />
                                        <span className="block text-center">MUA VÉ</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                }
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

            {/* Booking Modal */}
            {showBooking && (
                <div
                    id="booking-backdrop"
                    onClick={(e) => {
                        if (e.target.id === "booking-backdrop") setShowBooking(false);
                    }}
                    className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
                >
                    <div className="bg-white rounded-lg overflow-hidden w-full max-w-2xl relative p-6">
                        <button
                            onClick={() => setShowBooking(false)}
                            className="absolute top-2 right-2 text-gray-700 hover:text-black text-2xl font-bold cursor-pointer"
                        >
                            &times;
                        </button>

                        <h2 className="text-base font-semibold mb-4">Lịch chiếu - {selectedMovie?.title}</h2>
                        <h2 className="text-xl font-semibold mb-4 text-center">{cinemaName}</h2>

                        {loadingShowtimes ? (
                            <div className="flex justify-center items-center py-10">
                                <span className="text-gray-500">Đang tải lịch chiếu...</span>
                            </div>
                        ) : (
                            showtimes.length > 0 && (
                                <div className="mt-10">
                                    <Suspense fallback={<div>Đang tải giao diện đặt vé...</div>}>
                                        <ShowtimeSelector showtimes={showtimes} />
                                    </Suspense>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieList;
