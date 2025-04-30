import axiosClient from "@apis/axiosClient";

const register = async (body) => {
    return await axiosClient.post('/auth/register', body);
}

const sign = async (body) => {
    return await axiosClient.post('/auth/login', body);
}

const verifyEmail = async (token) => {
    try {
        const res = await axiosClient.get(`/auth/verify-email/${token}`,);
        return res.data;
    } catch (error) {
        // console.error("Lỗi khi gọi Api Verify Email", error);
        return error;
    }
}

export { register, verifyEmail, sign }