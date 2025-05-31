import axiosClient from "@apis/axiosClient";

const getProducts = async () => {
    try {
        const res = await axiosClient.get('/products');
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Product", error);
        return error.response.data.message;
    }
}

const updateStatus = async (body) => {
    return await axiosClient.put('/products/update/status', body);
}

const createProduct = async (body) => {
    return await axiosClient.post('/products', body, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

const updateProduct = async (slug, data) => {
    return await axiosClient.put(`/products/${slug}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

const getOne = async (slug) => {
    try {
        const res = await axiosClient.get(`/products/${slug}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Product", error);
        return error.response.data.message;
    }
}

const deleteProduct = async (slug) => {
    try {
        const res = await axiosClient.delete(`/products/${slug}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Product", error);
    }
}

export { getProducts, updateStatus, createProduct, updateProduct, getOne, deleteProduct };