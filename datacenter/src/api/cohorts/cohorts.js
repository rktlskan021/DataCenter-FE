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

    formData.append('schema_name', schemaName);
    formData.append('schema_description', schemaDescription);

    selectedTables.forEach((table) => {
        formData.append('tables', table);
    });

    selectedFiles.forEach((file) => {
        formData.append('files', file);
    });

    const res = await axiosInstance.post(`/api/cohort/id/${cohort_id}/apply_struct/`, formData);
    return res.data;
};

export const postApplyCohortModify = async ({
    struct_id,
    schemaName,
    schemaDescription,
    selectedTables,
    selectedFiles,
}) => {
    const formData = new FormData();

    formData.append('schema_name', schemaName);
    formData.append('schema_description', schemaDescription);

    selectedTables.forEach((table) => {
        formData.append('tables', table);
    });

    selectedFiles.forEach((file) => {
        formData.append('files', file);
    });

    const res = await axiosInstance.post(`/api/struct/id/${struct_id}/modify/`, formData);
    return res.data;
};

export const postApplyUnstruct = async ({
    cohort_id,
    data_type,
    sub_types,
    start_dates,
    end_dates,
    files,
}) => {
    const formData = new FormData();

    formData.append('data_type', data_type);

    sub_types.forEach((type) => {
        formData.append('sub_types', type);
    });

    start_dates.forEach((date) => {
        formData.append('start_dates', date);
    });

    end_dates.forEach((date) => {
        formData.append('end_dates', date);
    });

    files.forEach((file) => {
        formData.append('files', file);
    });

    const res = await axiosInstance.post(`/api/cohort/id/${cohort_id}/apply_unstruct/`, formData);
    return res.data;
};
