import axiosInstance from '../axios/axiosInstance';

export const fetchApplies = async () => {
    const res = await axiosInstance.get('/api/admin/struct');
    const res2 = await axiosInstance.get('api/admin/struct/access');
    return [...res.data, ...res2.data];
};

export const fetchUnstructApplies = async () => {
    const res = await axiosInstance.get('/api/admin/unstruct');
    return res.data;
};

export const postApplyApprove = async ({ cohort_id }) => {
    const res = await axiosInstance.post(`/api/admin/struct/id/${cohort_id}/approve`, {
        review: '',
    });
    return res.data;
};

export const postApplyReject = async ({ cohort_id, review }) => {
    const res = await axiosInstance.post(`/api/admin/struct/id/${cohort_id}/reject`, {
        review: review,
    });
    return res.data;
};

export const postStructAccess = async ({ access_id, approved, review }) => {
    const res = await axiosInstance.post(`/api/admin/struct/id/${access_id}/approve_access`, {
        approved: approved,
        review: review,
    });
    return res.data;
};
