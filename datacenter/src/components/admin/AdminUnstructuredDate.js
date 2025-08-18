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

const sampleUnstructuredApplications = [
    {
        id: 1,
        requestId: 'REQ-20240325001',
        userId: 'user001',
        userName: '김연구자',
        userEmail: 'kim.researcher@hospital.com',
        cohortId: 1,
        cohortName: 'Atlas Cohort 1',
        cohortDescription: '2024년 1분기에 가입한 신규 사용자들의 행동 패턴 분석',
        dataType: '생체신호',
        dataSubtype: 'ECG (심전도)',
        applicationDate: '2024-03-25',
        status: 'applied',
        reviewDate: null,
        approvedDate: null,
        reviewComment: '',
        priority: 'high',
        statistics: {
            totalFiles: 1247,
            totalSize: '623.5GB',
            avgFileSize: '512MB',
            patients: 998,
            dateRange: '2023-01-01 ~ 2024-03-31',
        },
        apiInfo: null,
    },
    {
        id: 2,
        requestId: 'REQ-20240320002',
        userId: 'user002',
        userName: '이분석가',
        userEmail: 'lee.analyst@university.edu',
        cohortId: 3,
        cohortName: 'Bento Cohort 3',
        cohortDescription: '심혈관 질환 환자들의 치료 경과 및 예후 분석',
        dataType: '이미지',
        dataSubtype: 'CT',
        applicationDate: '2024-03-20',
        status: 'approved',
        reviewDate: '2024-03-21',
        approvedDate: '2024-03-22',
        reviewComment: '연구 목적이 명확하고 IRB 승인이 적절하여 승인합니다.',
        priority: 'medium',
        statistics: {
            totalFiles: 892,
            totalSize: '1.2TB',
            avgFileSize: '1.4GB',
            patients: 445,
            dateRange: '2023-06-01 ~ 2024-03-31',
        },
        apiInfo: {
            endpoint: 'https://api.data-center.hospital.com/v1/unstructured',
            apiKey: 'dc_api_kr_002_ct_bento3_2024',
            downloadUrl: 'https://download.data-center.hospital.com/ct/bento3',
            expiryDate: '2024-09-22',
        },
    },
    {
        id: 3,
        requestId: 'REQ-20240318003',
        userId: 'user003',
        userName: '박의사',
        userEmail: 'park.doctor@medical.center',
        cohortId: 2,
        cohortName: 'Atlas Cohort 2',
        cohortDescription: '모바일 앱을 통해 서비스를 이용하는 사용자들의 리텐션 분석',
        dataType: '유전체',
        dataSubtype: 'WES',
        applicationDate: '2024-03-18',
        status: 'applied',
        reviewDate: '2024-03-19',
        approvedDate: null,
        reviewComment: '추가 검토 중 - 유전체 데이터 사용 목적 확인 필요',
        priority: 'high',
        statistics: {
            totalFiles: 156,
            totalSize: '78.2GB',
            avgFileSize: '512MB',
            patients: 156,
            dateRange: '2023-01-01 ~ 2024-02-29',
        },
        apiInfo: null,
    },
    {
        id: 4,
        requestId: 'REQ-20240315004',
        userId: 'user004',
        userName: '최통계학자',
        userEmail: 'choi.stats@research.org',
        cohortId: 4,
        cohortName: 'Bento Cohort 1',
        cohortDescription: '최근 활동이 감소한 사용자들을 대상으로 한 이탈 방지 분석',
        dataType: '생체신호',
        dataSubtype: 'EMG (근전도)',
        applicationDate: '2024-03-15',
        status: 'rejected',
        reviewDate: '2024-03-16',
        approvedDate: null,
        reviewComment:
            '해당 코호트에는 EMG 데이터가 수집되지 않았습니다. ECG 데이터로 변경하여 재신청해 주시기 바랍니다.',
        priority: 'low',
        statistics: {
            totalFiles: 0,
            totalSize: '0GB',
            avgFileSize: '0MB',
            patients: 0,
            dateRange: 'N/A',
        },
        apiInfo: null,
    },
    {
        id: 5,
        requestId: 'REQ-20240322005',
        userId: 'user005',
        userName: '정연구원',
        userEmail: 'jung.researcher@institute.ac.kr',
        cohortId: 5,
        cohortName: 'Bento Cohort 2',
        cohortDescription: '서울, 부산, 대구 지역 사용자들의 서비스 이용 패턴 비교 분석',
        dataType: '이미지',
        dataSubtype: 'MRI',
        applicationDate: '2024-03-22',
        status: 'applied',
        reviewDate: null,
        approvedDate: null,
        reviewComment: '',
        priority: 'medium',
        statistics: {
            totalFiles: 634,
            totalSize: '2.1TB',
            avgFileSize: '3.4GB',
            patients: 317,
            dateRange: '2023-03-01 ~ 2024-03-20',
        },
        apiInfo: null,
    },
];

export default function AdminUnstructuredData({}) {
    const [isAppReviewModalOpen, setIsAppReviewModalOpen] = useState(false);
    const [isAppDetailModalOpen, setIsAppDetailModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const applications = sampleUnstructuredApplications;
    const [statusFilter, setStatusFilter] = useState('all');
    const [reviewComment, setReviewComment] = useState('');
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
                            <th className="w-[20%]">코호트</th>
                            <th className="w-[20%]">데이터 타입</th>
                            <th className="w-[20%]">신청일</th>
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
                                    <td className="py-4">{application.userName}</td>
                                    <td className="font-bold">{application.cohortName}</td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="font-medium text-sm text-purple-900 bg-purple-100 px-2 rounded-xl">
                                                {application.dataType}
                                            </div>
                                            <div className="font-medium text-xs text-neutral-900 bg-neutral-100 px-2 rounded-xl">
                                                {application.dataSubtype}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="font-medium">
                                        {format(
                                            new Date(application.applicationDate),
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
