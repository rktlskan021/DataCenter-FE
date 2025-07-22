import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuthStore from '../stores/useAuthStore';
import { FaFileAlt, FaRegClock } from 'react-icons/fa';
import { GoXCircle } from 'react-icons/go';
import { BsCheck2Circle } from 'react-icons/bs';
import { FaRegEye } from 'react-icons/fa6';
import AppDetailModal from '../components/modals/AppDetailModal';
import SummaryBox from '../components/summary/SummaryBox';
import StatusBadge from '../components/common/StatusBadge';

// 샘플 신청 데이터
const sampleApplications = [
    {
        id: 1,
        userId: 'user001',
        userName: '김연구자',
        cohortId: 1,
        cohortName: 'Cohort 1',
        selectedTables: [
            'PERSON',
            'CONDITION_OCCURRENCE',
            'DRUG_EXPOSURE',
            'MEASUREMENT',
            'MEASUREMENT',
            'CONDITION_OCCURRENCE',
        ],
        irbFiles: [{ name: 'IRB_approval_2024_001.pdf', size: '2.3 MB', uploadDate: '2024-03-15' }],
        applicationDate: '2024-03-15',
        status: 'pending', // pending, approved, rejected
        reviewDate: null,
        completedDate: null,
        reviewComment: '',
    },
    {
        id: 2,
        userId: 'user002',
        userName: '이분석가',
        cohortId: 2,
        cohortName: 'Cohort 2',
        selectedTables: ['PERSON', 'VISIT_OCCURRENCE', 'PROCEDURE_OCCURRENCE'],
        irbFiles: [
            { name: 'DRB_approval_university_2024.pdf', size: '1.8 MB', uploadDate: '2024-03-10' },
        ],
        applicationDate: '2024-03-10',
        status: 'pending',
        reviewDate: '2024-03-12',
        completedDate: null,
        reviewComment: '추가 검토 중',
    },
    {
        id: 3,
        userId: 'user003',
        userName: '박의사',
        cohortId: 3,
        cohortName: 'Cohort 3',
        selectedTables: ['PERSON', 'CONDITION_OCCURRENCE', 'DRUG_EXPOSURE', 'DEATH', 'NOTE'],
        irbFiles: [
            { name: 'IRB_medical_center_2024_Q1.pdf', size: '3.1 MB', uploadDate: '2024-03-01' },
            { name: 'IRB_appendix.pdf', size: '1.2 MB', uploadDate: '2024-03-02' },
        ],
        applicationDate: '2024-03-01',
        status: 'approved',
        reviewDate: '2024-03-05',
        completedDate: '2024-03-08',
        reviewComment: '모든 조건을 만족하여 승인',
    },
    {
        id: 4,
        userId: 'user004',
        userName: '최통계학자',
        cohortId: 4,
        cohortName: 'Cohort 4',
        selectedTables: ['PERSON', 'OBSERVATION_PERIOD', 'COST'],
        irbFiles: [
            { name: 'DRB_research_org_2024.docx', size: '1.2 MB', uploadDate: '2024-02-28' },
        ],
        applicationDate: '2024-02-28',
        status: 'rejected',
        reviewDate: '2024-03-02',
        completedDate: null,
        reviewComment: 'IRB 승인서의 연구 범위가 신청 내용과 일치하지 않음',
    },
    {
        id: 5,
        userId: 'user005',
        userName: '정연구원',
        cohortId: 5,
        cohortName: 'Cohort 5',
        selectedTables: ['PERSON', 'LOCATION', 'CARE_SITE', 'PROVIDER'],
        irbFiles: [
            { name: 'IRB_institute_2024_spring.pdf', size: '2.7 MB', uploadDate: '2024-03-20' },
        ],
        applicationDate: '2024-03-20',
        status: 'pending',
        reviewDate: null,
        completedDate: null,
        reviewComment: '',
    },
];

// 타유저 스키마 권한 요청 샘플 데이터
const sampleSchemaRequests = [
    {
        id: 1,
        requesterId: 'user002',
        requesterName: '이분석가',
        requesterEmail: 'lee.analyst@university.edu',
        schemaOwner: '김연구자',
        schemaName: 'diabetes_study_2024',
        schemaDescription: '당뇨병 환자의 약물 치료 반응성 분석을 위한 스키마',
        requestReason: '유사한 연구 주제로 데이터 비교 분석이 필요합니다.',
        requestDate: '2024-03-20',
        status: 'pending',
        reviewDate: null,
        reviewComment: '',
    },
    {
        id: 2,
        requesterId: 'user003',
        requesterName: '박의사',
        requesterEmail: 'park.doctor@medical.center',
        schemaOwner: '이분석가',
        schemaName: 'mobile_user_retention',
        schemaDescription: '모바일 앱 사용자 리텐션 분석 스키마',
        requestReason: '환자 앱 사용 패턴 연구를 위해 참고 데이터가 필요합니다.',
        requestDate: '2024-03-18',
        status: 'approved',
        reviewDate: '2024-03-19',
        reviewComment: '연구 목적이 명확하여 승인합니다.',
    },
];

export default function AdminPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [applications, setApplications] = useState(sampleApplications);
    const [statusFilter, setStatusFilter] = useState('all');
    const [isAppDetailModalOpen, setIsAppDetailModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [activeTab, setActiveTab] = useState('cohort-requests');

    const { isLoggedIn } = useAuthStore();

    const summaryList = [
        {
            label: '전체 신청',
            color: 'text-gray-800',
            count: applications.length,
        },
        {
            label: '대기중',
            color: 'text-blue-600',
            count: applications.filter((app) => app.status === 'pending').length,
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
            count: sampleSchemaRequests.length,
        },
        {
            label: '대기중',
            color: 'text-blue-600',
            count: sampleSchemaRequests.filter((app) => app.status === 'pending').length,
        },
        {
            label: '승인됨',
            color: 'text-emerald-600',
            count: sampleSchemaRequests.filter((app) => app.status === 'approved').length,
        },
        {
            label: '거부됨',
            color: 'text-red-600',
            count: sampleSchemaRequests.filter((app) => app.status === 'rejected').length,
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
            value: 'pending',
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

    const filteredApplications = applications.filter((app) => {
        if (statusFilter === 'all') return true;
        return app.status === statusFilter;
    });

    useEffect(() => {
        if (isLoggedIn) {
            setIsLoading(false);
        } else {
            alert('로그인을 먼저 진행해주세요.');
            navigator('/login');
        }
    }, []);

    return (
        <div>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
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
                                        <th className="w-[25%]">선택 테이블</th>
                                        <th className="w-[20%]">IRB/DRB</th>
                                        <th className="w-[7.5%]">신청일</th>
                                        <th className="w-[7.5%]">상태</th>
                                        <th className="w-[10%]">액션</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredApplications.map((application) => (
                                        <tr
                                            key={application.id}
                                            className="hover:bg-gray-50 border-b border-gray-200 text-sm text-gray-800"
                                        >
                                            <td className="py-4">{application.userName}</td>
                                            <td className="font-bold">{application.cohortName}</td>
                                            <td className="font-medium truncate">
                                                <div className="text-sm">
                                                    {application.selectedTables
                                                        .slice(0, 2)
                                                        .join(', ')}
                                                    {application.selectedTables.length > 2 && (
                                                        <span className="text-gray-500">
                                                            {' '}
                                                            외{' '}
                                                            {application.selectedTables.length - 2}
                                                            개
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex gap-1 items-center">
                                                    <FaFileAlt />
                                                    <div>
                                                        <p>
                                                            {application.irbFiles[0].name}
                                                            {application.irbFiles.length > 1
                                                                ? ` 외 ${application.irbFiles.length - 1}개`
                                                                : null}
                                                        </p>
                                                        <p>
                                                            total :{' '}
                                                            {application.irbFiles
                                                                .reduce((total, file) => {
                                                                    const sizeMB = parseFloat(
                                                                        file.size
                                                                            .replace('MB', '')
                                                                            .trim()
                                                                    );
                                                                    return total + sizeMB;
                                                                }, 0)
                                                                .toFixed(2)}{' '}
                                                            MB
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="font-medium">
                                                {application.applicationDate}
                                            </td>
                                            <td>
                                                {(() => {
                                                    const statusInfo = statusButtons.find(
                                                        (status) =>
                                                            status.value === application.status
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
                                                {/* <div className="flex gap-1 items-center">
                                                    {(() => {
                                                        const statusInfo = statusButtons.find(
                                                            (status) =>
                                                                status.value === application.status
                                                        );
                                                        if (!statusInfo) return null; // 혹시 못찾을 때 방어

                                                        return (
                                                            <>
                                                                {statusInfo.icon}
                                                                <div
                                                                    className={`${statusInfo.className} px-2 py-1.5 rounded-xl text-xs font-bold cursor-default`}
                                                                >
                                                                    {statusInfo.label}
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div> */}
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
                                                    {application.status === 'pending' && (
                                                        <button className="border border-gray-200 font-bold py-1.5 rounded w-12 flex justify-center items-center hover:bg-gray-100 transition duration-200 ease-in-out">
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
            )}
            {isAppDetailModalOpen ? (
                <AppDetailModal
                    isModalOpen={isAppDetailModalOpen}
                    setIsModalOpen={setIsAppDetailModalOpen}
                    application={selectedApplication}
                />
            ) : null}
        </div>
    );
}
