import axiosClient from "@apis/axiosClient"

const getProvinces = async () => {
    try {
        const res = await axiosClient.get('/provinces');
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Province", error);
    }
}

const getCinemaByProvince = async () => {
    try {
        const res = await axiosClient.get('/provinces/get-cinema-by-province');
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Province", error);
    }
}

const create = async (body) => {
    return await axiosClient.post('/provinces', body);
}

const deleteProvince = async (slug) => {
    try {
        const res = await axiosClient.delete(`/provinces/${slug}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Province", error);
    }
}

const getOne = async (slug) => {
    try {
        const res = await axiosClient.get(`/provinces/${slug}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Province", error);
    }
}

const editProvince = async (slug,body) => {
    console.log(slug,name);
    return await axiosClient.put(`/provinces/${slug}`,body);
}

export { getProvinces, getCinemaByProvince, create, deleteProvince, getOne, editProvince};