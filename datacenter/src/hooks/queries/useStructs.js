import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchStructs, postApplySchema } from '../../api/structs/structs';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const useStructs = () => {
    return useQuery({
        queryKey: ['structs'],
        queryFn: fetchStructs,
    });
};

export const useApplySchema = () => {
    return useMutation({
        mutationFn: postApplySchema,
        onSuccess: () => {
            toast(`스키마 권한 신청 성공`, {
                className:
                    'border border-gray-200 bg-gray-100 text-gray-800 font-medium rounded-md shadow-sm',
                bodyClassName: 'text-sm whitespace-nowrap max-w-full',
            });
        },
    });
};
