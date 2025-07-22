import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get('token');

    if (token) {
        try {
            const decoded = jwtDecode(token);
            const now = Date.now() / 1000;

            if (decoded.exp && decoded.exp < now) {
                console.warn('🔒 Token expired');
                Cookies.remove('token'); // 토큰 제거
                window.location.href = '/login'; // 로그인 페이지로 리디렉션
                throw new axios.Cancel('Token expired');
            }

            config.headers.Authorization = `Bearer ${token}`;
        } catch (e) {
            console.warn('❌ Invalid token');
            Cookies.remove('token');
            window.location.href = '/login';
            throw new axios.Cancel('Invalid token');
        }
    }

    return config;
});

axiosInstance.interceptors.response.use(
    (res) => res,
    (err) => {
        return Promise.reject(err);
    }
);

export default axiosInstance;
