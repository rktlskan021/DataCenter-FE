import { useEffect, useState } from 'react';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { GoClock } from 'react-icons/go';
import { FiDownload } from 'react-icons/fi';
import { format } from 'date-fns';
import { FaRegTimesCircle } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';
import RejectionModal from '../modals/RejectionModal';

const userUnstructuredApplications = [
    {
        id: 1,
        requestId: 'REQ-20240315001',
        cohortId: 1,
        cohortName: 'Atlas Cohort 1',
        cohortDescription: '2024년 1분기에 가입한 신규 사용자들의 행동 패턴 분석',
        dataType: '생체신호',
        dataSubtype: 'ECG (심전도)',
        applicationDate: '2024-03-15',
        status: 'approved',
        approvedDate: '2024-03-18',
        statistics: {
            totalFiles: 1247,
            totalSize: '623.5GB',
            avgFileSize: '512MB',
            patients: 998,
            dateRange: '2023-01-01 ~ 2024-03-31',
        },
        apiInfo: {
            endpoint: 'https://api.data-center.hospital.com/v1/unstructured',
            apiKey: 'dc_api_kr_001_ecg_atlas1_2024',
            downloadUrl: 'https://download.data-center.hospital.com/ecg/atlas1',
            expiryDate: '2024-09-18',
        },
    },
    {
        id: 2,
        requestId: 'REQ-20240320002',
        cohortId: 3,
        cohortName: 'Bento Cohort 3',
        cohortDescription: '심혈관 질환 환자들의 치료 경과 및 예후 분석',
        dataType: '이미지',
        dataSubtype: 'CT',
        applicationDate: '2024-03-20',
        status: 'approved',
        approvedDate: '2024-03-22',
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
        requestId: 'REQ-20240325003',
        cohortId: 2,
        cohortName: 'Atlas Cohort 2',
        cohortDescription: '모바일 앱을 통해 서비스를 이용하는 사용자들의 리텐션 분석',
        dataType: '유전체',
        dataSubtype: 'WES',
        applicationDate: '2024-03-25',
        status: 'pending',
        reviewDate: null,
        rejectionReason: '',
        statistics: {
            totalFiles: 156,
            totalSize: '78.2GB',
            avgFileSize: '512MB',
            patients: 156,
            dateRange: '2023-01-01 ~ 2024-02-29',
        },
    },
    {
        id: 4,
        requestId: 'REQ-20240310004',
        cohortId: 4,
        cohortName: 'Bento Cohort 1',
        cohortDescription: '최근 활동이 감소한 사용자들을 대상으로 한 이탈 방지 분석',
        dataType: '생체신호',
        dataSubtype: 'EMG (근전도)',
        applicationDate: '2024-03-10',
        status: 'rejected',
        reviewDate: '2024-03-12',
        rejectionReason:
            '해당 코호트에는 EMG 데이터가 수집되지 않았습니다. ECG 데이터로 변경하여 재신청해 주시기 바랍니다.',
        statistics: {
            totalFiles: 0,
            totalSize: '0GB',
            avgFileSize: '0MB',
            patients: 0,
            dateRange: 'N/A',
        },
    },
];

export default function UnstructuredData({ setApprovedAppLength, setPendingAppLength }) {
    const [selectFilterCohort, setSelectFilterCohort] = useState(0);
    const [selectApp, setSelectApp] = useState(null);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);

    const approvedUnstructuredApps = userUnstructuredApplications.filter(
        (app) => app.status === 'approved'
    );
    const pendingUnstructuredApps = userUnstructuredApplications.filter(
        (app) => app.status !== 'approved'
    );

    useEffect(() => {
        setApprovedAppLength(approvedUnstructuredApps.length);
        setPendingAppLength(pendingUnstructuredApps.length);
    }, []);

    return (
        <div className="flex flex-col gap-3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div>
                <h1 className="font-bold text-2xl text-gray-900">비정형 데이터 신청 현황</h1>
                <span className="text-sm font-regular">
                    신청한 비정형 데이터의 승인 상태와 접근 정보를 확인할 수 있습니다.
                </span>
            </div>
            <div className="grid w-full grid-cols-2 bg-gray-100 py-1">
                <div
                    className={`flex items-center justify-center gap-2 py-2 ml-1 rounded transition-all duration-200 cursor-pointer ${selectFilterCohort === 0 ? 'bg-white text-gray-900' : 'bg-transparent text-gray-600'}`}
                    onClick={() => setSelectFilterCohort(0)}
                >
                    <IoMdCheckmarkCircleOutline className="h-5 w-5" />
                    <span className="font-bold">
                        승인된 비정형 데이터 ({approvedUnstructuredApps.length})
                    </span>
                </div>
                <div
                    className={`flex items-center justify-center gap-2 py-2 mr-1 rounded transition-all duration-200 cursor-pointer ${selectFilterCohort === 1 ? 'bg-white text-gray-900' : 'bg-transparent text-gray-600'}`}
                    onClick={() => setSelectFilterCohort(1)}
                >
                    <GoClock className="h-5 w-5" />
                    <span className="font-bold ">
                        대기중/반려된 비정형 데이터 ({pendingUnstructuredApps.length})
                    </span>
                </div>
            </div>
            {selectFilterCohort === 0 &&
                (approvedUnstructuredApps.length === 0 ? (
                    <div className="text-center py-12">
                        <IoMdCheckmarkCircleOutline className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            승인된 비정형 데이터가 없습니다
                        </h3>
                        <p className="text-gray-500">
                            비정형 데이터 신청 후 승인되면 여기에 표시됩니다.
                        </p>
                    </div>
                ) : (
                    approvedUnstructuredApps.map((app, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col gap-2 border border-emerald-200 bg-emerald-50/30 rounded-lg p-6 text-gray-900"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    <h1 className="text-lg font-semibold">{app.cohortName}</h1>
                                    <div className="flex gap-1 font-bold text-purple-900 items-center px-2 rounded-xl bg-purple-100">
                                        <span className="text-xs">{app.dataType}</span>
                                    </div>
                                    <div className="flex gap-1 font-bold text-neutral-900 items-center px-2 rounded-xl bg-neutral-100">
                                        <span className="text-xs">{app.dataSubtype}</span>
                                    </div>
                                    <div className="flex gap-1 font-bold text-emerald-900 items-center px-2 rounded-xl bg-emerald-100">
                                        <IoMdCheckmarkCircleOutline />
                                        <span className="text-xs">승인됨</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="flex items-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-gray-900 font-bold text-sm px-3 py-2 transition-all duration-200"
                                        onClick={() => {
                                            setSelectApp(app);
                                            // setIsConnectionInfoModalOpen(true);
                                        }}
                                    >
                                        <FiDownload className="text-xl" />
                                        <span>API 접근</span>
                                    </button>
                                </div>
                            </div>
                            <span className="text-sm">{app.cohortDescription}</span>
                            <div className="grid grid-cols-5 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">총 파일 수:</span>
                                    <span className="ml-2 font-medium">
                                        {app.statistics.totalFiles}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">환자 수:</span>
                                    <span className="ml-2 font-medium">
                                        {app.statistics.patients}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">총 크기:</span>
                                    <span className="ml-2 font-medium">
                                        {app.statistics.totalSize}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">평균 크기:</span>
                                    <span className="ml-2 font-medium">
                                        {app.statistics.avgFileSize}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">데이터 수집 기간:</span>
                                    <span className="ml-2 font-medium">
                                        {app.statistics.dateRange}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-5 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">신청일:</span>
                                    <span className="ml-2 font-medium">
                                        {format(new Date(app.applicationDate), 'yyyy-MM-dd hh:mm')}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">승인일:</span>
                                    <span className="ml-2 font-medium">
                                        {format(new Date(app.approvedDate), 'yyyy-MM-dd hh:mm')}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">만료일:</span>
                                    <span className="ml-2 font-medium">
                                        {format(
                                            new Date(app.apiInfo.expiryDate),
                                            'yyyy-MM-dd hh:mm'
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ))}
            {selectFilterCohort === 1 &&
                (pendingUnstructuredApps.length === 0 ? (
                    <div className="text-center py-12">
                        <IoMdCheckmarkCircleOutline className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            신청된 비정형 데이터가 없습니다
                        </h3>
                        <p className="text-gray-500">비정형 데이터 신청 후 여기에 표시됩니다.</p>
                    </div>
                ) : (
                    pendingUnstructuredApps.map((app, idx) => (
                        <div
                            key={idx}
                            className={`flex flex-col gap-2 border rounded-lg p-6 text-gray-900 ${app.status === 'rejected' ? 'border-red-200 bg-red-50/30' : 'border-blue-200 bg-blue-50/30'}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    <h1 className="text-lg font-semibold">{app.cohortName}</h1>
                                    <div className="flex gap-1 font-bold text-purple-900 items-center px-2 rounded-xl bg-purple-100">
                                        <span className="text-xs">{app.dataType}</span>
                                    </div>
                                    <div className="flex gap-1 font-bold text-neutral-900 items-center px-2 rounded-xl bg-neutral-100">
                                        <span className="text-xs">{app.dataSubtype}</span>
                                    </div>
                                    <div
                                        className={`flex gap-1 font-bold items-center px-2 rounded-xl ${app.status === 'rejected' ? 'text-red-900 bg-red-100' : 'text-blue-900 bg-blue-100'}`}
                                    >
                                        {app.status === 'rejected' ? (
                                            <FaRegTimesCircle />
                                        ) : (
                                            <GoClock />
                                        )}
                                        <span className="text-xs">
                                            {app.status === 'rejected' ? '반려됨' : '대기중'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {app.status === 'rejected' && (
                                        <button
                                            className="flex items-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-gray-900 font-bold text-sm px-3 py-2 transition-all duration-200"
                                            onClick={() => {
                                                setSelectApp(app);
                                                setIsRejectionModalOpen(true);
                                            }}
                                        >
                                            <IoEyeOutline className="h-4 w-4" />
                                            <span>반려 사유</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <span className="text-sm">{app.cohortDescription}</span>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">신청일:</span>
                                    <span className="ml-2 font-medium">
                                        {format(new Date(app.applicationDate), 'yyyy-MM-dd hh:mm')}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">검토일:</span>
                                    <span className="ml-2 font-medium">
                                        {format(new Date(app.reviewDate), 'yyyy-MM-dd hh:mm')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ))}
            <RejectionModal
                isModalOpen={isRejectionModalOpen}
                setIsModalOpen={setIsRejectionModalOpen}
                app={selectApp}
            />
        </div>
    );
}
