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

export { getProvinces, getCinemaByProvince };