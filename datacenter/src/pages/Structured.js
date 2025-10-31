import { useState, Fragment, useEffect } from 'react';
import { FaUser, FaRegCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { fetchBentoCohorts } from '../api/fetchBentoCohorts';
import useAuthStore from '../stores/useAuthStore';
import { useCohorts } from '../hooks/queries/useCohorts';
import { format } from 'date-fns';
import InputBox from '../components/InputBox';
import Pagination from '../components/Pagination';

const filters = [
    { id: 1, name: 'Cohort name', value: 'name' },
    { id: 2, name: 'Description', value: 'description' },
    { id: 3, name: 'Creator', value: 'author' },
];

export default function Structured() {
    // fetch atlas & bento data
    // const [atlasCohorts, setAtlasCohorts] = useState([]);
    const { data: atlasCohorts, isLoading } = useCohorts();
    const [bentoCohorts, setBentoCohorts] = useState([]);

    // 상태 선언
    const [cohortType, setCohortType] = useState('atlas');
    const [filterType, setFilterType] = useState('all'); // all | my
    const [searchTerm, setSearchTerm] = useState('');
    const [selected, setSelected] = useState(filters[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentCohorts, setCurrentCohorts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    const itemsPerPage = 10;
    const { id } = useAuthStore();
    const navigator = useNavigate();

    useEffect(() => {
        fetchBentoCohorts().then(setBentoCohorts);
    }, []);

    useEffect(() => {
        if (isLoading) return;
        const base =
            cohortType === 'atlas'
                ? atlasCohorts.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
                : bentoCohorts;

        const filtered = base
            .filter((c) => (filterType === 'my' ? c.creator === id : true))
            .filter((c) => {
                const target = c[selected.value]?.toLowerCase?.();
                return target?.includes(searchTerm.toLowerCase());
            });

        const total = Math.ceil(filtered.length / itemsPerPage);
        const paginated = filtered.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

        setCurrentCohorts(paginated);
        setTotalPages(total);
    }, [
        cohortType,
        filterType,
        searchTerm,
        selected,
        currentPage,
        atlasCohorts,
        bentoCohorts,
        id,
        isLoading,
    ]);

    const handleChangeType = (type) => {
        if (type !== cohortType) {
            setCohortType(type);
            setCurrentPage(1);
        }
    };

    const handleChangeFilter = (type) => {
        if (type !== filterType) {
            setFilterType(type);
            setCurrentPage(1);
        }
    };

    return (
        <div className="flex flex-col gap-10 max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
            <div>
                <h1 className="font-bold text-4xl mb-5">Apply for new structured data</h1>
                <p className="text-xl">
                    You can apply to use structured data for the created cohort.
                </p>
            </div>
            <div className="flex gap-5">
                <div className="flex font-bold jusfify-between items-center">
                    <button
                        className={`flex items-center gap-2 rounded-l-lg px-3 py-2 transition duration-200 ease-in-out ${
                            cohortType === 'atlas'
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        onClick={() => handleChangeType('atlas')}
                    >
                        Atlas
                    </button>
                    <button
                        className={`flex items-center gap-2 px-3 py-2 rounded-r-lg transition duration-200 ease-in-out ${
                            cohortType === 'bento'
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        onClick={() => handleChangeType('bento')}
                    >
                        Bento
                    </button>
                </div>
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
                cohortType={cohortType}
                placeholder={'Search by cohort name or description...'}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filters={filters}
            />

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <h1 className="font-bold text-xl border-b border-gray-200 px-6 py-4">
                    {cohortType === 'atlas' ? 'ATLAS ' : 'Bento '}
                    Cohort List
                </h1>
                <table className="w-full table-fixed divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-[20%]">
                                Cohort name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-[30%]">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-[10%]">
                                Number of patients
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-[10%]">
                                Creator
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-[15%]">
                                Creation date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-[15%]">
                                Modification date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCohorts.length > 0 ? (
                            currentCohorts.map((cohort) => (
                                <tr
                                    key={cohort.id}
                                    className="hover:bg-gray-50 cursor-pointer border-b border-gray-200"
                                    onClick={() => navigator(`/structured/${cohort.id}`)}
                                >
                                    <td className="px-6 py-4 text-sm text-gray-800 font-semibold">
                                        {cohort.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 truncate">
                                        {cohort.description}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {cohort.patientCount}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        <div className="flex items-center gap-2">
                                            <FaUser />
                                            <span>{cohort.creator}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FaRegCalendarAlt />
                                            <span>
                                                {format(
                                                    new Date(cohort.createdDate),
                                                    'yyyy-MM-dd hh:mm'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FaRegCalendarAlt />
                                            <span>
                                                {cohort.modifiedDate
                                                    ? format(
                                                          new Date(cohort.modifiedDate),
                                                          'yyyy-MM-dd hh:mm'
                                                      )
                                                    : '-'}
                                            </span>
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
        </div>
    );
}
