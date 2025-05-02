import axiosClient from "@apis/axiosClient"

const getAllByCinema = async (cinemaId) => {
    try {
        const res = await axiosClient.post('/screens/get-all-by-cinema', { cinemaId });
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Screen", error);
    }
}

const createScreen = async (body) => {
    return await axiosClient.post(`/screens`, body);
}

const getOneById = async (body) => {
    try {
        const res = await axiosClient.post('/screens/get-one', body);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Screen", error);
    }
}

const editScreen = async (body) => {
    return await axiosClient.put('/screens', body);
}

const deleteScreen = async (body) => {
    try {
        const res = await axiosClient.delete('/screens', {
            data: body
        });
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Province", error);
    }
}

export { getAllByCinema, createScreen, getOneById, editScreen, deleteScreen };