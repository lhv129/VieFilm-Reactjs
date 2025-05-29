import axiosClient from "@apis/axiosClient";

const getOne = async (name) => {
    try {
        const res = await axiosClient.post('/promo/get-one-by-name', { name });
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Promo", error);
        return error.response.data;
    }
}

const getAll = async () => {
    try {
        const res = await axiosClient.get('/promo');
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Promo", error);
        return error.response.data;
    }
}

const updateStatus = async (body) => {
    return await axiosClient.put('/promo/update/status', body);
}

const deletePromo = async (id) => {
    try {
        const res = await axiosClient.delete(`/promo/${id}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Promo", error);
    }
}

const createPromo = async (body) => {
    return await axiosClient.post("/promo", body);
}

const updatePromo = async (id,body) => {
    return await axiosClient.put(`/promo/${id}`, body);
}

const getOneBySlug = async (slug) => {
    try {
        const res = await axiosClient.get(`/promo/${slug}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Promo", error);
        return error.response.data;
    }
}

export { getOne, getAll, updateStatus, deletePromo, createPromo, updatePromo,getOneBySlug };
