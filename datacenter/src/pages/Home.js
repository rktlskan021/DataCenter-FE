import { useState, Fragment } from 'react';
import { FaSearch, FaUser, FaChevronDown } from 'react-icons/fa';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Transition,
} from '@headlessui/react';

// import atlasLogo from '../assets/imgs/atlas_logo.png';
// import bentoLogo from '../assets/imgs/bento_logo.svg';

const filters = [
    { id: 1, name: '이름', value: 'name' },
    { id: 2, name: '설명', value: 'description' },
    { id: 3, name: '작성자', value: 'author' },
];

export default function Home() {
    const [cohortType, setCohortType] = useState('atlas');
    const [searchTerm, setSearchTerm] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [selected, setSelected] = useState(filters[0]);

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
                    onClick={() => {
                        setCohortType('atlas');
                    }}
                >
                    Atlas
                </button>
                <button
                    className={`flex items-center gap-2 rounded-r-lg px-3 py-2 transition duration-200 ease-in-out ${
                        cohortType === 'bento'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    onClick={() => {
                        setCohortType('bento');
                    }}
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
                    className={`flex border border-gray-50 rounded-md w-full items-center py-2 px-5 transition duration-300 bg-gray-50 ${
                        isInputFocused ? 'border-blue-500' : 'border-gray-100'
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
                        <ListboxButton className="relative w-32 cursor-default rounded-md bg-gray-50 border border-gray-50 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:border-blue-500 text-sm">
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
        </div>
    );
}
