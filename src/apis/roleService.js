import axiosClient from "@apis/axiosClient"

const getOneById = async (id) => {
    try {
        const res = await axiosClient.get(`/roles/get-one/${id}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Roles", error);
    }
}


export { getOneById };