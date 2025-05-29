import axiosClient from "@apis/axiosClient";

const getAll = async () => {
    try {
        const res = await axiosClient.get('/users');
        return res.data;
    } catch (error) {
        return error;
    }
};

const updateStatus = async (body) => {
    return await axiosClient.post('/users/update/status', body);
}

const deleteUser = async (userId) => {
    return await axiosClient.delete('/users', {
        data: { userId },
    });
}

const getOne = async (id) => {
    try {
        const res = await axiosClient.get(`/users/${id}`);
        return res.data;
    } catch (error) {
        return error;
    }
}

const updateRole = async (body) => {
    return await axiosClient.put('/users/update-role', body);
}

const removeRole = async (id) => {
    return await axiosClient.post('/users/remove/role',id);
}


export { getAll, updateStatus, deleteUser, getOne, updateRole, removeRole };