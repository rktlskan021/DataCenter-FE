import { FaFileAlt, FaRegClock } from 'react-icons/fa';
import { GoXCircle } from 'react-icons/go';
import { BsCheck2Circle } from 'react-icons/bs';
import { FaRegEye } from 'react-icons/fa6';
import StatusBadge from '../../components/common/StatusBadge';
import { format } from 'date-fns';
import { useState } from 'react';
import AppUnstructDetailModal from '../modals/AppUnstructDetailModal';
import AppReviewModal from '../modals/AppReviewModal';
import LoadingSpinner from '../LoadingSpinner';
import { useUnstructApplies } from '../../hooks/queries/useAdmins';

export default function AdminUnstructuredData({}) {
    const [isAppReviewModalOpen, setIsAppReviewModalOpen] = useState(false);
    const [isAppDetailModalOpen, setIsAppDetailModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [reviewComment, setReviewComment] = useState('');

    const { data: applications, isLoading } = useUnstructApplies();

    const statusButtons = [
        { label: '전체', value: 'all' },
        {
            label: '대기중',
            value: 'applied',
            icon: <FaRegClock />,
            className: 'bg-blue-100 text-blue-800',
        },
        {
            label: '승인됨',
            value: 'approved',
            icon: <BsCheck2Circle />,
            className: 'bg-emerald-100 text-emerald-800',
        },
        {
            label: '거부됨',
            value: 'rejected',
            icon: <GoXCircle />,
            className: 'bg-red-100 text-red-800',
        },
    ];

    if (isLoading) return <LoadingSpinner />;

    return (
        <>
            <div className="flex gap-2 mb-6">
                {statusButtons.map((button) => (
                    <button
                        key={button.value}
                        className={`px-3 py-1.5 rounded border border-gray-300 ${
                            statusFilter === button.value
                                ? 'bg-blue-600 hover:bg-blue-700 text-white font-bold'
                                : 'bg-white text-black font-medium'
                        }`}
                        onClick={() => setStatusFilter(button.value)}
                    >
                        {button.label}
                    </button>
                ))}
            </div>
            <div className="flex flex-col gap-10 bg-white border border-gray-200 px-5 py-6 rounded-xl">
                <div>
                    <h1 className="text-2xl font-black font-normal">비정형 데이터 신청 목록</h1>
                    <span className="text-sm text-gray-900 font-medium">
                        비정형 데이터에 대한 접근 권한 신청 현황입니다.
                    </span>
                </div>
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="border-b border-gray-200 text-left text-sm text-gray-500 uppercase tracking-wider">
                            <th className="w-[10%]">신청자</th>
                            <th className="w-[10%]">요청자</th>
                            <th className="w-[15%]">데이터 타입</th>
                            <th className="w-[20%]">서브 타입</th>
                            <th className="w-[15%]">신청일</th>
                            <th className="w-[10%]">상태</th>
                            <th className="w-[15%]">액션</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 py-4">
                                    신청 정보가 존재하지 않습니다.
                                </td>
                            </tr>
                        ) : (
                            applications.map((application, idx) => (
                                <tr
                                    key={idx}
                                    className="hover:bg-gray-50 border-b border-gray-200 text-sm text-gray-800"
                                >
                                    <td className="py-4 font-bold">{application.creator}</td>
                                    <td className="font-bold">{application.modifier}</td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="font-medium text-sm text-purple-900 bg-purple-100 px-2 rounded-xl">
                                                {application.unstructType?.mainType}
                                            </div>
                                            <div className="font-medium text-sm text-neutral-900 bg-neutral-100 px-2 rounded-xl">
                                                {}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            {application.unstructType?.subTypes?.map((sub) => (
                                                <div className="font-medium text-sm text-neutral-900 bg-neutral-100 px-2 rounded-xl">
                                                    <span className="text-xs">{sub}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="font-medium">
                                        {format(
                                            new Date(application.appliedDate),
                                            'yyyy-MM-dd HH:mm'
                                        )}
                                    </td>
                                    <td>
                                        {(() => {
                                            const statusInfo = statusButtons.find(
                                                (status) => status.value === application.status
                                            );
                                            if (!statusInfo) return null;
                                            return (
                                                <StatusBadge
                                                    icon={statusInfo.icon}
                                                    label={statusInfo.label}
                                                    className={statusInfo.className}
                                                />
                                            );
                                        })()}
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                className="border border-gray-200 py-1.5 rounded w-12 flex justify-center items-center hover:bg-gray-100 transition duration-200 ease-in-out"
                                                onClick={() => {
                                                    setIsAppDetailModalOpen(true);
                                                    setSelectedApplication(application);
                                                }}
                                            >
                                                <FaRegEye className="w-4 h-4" />
                                            </button>
                                            {application.status === 'applied' && (
                                                <button
                                                    className="border border-gray-200 font-bold py-1.5 rounded w-12 flex justify-center items-center hover:bg-gray-100 transition duration-200 ease-in-out"
                                                    onClick={() => {
                                                        setIsAppReviewModalOpen(true);
                                                        setSelectedApplication(application);
                                                    }}
                                                >
                                                    검토
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {isAppDetailModalOpen && (
                <AppUnstructDetailModal
                    isModalOpen={isAppDetailModalOpen}
                    setIsModalOpen={setIsAppDetailModalOpen}
                    application={selectedApplication}
                />
            )}
            {isAppReviewModalOpen && (
                <AppReviewModal
                    isModalOpen={isAppReviewModalOpen}
                    setIsModalOpen={setIsAppReviewModalOpen}
                    application={selectedApplication}
                    reviewComment={reviewComment}
                    setReviewComment={setReviewComment}
                />
            )}
        </>
    );
}
