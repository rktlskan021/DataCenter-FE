import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSchemas, fetchCohortApplies, fetchStruct } from '../../api/users/users';

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

export const useStruct = (struct_id) => {
    return useQuery({
        queryKey: ['struct'],
        queryFn: () => fetchStruct(struct_id),
        enabled: !!struct_id,
    });
};
