import axiosInstance from '../axios/axiosInstance';
import publicAxios from '../axios/publicAxios';
import qs from 'qs';

export const fetchUserCohorts = async () => {
    const res = await axiosInstance.get('/api/user/cohort');
    return res.data;
};

export const fetchUserDetailCohort = async (cohort_id) => {
    console.log(cohort_id);
    const res = await axiosInstance.get(`/api/user/cohort/id/${cohort_id}`);
    return res.data;
};

export const postApplyCohort = async ({ cohort_id }) => {
    const res = await axiosInstance.post(`/api/user/cohort/id/${cohort_id}`);
    return res.data;
};

export const postLogin = async (id, password) => {
    const res = await publicAxios.post('/login', {
        id: id,
        pw: password,
    });
    return res.data;
};
