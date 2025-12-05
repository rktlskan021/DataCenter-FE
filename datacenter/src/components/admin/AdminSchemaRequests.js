import { FaRegClock } from 'react-icons/fa';
import { GoXCircle } from 'react-icons/go';
import { BsCheck2Circle } from 'react-icons/bs';
import { FaRegEye } from 'react-icons/fa6';
import StatusBadge from '../../components/common/StatusBadge';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import AppDetailModal from '../modals/AppDetailModal';
import AppReviewModal from '../modals/AppReviewModal';
import { fetchIrbDrbData } from '../../api/users/users';
import { useTranslation } from 'react-i18next';
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

    const { t } = useTranslation();

    const statusButtons = [
        { label: t('admin.info.total_applications'), value: 'all' },
        {
            label: t('admin.info.pending'),
            value: 'applied',
            // 💡 size 속성을 사용하여 픽셀 단위로 크기 고정 (예: 18px)
            icon: <FaRegClock size={18} />,
            className: 'bg-blue-100 text-blue-800',
        },
        {
            label: t('admin.info.approved'),
            value: 'approved',
            // 💡 size 속성 적용
            icon: <BsCheck2Circle size={18} />,
            className: 'bg-emerald-100 text-emerald-800',
        },
        {
            label: t('admin.info.rejected'),
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
                        className={`px-3 py-1.5 rounded border border-gray-300 font-medium transition-all ${
                            statusFilter === button.value
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-black hover:bg-gray-100'
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
                    <h1 className="text-2xl font-normal">{t('admin.table.title')}</h1>
                    <span className="text-sm text-gray-900 font-medium">
                        {t('admin.table.subtitle')}
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="table-fixed min-w-max">
                        <thead>
                            <tr className="border-b border-gray-200 text-left text-sm text-gray-500 uppercase tracking-wider">
                                <th className="w-32">{t('admin.table.applicant')}</th>
                                <th className="w-32">{t('admin.table.requester')}</th>
                                <th className="w-48">{t('admin.table.cohort_name')}</th>
                                <th className="w-96">{t('admin.table.selected_tables')}</th>
                                <th className="w-48">{t('admin.table.schema_name')}</th>
                                <th className="w-48">{t('admin.table.application_date')}</th>
                                <th className="w-32">{t('admin.table.status')}</th>
                                <th className="w-32">{t('admin.table.type.title')}</th>
                                <th className="w-32">{t('admin.table.action.title')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center text-gray-500 py-8">
                                        No Data
                                    </td>
                                </tr>
                            ) : (
                                applications.map((application, idx) => (
                                    <tr
                                        key={idx}
                                        className="hover:bg-gray-50 border-b border-gray-200 text-sm text-gray-800"
                                    >
                                        <td className="py-4">
                                            <span className="w-32 truncate block">
                                                {application.creator}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="truncate block w-32">
                                                {application.applicant
                                                    ? application.applicant
                                                    : '-'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="font-bold truncate block w-48">
                                                {application.name}
                                            </span>
                                        </td>
                                        <td className="font-medium">
                                            <div className="block text-sm truncate w-96">
                                                {application.tables.slice(0, 2).join(', ')}
                                                {application.tables.length > 2 && (
                                                    <span className="text-gray-500">
                                                        {' '}
                                                        and {application.tables.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="font-medium truncate block w-48">
                                                {application.schemaInfo.name}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="font-medium truncate block w-32">
                                                {format(
                                                    new Date(application.appliedDate),
                                                    'yyyy-MM-dd HH:mm'
                                                )}
                                            </span>
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
                                                    {application.applicant
                                                        ? t('admin.table.type.schema')
                                                        : t('admin.table.type.permission')}
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
                                                        className="border border-gray-200 font-bold py-1.5 px-2 rounded flex justify-center items-center hover:bg-gray-100 transition duration-200 ease-in-out"
                                                        onClick={() => {
                                                            setIsAppReviewModalOpen(true);
                                                            setSelectedApplication(application);
                                                        }}
                                                    >
                                                        {t('admin.table.action.review_btn')}
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
