import axios from 'axios';
import Cookies from 'js-cookie';
import publicAxios from './publicAxios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
    const token = Cookies.get('token');
    if (!token) return config;

    try {
        // 서버에 토큰 유효성 확인 요청
        const res = await publicAxios.get('/api/user/verify', {
            headers: { Authorization: `Bearer ${token}` },
            baseURL: config.baseURL,
        });
        if (res.status === 200) {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        } else if (res.status === 403) {
            console.log('토큰 만료 실행');
            Cookies.remove('token');
            window.location.href = '/';
            throw new axios.Cancel('Token invalid from server');
        }
    } catch (err) {
        console.warn('🔒 서버에서 토큰 만료 판단됨');
        console.warn(err);
        Cookies.remove('token');
        window.location.href = '/';
        throw new axios.Cancel('Token invalid from server');
    }

    return config;
});

axiosInstance.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 403) {
            Cookies.remove('token');
            alert('토큰 만료');
            window.location.href = '/';
        }
        return Promise.reject(err);
    }
);

export default axiosInstance;
