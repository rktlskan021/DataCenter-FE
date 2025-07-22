import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUserCohorts, fetchUserDetailCohort, postApplyCohort } from '../../api/users/users';

export const useUserCohorts = () => {
    return useQuery({
        queryKey: ['userCohorts'],
        queryFn: fetchUserCohorts,
    });
};

export const useUserDetailCohorts = (cohort_id) => {
    return useQuery({
        queryKey: ['userDetailCohorts', cohort_id],
        queryFn: () => fetchUserDetailCohort(cohort_id),
        enabled: !!cohort_id,
    });
};

// export const useApplyCohort = () => {

// }
