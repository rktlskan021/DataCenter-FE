import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSchemas } from '../../api/users/users';

export const useSchemas = () => {
    return useQuery({
        queryKey: ['schemas'],
        queryFn: fetchSchemas,
    });
};
