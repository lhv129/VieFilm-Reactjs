import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
    baseURL: 'https://viefilm-api.vercel.app/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosClient.interceptors.request.use(async (config) => {
    const access_token = Cookies.get('access_token');

    if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`
    }
    return config;
}, (err) => {
    return Promise.reject(err)
})

axiosClient.interceptors.response.use((res) => {
    return res;
}, async (err) => {
    const originalRequest = err.config;
    if ((err.response?.status === 401 || err.response?.status === 403) && !originalRequest._retry) {
        originalRequest._retry = true;

        const refresh_token = Cookies.get('refresh_token');
        if (!refresh_token) return Promise.reject(err);

        try {
            const res = await axiosClient.post('/auth/refresh-token', {
                refresh_token: refresh_token,
            });
            const newAccessToken = res.data.access_token;
            Cookies.set('access_token', newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosClient(originalRequest);
        } catch (refreshErr) { // ⚠️ ĐỔI TÊN Ở ĐÂY
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            return Promise.reject(refreshErr);
        }
    }

    return Promise.reject(err);
});


export default axiosClient;