import { useState, useEffect, useMemo } from 'react'; // useEffect 추가
import SummaryBox from '../components/summary/SummaryBox';
import AdminSchemaRequests from '../components/admin/AdminSchemaRequests';
import AdminUnstructuredData from '../components/admin/AdminUnstructuredDate';
import { useApplies } from '../hooks/queries/useAdmins';
import LoadingSpinner from '../components/LoadingSpinner';
// 💡 페이지네이션 컴포넌트를 불러옵니다. (경로를 확인해주세요!)
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 10; // 💡 페이지당 표시할 항목 수 정의

export default function AdminPage() {
    const [applications, setApplications] = useState([]);
    const [localData, setLocalData] = useState([]);
    const [activeTab, setActiveTab] = useState('cohort-requests');
    const [currentPage, setCurrentPage] = useState(1); // 💡 페이지네이션: 현재 페이지 상태

    const { data, isLoading, refetch } = useApplies();

    // 💡 페이지네이션 로직을 useMemo로 구현하여 totalPages와 현재 페이지 데이터를 계산
    const { totalPages, currentApplicationsForDisplay } = useMemo(() => {
        const totalItems = localData.length;
        const calculatedTotalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        // 페이지 범위 조정 (데이터가 줄어들었을 경우)
        if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
            setCurrentPage(calculatedTotalPages);
        }

        const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
        const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

        const paginatedData = localData.slice(indexOfFirstItem, indexOfLastItem);

        return {
            totalPages: calculatedTotalPages,
            currentApplicationsForDisplay: paginatedData,
        };
    }, [localData, currentPage]);

    // 💡 localData가 변경될 때마다 현재 페이지를 1로 리셋하는 로직은 제거 (useMemo 내부에서 처리)
    // 💡 대신, localData가 비어있을 때 currentPage를 1로 설정하여 안전하게 만듭니다.
    useEffect(() => {
        if (localData.length === 0 && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [localData, currentPage]);

    const summaryList = [
        {
            label: 'Total Applications', // 전체 신청
            color: 'text-gray-800',
            count: localData.length,
        },
        {
            label: 'Pending', // 대기중
            color: 'text-blue-600',
            count: localData.filter((app) => app.status === 'applied').length,
        },
        {
            label: 'Approved', // 승인됨
            color: 'text-emerald-600',
            count: localData.filter((app) => app.status === 'approved').length,
        },
        {
            label: 'Rejected', // 거부됨
            color: 'text-red-600',
            count: localData.filter((app) => app.status === 'rejected').length,
        },
    ];

    const summaryUnstructuredList = [
        {
            label: 'Total Applications', // 전체 신청
            color: 'text-gray-800',
            count: 0,
        },
        {
            label: 'Pending', // 대기중
            color: 'text-blue-600',
            count: 0,
        },
        {
            label: 'Approved', // 승인됨
            color: 'text-emerald-600',
            count: 0,
        },
        {
            label: 'Rejected', // 거부됨
            color: 'text-red-600',
            count: 0,
        },
    ];

    const summaries = {
        'cohort-requests': summaryList,
        'unstructured-data': summaryUnstructuredList,
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="min-h-[calc(100vh-60px)] bg-gradient-to-b from-blue-50 to-white">
            <div className="flex flex-col max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-10">
                    <h1 className="font-bold text-3xl">Manage data access rights applications</h1>
                    <span>
                        You can review and approve/reject users applications for data access rights.
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
                                Structured Data Application
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
                    <>
                        <AdminSchemaRequests
                            applications={applications}
                            setApplications={setApplications}
                            // 💡 localData Prop에 페이지네이션된 데이터 전달
                            localData={currentApplicationsForDisplay}
                            setLocalData={setLocalData}
                            data={data}
                            // 💡 추가: 필터링을 위한 전체 데이터 Prop을 새로 정의 (AdminSchemaRequests에서 필터링에 사용)
                            fullData={localData}
                            // 💡 추가: 페이지가 변경되면 필터 상태도 초기화되도록, 현재 페이지 상태를 전달합니다.
                            currentPage={currentPage}
                            refetch={refetch}
                        />
                        {/* 💡 페이지네이션 컴포넌트 렌더링 */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    </>
                )}
                {/* {activeTab === 'unstructured-data' && <AdminUnstructuredData />} */}
                {activeTab === 'unstructured-data' && <></>}
            </div>
        </div>
    );
}
