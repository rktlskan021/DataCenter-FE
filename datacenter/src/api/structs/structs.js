import axiosInstance from '../axios/axiosInstance';

export const fetchStructs = async () => {
    const res = await axiosInstance.get('/api/struct/public');
    return res.data;
};

export const postApplySchema = async ({ schema_id, purpose }) => {
    const res = await axiosInstance.post(`/api/struct/id/${schema_id}/apply_access`, {
        purpose: purpose,
    });
    return res.data;
};
