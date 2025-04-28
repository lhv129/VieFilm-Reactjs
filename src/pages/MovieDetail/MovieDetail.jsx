import Header from "@components/Header/Header";
import Preloader from "@components/Preloader/Preloader";
import NotFound from "@pages/404NotFound/NotFound";
import { getOne } from "@apis/movieService";
import { getAllByMovie } from "@apis/showtimeService";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ShowtimeSelector from "@components/ShowtimeSelector/ShowtimeSelector";

function MovieDetail() {
    const { slug } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showtimes, setShowtimes] = useState([]);

    // Lấy ngày hiện tại
    const today = new Date();
    const currentDate = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${today.getFullYear()}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const movieRes = await getOne(slug);
                if (movieRes && movieRes.data) {
                    setMovie(movieRes.data);

                    // Sau khi có movie thì lấy luôn suất chiếu
                    const showtimeRes = await getAllByMovie(currentDate, "68035db82d21be7453864e99", movieRes.data._id);
                    if (showtimeRes && showtimeRes.data) {
                        setShowtimes(showtimeRes.data);
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
    }, [slug]);

    if (loading) return <Preloader />;
    if (!movie) return <NotFound />;

    return (
        <>
            <Header />
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
