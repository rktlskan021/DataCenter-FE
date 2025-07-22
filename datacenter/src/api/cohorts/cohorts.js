import axiosInstance from '../axios/axiosInstance';

export const fetchCohorts = async () => {
    const res = await axiosInstance.get('/api/cohort/');
    return res.data;
};

export const fetchCohortDetail = async (cohort_id) => {
    const res = await axiosInstance.get(`/api/cohort/id/${cohort_id}`);
    return res.data;
};
