import { FaFileAlt, FaRegClock } from 'react-icons/fa';
import { GoXCircle } from 'react-icons/go';
import { BsCheck2Circle } from 'react-icons/bs';
import { FaRegEye } from 'react-icons/fa6';
import StatusBadge from '../../components/common/StatusBadge';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import AppDetailModal from '../modals/AppDetailModal';
import AppReviewModal from '../modals/AppReviewModal';
import { useApplies } from '../../hooks/queries/useAdmins';
import { fetchIrbDrbData } from '../../api/users/users';
import LoadingSpinner from '../LoadingSpinner';

export default function AdminSchemaRequests({
    applications,
    setApplications,
    localData,
    setLocalData,
}) {
    const [statusFilter, setStatusFilter] = useState('all');
    const [isAppDetailModalOpen, setIsAppDetailModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isAppReviewModalOpen, setIsAppReviewModalOpen] = useState(false);
    const [reviewComment, setReviewComment] = useState('');
    const { data, isLoading: DataLoading } = useApplies();

    const [isLoading, setIsLoading] = useState(true);

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

    useEffect(() => {
        setApplications(
            localData
                .filter((app) => {
                    if (statusFilter === 'all') return true;
                    return app.status === statusFilter;
                })
                .sort((a, b) => {
                    return new Date(b.appliedDate) - new Date(a.appliedDate);
                })
        );
    }, [statusFilter]);

    useEffect(() => {
        const fetchAllFiles = async () => {
            if (!DataLoading && data) {
                const dataWithFilesPromises = data.map(async (item) => {
                    if (Array.isArray(item.irb_drb)) {
                        const files = await Promise.all(
                            item.irb_drb.map((file) => fetchIrbDrbData(file.path, file.name))
                        );
                        return { ...item, files };
                    } else {
                        return { ...item, files: [{ name: 'Hello' }] };
                    }
                });

                const allResults = await Promise.all(dataWithFilesPromises);
                setLocalData(allResults);
                setIsLoading(false);
            }
        };

        fetchAllFiles();
    }, [DataLoading, data]);

    useEffect(() => {
        if (localData.length > 0) {
            setApplications(
                localData.sort((a, b) => {
                    return new Date(b.appliedDate) - new Date(a.appliedDate);
                })
            );
        }
    }, [localData]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

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
                    <h1 className="text-2xl font-black font-normal">신청 목록</h1>
                    <span className="text-sm text-gray-900 font-medium">
                        사용자들의 데이터 접근 권한 신청 현황입니다.
                    </span>
                </div>
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="border-b border-gray-200 text-left text-sm text-gray-500 uppercase tracking-wider">
                            <th className="w-[10%]">신청자</th>
                            <th className="w-[15%]">코호트</th>
                            <th className="w-[25%]">선택 테이블</th>
                            <th className="w-[20%]">스키마</th>
                            <th className="w-[10%]">신청일</th>
                            <th className="w-[10%]">상태</th>
                            <th className="w-[10%]">액션</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center text-gray-500 py-4">
                                    신청 정보가 존재하지 않습니다.
                                </td>
                            </tr>
                        ) : (
                            applications.map((application, idx) => (
                                <tr
                                    key={idx}
                                    className="hover:bg-gray-50 border-b border-gray-200 text-sm text-gray-800"
                                >
                                    <td className="py-4">{application.author}</td>
                                    <td className="font-bold">{application.name}</td>
                                    <td className="font-medium">
                                        <div className="text-sm">
                                            {application.tables.slice(0, 2).join(', ')}
                                            {application.tables.length > 2 && (
                                                <span className="text-gray-500">
                                                    {' '}
                                                    외 {application.tables.length - 2}개
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="font-medium">{application.schemaInfo.name}</td>
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
                <AppDetailModal
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
