import axiosClient from "@apis/axiosClient";

const getProducts = async () => {
    try {
        const res = await axiosClient.get('/products');
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Product", error);
    }
}

export { getProducts };