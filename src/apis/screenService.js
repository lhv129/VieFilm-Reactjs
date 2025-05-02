import axiosClient from "@apis/axiosClient"

const getAllByCinema = async (cinemaId) => {
    try {
        const res = await axiosClient.post('/screens/get-all-by-cinema', { cinemaId });
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Cinema", error);
    }
}

const createScreen = async (body) => {
    return await axiosClient.post(`/screens`,body);
}



export { getAllByCinema, createScreen };