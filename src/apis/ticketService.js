import axiosClient from "@apis/axiosClient"

const holdSeats = async (body) => {
    return await axiosClient.post('/tickets/hold/seats', body);
}

const deleteHoldSeats = async ({ ticketId }) => {
    return await axiosClient.delete('/tickets/hold/seats', {
        data: { ticketId },
    });
};

const checkOut = async (body) => {
    return await axiosClient.post('/tickets/checkout', body);
}

const returnVNPAY = async () => {
    try {
        const queryParams = new URLSearchParams(window.location.search);
        const queryObject = Object.fromEntries(queryParams.entries());

        const res = await axiosClient.get('/tickets/vnpay-return', {
            params: queryObject
        });

        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Ticket", error);
        return error.response.data;
    }
};

const getAllByUser = async (body) => {
    try {
        const res = await axiosClient.post('/tickets/get-all-by-user', body);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Ticket", error);
        return error.response.data;
    }
}

const getOneByUser = async (body) => {
    try {
        const res = await axiosClient.post('/tickets/get-one-by-user', body);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi Api Ticket", error);
        return error.response.data;
    }
}

const getAll = async (body) => {
    return await axiosClient.post('/tickets/get-all', body);
}

const getOne = async (body) => {
    return await axiosClient.post('/tickets/get-one', body);
}

const updateStatus = async (body) => {
    return await axiosClient.put('/tickets/update/status', body);
}

export { holdSeats, deleteHoldSeats, checkOut, returnVNPAY, getAllByUser, getOneByUser, getAll, getOne, updateStatus };