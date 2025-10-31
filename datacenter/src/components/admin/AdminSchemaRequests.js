import { FaFileAlt, FaRegClock } from 'react-icons/fa';
import { GoXCircle } from 'react-icons/go';
import { BsCheck2Circle } from 'react-icons/bs';
import { FaRegEye } from 'react-icons/fa6';
import StatusBadge from '../../components/common/StatusBadge';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import AppDetailModal from '../modals/AppDetailModal';
import AppReviewModal from '../modals/AppReviewModal';
import { fetchIrbDrbData } from '../../api/users/users';
import LoadingSpinner from '../LoadingSpinner';

export default function AdminSchemaRequests({
    applications,
    setApplications,
    localData, // 현재 페이지의 데이터 (페이지네이션 완료)
    setLocalData,
    data,
    fullData, // 전체 데이터
    currentPage, // 현재 페이지 번호
    refetch,
}) {
    const [statusFilter, setStatusFilter] = useState('all');
    const [isAppDetailModalOpen, setIsAppDetailModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isAppReviewModalOpen, setIsAppReviewModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const statusButtons = [
        { label: 'All', value: 'all' },
        {
            label: 'Pending',
            value: 'applied',
            // 💡 size 속성을 사용하여 픽셀 단위로 크기 고정 (예: 18px)
            icon: <FaRegClock size={18} />,
            className: 'bg-blue-100 text-blue-800',
        },
        {
            label: 'Approved',
            value: 'approved',
            // 💡 size 속성 적용
            icon: <BsCheck2Circle size={18} />,
            className: 'bg-emerald-100 text-emerald-800',
        },
        {
            label: 'Rejected',
            value: 'rejected',
            // 💡 size 속성 적용
            icon: <GoXCircle size={18} />,
            className: 'bg-red-100 text-red-800',
        },
    ];

    // 💡 수정된 useEffect: localData (페이지네이션된 데이터)가 변경될 때마다 필터/정렬을 다시 적용
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
    }, [statusFilter, localData, setApplications]); // localData 추가!

    useEffect(() => {
        const fetchAllFiles = async () => {
            if (data) {
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
    }, [data, setLocalData]);

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
            {/* ... (테이블 및 모달 렌더링 코드는 변경 없음) ... */}
            <div className="flex flex-col gap-10 bg-white border border-gray-200 px-5 py-6 rounded-xl">
                <div>
                    <h1 className="text-2xl font-black font-normal">Application List</h1>
                    <span className="text-sm text-gray-900 font-medium">
                        This is the status of users applications for data access rights.
                    </span>
                </div>
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="border-b border-gray-200 text-left text-sm text-gray-500 uppercase tracking-wider">
                            <th className="w-[6%]">Applicant</th> {/* 신청자 */}
                            <th className="w-[6%]">Requester</th> {/* 요청자 */}
                            <th className="w-[15%]">Cohort name</th> {/* 코호트 */}
                            <th className="w-[25%]">Selected Tables</th> {/* 선택 테이블 */}
                            <th className="w-[17%]">Schema Name</th> {/* 스키마명 */}
                            <th className="w-[10%]">Application Date</th> {/* 신청일 */}
                            <th className="w-[7%]">Status</th> {/* 상태 */}
                            <th className="w-[6%]">Type</th> {/* 유형 */}
                            <th className="w-[10%]">Action</th> {/* 액션 */}
                        </tr>
                    </thead>
                    <tbody>
                        {applications.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center text-gray-500 py-4">
                                    No Data.
                                </td>
                            </tr>
                        ) : (
                            applications.map((application, idx) => (
                                <tr
                                    key={idx}
                                    className="hover:bg-gray-50 border-b border-gray-200 text-sm text-gray-800"
                                >
                                    <td className="py-4">{application.creator}</td>
                                    <td>{application.applicant ? application.applicant : '-'}</td>
                                    <td className="font-bold">{application.name}</td>
                                    <td className="font-medium">
                                        <div className="text-sm">
                                            {application.tables.slice(0, 2).join(', ')}
                                            {application.tables.length > 2 && (
                                                <span className="text-gray-500">
                                                    {' '}
                                                    and {application.tables.length - 2} more
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
                                        <div className="inline font-bold text-emerald-900 items-center px-2 py-1.5 rounded-xl bg-emerald-100">
                                            <span className="text-xs text-nowrap">
                                                {application.applicant ? 'Schema' : 'Permission'}
                                            </span>
                                        </div>
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
                                                    Review
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
                    refetch={refetch}
                />
            )}
        </>
    );
}
