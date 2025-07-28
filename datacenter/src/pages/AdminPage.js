import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaFileAlt, FaRegClock } from 'react-icons/fa';
import { GoXCircle } from 'react-icons/go';
import { BsCheck2Circle } from 'react-icons/bs';
import { FaRegEye } from 'react-icons/fa6';
import AppDetailModal from '../components/modals/AppDetailModal';
import SummaryBox from '../components/summary/SummaryBox';
import StatusBadge from '../components/common/StatusBadge';
import AppReviewModal from '../components/modals/AppReviewModal';
import { useApplies } from '../hooks/queries/useAdmins';
import { fetchIrbDrbData } from '../api/users/users';
import { format } from 'date-fns';

export default function AdminPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [applications, setApplications] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [isAppDetailModalOpen, setIsAppDetailModalOpen] = useState(false);
    const [isAppReviewModalOpen, setIsAppReviewModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [activeTab, setActiveTab] = useState('cohort-requests');
    const [reviewComment, setReviewComment] = useState('');

    const { data, isLoading: DataLoading } = useApplies();
    const [localData, setLocalData] = useState([]);

    const summaryList = [
        {
            label: '전체 신청',
            color: 'text-gray-800',
            count: applications.length,
        },
        {
            label: '대기중',
            color: 'text-blue-600',
            count: applications.filter((app) => app.status === 'applied').length,
        },
        {
            label: '승인됨',
            color: 'text-emerald-600',
            count: applications.filter((app) => app.status === 'approved').length,
        },
        {
            label: '거부됨',
            color: 'text-red-600',
            count: applications.filter((app) => app.status === 'rejected').length,
        },
    ];

    const summarySchemaList = [
        {
            label: '전체 신청',
            color: 'text-gray-800',
            count: localData.length,
            count: 0,
        },
        {
            label: '대기중',
            color: 'text-blue-600',
            count: localData.filter((app) => app.status === 'applied').length,
        },
        {
            label: '승인됨',
            color: 'text-emerald-600',
            count: localData.filter((app) => app.status === 'approved').length,
        },
        {
            label: '거부됨',
            color: 'text-red-600',
            count: localData.filter((app) => app.status === 'rejected').length,
        },
    ];

    const summaryUnstructuredList = [
        {
            label: '전체 신청',
            color: 'text-gray-800',
            count: 0,
        },
        {
            label: '대기중',
            color: 'text-blue-600',
            count: 0,
        },
        {
            label: '승인됨',
            color: 'text-emerald-600',
            count: 0,
        },
        {
            label: '거부됨',
            color: 'text-red-600',
            count: 0,
        },
    ];

    const summaries = {
        'cohort-requests': summaryList,
        'schema-requests': summarySchemaList,
        'unstructured-data': summaryUnstructuredList,
    };

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
                    const files = await Promise.all(
                        item.irb_drb.map((file) => fetchIrbDrbData(file.path, file.name))
                    );
                    return { ...item, files };
                });

                const allResults = await Promise.all(dataWithFilesPromises);
                setLocalData(allResults);
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
            setIsLoading(false);
        }
    }, [localData]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            (
            <div className="flex flex-col max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
                <div className="mb-10">
                    <h1 className="font-bold text-3xl">데이터 접근 권한 신청 관리</h1>
                    <span>
                        사용자들의 데이터 접근 권한 신청을 검토하고 승인/거부할 수 있습니다.
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-4">
                    {summaries[activeTab]?.map((item) => (
                        <SummaryBox key={item.label} {...item} />
                    ))}
                </div>

                {/* Tab Navigation */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('cohort-requests')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'cohort-requests'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                코호트 신청 관리
                            </button>
                            <button
                                onClick={() => setActiveTab('schema-requests')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'schema-requests'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                스키마 권한 요청
                            </button>
                            <button
                                onClick={() => setActiveTab('unstructured-data')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'unstructured-data'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                비정형 데이터 신청
                            </button>
                        </nav>
                    </div>
                </div>

                {activeTab === 'cohort-requests' && (
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
                )}
                {activeTab === 'cohort-requests' && (
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
                                    <th className="w-[20%]">코호트</th>
                                    <th className="w-[20%]">선택 테이블</th>
                                    <th className="w-[20%]">IRB/DRB</th>
                                    <th className="w-[10%]">신청일</th>
                                    <th className="w-[10%]">상태</th>
                                    <th className="w-[10%]">액션</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((application, idx) => (
                                    <tr
                                        key={idx}
                                        className="hover:bg-gray-50 border-b border-gray-200 text-sm text-gray-800"
                                    >
                                        <td className="py-4">{application.author}</td>
                                        <td className="font-bold">{application.name}</td>
                                        <td className="font-medium truncate">
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
                                        <td>
                                            <div className="flex gap-1 items-center">
                                                <FaFileAlt />
                                                <div>
                                                    <p>
                                                        {application.files[0].name}
                                                        {application.files.length > 1
                                                            ? ` 외 ${application.files.length - 1}개`
                                                            : null}
                                                    </p>
                                                    <p>
                                                        total :{' '}
                                                        {application.files
                                                            .reduce((total, file) => {
                                                                const sizeMB = parseFloat(
                                                                    file.size / 1024 / 1024
                                                                );
                                                                return total + sizeMB;
                                                            }, 0)
                                                            .toFixed(2)}
                                                        MB
                                                    </p>
                                                </div>
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {activeTab === 'schema-requests' && <div>Test</div>}
                {activeTab === 'unstructured-data' && <div>Test</div>}
            </div>
            )
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
        </div>
    );
}
