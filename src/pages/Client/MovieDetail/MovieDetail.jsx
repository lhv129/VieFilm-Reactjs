import Preloader from "@components/Preloader/Preloader";
import NotFound from "@pages/404NotFound/NotFound";
import { getDetails } from "@apis/movieService";
import { getAllByMovie } from "@apis/showtimeService";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ShowtimeSelector from "@components/ShowtimeSelector/ShowtimeSelector";
import { Helmet } from "react-helmet";

function MovieDetail() {
    const { slug } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showtimes, setShowtimes] = useState([]);
    const [cinemaId, setCinemaId] = useState(() => {
        const cinema = JSON.parse(localStorage.getItem('cinema'));
        return cinema?._id || null;
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const movieRes = await getDetails(slug);
                if (movieRes && movieRes.data) {
                    setMovie(movieRes.data);

                    if (cinemaId) {
                        const showtimeRes = await getAllByMovie(cinemaId, movieRes.data._id);
                        if (showtimeRes && showtimeRes.data) {
                            setShowtimes(showtimeRes.data);
                        }
                    }
                } else {
                    setMovie(null);
                }
            } catch (error) {
                console.error(error);
                setMovie(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug, cinemaId]); // 👈 Thêm cinemaId vào dependency array

    // Theo dõi thay đổi cinema trong localStorage
    useEffect(() => {
        const interval = setInterval(() => {
            const cinema = JSON.parse(localStorage.getItem('cinema'));
            const newCinemaId = cinema?._id || null;

            if (newCinemaId !== cinemaId) {
                setCinemaId(newCinemaId);
            }
        }, 1000); // Kiểm tra mỗi 1s (bạn có thể điều chỉnh)

        return () => clearInterval(interval);
    }, [cinemaId]);

    if (loading) return <Preloader />;
    if (!movie) return <NotFound />;

    return (
        <>
            <Helmet>
                <title>Chi tiết phim</title>
            </Helmet>
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row gap-10 mt-5">
                    {/* Poster */}
                    <div className="flex-shrink-0">
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="rounded-xl shadow-lg w-full md:w-[300px] object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-700 mb-4">{movie.title}</h1>
                        <p className="text-base text-gray-700 mb-6">{movie.description}</p>

                        <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
                            <p><span className="font-semibold">Đạo diễn:</span> {movie.directors}</p>
                            <p><span className="font-semibold">Diễn viên:</span> {movie.actors}</p>
                            <p><span className="font-semibold">Thể loại:</span> {movie.genres}</p>
                            <p><span className="font-semibold">Thời lượng:</span> {movie.duration} phút</p>
                            <p><span className="font-semibold">Ngôn ngữ:</span> {movie.language}</p>
                            <p><span className="font-semibold">Ngày khởi chiếu:</span> {new Date(movie.releaseDate).toLocaleDateString("vi-VN")}</p>
                        </div>
                    </div>
                </div>

                {/* Nếu có suất chiếu mới hiện ShowtimeSelector */}
                {showtimes.length > 0 && (
                    <div className="mt-10">
                        <ShowtimeSelector showtimes={showtimes} />
                    </div>
                )}
            </div>
        </>
    );
}

export default MovieDetail;
