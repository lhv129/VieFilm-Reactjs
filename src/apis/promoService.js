import axiosClient from "@apis/axiosClient";

const getOne = async (name) => {
    try {
        const res = await axiosClient.post('/promo/get-one-by-name',{name});
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Promo", error);
        return error.response.data;
    }
}

export {getOne};
