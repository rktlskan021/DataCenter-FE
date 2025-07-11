import { useParams } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { MdOutlineFileUpload } from 'react-icons/md';
import { BsCheck2Circle } from 'react-icons/bs';
import MultiFileUpload from '../components/MultiFileUpload';
import InfoModal from '../components/InfoModal';
import { FiInfo } from 'react-icons/fi';

// OMOP CDM 테이블 정의
const omopTables = [
    {
        id: 'person',
        name: 'PERSON',
        description: '환자의 기본 인구학적 정보',
        recordCount: '1,234,567',
    },
    {
        id: 'observation_period',
        name: 'OBSERVATION_PERIOD',
        description: '환자의 관찰 기간 정보',
        recordCount: '1,456,789',
    },
    {
        id: 'visit_occurrence',
        name: 'VISIT_OCCURRENCE',
        description: '병원 방문 기록',
        recordCount: '5,678,901',
    },
    {
        id: 'visit_detail',
        name: 'VISIT_DETAIL',
        description: '방문 상세 정보',
        recordCount: '1,111,111',
    },
    {
        id: 'condition_occurrence',
        name: 'CONDITION_OCCURRENCE',
        description: '진단 및 질병 정보',
        recordCount: '8,901,234',
    },
    {
        id: 'drug_exposure',
        name: 'DRUG_EXPOSURE',
        description: '약물 처방 및 투약 정보',
        recordCount: '12,345,678',
    },
    {
        id: 'procedure_occurrence',
        name: 'PROCEDURE_OCCURRENCE',
        description: '시술 및 수술 정보',
        recordCount: '3,456,789',
    },
    {
        id: 'device_exposure',
        name: 'DEVICE_EXPOSURE',
        description: '의료 기기 사용 정보',
        recordCount: '2,222,222',
    },
    {
        id: 'measurement',
        name: 'MEASUREMENT',
        description: '검사 결과 및 측정값',
        recordCount: '15,678,901',
    },
    {
        id: 'observation',
        name: 'OBSERVATION',
        description: '기타 관찰 정보',
        recordCount: '2,345,678',
    },
    { id: 'death', name: 'DEATH', description: '사망 정보', recordCount: '45,678' },
    {
        id: 'note',
        name: 'NOTE',
        description: '임상 노트 및 텍스트 데이터',
        recordCount: '7,890,123',
    },
    {
        id: 'note_nlp',
        name: 'NOTE_NLP',
        description: '임상 노트 자연어 처리 데이터',
        recordCount: '456,789',
    },
    { id: 'specimen', name: 'SPECIMEN', description: '검체 정보', recordCount: '1,234,567' },
    {
        id: 'fact_relationship',
        name: 'FACT_RELATIONSHIP',
        description: '사실 관계 데이터',
        recordCount: '123,456',
    },
    { id: 'location', name: 'LOCATION', description: '위치 정보', recordCount: '12,345' },
    { id: 'care_site', name: 'CARE_SITE', description: '진료 기관 정보', recordCount: '5,678' },
    { id: 'provider', name: 'PROVIDER', description: '의료진 정보', recordCount: '23,456' },
    {
        id: 'payer_plan_period',
        name: 'PAYER_PLAN_PERIOD',
        description: '보험 및 지불 계획 기간',
        recordCount: '345,678',
    },
    { id: 'cost', name: 'COST', description: '비용 정보', recordCount: '9,876,543' },
    { id: 'drug_era', name: 'DRUG_ERA', description: '약물 ERA 정보', recordCount: '2,345,678' },
    { id: 'dose_era', name: 'DOSE_ERA', description: '용량 ERA 정보', recordCount: '1,234,567' },
    {
        id: 'condition_era',
        name: 'CONDITION_ERA',
        description: '질병 ERA 정보',
        recordCount: '789,012',
    },
    { id: 'episode', name: 'EPISODE', description: '에피소드 정보', recordCount: '123,456' },
    {
        id: 'episode_event',
        name: 'EPISODE_EVENT',
        description: '에피소드 이벤트 정보',
        recordCount: '234,567',
    },
    { id: 'metadata', name: 'METADATA', description: '메타데이터 테이블', recordCount: '345' },
    { id: 'cdm_source', name: 'CDM_SOURCE', description: 'CDM 소스 정보', recordCount: '1' },
    { id: 'concept', name: 'CONCEPT', description: '표준 용어 정보', recordCount: '9,876' },
    { id: 'vocabulary', name: 'VOCABULARY', description: '용어집 정보', recordCount: '456' },
    { id: 'domain', name: 'DOMAIN', description: '도메인 정보', recordCount: '123' },
    {
        id: 'concept_class',
        name: 'CONCEPT_CLASS',
        description: '개념 클래스 정보',
        recordCount: '789',
    },
    {
        id: 'concept_relationship',
        name: 'CONCEPT_RELATIONSHIP',
        description: '개념 관계 정보',
        recordCount: '1,234',
    },
    {
        id: 'concept_synonym',
        name: 'CONCEPT_SYNONYM',
        description: '개념 동의어 정보',
        recordCount: '567',
    },
    {
        id: 'concetp_ancestor',
        name: 'CONCETP_ANCESTOR',
        description: '개념 조상 정보',
        recordCount: '890',
    },
    {
        id: 'source_to_concept_map',
        name: 'SOURCE_TO_CONCEPT_MAP',
        description: '소스-개념 매핑 정보',
        recordCount: '234',
    },
    {
        id: 'drug_strength',
        name: 'DRUG_STRENGTH',
        description: '약물 강도 정보',
        recordCount: '345',
    },
    { id: 'cohort', name: 'COHORT', description: '코호트 정보', recordCount: '123,456' },
    {
        id: 'cohort_definition',
        name: 'COHORT_DEFINITION',
        description: '코호트 정의 정보',
        recordCount: '789',
    },
];

export default function CohortDetail() {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTables, setSelectedTables] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isFileUploadOpen, setFileUploadOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const { id } = useParams();
    const { isLoggedIn } = useAuthStore();
    const navigator = useNavigate();
    const canSubmitRequest = selectedTables.length > 0 && selectedFiles.length > 0;

    const handleCheckboxChange = (id) => {
        setSelectedTables((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((itemId) => itemId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedTables.length === omopTables.length) {
            setSelectedTables([]);
        } else {
            setSelectedTables(omopTables.map((table) => table.id));
        }
    };

    const clickApplyBtn = () => {
        console.log('신청됨');
    };

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
                    <div className="flex flex-col gap-3 bg-white border border-gray-200 px-5 py-6 rounded-xl">
                        <h1 className="font-bold text-2xl">Atlas Cohort 1</h1>
                        <span>
                            2024년 1분기에 가입한 신규 사용자들의 행동 패턴 분석을 위한 Atlas
                        </span>
                        <div className="flex gap-5">
                            <span>작성자: 김데이터</span>
                            <span>생성일: 2024-01-15</span>
                            <span>수정일: 2024-01-15</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 bg-white border border-gray-200 px-5 py-6 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-black font-normal">
                                    데이터 테이블 선택
                                </h1>
                                <span className="text-sm text-gray-900 font-medium">
                                    접근 권한을 신청할 CDM 테이블을 선택하세요.
                                </span>
                            </div>
                            <button
                                className="font-medium text-sm border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-200 transition duration-200 ease-in-out"
                                onClick={handleSelectAll}
                            >
                                전체 선택
                            </button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {omopTables.map((table) => (
                                <div
                                    key={table.id}
                                    className={`flex gap-3 items-start border rounded-lg p-4 cursor-pointer transition-colors ${selectedTables.includes(table.id) ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                                    onClick={() => handleCheckboxChange(table.id)}
                                >
                                    <div
                                        type="button"
                                        className={`w-4 h-4 border border-black rounded-sm flex items-center justify-center transition mt-1
                                                ${selectedTables.includes(table.id) ? 'bg-black' : null}`}
                                    >
                                        {selectedTables.includes(table.id) && (
                                            <svg
                                                className="w-5 h-5 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="font-semibold text-xm align-middle">
                                            {table.name}
                                        </h3>
                                        <p className="text-xs text-gray-600 mb-2">
                                            {table.description}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            레코드 수 : {table.recordCount}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {selectedTables.length > 0 && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-800">
                                    선택된 테이블: {selectedTables.length}개
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-5 bg-white border border-gray-200 px-5 py-6 rounded-xl">
                        <div>
                            <h1 className="text-2xl font-black font-normal">
                                IRB/DRB 승인서 업로드
                            </h1>
                            <span className="font-normal text-gray-700">
                                데이터 접근 권한 신청을 위해 IRB/DRB 승인서를 업로드하세요
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <button
                                className="flex gap-3 items-center border border-gray-300 rounded px-4 py-2 hover:bg-gray-100"
                                onClick={() => setFileUploadOpen(true)}
                            >
                                <MdOutlineFileUpload className="h-6 w-6" />
                                <span className="font-bold text-xs">파일 업로드</span>
                            </button>
                            {selectedFiles.length > 0 ? (
                                <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                                    <BsCheck2Circle className="h-4 w-4" />
                                    <span>
                                        {selectedFiles[0].name} 업로드 완료
                                        {selectedFiles.length !== 1
                                            ? ` (외 ${selectedFiles.length - 1}건)`
                                            : null}
                                    </span>
                                    <button
                                        onClick={() => setIsInfoModalOpen(true)}
                                        className="text-gray-500 hover:text-gray-700"
                                        aria-label="전체 파일 보기"
                                    >
                                        <FiInfo className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                        {selectedFiles.length ? null : (
                            <div className="flex items-center gap-2 text-sm text-amber-600">
                                <FiInfo className="h-4 w-4" />
                                <span>테이블 선택과 IRB/DRB 파일 업로드를 완료해주세요</span>
                            </div>
                        )}
                        <button
                            disabled={!canSubmitRequest}
                            className={`px-8 bg-blue-600 text-white rounded py-3 font-bold ${
                                !canSubmitRequest
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-blue-700'
                            }`}
                            onClick={clickApplyBtn}
                        >
                            데이터 접근 권한 신청
                        </button>
                    </div>
                </div>
            )}
            {isInfoModalOpen && (
                <InfoModal
                    isModalOpen={isInfoModalOpen}
                    setIsModalOpen={setIsInfoModalOpen}
                    files={selectedFiles}
                />
            )}
            {isFileUploadOpen ? (
                <MultiFileUpload
                    isOpen={isFileUploadOpen}
                    setIsOpen={setFileUploadOpen}
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                />
            ) : null}
        </div>
    );
}
