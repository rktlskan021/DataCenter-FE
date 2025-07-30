import axiosInstance from '../axios/axiosInstance';
import publicAxios from '../axios/publicAxios';

export const postLogin = async (id, password) => {
    const res = await publicAxios.post('/login', {
        id: id,
        pw: password,
    });
    return res.data;
};

export const fetchCohortApplies = async () => {
    const res = await axiosInstance.get('/api/user/cohort/applies');
    return res.data;
};

export const fetchIrbDrbData = async (path, name) => {
    const res = await axiosInstance.get(`/documents${path}`, {
        responseType: 'blob',
    });

    const file = new File([res.data], name, { type: res.data.typ });
    return file;
};

export const fetchSchemas = async () => {
    const res = await axiosInstance.get('/api/user/cohort/');
    return res.data;
};
