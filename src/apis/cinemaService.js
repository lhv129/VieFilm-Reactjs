import axiosClient from "@apis/axiosClient"

const getAllByProvince = async (provinceId) => {
    try {
        const res = await axiosClient.post('/cinemas/get-all-by-province', { provinceId });
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Cinema", error);
    }
}

const createProvince = async (body) => {
    return await axiosClient.post('/cinemas', body, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

const getOne = async (slug) => {
    try {
        const res = await axiosClient.get(`/cinemas/${slug}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Cinema", error);
    }
}

const editProvince = async (slug, body) => {
    return await axiosClient.put(`/cinemas/${slug}`, body, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

const deleteCinema = async (slug) => {
    try {
        const res = await axiosClient.delete(`/cinemas/${slug}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Cinema", error);
    }
}

const getOneById = async (id) => {
    try {
        const res = await axiosClient.get(`/cinemas/get-one/${id}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Cinema", error);
    }
}

export { getAllByProvince, createProvince, getOne, editProvince, deleteCinema,getOneById };