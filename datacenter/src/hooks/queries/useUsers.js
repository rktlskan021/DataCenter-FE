import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSchemas, fetchCohortApplies } from '../../api/users/users';

export const useSchemas = () => {
    return useQuery({
        queryKey: ['schemas'],
        queryFn: fetchSchemas,
    });
};

export const useApplies = () => {
    return useQuery({
        queryKey: ['applies'],
        queryFn: fetchCohortApplies,
    });
};
