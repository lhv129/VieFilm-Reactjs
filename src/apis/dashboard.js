import axiosClient from "@apis/axiosClient";

const revenueByCinema = async () => {
    try {
        const res = await axiosClient.post(`/dashboard/get-revenue-by-cinema`);
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}


const ticketSalesChart = async (cinemaId) => {
    try {
        const res = await axiosClient.post(`/dashboard/get-total-seat`,{cinemaId:cinemaId});
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}

export { ticketSalesChart, revenueByCinema }