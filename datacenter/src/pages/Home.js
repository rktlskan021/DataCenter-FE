import LoadingSpinner from '../components/LoadingSpinner';
import { useState, useEffect } from 'react';
import useAuthStore from '../stores/useAuthStore';
import { LuUser } from 'react-icons/lu';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { GoClock } from 'react-icons/go';
import { FaRegTimesCircle } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';
import RejectionModal from '../components/modals/RejectionModal';
import ConnectionInfoModal from '../components/modals/ConnectionInfoModal';
import { useSchemas } from '../hooks/queries/useUsers';

// 사용자의 코호트 신청 데이터
const userCohortApplications = [
    {
        id: 1,
        cohortId: 1,
        cohortName: 'Atlas Cohort 1',
        cohortDescription: '2024년 1분기에 가입한 신규 사용자들의 행동 패턴 분석',
        selectedTables: [
            'PERSON',
            'CONDITION_OCCURRENCE',
            'DRUG_EXPOSURE',
            'MEASUREMENT',
            'VISIT_OCCURRENCE',
        ],
        applicationDate: '2024-03-15',
        status: 'approved',
        approvedDate: '2024-03-18',
        schemaName: 'cohort_1_kim_researcher',
        accessCode: 'COHORT_1_KR_2024',
        connectionInfo: {
            host: 'data-center-db.hospital.com',
            port: '5432',
            database: 'omop_cdm',
            schema: 'cohort_1_kim_researcher',
            username: 'kim_researcher_001',
            password: 'temp_password_123',
        },
    },
    {
        id: 2,
        cohortId: 3,
        cohortName: 'Atlas Cohort 3',
        cohortDescription: '프리미엄 플랜을 구독한 사용자들의 사용 패턴 및 만족도 조사',
        selectedTables: ['PERSON', 'OBSERVATION_PERIOD', 'DRUG_EXPOSURE', 'PROCEDURE_OCCURRENCE'],
        applicationDate: '2024-02-20',
        status: 'approved',
        approvedDate: '2024-02-25',
        schemaName: 'cohort_3_kim_researcher',
        accessCode: 'COHORT_3_KR_2024',
        connectionInfo: {
            host: 'data-center-db.hospital.com',
            port: '5432',
            database: 'omop_cdm',
            schema: 'cohort_3_kim_researcher',
            username: 'kim_researcher_003',
            password: 'temp_password_456',
        },
    },
    {
        id: 3,
        cohortId: 2,
        cohortName: 'Atlas Cohort 2',
        cohortDescription: '모바일 앱을 통해 서비스를 이용하는 사용자들의 리텐션 분석',
        selectedTables: ['PERSON', 'VISIT_OCCURRENCE', 'CONDITION_OCCURRENCE', 'NOTE'],
        applicationDate: '2024-03-10',
        status: 'pending',
        reviewDate: null,
        rejectionReason: '',
    },
    {
        id: 4,
        cohortId: 4,
        cohortName: 'Bento Cohort 1',
        cohortDescription: '최근 활동이 감소한 사용자들을 대상으로 한 이탈 방지 분석',
        selectedTables: ['PERSON', 'OBSERVATION_PERIOD', 'MEASUREMENT', 'DRUG_EXPOSURE', 'DEATH'],
        applicationDate: '2024-02-28',
        status: 'rejected',
        reviewDate: '2024-03-02',
        rejectionReason:
            '제출된 IRB 승인서의 연구 범위가 신청하신 데이터 테이블과 일치하지 않습니다. 특히 DEATH 테이블 접근에 대한 별도 승인이 필요합니다. IRB 승인서를 수정하여 재신청해 주시기 바랍니다.',
    },
    {
        id: 5,
        cohortId: 5,
        cohortName: 'Bento Cohort 2',
        cohortDescription: '서울, 부산, 대구 지역 사용자들의 서비스 이용 패턴 비교 분석',
        selectedTables: ['PERSON', 'LOCATION', 'CARE_SITE', 'VISIT_OCCURRENCE'],
        applicationDate: '2024-03-25',
        status: 'pending',
        reviewDate: '2024-03-26',
        rejectionReason: '',
    },
];

export default function Home() {
    // const [isLoading, setIsLoading] = useState(true);
    const [selectFilterCohort, setSelectFilterCohort] = useState(0);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [isConnectionInfoModalOpen, setIsConnectionInfoModalOpen] = useState(false);
    const [selectApp, setSelectApp] = useState(null);
    const [approvedApplications, setApprovedApplications] = useState([]);
    const [pendingApplications, setPendingApplications] = useState([]);

    const { isLoggedIn, id, name } = useAuthStore();
    const { data, isLoading } = useSchemas();

    useEffect(() => {
        if (!isLoggedIn) {
            alert('로그인을 먼저 진행해주세요.');
            navigator('/login');
        }
    }, []);

    useEffect(() => {
        if (!isLoading && data) {
            setApprovedApplications(data.filter((app) => app.status === 'approved'));
            setPendingApplications(data.filter((app) => app.status !== 'approved'));
        }
    }, [isLoading, data]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen">
            (
            <div className="flex flex-col gap-10 max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
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
                    <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-emerald-600">
                                {approvedApplications.length}
                            </div>
                            <div className="text-gray-600">승인된 코호트</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">
                                {pendingApplications.length}
                            </div>
                            <div className="text-gray-600">대기중 신청</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div>
                        <h1 className="font-bold text-2xl text-gray-900">코호트 신청 현황</h1>
                        <span className="text-sm font-regular">
                            신청한 코호트의 승인 상태와 접근 정보를 확인할 수 있습니다.
                        </span>
                    </div>
                    <div className="grid w-full grid-cols-2 bg-gray-100 py-1">
                        <div
                            className={`flex items-center justify-center gap-2 py-2 ml-1 rounded transition-all duration-200 cursor-pointer ${selectFilterCohort === 0 ? 'bg-white text-gray-900' : 'bg-transparent text-gray-600'}`}
                            onClick={() => setSelectFilterCohort(0)}
                        >
                            <IoMdCheckmarkCircleOutline className="h-5 w-5" />
                            <span className="font-bold">
                                승인된 코호트 ({approvedApplications.length})
                            </span>
                        </div>
                        <div
                            className={`flex items-center justify-center gap-2 py-2 mr-1 rounded transition-all duration-200 cursor-pointer ${selectFilterCohort === 1 ? 'bg-white text-gray-900' : 'bg-transparent text-gray-600'}`}
                            onClick={() => setSelectFilterCohort(1)}
                        >
                            <GoClock className="h-5 w-5" />
                            <span className="font-bold ">
                                대기중/반려된 코호트 ({pendingApplications.length})
                            </span>
                        </div>
                    </div>
                    {selectFilterCohort === 0 ? (
                        approvedApplications.length === 0 ? (
                            <div className="text-center py-12">
                                <IoMdCheckmarkCircleOutline className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    승인된 코호트가 없습니다
                                </h3>
                                <p className="text-gray-500">
                                    코호트 신청 후 승인되면 여기에 표시됩니다.
                                </p>
                            </div>
                        ) : (
                            approvedApplications.map((app) => (
                                <div
                                    key={app.id}
                                    className="flex flex-col gap-2 border border-emerald-200 bg-emerald-50/30 rounded-lg p-6 text-gray-900"
                                >
                                    <div className="relative flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <h1 className="text-lg font-semibold">
                                                {app.cohortName}
                                            </h1>
                                            <div className="flex gap-1 font-bold text-emerald-900 items-center px-2 rounded-xl bg-emerald-100">
                                                <IoMdCheckmarkCircleOutline />
                                                <span className="text-xs">승인됨</span>
                                            </div>
                                        </div>
                                        <button
                                            className="absolute top-0 right-0 flex gap-3 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-gray-900 font-bold text-sm px-2 py-2 transition-all duration-200"
                                            onClick={() => {
                                                setSelectApp(app);
                                                setIsConnectionInfoModalOpen(true);
                                            }}
                                        >
                                            <span>{'< >'}</span>
                                            <span>접속 정보</span>
                                        </button>
                                    </div>
                                    <span className="text-sm">{app.cohortDescription}</span>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">신청일:</span>
                                            <span className="ml-2 font-medium">
                                                {app.applicationDate}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">승인일:</span>
                                            <span className="ml-2 font-medium">
                                                {app.approvedDate}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">선택 테이블:</span>
                                            <span className="ml-2 font-medium">
                                                {app.selectedTables.length}개
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">
                                            승인된 테이블:
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                            {app.selectedTables.map((table) => (
                                                <div
                                                    key={table}
                                                    className="font-bold text-center bg-gray-200 text-xs px-1.5 py-1 rounded-xl"
                                                >
                                                    {table}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    ) : (
                        pendingApplications.map((app) => (
                            <div
                                key={app.id}
                                className={`flex flex-col gap-2 border rounded-lg p-6 text-gray-900 ${app.status === 'rejected' ? 'border-red-200 bg-red-50/30' : 'border-blue-200 bg-blue-50/30'}`}
                            >
                                <div className="relative flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <h1 className="text-lg font-semibold">{app.name}</h1>
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
                                    {app.status === 'rejected' && (
                                        <button
                                            className="absolute top-0 right-0 flex gap-3 items-center border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-gray-900 font-bold text-sm px-2 py-2 transition-all duration-200"
                                            onClick={() => {
                                                setIsRejectionModalOpen(true);
                                                setSelectApp(app);
                                            }}
                                        >
                                            <IoEyeOutline className="h-4 w-4" />
                                            <span>반려 사유</span>
                                        </button>
                                    )}
                                </div>
                                <span className="text-sm">{app.description}</span>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">신청일:</span>
                                        <span className="ml-2 font-medium">{app.createdDate}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">검토일:</span>
                                        <span className="ml-2 font-medium">{app.resolvedDate}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">선택 테이블:</span>
                                        <span className="ml-2 font-medium">
                                            {app.tables.length}개
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">승인된 테이블:</span>
                                    <div className="flex flex-wrap gap-1">
                                        {app.tables.map((table, idx) => (
                                            <div
                                                key={idx}
                                                className="font-bold text-center bg-gray-200 text-xs px-1.5 py-1 rounded-xl"
                                            >
                                                {table.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <RejectionModal
                    isModalOpen={isRejectionModalOpen}
                    setIsModalOpen={setIsRejectionModalOpen}
                    app={selectApp}
                />
                <ConnectionInfoModal
                    isModalOpen={isConnectionInfoModalOpen}
                    setIsModalOpen={setIsConnectionInfoModalOpen}
                    app={selectApp}
                />
            </div>
            )
        </div>
    );
}
