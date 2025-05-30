import axiosClient from "@apis/axiosClient";

const revenueByCinema = async (cinemaId) => {
    try {
        const res = await axiosClient.post(`/dashboard/get-revenue-by-cinema`, { cinemaId: cinemaId });
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}

const revenueByMovie = async (cinemaId) => {
    try {
        const res = await axiosClient.post(`/dashboard/get-revenue-by-movie`, { cinemaId: cinemaId });
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}

const getRevenueTopByCinema = async (cinemaId) => {
    try {
        const res = await axiosClient.post(`/dashboard/get-revenue-top-by-cinema`, { cinemaId: cinemaId });
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}


const ticketSalesChart = async (cinemaId) => {
    try {
        const res = await axiosClient.post(`/dashboard/get-total-seat`, { cinemaId: cinemaId });
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}

export { ticketSalesChart, revenueByCinema, getRevenueTopByCinema, revenueByMovie }