import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useApplyApproce, useApplyReject } from '../../hooks/queries/useAdmins';
import { toast } from 'react-toastify';
import { useStructAccess } from '../../hooks/queries/useAdmins';

export default function AppReviewModal({ isModalOpen, setIsModalOpen, application, refetch }) {
    const { mutate: Approve } = useApplyApproce();
    const { mutate: Reject } = useApplyReject();
    const { mutate: Access } = useStructAccess();

    const [reviewComment, setReviewComment] = useState('');

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setReviewComment('');
                setIsModalOpen(false);
            }
        };

        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [setIsModalOpen]);

    return (
        <div className="flex items-center gap-2 text-sm font-sans">
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative flex flex-col gap-3 bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                        {/* X 버튼 */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            aria-label="닫기"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>

                        <div>
                            <h1 className="font-bold text-lg">Review Application</h1>{' '}
                            {/* 신청 검토 */}
                            <span className="text-gray-700">
                                {/* {applicant/creator}'s application is ready for review. Approve or reject it. */}
                                Review the application submitted by{' '}
                                {application.accessId ? application.applicant : application.creator}{' '}
                                and approve or reject it.
                            </span>
                        </div>

                        <div>
                            <h1 className="text-gray-900">Review Comments</h1>
                            <textarea
                                placeholder="Please enter your review comments..."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                className="mt-1 w-full h-20 border border-gray-300 p-2 rounded-lg min-h-[40px]"
                            />
                        </div>
                        <div className="flex gap-2 justify-end items-center font-bold">
                            <button
                                className="border border-gray-300 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
                                onClick={() => {
                                    setReviewComment('');
                                    setIsModalOpen(false);
                                }}
                            >
                                close
                            </button>
                            <button
                                className="border border-gray-300 text-white bg-red-600 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-red-700"
                                onClick={() => {
                                    if (reviewComment.length === 0) {
                                        toast(`Please write a review comment.`, {
                                            className:
                                                'border border-gray-200 bg-gray-100 text-gray-800 font-medium rounded-md shadow-sm',
                                            bodyClassName: 'text-sm whitespace-nowrap max-w-full',
                                        });
                                    } else if (application.accessId) {
                                        const data = {
                                            access_id: application.accessId,
                                            approved: false,
                                            review: reviewComment,
                                        };
                                        Access(data);
                                        toast(
                                            `${application.applicant}'s application has been rejected`,
                                            {
                                                className:
                                                    'border border-gray-200  bg-gray-100 text-gray-800 font-medium rounded-md shadow-sm',
                                                bodyClassName:
                                                    'text-sm whitespace-nowrap max-w-full',
                                            }
                                        );
                                        setReviewComment('');
                                        setIsModalOpen(false);
                                        refetch();
                                    } else {
                                        const data = {
                                            cohort_id: application.id,
                                            review: reviewComment,
                                        };
                                        Reject(data);
                                        toast(
                                            `${application.creator}'s application has been rejected`,
                                            {
                                                className:
                                                    'border border-gray-200  bg-gray-100 text-gray-800 font-medium rounded-md shadow-sm',
                                                bodyClassName:
                                                    'text-sm whitespace-nowrap max-w-full',
                                            }
                                        );
                                        setReviewComment('');
                                        setIsModalOpen(false);
                                        refetch();
                                    }
                                }}
                            >
                                Reject
                            </button>
                            <button
                                className="border border-gray-300 text-white bg-green-600 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-green-700"
                                onClick={() => {
                                    if (application.accessId) {
                                        const data = {
                                            access_id: application.accessId,
                                            approved: true,
                                            review: null,
                                        };
                                        Access(data);
                                        toast(
                                            `${application.applicant}'s application has been approved`,
                                            {
                                                className:
                                                    'bg-gray-100 text-gray-800 font-medium rounded-md shadow-sm',
                                                bodyClassName:
                                                    'text-sm whitespace-nowrap max-w-full',
                                            }
                                        );
                                        setReviewComment('');
                                        setIsModalOpen(false);
                                        refetch();
                                    } else {
                                        const data = {
                                            cohort_id: application.id,
                                        };
                                        Approve(data);
                                        toast(
                                            `${application.creator}'s application has been approved`,
                                            {
                                                className:
                                                    'bg-gray-100 text-gray-800 font-medium rounded-md shadow-sm',
                                                bodyClassName:
                                                    'text-sm whitespace-nowrap max-w-full',
                                            }
                                        );
                                        setReviewComment('');
                                        setIsModalOpen(false);
                                        refetch();
                                    }
                                }}
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
