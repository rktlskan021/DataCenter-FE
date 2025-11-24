import { useEffect, useState, useMemo } from 'react'; // 💡 useMemo 추가
import useAuthStore from '../stores/useAuthStore';
import { LuUser } from 'react-icons/lu';
import { useApplies } from '../hooks/queries/useUsers';
import { useUnstructApplies } from '../hooks/queries/useUsers';

import SchemaRequests from '../components/home/SchemaRequests';
import UnstructuredData from '../components/home/UnstructuredData';
import LoadingSpinner from '../components/LoadingSpinner';

const ITEMS_PER_PAGE = 5; // Home 페이지에서는 항목을 5개씩 표시한다고 가정합니다.

export default function Home() {
    // 💡 탭별 페이지 상태 관리
    const [currentPages, setCurrentPages] = useState({
        'cohort-requests-approved': 1,
        'cohort-requests-pending': 1,
        'unstructured-data-approved': 1,
        'unstructured-data-pending': 1,
    });

    const [activeTab, setActiveTab] = useState('cohort-requests');

    const { data: AData, isLoading: AisLoading } = useApplies();
    const { data: UAData, isLoading: UAisLoading } = useUnstructApplies();
    const { id, name } = useAuthStore();

    // 💡 useMemo를 사용하여 데이터 필터링 및 페이지네이션 로직을 통합
    const { approvedApplications, pendingApplications, paginationProps } = useMemo(() => {
        const data = activeTab === 'cohort-requests' ? AData || [] : UAData || [];

        // 1. 상태별 필터링 및 정렬
        const approved = data
            .filter(
                (app) =>
                    (app.status === 'approved' && app.source === 'mine') ||
                    (app?.isAccessApproved && app.source === 'access')
            )
            .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
        const pending = data
            .filter(
                (app) =>
                    (app.status !== 'approved' && app.source === 'mine') ||
                    (!app?.isAccessApproved && app.source === 'access')
            )
            .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

        const approvedKey = `${activeTab}-approved`;
        const pendingKey = `${activeTab}-pending`;

        // 2. 페이지네이션
        const paginate = (list, key) => {
            const currentPage = currentPages[key] || 1;
            const totalItems = list.length;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

            const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
            const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
            const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);

            // 현재 페이지 조정 (데이터가 줄었을 경우)
            if (currentPage > totalPages && totalPages > 0) {
                setCurrentPages((prev) => ({ ...prev, [key]: totalPages }));
            }

            return {
                items: currentItems,
                currentPage: currentPage,
                totalPages: totalPages,
                setCurrentPage: (page) => setCurrentPages((prev) => ({ ...prev, [key]: page })),
                totalItems: totalItems, // 총 항목 수
            };
        };

        const approvedProps = paginate(approved, approvedKey);
        const pendingProps = paginate(pending, pendingKey);

        return {
            approvedApplications: approvedProps.items,
            pendingApplications: pendingProps.items,
            paginationProps: {
                approved: {
                    currentPage: approvedProps.currentPage,
                    totalPages: approvedProps.totalPages,
                    setCurrentPage: approvedProps.setCurrentPage,
                    totalItems: approvedProps.totalItems,
                },
                pending: {
                    currentPage: pendingProps.currentPage,
                    totalPages: pendingProps.totalPages,
                    setCurrentPage: pendingProps.setCurrentPage,
                    totalItems: pendingProps.totalItems,
                },
            },
        };
    }, [activeTab, AData, UAData, currentPages]);

    if (AisLoading || UAisLoading) return <LoadingSpinner />;

    return (
        <div className="min-h-[calc(100vh-60px)] bg-gradient-to-b from-blue-50 to-white">
            <div className="flex flex-col gap-10 max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
                {/* ... (유저 정보 박스 그대로 유지) ... */}
                <div className="flex gap-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="w-16 h-16 rounded-full bg-cyan-600 flex items-center justify-center shadow-sm border border-gray-200">
                        <span className="text-xl font-bold text-white">{name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                        <div className="flex items-center gap-2 text-gray-900">
                            <LuUser className="h-4 w-4" />
                            <span className="text-sm font-regular bg-gray-100 px-2 py-1 rounded">
                                {id}
                            </span>
                        </div>
                    </div>
                    {/* Summary Count (페이지네이션 없이 전체 데이터 기준으로 계산) */}
                    <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-emerald-600">
                                {approvedApplications.length}
                            </div>
                            <div className="text-gray-600">Approved Application</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">
                                {pendingApplications.length}
                            </div>
                            <div className="text-gray-600">Pending Application</div>
                        </div>
                    </div>
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
                                Schema Application
                            </button>
                            <button
                                onClick={() => setActiveTab('unstructured-data')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'unstructured-data'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Unstructured Data Application
                            </button>
                        </nav>
                    </div>
                </div>
                {activeTab === 'cohort-requests' && (
                    <SchemaRequests
                        approvedApplications={approvedApplications} // 💡 페이지네이션된 데이터
                        pendingApplications={pendingApplications} // 💡 페이지네이션된 데이터
                        isLoading={AisLoading}
                        // 💡 페이지네이션 Props 전달
                        approvedPagination={paginationProps.approved}
                        pendingPagination={paginationProps.pending}
                    />
                )}

                {activeTab === 'unstructured-data' && (
                    <UnstructuredData
                        approvedApplications={approvedApplications} // 💡 페이지네이션된 데이터
                        pendingApplications={pendingApplications} // 💡 페이지네이션된 데이터
                        isLoading={UAisLoading}
                        // 💡 페이지네이션 Props 전달
                        approvedPagination={paginationProps.approved}
                        pendingPagination={paginationProps.pending}
                    />
                )}
            </div>
        </div>
    );
}
