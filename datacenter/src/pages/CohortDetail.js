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
import { format } from 'date-fns';

export default function CohortDetail() {
    const [selectedTables, setSelectedTables] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isFileUploadOpen, setFileUploadOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [schemaName, setSchemaName] = useState('');
    const [schemaDescription, setSchemaDescription] = useState('');
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
            const withId = data.tableInfo?.filter((t) => !t?.isPersonIndependent);
            const withoutId = data.tableInfo?.filter((t) => t?.isPersonIndependent);

            setWithPersonId(withId);
            setWithoutPersonId(withoutId);
            setAllTables([...withId, ...withoutId]);
        }
    }, [isLoading, data]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <main className="min-h-[calc(100vh-60px)] bg-gradient-to-b from-blue-50 to-white">
            <section>
                <div className="mx-auto max-w-7xl py-8">
                    <h1 className="font-bold text-2xl">{data.name}</h1>
                    <span>{data.description}</span>
                    <div className="flex gap-5">
                        <span>Creator: {data.creator}</span>
                        <span>
                            Creation Date: {format(new Date(data.createdDate), 'yyyy-MM-dd hh:mm')}
                        </span>
                        <span>
                            Modification Date:{' '}
                            {data.modifiedData
                                ? format(new Date(data.modifiedDate), 'yyyy-MM-dd hh:mm')
                                : '-'}
                        </span>
                    </div>
                </div>
            </section>
            <section>
                <div className="mx-auto max-w-7xl pb-8">
                    <div className="flex items-center justify-between border-b px-5 py-6 border-blue-200">
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <LuUser className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg text-blue-900 font-bold">
                                    Patient Data Table
                                </h1>
                                <span className="text-blue-700 font-regular">
                                    Clinical data table by patient with person id (
                                    {withPersonId.length} tables)
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
                                ? 'Deselect All'
                                : 'Select all'}
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
                    <div className="p-3 bg-blue-100 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800 font-bold">
                            Selected Table: {countWithPersonIdTable} tables
                        </p>
                    </div>
                </div>
            </section>
            <section>
                <div className="mx-auto max-w-7xl py-8">
                    <div className="flex items-center justify-between border-b px-5 py-6 border-emerald-200">
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                                <LuUser className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg text-emerald-900 font-bold">
                                    Reference/Metadata Table
                                </h1>
                                <span className="text-emerald-700 font-regular">
                                    Reference tables including glossary, code mapping, system
                                    information, etc. ({withoutPersonId.length} tables)
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
                                ? 'Deselect All'
                                : 'Select all'}
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
                    <div className="p-3 bg-emerald-100 rounded-lg border border-emerald-200">
                        <p className="text-sm text-emerald-800 font-bold">
                            Selected Table: {countWithOutPersonIdTable} tables
                        </p>
                    </div>
                </div>
            </section>
            <section>
                <div className="mx-auto max-w-7xl flex justify-between items-center border border-gray-200 rounded-lg bg-white px-5 py-6 mb-5">
                    <div className="flex gap-5 font-bold">
                        <span className="text-gray-600">
                            All selected tables: {selectedTables.length} tables
                        </span>
                        <span className="text-blue-600">
                            Patient Tables: {countWithPersonIdTable} tables
                        </span>
                        <span className="text-emerald-600">
                            Reference Tables: {countWithOutPersonIdTable} tables
                        </span>
                    </div>
                    <button
                        className="font-medium text-sm bg-transparent border border-gray-300 px-4 py-2 rounded-lg text-gray-900 hover:bg-gray-100 transition duration-200 ease-in-out"
                        onClick={handleSelectAll}
                    >
                        {selectedTables.length === allTables.length ? 'Deselect All' : 'Select All'}
                    </button>
                </div>
            </section>
            <section>
                <div className="mx-auto max-w-7xl py-8 space-y-2 border border-gray-200 rounded-lg bg-white px-5 py-6 mb-5">
                    <div>
                        <h1 className="text-2xl font-black font-normal">Schema Infomation</h1>
                        <span className="font-normal text-gray-700">
                            Enter the name and description of the schema to be created.
                        </span>
                    </div>
                    <div>
                        <label
                            htmlFor="schemaName"
                            className="block text-sm font-medium text-gray-800 mb-2"
                        >
                            Schema name *
                        </label>
                        <input
                            id="schemaName"
                            type="text"
                            onChange={(e) => setSchemaName(e.target.value)}
                            value={schemaName}
                            placeholder="EX: diabetes_study_2024"
                            className="max-w-md w-full px-2 py-1.5 border border-gray-200 rounded"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Only letters (a-z, A-Z), numbers (0-9), and underscores (_) are allowed.
                            Must contain at least one letter.
                        </p>
                    </div>
                    <div>
                        <label
                            htmlFor="schemaName"
                            className="block text-sm font-medium text-gray-800 mb-2"
                        >
                            Schema description *
                        </label>
                        <textarea
                            id="schemaDescription"
                            type="text"
                            onChange={(e) => setSchemaDescription(e.target.value)}
                            value={schemaDescription}
                            placeholder="Please explain the purpose and use of this schema..."
                            className="max-w-2xl w-full px-2 py-1.5 border border-gray-200 rounded"
                            rows={3}
                            required
                        />
                    </div>
                </div>
            </section>
            <section>
                <div className="mx-auto max-w-7xl py-4 border border-gray-200 rounded-lg bg-white px-5 py-6 mb-5">
                    <div>
                        <h1 className="text-2xl font-black font-normal">
                            Upload IRB/DRB approval form
                        </h1>
                        <span className="font-normal text-gray-700">
                            Upload IRB/DRB approval to apply for data access.
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="flex gap-3 items-center border border-gray-300 rounded px-4 py-2 hover:bg-gray-100"
                            onClick={() => setFileUploadOpen(true)}
                        >
                            <MdOutlineFileUpload className="h-6 w-6" />
                            <span className="font-bold text-xs">File Upload</span>
                        </button>
                        {selectedFiles.length > 0 ? (
                            <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                                <BsCheck2Circle className="h-4 w-4" />
                                <span>
                                    {selectedFiles[0].name} upload completed
                                    {selectedFiles.length !== 1
                                        ? ` (and ${selectedFiles.length - 1} more file${selectedFiles.length - 1 !== 1 ? 's' : ''})`
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
            </section>
            <section>
                <div className="mx-auto max-w-7xl py-8">
                    <div className="flex flex-col items-end gap-2">
                        {selectedFiles.length ? null : (
                            <div className="flex items-center gap-2 text-sm text-amber-600">
                                <FiInfo className="h-4 w-4" />
                                <span>
                                    Please complete table selection and IRB/DRB file upload.
                                </span>
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
                            Application
                        </button>
                    </div>
                </div>
            </section>
            {isInfoModalOpen && (
                <InfoModal
                    isModalOpen={isInfoModalOpen}
                    setIsModalOpen={setIsInfoModalOpen}
                    files={selectedFiles}
                />
            )}
            {isFileUploadOpen && (
                <FileUploadModal
                    isOpen={isFileUploadOpen}
                    setIsOpen={setFileUploadOpen}
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                />
            )}
        </main>
    );

    return (
        <div>
            (
            <div className="flex flex-col gap-10 max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
                <div className="flex flex-col gap-3 bg-white border border-gray-200 px-5 py-6 rounded-xl">
                    <h1 className="font-bold text-2xl">{data.name}</h1>
                    <span>{data.description}</span>
                    <div className="flex gap-5">
                        <span>Creator: {data.creator}</span>
                        <span>
                            Creation Date: {format(new Date(data.createdDate), 'yyyy-MM-dd hh:mm')}
                        </span>
                        <span>
                            Modification Date:{' '}
                            {data.modifiedData
                                ? format(new Date(data.modifiedDate), 'yyyy-MM-dd hh:mm')
                                : '-'}
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
                                    Patient Data Table
                                </h1>
                                <span className="text-blue-700 font-regular">
                                    Clinical data table by patient with person id (
                                    {withPersonId.length} tables)
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
                                ? 'Deselect All'
                                : 'Select all'}
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
                            Selected Table: {countWithPersonIdTable} tables
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
                                    Reference/Metadata Table
                                </h1>
                                <span className="text-emerald-700 font-regular">
                                    Reference tables including glossary, code mapping, system
                                    information, etc. ({withoutPersonId.length} tables)
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
                                ? 'Deselect All'
                                : 'Select all'}
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
                            Selected Table: {countWithOutPersonIdTable} tables
                        </p>
                    </div>
                </div>
                <div className="flex items-center bg-white justify-between text-lg border border-gray-200 px-5 py-6 rounded-xl">
                    <div className="flex gap-5 font-bold">
                        <span className="text-gray-600">
                            All selected tables: {selectedTables.length} tables
                        </span>
                        <span className="text-blue-600">
                            Patient Tables: {countWithPersonIdTable} tables
                        </span>
                        <span className="text-emerald-600">
                            Reference Tables: {countWithOutPersonIdTable} tables
                        </span>
                    </div>
                    <button
                        className="font-medium text-sm bg-transparent border border-gray-300 px-4 py-2 rounded-lg text-gray-900 hover:bg-gray-100 transition duration-200 ease-in-out"
                        onClick={handleSelectAll}
                    >
                        {selectedTables.length === allTables.length ? 'Deselect All' : 'Select All'}
                    </button>
                </div>
                <div className="flex flex-col gap-5 bg-white border border-gray-200 px-5 py-6 rounded-xl">
                    <div>
                        <h1 className="text-2xl font-black font-normal">Schema Infomation</h1>
                        <span className="font-normal text-gray-700">
                            Enter the name and description of the schema to be created.
                        </span>
                    </div>
                    <div>
                        <label
                            htmlFor="schemaName"
                            className="block text-sm font-medium text-gray-800 mb-2"
                        >
                            Schema name *
                        </label>
                        <input
                            id="schemaName"
                            type="text"
                            onChange={(e) => setSchemaName(e.target.value)}
                            value={schemaName}
                            placeholder="EX: diabetes_study_2024"
                            className="max-w-md w-full px-2 py-1.5 border border-gray-200 rounded"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Only letters (a-z, A-Z), numbers (0-9), and underscores (_) are allowed.
                            Must contain at least one letter.
                        </p>
                    </div>
                    <div>
                        <label
                            htmlFor="schemaName"
                            className="block text-sm font-medium text-gray-800 mb-2"
                        >
                            Schema description *
                        </label>
                        <textarea
                            id="schemaDescription"
                            type="text"
                            onChange={(e) => setSchemaDescription(e.target.value)}
                            value={schemaDescription}
                            placeholder="Please explain the purpose and use of this schema..."
                            className="max-w-2xl w-full px-2 py-1.5 border border-gray-200 rounded"
                            rows={3}
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-5 bg-white border border-gray-200 px-5 py-6 rounded-xl">
                    <div>
                        <h1 className="text-2xl font-black font-normal">
                            Upload IRB/DRB approval form
                        </h1>
                        <span className="font-normal text-gray-700">
                            Upload IRB/DRB approval to apply for data access.
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="flex gap-3 items-center border border-gray-300 rounded px-4 py-2 hover:bg-gray-100"
                            onClick={() => setFileUploadOpen(true)}
                        >
                            <MdOutlineFileUpload className="h-6 w-6" />
                            <span className="font-bold text-xs">File Upload</span>
                        </button>
                        {selectedFiles.length > 0 ? (
                            <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                                <BsCheck2Circle className="h-4 w-4" />
                                <span>
                                    {selectedFiles[0].name} upload completed
                                    {selectedFiles.length !== 1
                                        ? ` (and ${selectedFiles.length - 1} more file${selectedFiles.length - 1 !== 1 ? 's' : ''})`
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
                            <span>Please complete table selection and IRB/DRB file upload.</span>
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
                        Application
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
            {isFileUploadOpen && (
                <FileUploadModal
                    isOpen={isFileUploadOpen}
                    setIsOpen={setFileUploadOpen}
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                />
            )}
        </div>
    );
}
