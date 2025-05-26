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

const updateProfile = async (body) => {
    return await axiosClient.post('/auth/profile', body, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

const changePassword = async (body) => {
    return await axiosClient.post('/auth/change-password', body);
}

const sendTokenForgetPassword = async ({email}) => {
    return await axiosClient.post('/auth/send-token-forget-password', {email:email});
}

const forgetPassword = async (body) => {
    return await axiosClient.put('/auth/forget-password',body);
}

export { register, verifyEmail, sign, updateProfile, changePassword,sendTokenForgetPassword,forgetPassword }