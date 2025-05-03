import axiosClient from "@apis/axiosClient"

const getAllByCinema = async (screenId) => {
    try {
        const res = await axiosClient.post('/seats/get-all-by-screen', { screenId });
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Seat", error);
    }
}

const createSeat = async (body) => {
    return await axiosClient.post('/seats', body);
}

const updateSeat = async (body) => {
    return await axiosClient.put('/seats', body);
}

const deleteSeat = async (body) => {
    try {
        const res = await axiosClient.delete('/seats', {
            data: body
        });
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Seat", error);
    }
}

export { getAllByCinema, createSeat, updateSeat, deleteSeat };