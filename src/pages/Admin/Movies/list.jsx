import { Helmet } from "react-helmet";
import { getMovies } from "@apis/movieService";
import { useEffect, useState } from "react";
import MovieTable from '@components/MovieTable/MovieTable';
import { Link } from "react-router-dom";
import { Button, message } from 'antd';


function list() {

    const [movies, setMovies] = useState([]);

    const fetchMovies = async () => {
        const res = await getMovies(); // hoặc API của bạn
        setMovies(res.data);
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    return (
        <>
            <Helmet>
                <title>Danh sách phim</title>
            </Helmet>
            <div className="p-6">
                {/* Nút thêm mới */}
                <div className="flex justify-end mb-4">
                    <Link to={`/admin/phim/them-moi`}>
                        <Button type="primary" className="bg-blue-500 hover:bg-blue-600 cursor-pointer">
                            Thêm mới
                        </Button>
                    </Link>
                </div>
                <MovieTable movies={movies} onReload={fetchMovies} />
            </div>
        </>
    )
}

export default list;