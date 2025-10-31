import { useQuery, useMutation } from '@tanstack/react-query';
import {
    fetchCohorts,
    fetchCohortDetail,
    postApplyCohort,
    postApplyUnstruct,
    postApplyCohortModify,
} from '../../api/cohorts/cohorts';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
    return useMutation({
        mutationFn: postApplyCohort,
        onSuccess: () => {
            toast(`성공적으로 신청되었습니다.`, {
                className: 'bg-gray-100 text-gray-800 font-medium rounded-md shadow-sm',
                bodyClassName: 'text-sm whitespace-nowrap max-w-full',
            });
            navigate('/home');
        },
        onError: (err) => {
            console.log(err);
        },
    });
};

export const useApplyCohortModify = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: postApplyCohortModify,
        onSuccess: () => {
            toast(`성공적으로 수정 후 신청되었습니다.`, {
                className: 'bg-gray-100 text-gray-800 font-medium rounded-md shadow-sm',
                bodyClassName: 'text-sm whitespace-nowrap max-w-full',
            });
            navigate('/home');
        },
        onError: (err) => {
            console.log(err);
        },
    });
};

export const useApplyUnstruct = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: postApplyUnstruct,
        onSuccess: () => {
            toast(`성공적으로 신청되었습니다.`, {
                className: 'bg-gray-100 text-gray-800 font-medium rounded-md shadow-sm',
                bodyClassName: 'text-sm whitespace-nowrap max-w-full',
            });
            navigate('/home');
        },
        onError: (err) => {
            console.log(err);
        },
    });
};
