import { useState, useMemo, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { MdOutlineFileUpload } from 'react-icons/md';
import { BsCheck2Circle } from 'react-icons/bs';
import FileUploadModal from '../components/modals/FileUploadModal';
import InfoModal from '../components/modals/InfoModal';
import { FiInfo } from 'react-icons/fi';
import { LuUser } from 'react-icons/lu';
import CheckboxCard from '../components/table/CheckboxCard';
import { useParams } from 'react-router-dom';
import { useCohortDetail, useApplyCohort } from '../hooks/queries/useCohorts';
import { fetchIrbDrbData } from '../api/users/users';
import { format } from 'date-fns';

const tableMeta = {
    person: { hasPersonId: true },
    observation_period: { hasPersonId: true },
    visit_occurrence: { hasPersonId: true },
    visit_detail: { hasPersonId: true },
    condition_occurrence: { hasPersonId: true },
    drug_exposure: { hasPersonId: true },
    procedure_occurrence: { hasPersonId: true },
    device_exposure: { hasPersonId: true },
    measurement: { hasPersonId: true },
    observation: { hasPersonId: true },
    death: { hasPersonId: true },
    note: { hasPersonId: true },
    note_nlp: { hasPersonId: true },
    specimen: { hasPersonId: true },
    payer_plan_period: { hasPersonId: true },
    drug_era: { hasPersonId: true },
    dose_era: { hasPersonId: true },
    condition_era: { hasPersonId: true },
    episode: { hasPersonId: true },

    // 나머지는 명시적으로 false 처리 (선택)
    metadata: { hasPersonId: false },
    vocabulary: { hasPersonId: false },
    concept: { hasPersonId: false },
    domain: { hasPersonId: false },
    concept_class: { hasPersonId: false },
    concept_relationship: { hasPersonId: false },
    concept_synonym: { hasPersonId: false },
    concetp_ancestor: { hasPersonId: false },
    source_to_concept_map: { hasPersonId: false },
    care_site: { hasPersonId: false },
    cohort: { hasPersonId: false },
    cohort_definition: { hasPersonId: false },
    provider: { hasPersonId: false },
    drug_strength: { hasPersonId: false },
    cdm_source: { hasPersonId: false },
    episode_event: { hasPersonId: false },
    cost: { hasPersonId: false },
    location: { hasPersonId: false },
    fact_relationship: { hasPersonId: false },
};

export default function CohortDetail() {
    const [selectedTables, setSelectedTables] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isFileUploadOpen, setFileUploadOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [schemaName, setSchemaName] = useState('');
    const [schemaDescription, setSchemaDescription] = useState('');
    const [isDisabledSchemaInfo, setIsDisabledSchemaInfo] = useState(false);
    const cohort_id = useParams().id;

    const { mutate } = useApplyCohort();
    const { data, isLoading } = useCohortDetail(cohort_id);
    const [withPersonId, setWithPersonId] = useState([]);
    const [withoutPersonId, setWithoutPersonId] = useState([]);
    const [allTables, setAllTables] = useState([]);

    const canSubmitRequest =
        selectedTables.length > 0 &&
        selectedFiles.length > 0 &&
        schemaName.trim() !== '' &&
        schemaDescription.trim() !== '';

    const countWithPersonIdTable = useMemo(
        () => withPersonId.filter((item) => selectedTables.includes(item.name)).length,
        [selectedTables]
    );

    const countWithOutPersonIdTable = useMemo(
        () => withoutPersonId.filter((item) => selectedTables.includes(item.name)).length,
        [selectedTables]
    );

    const handleCheckboxChange = (name) => {
        setSelectedTables((prevSelected) =>
            prevSelected.includes(name)
                ? prevSelected.filter((itemId) => itemId !== name)
                : [...prevSelected, name]
        );
    };

    const handleSelectWithPersonIdTableAll = () => {
        const withPersonIdTableIds = withPersonId.map((table) => table.name);
        const currentWithPersonIdTable = selectedTables.filter((name) =>
            withPersonIdTableIds.includes(name)
        );
        if (currentWithPersonIdTable.length === withPersonId.length) {
            setSelectedTables(
                selectedTables.filter((name) => !withPersonIdTableIds.includes(name))
            );
        } else {
            const newSelections = [
                ...selectedTables.filter((name) => !withPersonIdTableIds.includes(name)),
                ...withPersonIdTableIds,
            ];
            setSelectedTables(newSelections);
        }
    };

    const handleSelectWithOutPersoIdTableAll = () => {
        const withOutPersonIdTableIds = withoutPersonId.map((table) => table.name);
        const currentWithOutPersonIdTable = selectedTables.filter((name) =>
            withOutPersonIdTableIds.includes(name)
        );
        if (currentWithOutPersonIdTable.length === withoutPersonId.length) {
            setSelectedTables(
                selectedTables.filter((name) => !withOutPersonIdTableIds.includes(name))
            );
        } else {
            const newSelections = [
                ...selectedTables.filter((name) => !withOutPersonIdTableIds.includes(name)),
                ...withOutPersonIdTableIds,
            ];
            setSelectedTables(newSelections);
        }
    };

    const handleSelectAll = () => {
        if (selectedTables.length === allTables.length) {
            setSelectedTables([]);
        } else {
            setSelectedTables(allTables.map((table) => table.name));
        }
    };

    const clickApplyBtn = () => {
        const cohortData = {
            cohort_id,
            schemaName,
            schemaDescription,
            selectedTables,
            selectedFiles,
        };

        mutate(cohortData); // 한 번에 객체로 전달
    };

    useEffect(() => {
        if (!isLoading && data) {
            const withId = data.tableInfo?.filter(
                (t) => tableMeta[t.name.toLowerCase()]?.hasPersonId
            );
            const withoutId = data.tableInfo?.filter(
                (t) => tableMeta[t.name.toLowerCase()]?.hasPersonId === false
            );
            const selectedTableNames = data.tableInfo?.filter((t) => t.checked).map((t) => t.name);

            if (data.schemaInfo) {
                setSchemaName(data.schemaInfo.name);
                setSchemaDescription(data.schemaInfo.description);
                setIsDisabledSchemaInfo(true);
            }

            if (data.irb_drb) {
                const filePromies = data.irb_drb.map((file) =>
                    fetchIrbDrbData(file.path, file.name)
                );

                Promise.all(filePromies).then((files) => {
                    setSelectedFiles(files);
                });
            }

            setWithPersonId(withId);
            setWithoutPersonId(withoutId);
            setAllTables([...withId, ...withoutId]);
            setSelectedTables(selectedTableNames);

            console.log(data);
        }
    }, [isLoading, data]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            (
            <div className="flex flex-col gap-10 max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
                <div className="flex flex-col gap-3 bg-white border border-gray-200 px-5 py-6 rounded-xl">
                    <h1 className="font-bold text-2xl">{data.cohortInfo.name}</h1>
                    <span>{data.cohortInfo.description}</span>
                    <div className="flex gap-5">
                        <span>작성자: {data.cohortInfo.author}</span>
                        <span>
                            생성일:{' '}
                            {format(new Date(data.cohortInfo.createdDate), 'yyyy-MM-dd hh:mm')}
                        </span>
                        <span>
                            수정일:{' '}
                            {format(new Date(data.cohortInfo.modifiedDate), 'yyyy-MM-dd hh:mm')}
                        </span>
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
                                    {withPersonId.length}개)
                                </span>
                            </div>
                        </div>
                        <button
                            className="font-medium text-sm bg-transparent border border-gray-300 px-4 py-3 rounded-lg text-blue-700 hover:bg-blue-100 transition duration-200 ease-in-out"
                            onClick={handleSelectWithPersonIdTableAll}
                        >
                            {selectedTables.filter((name) =>
                                withPersonId.map((table) => table.name).includes(name)
                            ).length === withPersonId.length
                                ? '전체 해제'
                                : '전체 선택'}
                        </button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-4 py-5">
                        {withPersonId.map((table) => (
                            <CheckboxCard
                                key={table.name}
                                table={table}
                                isSelected={selectedTables.includes(table.name)}
                                onClick={() => handleCheckboxChange(table.name)}
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
                                    {withoutPersonId.length}개)
                                </span>
                            </div>
                        </div>
                        <button
                            className="font-medium text-sm bg-transparent border border-gray-300 px-4 py-3 rounded-lg text-emerald-700 hover:bg-emerald-100 transition duration-200 ease-in-out"
                            onClick={handleSelectWithOutPersoIdTableAll}
                        >
                            {selectedTables.filter((name) =>
                                withoutPersonId.map((table) => table.name).includes(name)
                            ).length === withoutPersonId.length
                                ? '전체 해제'
                                : '전체 선택'}
                        </button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-4 py-5">
                        {withoutPersonId.map((table) => (
                            <CheckboxCard
                                key={table.name}
                                table={table}
                                isSelected={selectedTables.includes(table.name)}
                                onClick={() => handleCheckboxChange(table.name)}
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
                            disabled={isDisabledSchemaInfo}
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
                            disabled={isDisabledSchemaInfo}
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-5 bg-white border border-gray-200 px-5 py-6 rounded-xl">
                    <div>
                        <h1 className="text-2xl font-black font-normal">IRB/DRB 승인서 업로드</h1>
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
            )
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
