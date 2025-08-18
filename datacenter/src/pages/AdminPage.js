import { useState } from 'react';
import SummaryBox from '../components/summary/SummaryBox';
import AdminSchemaRequests from '../components/admin/AdminSchemaRequests';
import AdminUnstructuredData from '../components/admin/AdminUnstructuredDate';

export default function AdminPage() {
    const [applications, setApplications] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [localData, setLocalData] = useState([]);

    const [activeTab, setActiveTab] = useState('cohort-requests');

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

    return (
        <div>
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
                                스키마 신청 관리
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
                    <AdminSchemaRequests
                        applications={applications}
                        setApplications={setApplications}
                        localData={localData}
                        setLocalData={setLocalData}
                    />
                )}
                {activeTab === 'schema-requests' && <div>Test</div>}
                {activeTab === 'unstructured-data' && <AdminUnstructuredData />}
            </div>
        </div>
    );
}
