import axiosInstance from '../axios/axiosInstance';

export const fetchApplies = async () => {
    const res = await axiosInstance.get('/api/admin/applies');
    return res.data;
};

export const postApplyApprove = async ({ cohort_id, review }) => {
    const res = await axiosInstance.post(`/api/admin/applies/id/${cohort_id}/approve`, {
        review: review,
    });
    return res.data;
};

export const postApplyReject = async ({ cohort_id, review }) => {
    const res = await axiosInstance.post(`/api/admin/applies/id/${cohort_id}/reject`, {
        review: review,
    });
    return res.data;
};
