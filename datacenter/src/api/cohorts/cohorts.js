import axiosInstance from '../axios/axiosInstance';

export const fetchCohorts = async () => {
    const res = await axiosInstance.get('/api/cohort/');
    return res.data;
};

export const fetchCohortDetail = async (cohort_id) => {
    const res = await axiosInstance.get(`/api/cohort/id/${cohort_id}`);
    return res.data;
};

export const postApplyCohort = async ({
    cohort_id,
    schemaName,
    schemaDescription,
    selectedTables,
    selectedFiles,
}) => {
    const formData = new FormData();

    formData.append('name', schemaName);
    formData.append('description', schemaDescription);

    selectedTables.forEach((table) => {
        formData.append('tables', table);
    });

    selectedFiles.forEach((file) => {
        formData.append('files', file);
    });

    const res = await axiosInstance.post(`/api/cohort/id/${cohort_id}/apply/`, formData);
    return res.data;
};
