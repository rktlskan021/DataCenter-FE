import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuthStore from '../stores/useAuthStore';
import { FaFileAlt, FaRegClock } from 'react-icons/fa';
import { GoXCircle } from 'react-icons/go';
import { BsCheck2Circle } from 'react-icons/bs';
import { FaRegEye } from 'react-icons/fa6';
import AppDetailModal from '../components/AppDetailModal';

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

export default function AdminPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [applications, setApplications] = useState(sampleApplications);
    const [statusFilter, setStatusFilter] = useState('all');
    const [isAppDetailModalOpen, setIsAppDetailModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

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
                <div className="flex flex-col gap-10 max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
                    <div>
                        <h1 className="font-bold text-3xl">데이터 접근 권한 신청 관리</h1>
                        <span>
                            사용자들의 데이터 접근 권한 신청을 검토하고 승인/거부할 수 있습니다.
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-4">
                        {summaryList.map((item) => (
                            <div
                                key={item.label}
                                className="flex flex-col gap-2 border border-gray-200 bg-white px-6 py-5 rounded"
                            >
                                <p className="font-medium">{item.label}</p>
                                <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
                            </div>
                        ))}
                    </div>
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
                                                {application.selectedTables.slice(0, 2).join(', ')}
                                                {application.selectedTables.length > 2 && (
                                                    <span className="text-gray-500">
                                                        {' '}
                                                        외 {application.selectedTables.length - 2}개
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
                                            <div className="flex gap-1 items-center">
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
