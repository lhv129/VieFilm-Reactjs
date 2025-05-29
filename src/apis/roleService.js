import axiosClient from "@apis/axiosClient"

const getOneById = async (roleId) => {
    try {
        const res = await axiosClient.post('/roles/get-one', { roleId });
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Roles", error);
    }
}

const getAllRole = async () => {
    try {
        const res = await axiosClient.get('/roles');
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Roles", error);
    }
}

export { getOneById, getAllRole };