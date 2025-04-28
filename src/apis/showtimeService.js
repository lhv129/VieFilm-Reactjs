import axiosClient from "@apis/axiosClient"


const getAllByMovie = async (date, cinemaId, movieId) => {
    try {
        const res = await axiosClient.post('/showtimes/get-all-by-movie', {
            date,       // trường date
            cinemaId,   // trường cinemaId
            movieId     // trường movieId
        });
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Movie", error);
    }
}


export { getAllByMovie };