import axiosInstance from '../axios/axiosInstance';

export const fetchApplies = async () => {
    const res = await axiosInstance.get('/api/admin/applies');
    return res.data;
};
