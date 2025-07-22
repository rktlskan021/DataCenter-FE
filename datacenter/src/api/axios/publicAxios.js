// src/api/axios/publicAxios.ts
import axios from 'axios';

const publicAxios = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

publicAxios.interceptors.response.use(
    (res) => res,
    (err) => {
        // 위에서 설명한 로직 공통 적용
        return Promise.reject(err);
    }
);

export default publicAxios;
