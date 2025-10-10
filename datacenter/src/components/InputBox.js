import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Transition,
} from '@headlessui/react';
import { Fragment, useState } from 'react';
import { FaSearch, FaUser, FaChevronDown } from 'react-icons/fa';

export default function InputBox({
    selected,
    setSelected,
    cohortType,
    searchTerm,
    setSearchTerm,
    filters,
}) {
    const [isInputFocused, setIsInputFocused] = useState(false);
    return (
        <div className="flex jusfify-between items-center gap-5 bg-white shadow-sm border border-gray-200 p-6 rounded-lg">
            {/* 검색창 */}
            <div
                className={`flex border rounded-md w-full h-[42px] items-center py-2 px-5 transition duration-300 bg-white ${
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
                    <ListboxButton className="relative w-[150px] h-[42px] cursor-default rounded-md bg-white border border-gray-200 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:border-blue-500 text-sm">
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
                        <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-32 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filters.map((filter) => (
                                <ListboxOption
                                    key={filter.id}
                                    className={({ active }) =>
                                        `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                                            active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
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
    );
}
