import MovieSlider from '@components/MovieSlider/MovieSlider';
import MovieList from "@components/MovieList/MovieList";
import { useEffect, useState } from "react";
import { getMoviesByDate } from "@apis/movieService";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";


const Home = () => {
    const [movieDate, setMovieDate] = useState('showing');
    const [movies, setMovies] = useState([]);
    const [isLoadingMovies, setIsLoadingMovies] = useState(false);

    useEffect(() => {
        setIsLoadingMovies(true);
        getMoviesByDate(movieDate).then((res) => {
            if (res && res.data && res.data.length > 0) {
                setMovies(res.data);
            }
        }).finally(() => {
            setIsLoadingMovies(false); // 👈 sau khi fetch xong mới tắt loading
        });
    }, [movieDate]);

    const handleStatusChange = (newDate) => {
        setMovieDate(newDate);
    };

    return (
        <>
            <Helmet>
                <title>VieFilm | Trang chủ</title>
            </Helmet>
            <MovieSlider></MovieSlider>
            <div className="container min-h-screen">
                <div className="flex justify-center mb-8 mt-6">
                    <div className="relative flex space-x-8 text-xl font-semibold border-b border-gray-300">
                        {[
                            { value: 'showing', label: 'Phim đang chiếu' },
                            { value: 'upcoming', label: 'Phim sắp chiếu' }
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => handleStatusChange(tab.value)}
                                className={`pb-2 transition-all duration-300 cursor-pointer ${movieDate === tab.value
                                    ? 'text-[#337ab7] border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-blue-400'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
                <AnimatePresence mode="wait">
                    {!isLoadingMovies && (
                        <motion.div
                            key={movieDate}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.4 }}
                        >
                            <MovieList movies={movies} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}

export default Home;