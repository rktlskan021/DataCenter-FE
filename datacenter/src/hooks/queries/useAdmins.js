import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApplies } from '../../api/admins/admins';

export const useApplies = () => {
    return useQuery({
        queryKey: ['applies'],
        queryFn: fetchApplies,
    });
};
