import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCohorts } from '../../api/cohorts/cohorts';

export const useCohorts = () => {
    return useQuery({
        queryKey: ['userCohorts'],
        queryFn: fetchCohorts,
    });
};
