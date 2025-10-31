import axiosInstance from '../axios/axiosInstance';

export const fetchApplies = async () => {
    const res = await axiosInstance.get('/api/admin/struct');
    return res.data;
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
