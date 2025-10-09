import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchApplies,
    postApplyApprove,
    postApplyReject,
    fetchUnstructApplies,
} from '../../api/admins/admins';

export const useApplies = () => {
    return useQuery({
        queryKey: ['applies'],
        queryFn: fetchApplies,
    });
};

export const useUnstructApplies = () => {
    return useQuery({
        queryKey: ['unstrcut_applies'],
        queryFn: fetchUnstructApplies,
    });
};

export const useApplyApproce = () => {
    return useMutation({
        mutationFn: postApplyApprove,
    });
};

export const useApplyReject = () => {
    return useMutation({
        mutationFn: postApplyReject,
    });
};
