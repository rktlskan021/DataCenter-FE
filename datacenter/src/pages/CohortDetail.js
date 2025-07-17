import { useEffect, useState, useMemo } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { MdOutlineFileUpload } from 'react-icons/md';
import { BsCheck2Circle } from 'react-icons/bs';
import FileUploadModal from '../components/modals/FileUploadModal';
import InfoModal from '../components/modals/InfoModal';
import { FiInfo } from 'react-icons/fi';
import { LuUser } from 'react-icons/lu';
import CheckboxCard from '../components/table/CheckboxCard';
import { Textarea } from '@headlessui/react';

const omopTablesWithPersonId = [
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
        id: 'payer_plan_period',
        name: 'PAYER_PLAN_PERIOD',
        description: '보험 및 지불 계획 기간',
        recordCount: '345,678',
    },
    { id: 'drug_era', name: 'DRUG_ERA', description: '약물 ERA 정보', recordCount: '2,345,678' },
    { id: 'dose_era', name: 'DOSE_ERA', description: '용량 ERA 정보', recordCount: '1,234,567' },
    {
        id: 'condition_era',
        name: 'CONDITION_ERA',
        description: '질병 ERA 정보',
        recordCount: '789,012',
    },
    { id: 'episode', name: 'EPISODE', description: '에피소드 정보', recordCount: '123,456' },
];

const omopTablesWithoutPersonId = [
    { id: 'metadata', name: 'METADATA', description: '메타데이터 테이블', recordCount: '345' },
    { id: 'vocabulary', name: 'VOCABULARY', description: '용어집 정보', recordCount: '456' },
    { id: 'concept', name: 'CONCEPT', description: '표준 용어 정보', recordCount: '9,876' },
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
    { id: 'care_site', name: 'CARE_SITE', description: '진료 기관 정보', recordCount: '5,678' },
    { id: 'cohort', name: 'COHORT', description: '코호트 정보', recordCount: '123,456' },
    {
        id: 'cohort_definition',
        name: 'COHORT_DEFINITION',
        description: '코호트 정의 정보',
        recordCount: '789',
    },
    { id: 'provider', name: 'PROVIDER', description: '의료진 정보', recordCount: '23,456' },
    {
        id: 'drug_strength',
        name: 'DRUG_STRENGTH',
        description: '약물 강도 정보',
        recordCount: '345',
    },
    { id: 'cdm_source', name: 'CDM_SOURCE', description: 'CDM 소스 정보', recordCount: '1' },
    {
        id: 'episode_event',
        name: 'EPISODE_EVENT',
        description: '에피소드 이벤트 정보',
        recordCount: '234,567',
    },
    { id: 'cost', name: 'COST', description: '비용 정보', recordCount: '9,876,543' },
    { id: 'location', name: 'LOCATION', description: '위치 정보', recordCount: '12,345' },
    {
        id: 'fact_relationship',
        name: 'FACT_RELATIONSHIP',
        description: '사실 관계 데이터',
        recordCount: '123,456',
    },
];

const allTables = [...omopTablesWithPersonId, ...omopTablesWithoutPersonId];

export default function CohortDetail() {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTables, setSelectedTables] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isFileUploadOpen, setFileUploadOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [schemaName, setSchemaName] = useState('');
    const [schemaDescription, setSchemaDescription] = useState('');

    const canSubmitRequest =
        selectedTables.length > 0 &&
        selectedFiles.length > 0 &&
        schemaName.trim() !== '' &&
        schemaDescription.trim() !== '';

    const countWithPersonIdTable = useMemo(
        () => omopTablesWithPersonId.filter((item) => selectedTables.includes(item.id)).length,
        [selectedTables]
    );

    const countWithOutPersonIdTable = useMemo(
        () => omopTablesWithoutPersonId.filter((item) => selectedTables.includes(item.id)).length,
        [selectedTables]
    );

    const handleCheckboxChange = (id) => {
        setSelectedTables((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((itemId) => itemId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectWithPersonIdTableAll = () => {
        const withPersonIdTableIds = omopTablesWithPersonId.map((table) => table.id);
        const currentWithPersonIdTable = selectedTables.filter((id) =>
            withPersonIdTableIds.includes(id)
        );
        if (currentWithPersonIdTable.length === omopTablesWithPersonId.length) {
            setSelectedTables(selectedTables.filter((id) => !withPersonIdTableIds.includes(id)));
        } else {
            const newSelections = [
                ...selectedTables.filter((id) => !withPersonIdTableIds.includes(id)),
                ...withPersonIdTableIds,
            ];
            setSelectedTables(newSelections);
        }
    };

    const handleSelectWithOutPersoIdTableAll = () => {
        const withOutPersonIdTableIds = omopTablesWithoutPersonId.map((table) => table.id);
        const currentWithOutPersonIdTable = selectedTables.filter((id) =>
            withOutPersonIdTableIds.includes(id)
        );
        if (currentWithOutPersonIdTable.length === omopTablesWithoutPersonId.length) {
            setSelectedTables(selectedTables.filter((id) => !withOutPersonIdTableIds.includes(id)));
        } else {
            const newSelections = [
                ...selectedTables.filter((id) => !withOutPersonIdTableIds.includes(id)),
                ...withOutPersonIdTableIds,
            ];
            setSelectedTables(newSelections);
        }
    };

    const handleSelectAll = () => {
        if (selectedTables.length === allTables.length) {
            setSelectedTables([]);
        } else {
            setSelectedTables(allTables.map((table) => table.id));
        }
    };

    const clickApplyBtn = () => {
        console.log('신청됨');
    };

    useEffect(() => {
        setIsLoading(false);
    });

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
                    <div className="flex flex-col bg-white border border-blue-200 bg-blue-50/30 rounded-xl">
                        <div className="flex items-center justify-between bg-blue-50 border-b px-5 py-6 border-blue-200">
                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <LuUser className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg text-blue-900 font-bold">
                                        환자 데이터 테이블
                                    </h1>
                                    <span className="text-blue-700 font-regular">
                                        person id가 포함된 환자별 임상 데이터 테이블 (
                                        {omopTablesWithPersonId.length}개)
                                    </span>
                                </div>
                            </div>
                            <button
                                className="font-medium text-sm bg-transparent border border-gray-300 px-4 py-3 rounded-lg text-blue-700 hover:bg-blue-100 transition duration-200 ease-in-out"
                                onClick={handleSelectWithPersonIdTableAll}
                            >
                                {selectedTables.filter((id) =>
                                    omopTablesWithPersonId.map((table) => table.id).includes(id)
                                ).length === omopTablesWithPersonId.length
                                    ? '전체 해제'
                                    : '전체 선택'}
                            </button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-4 py-5">
                            {omopTablesWithPersonId.map((table) => (
                                <CheckboxCard
                                    table={table}
                                    isSelected={selectedTables.includes(table.id)}
                                    onClick={() => handleCheckboxChange(table.id)}
                                    color={'blue'}
                                />
                            ))}
                        </div>
                        <div className="mx-5 mb-6 p-3 bg-blue-100 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800 font-bold">
                                선택된 환자 데이터 테이블: {countWithPersonIdTable}개
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col bg-white border border-emerald-200 bg-emerald-50/30 rounded-xl">
                        <div className="flex items-center justify-between bg-emerald-50 border-b px-5 py-6 border-blue-200">
                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                                    <LuUser className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg text-emerald-900 font-bold">
                                        참조/메타데이터 테이블
                                    </h1>
                                    <span className="text-emerald-700 font-regular">
                                        용어집, 코드 매핑, 시스템 정보 등 참조용 테이블 (
                                        {omopTablesWithoutPersonId.length}개)
                                    </span>
                                </div>
                            </div>
                            <button
                                className="font-medium text-sm bg-transparent border border-gray-300 px-4 py-3 rounded-lg text-emerald-700 hover:bg-emerald-100 transition duration-200 ease-in-out"
                                onClick={handleSelectWithOutPersoIdTableAll}
                            >
                                {selectedTables.filter((id) =>
                                    omopTablesWithoutPersonId.map((table) => table.id).includes(id)
                                ).length === omopTablesWithoutPersonId.length
                                    ? '전체 해제'
                                    : '전체 선택'}
                            </button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-4 py-5">
                            {omopTablesWithoutPersonId.map((table) => (
                                <CheckboxCard
                                    table={table}
                                    isSelected={selectedTables.includes(table.id)}
                                    onClick={() => handleCheckboxChange(table.id)}
                                    color={'emerald'}
                                />
                            ))}
                        </div>
                        <div className="mx-5 mb-6 p-3 bg-emerald-100 rounded-lg border border-emerald-200">
                            <p className="text-sm text-emerald-800 font-bold">
                                선택된 환자 데이터 테이블: {countWithOutPersonIdTable}개
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center bg-white justify-between text-lg border border-gray-200 px-5 py-6 rounded-xl">
                        <div className="flex gap-5 font-bold">
                            <span className="text-gray-600">
                                전체 선택될 테이블: {selectedTables.length}개
                            </span>
                            <span className="text-blue-600">
                                환자 테이블: {countWithPersonIdTable}개
                            </span>
                            <span className="text-emerald-600">
                                참조 테이블: {countWithOutPersonIdTable}개
                            </span>
                        </div>
                        <button
                            className="font-medium text-sm bg-transparent border border-gray-300 px-4 py-2 rounded-lg text-gray-900 hover:bg-gray-100 transition duration-200 ease-in-out"
                            onClick={handleSelectAll}
                        >
                            {selectedTables.length === allTables.length ? '전체 해제' : '전체 선택'}
                        </button>
                    </div>
                    <div className="flex flex-col gap-5 bg-white border border-gray-200 px-5 py-6 rounded-xl">
                        <div>
                            <h1 className="text-2xl font-black font-normal">스키마 정보</h1>
                            <span className="font-normal text-gray-700">
                                생성될 스키마의 이름과 설명을 입력하세요
                            </span>
                        </div>
                        <div>
                            <label
                                htmlFor="schemaName"
                                className="block text-sm font-medium text-gray-800 mb-2"
                            >
                                스키마 이름 *
                            </label>
                            <input
                                id="schemaName"
                                type="text"
                                onChange={(e) => setSchemaName(e.target.value)}
                                value={schemaName}
                                placeholder="예: diabetes_study_2024"
                                className="max-w-md w-full px-2 py-1.5 border border-gray-200 rounded"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                영문, 숫자, 언더스코어(_)만 사용 가능합니다.
                            </p>
                        </div>
                        <div>
                            <label
                                htmlFor="schemaName"
                                className="block text-sm font-medium text-gray-800 mb-2"
                            >
                                스키마 설명 *
                            </label>
                            <textarea
                                id="schemaDescription"
                                type="text"
                                onChange={(e) => setSchemaDescription(e.target.value)}
                                value={schemaDescription}
                                placeholder="이 스키마의 목적과 사용 용도를 설명해주세요..."
                                className="max-w-2xl w-full px-2 py-1.5 border border-gray-200 rounded"
                                rows={3}
                                required
                            />
                        </div>
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
                <FileUploadModal
                    isOpen={isFileUploadOpen}
                    setIsOpen={setFileUploadOpen}
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                />
            ) : null}
        </div>
    );
}
