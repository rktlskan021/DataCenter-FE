import { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useStructs } from '../hooks/queries/useStructs';
import useAuthStore from '../stores/useAuthStore';
import { FaRegEye } from 'react-icons/fa6';
import Pagination from '../components/Pagination';
import InputBox from '../components/InputBox';
import SchemaDetailModal from '../components/modals/SchemaDetailModal';
import SchemaApplyModal from '../components/modals/SchemaApplyModal';
import LoadingSpinner from '../components/LoadingSpinner';

const filters = [
    { id: 1, name: 'Schema name', value: 'schema_name' },
    { id: 2, name: 'Description', value: 'schema_description' },
    { id: 3, name: 'Creator', value: 'creator_name' },
];

export default function StructuredRequest() {
    const { data, isLoading, refetch } = useStructs();

    // 상태 선언
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [purpose, setPurpose] = useState('');
    const [selectedSchema, setSelectedSchema] = useState(null);
    const [filterType, setFilterType] = useState('all'); // all | my
    const [searchTerm, setSearchTerm] = useState('');
    const [selected, setSelected] = useState(filters[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentCohorts, setCurrentCohorts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    const itemsPerPage = 5;
    const { id } = useAuthStore();

    useEffect(() => {
        if (isLoading) return;
        const filtered = data
            .filter((c) => (filterType === 'my' ? c.creator_name === id : true))
            .filter((c) => {
                const target = c[selected.value]?.toLowerCase?.();
                return target?.includes(searchTerm.toLowerCase());
            });

        const total = Math.ceil(filtered.length / itemsPerPage);
        const paginated = filtered.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

        // 검색/필터링 결과가 현재 페이지보다 작아지면 페이지를 조정합니다.
        if (currentPage > total && total > 0) {
            setCurrentPage(total);
        }
        console.log(paginated);
        setCurrentCohorts(paginated);
        setTotalPages(total);
    }, [filterType, searchTerm, selected, currentPage, id, isLoading, data]);

    const handleChangeFilter = (type) => {
        if (type !== filterType) {
            setFilterType(type);
            setCurrentPage(1);
        }
    };

    return (
        <div className="flex flex-col gap-10 max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
            <div>
                <h1 className="font-bold text-4xl mb-5">Structured Data Application</h1>
                <p className="text-xl">
                    You can apply for permission to use the requestred structured data.
                </p>
            </div>
            <div className="flex gap-5">
                <div className="flex font-bold jusfify-between items-center">
                    <button
                        className={`flex items-center gap-2 px-3 py-2 rounded-l-lg transition duration-200 ease-in-out ${
                            filterType === 'all'
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        onClick={() => handleChangeFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`flex items-center gap-2 rounded-r-lg px-3 py-2 transition duration-200 ease-in-out ${
                            filterType === 'my'
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        onClick={() => handleChangeFilter('my')}
                    >
                        My
                    </button>
                </div>
            </div>
            <InputBox
                selected={selected}
                setSelected={setSelected}
                searchTerm={searchTerm}
                placeholder={'Search by schema name or description...'}
                setSearchTerm={setSearchTerm}
                filters={filters}
            />

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <h1 className="font-bold text-xl border-b border-gray-200 px-6 py-4">
                    Schema List
                </h1>
                <table className="w-full table-fixed divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-[20%]">
                                Schema Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-[30%]">
                                description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-[10%]">
                                creator
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-[10%]">
                                number of patients
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-[10%]">
                                number of tables
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-[23%]">
                                action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCohorts.length > 0 ? (
                            currentCohorts.map((schema) => (
                                <tr key={schema.id} className="border-b border-gray-200">
                                    <td className="px-6 py-4 text-sm text-gray-800 font-semibold">
                                        {schema.schema_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 truncate">
                                        {schema.schema_description}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        <div className="flex items-center gap-2">
                                            <FaUser />
                                            <span>{schema.creator_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {schema.patient_count}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {schema.tables?.length} tables
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex gap-2">
                                            <button
                                                className="text-nowrap gap-1 border border-gray-200 text-gray-800 py-1.5 px-2 rounded-lg flex justify-center items-center hover:bg-gray-100 transition duration-200 ease-in-out"
                                                onClick={() => {
                                                    setIsModalOpen(true);
                                                    setSelectedSchema(schema);
                                                }}
                                            >
                                                <FaRegEye className="w-4 h-4" />
                                                View
                                            </button>
                                            <button
                                                className="text-nowrap bg-blue-600 py-1.5 px-2 text-white rounded-lg flex justify-center items-center hover:bg-blue-700 transition duration-200 ease-in-out"
                                                onClick={() => {
                                                    setIsApplyModalOpen(true);
                                                    setSelectedSchema(schema);
                                                }}
                                            >
                                                Request
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 py-4">
                                    No search results.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            </div>
            <SchemaDetailModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                schema={selectedSchema}
            />
            <SchemaApplyModal
                isModalOpen={isApplyModalOpen}
                setIsModalOpen={setIsApplyModalOpen}
                schema={selectedSchema}
                purpose={purpose}
                setPurpose={setPurpose}
                refetch={refetch}
            />
        </div>
    );
}
