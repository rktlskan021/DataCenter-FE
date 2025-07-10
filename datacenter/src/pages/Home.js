import { useState, Fragment, useEffect } from 'react';
import { FaSearch, FaUser, FaChevronDown, FaRegCalendarAlt } from 'react-icons/fa';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Transition,
} from '@headlessui/react';
import { fetchAtlasCohorts } from '../api/fetchAtlasCohorts';
import { fetchBentoCohorts } from '../api/fetchBentoCohorts';

// import atlasLogo from '../assets/imgs/atlas_logo.png';
// import bentoLogo from '../assets/imgs/bento_logo.svg';

const filters = [
    { id: 1, name: '코호트 이름', value: 'name' },
    { id: 2, name: '설명', value: 'description' },
    { id: 3, name: '작성자', value: 'author' },
];

export default function Home() {
    const [cohortType, setCohortType] = useState('atlas');
    const [searchTerm, setSearchTerm] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [selected, setSelected] = useState(filters[0]);
    const [cohorts, setCohorts] = useState([]);
    const [bentoCohorts, setBentoCohorts] = useState([]);
    const [atlasCohorts, setAtlasCohorts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentCohorts, setCurrentCohorts] = useState([]);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchAtlasCohorts().then((data) => {
            setCohorts(data);
            setAtlasCohorts(data);
        });

        fetchBentoCohorts().then((data) => setBentoCohorts(data));
    }, []);

    useEffect(() => {
        const newTotalPages = Math.ceil(cohorts.length / itemsPerPage);
        setTotalPages(newTotalPages);
        setCurrentCohorts(
            cohorts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        );
    }, [cohorts, currentPage, itemsPerPage]);

    useEffect(() => {
        const filtered = cohorts.filter((cohort) => {
            const field = selected.value;
            const value = cohort[field]?.toString().toLowerCase();
            return value.includes(searchTerm.toLowerCase());
        });

        const newTotalPages = Math.ceil(filtered.length / itemsPerPage);
        setTotalPages(newTotalPages);
        setCurrentCohorts(
            filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        );
    }, [cohorts, currentPage, selected, searchTerm, itemsPerPage]);

    function clickToggle(e) {
        if (e === cohortType) return;

        setCohortType(e);
        if (e === 'atlas') setCohorts(atlasCohorts);
        else setCohorts(bentoCohorts);
        setCurrentPage(1); // 페이지도 처음으로 돌려야 안전해
    }

    return (
        <div className="flex flex-col gap-10 max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
            <div>
                <h1 className="font-bold text-4xl mb-5">코호트 리스트</h1>
                <p className="text-xl">코호트 사용 권한을 신청할 수 있습니다.</p>
            </div>
            <div className="flex font-bold jusfify-between items-center">
                <button
                    className={`flex items-center gap-2 rounded-l-lg px-3 py-2 transition duration-200 ease-in-out ${
                        cohortType === 'atlas'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    onClick={() => clickToggle('atlas')}
                >
                    Atlas
                </button>
                <button
                    className={`flex items-center gap-2 rounded-r-lg px-3 py-2 transition duration-200 ease-in-out ${
                        cohortType === 'bento'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    onClick={() => clickToggle('bento')}
                >
                    Bento
                </button>
                <div className="text-sm text-gray-600 ml-10">
                    {cohortType === 'atlas' ? 'ATLAS 기반 코호트' : 'BENTO 기반 코호트'}
                </div>
            </div>

            <div className="flex jusfify-between items-center gap-5 bg-gray-150 shadow-sm border border-gray-200 p-6">
                {/* 검색창 */}
                <div
                    className={`flex border rounded-md w-full h-[42px] items-center py-2 px-5 transition duration-300 bg-gray-50 ${
                        isInputFocused ? 'border-blue-500' : 'border-gray-200'
                    }`}
                >
                    <FaSearch />
                    <input
                        placeholder={`${cohortType.toUpperCase()} 코호트 이름 또는 설명으로 검색...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        className="pl-5 bg-transparent focus:outline-none w-full"
                    />
                </div>

                {/* 유저 아이콘 + Select Box */}
                <Listbox value={selected} onChange={setSelected}>
                    <div className="relative">
                        <ListboxButton className="relative w-[150px] h-[42px] cursor-default rounded-md bg-gray-50 border border-gray-200 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:border-blue-500 text-sm">
                            <div className="flex items-center gap-2">
                                <FaUser />
                                <span className="block truncate">{selected.name}</span>
                            </div>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <FaChevronDown className="h-4 w-4 text-gray-400" />
                            </span>
                        </ListboxButton>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-32 overflow-auto rounded-md bg-gray-50 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filters.map((filter) => (
                                    <ListboxOption
                                        key={filter.id}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                                                active
                                                    ? 'bg-blue-100 text-blue-900'
                                                    : 'text-gray-900'
                                            }`
                                        }
                                        value={filter}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${
                                                        selected ? 'font-medium' : 'font-normal'
                                                    }`}
                                                >
                                                    {filter.name}
                                                </span>
                                                {selected ? (
                                                    <span className="absolute inset-y-0 right-2 flex items-center pl-2 text-blue-600">
                                                        ✔
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </Transition>
                    </div>
                </Listbox>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <h1 className="font-bold text-xl border-b border-gray-200 px-6 py-4">
                    {cohortType === 'atlas' ? 'ATLAS' : 'Bento'} 코호트 목록
                </h1>
                <table className="w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                코호트 이름
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                설명
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                환자 수
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                작성자
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                생성일
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                수정일
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCohorts.length > 0 ? (
                            currentCohorts.map((cohort) => (
                                <tr
                                    key={cohort.id}
                                    className="hover:bg-gray-50 cursor-pointer border-b border-gray-200"
                                >
                                    <td className="px-6 py-4 text-sm text-gray-800 font-semibold">
                                        {cohort.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 line-clamp-2">
                                        {cohort.description}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {cohort.patientCount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                        <div className="flex items-center gap-2">
                                            <FaUser />
                                            <span>{cohort.author}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <FaRegCalendarAlt />
                                            <span>{cohort.createdDate}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <FaRegCalendarAlt />
                                            <span>{cohort.modifiedDate}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 py-4">
                                    검색 결과가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {/* ✅ 페이지네이션 버튼 */}
                <div className="flex justify-center items-center gap-2 py-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        disabled={currentPage === 1}
                    >
                        이전
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        return (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 border rounded-md ${
                                    page === currentPage
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        disabled={currentPage === totalPages}
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
}
