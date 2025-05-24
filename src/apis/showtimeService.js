import axiosClient from "@apis/axiosClient"


const getAllByMovie = async (cinemaId, movieId) => {
    try {
        const res = await axiosClient.post('/showtimes/get-all-by-movie', {
            cinemaId,   // trường cinemaId
            movieId     // trường movieId
        });
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Showtime", error);
    }
}

const getSeats = async (showtimeId) => {
    try {
        const res = await axiosClient.post('/showtimes/get-seats-by-showtime', { showtimeId });
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Showtime", error);
    }
}

const getAll = async (body) => {
    try {
        const res = await axiosClient.post('/showtimes/get-all', body);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Showtime", error);
    }
}

const createShowtime = async (body) => {
    return await axiosClient.post('/showtimes', body);
}

const getShowtimeById = async (id) => {
    try {
        const res = await axiosClient.get(`/showtimes/${id}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Showtime", error);
    }
}

const updateShowtime = async (id, body) => {
    return await axiosClient.put(`/showtimes/${id}`, body);
}

const deleteShowtime = async (body) => {
    try {
        const res = await axiosClient.delete('/showtimes', {
            data: body
        });
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Seat", error);
    }
}

const getAllByDate = async (body) => {
    try{
        const res = await axiosClient.post("/showtimes/get-all-by-date",body);
        return res.data;
    }catch(error){
        console.error("Lỗi khi gọi Api Movie");
    }
}

export { getAllByMovie, getSeats, getAll, createShowtime, getShowtimeById, updateShowtime, deleteShowtime, getAllByDate };