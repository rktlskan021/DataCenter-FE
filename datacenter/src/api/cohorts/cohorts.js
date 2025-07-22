import axiosInstance from '../axios/axiosInstance';

export const fetchCohorts = async () => {
    const res = await axiosInstance.get('/cohort');
    return res.data;
};
