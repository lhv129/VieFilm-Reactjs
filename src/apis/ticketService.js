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

export { holdSeats, deleteHoldSeats, checkOut, returnVNPAY };