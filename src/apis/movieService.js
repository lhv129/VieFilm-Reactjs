import axiosClient from "@apis/axiosClient"

const getMovies = async () => {
    try {
        const res = await axiosClient.get('/movies');
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Movie", error);
    }
}

const getMoviesByDate = async (date) => {
    try {
        const res = await axiosClient.post('/movies/get-all-by-date', { date });
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Movie", error);
    }
}

const getOne = async (slug) => {
    try {
        const res = await axiosClient.get(`/movies/${slug}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Movie", error);
    }
}

const getOneById = async (id) => {
    try {
        const res = await axiosClient.get(`/movies/get-one-by-id/${id}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Movie", error);
    }
}

const updateStatusMovie = async (body) => {
    return await axiosClient.post('/movies/update-status-movie', body);
}

const createMovie = async (body) => {
    return await axiosClient.post('/movies', body, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

const updateMovie = async (slug,body) => {
    return await axiosClient.put(`/movies/${slug}`, body, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export { getMovies, getMoviesByDate, getOne, getOneById, updateStatusMovie, createMovie,updateMovie };