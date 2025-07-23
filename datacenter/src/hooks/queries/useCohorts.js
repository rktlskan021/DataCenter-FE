import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCohorts, fetchCohortDetail, postApplyCohort } from '../../api/cohorts/cohorts';

export const useCohorts = () => {
    return useQuery({
        queryKey: ['cohorts'],
        queryFn: fetchCohorts,
    });
};

export const useCohortDetail = (cohort_id) => {
    return useQuery({
        queryKey: ['cohortDetail', cohort_id],
        queryFn: () => fetchCohortDetail(cohort_id),
        enabled: !!cohort_id,
    });
};

export const useApplyCohort = () => {
    return useMutation({
        mutationFn: postApplyCohort,
    });
};
