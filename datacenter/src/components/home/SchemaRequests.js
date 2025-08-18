import { useState, useEffect } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';
import { format } from 'date-fns';
import { BiSolidEdit } from 'react-icons/bi';
import { AiFillExclamationCircle } from 'react-icons/ai';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { GoClock } from 'react-icons/go';
import { useApplies } from '../../hooks/queries/useUsers';
import { useNavigate } from 'react-router-dom';
import RejectionModal from '../../components/modals/RejectionModal';
import ConnectionInfoModal from '../../components/modals/ConnectionInfoModal';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function SchemaRequests({ setApprovedAppLength, setPendingAppLength }) {
    const [selectFilterCohort, setSelectFilterCohort] = useState(0);
    const [approvedApplications, setApprovedApplications] = useState([]);
    const [pendingApplications, setPendingApplications] = useState([]);
    const [selectApp, setSelectApp] = useState(null);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [isConnectionInfoModalOpen, setIsConnectionInfoModalOpen] = useState(false);

    const { data, isLoading } = useApplies();

    const navigator = useNavigate();

    useEffect(() => {
        if (!isLoading && data) {
            setApprovedApplications(
                data
                    .filter((app) => app.status === 'approved')
                    .sort((a, b) => {
                        return new Date(b.appliedDate) - new Date(a.appliedDate);
                    })
            );
            setApprovedAppLength(approvedApplications.length);
            setPendingApplications(
                data
                    .filter((app) => app.status !== 'approved')
                    .sort((a, b) => {
                        return new Date(b.appliedDate) - new Date(a.appliedDate);
                    })
            );
            setPendingAppLength(pendingApplications.length);
        }
    }, [isLoading, data]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="flex flex-col gap-3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div>
                <h1 className="font-bold text-2xl text-gray-900">스키마 신청 현황</h1>
                <span className="text-sm font-regular">
                    신청한 스키마의 승인 상태와 접근 정보를 확인할 수 있습니다.
                </span>
            </div>
            <div className="grid w-full grid-cols-2 bg-gray-100 py-1">
                <div
                    className={`flex items-center justify-center gap-2 py-2 ml-1 rounded transition-all duration-200 cursor-pointer ${selectFilterCohort === 0 ? 'bg-white text-gray-900' : 'bg-transparent text-gray-600'}`}
                    onClick={() => setSelectFilterCohort(0)}
                >
                    <IoMdCheckmarkCircleOutline className="h-5 w-5" />
                    <span className="font-bold">승인된 스키마 ({approvedApplications.length})</span>
                </div>
                <div
                    className={`flex items-center justify-center gap-2 py-2 mr-1 rounded transition-all duration-200 cursor-pointer ${selectFilterCohort === 1 ? 'bg-white text-gray-900' : 'bg-transparent text-gray-600'}`}
                    onClick={() => setSelectFilterCohort(1)}
                >
                    <GoClock className="h-5 w-5" />
                    <span className="font-bold ">
                        대기중/반려된 스키마 ({pendingApplications.length})
                    </span>
                </div>
            </div>
            {selectFilterCohort === 0 ? (
                approvedApplications.length === 0 ? (
                    <div className="text-center py-12">
                        <IoMdCheckmarkCircleOutline className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            승인된 스키마가 없습니다
                        </h3>
                        <p className="text-gray-500">스키마 신청 후 승인되면 여기에 표시됩니다.</p>
                    </div>
                ) : (
                    approvedApplications.map((app, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col gap-2 border border-emerald-200 bg-emerald-50/30 rounded-lg p-6 text-gray-900"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    {!app.isSynced && (
                                        <div className="relative group flex items-center">
                                            <AiFillExclamationCircle
                                                className="text-red-500"
                                                size={20}
                                            />

                                            <div
                                                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                                                            bg-gray-800 text-white text-xs rounded px-2 py-1 
                                                            opacity-0 group-hover:opacity-100 
                                                            scale-95 group-hover:scale-100 
                                                            transition-all duration-200 
                                                            pointer-events-none z-10 whitespace-nowrap"
                                            >
                                                동기화가 필요합니다
                                            </div>
                                        </div>
                                    )}
                                    <h1 className="text-lg font-semibold">{app.schemaInfo.name}</h1>
                                    <div className="flex gap-1 font-bold text-emerald-900 items-center px-2 rounded-xl bg-emerald-100">
                                        <IoMdCheckmarkCircleOutline />
                                        <span className="text-xs">승인됨</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="flex justify-center items-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-gray-900 font-bold text-sm px-2 py-2 transition-all duration-200"
                                        onClick={() => {
                                            navigator(`/structured/${app.id}`);
                                        }}
                                    >
                                        <BiSolidEdit size={20} />
                                        <span>수정</span>
                                    </button>
                                    <button
                                        className="flex gap-3 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-gray-900 font-bold text-sm px-2 py-2 transition-all duration-200"
                                        onClick={() => {
                                            setSelectApp(app);
                                            setIsConnectionInfoModalOpen(true);
                                        }}
                                    >
                                        <span>{'< >'}</span>
                                        <span>접속 정보</span>
                                    </button>
                                </div>
                            </div>
                            <span className="text-sm">{app.schemaInfo.description}</span>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">코호트 이름:</span>
                                    <span className="ml-2 font-medium">{app.name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">코호트 타입:</span>
                                    <span className="ml-2 font-medium">{app.origin}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">신청일:</span>
                                    <span className="ml-2 font-medium">
                                        {format(new Date(app.appliedDate), 'yyyy-MM-dd hh:mm')}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">승인일:</span>
                                    <span className="ml-2 font-medium">
                                        {format(new Date(app.appliedDate), 'yyyy-MM-dd hh:mm')}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">선택 테이블:</span>
                                    <span className="ml-2 font-medium">
                                        {app.tables.filter((table) => table.checked).length}개
                                    </span>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">승인된 테이블:</span>
                                <div className="flex flex-wrap gap-1">
                                    {app.tables
                                        .filter((table) => table.checked)
                                        .map((table, idx) => (
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
                )
            ) : pendingApplications.length === 0 ? (
                <div className="text-center py-12">
                    <IoMdCheckmarkCircleOutline className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        신청된 스키마가 없습니다
                    </h3>
                    <p className="text-gray-500">스키마 신청 후 여기에 표시됩니다.</p>
                </div>
            ) : (
                pendingApplications.map((app) => (
                    <div
                        key={app.id}
                        className={`flex flex-col gap-2 border rounded-lg p-6 text-gray-900 ${app.status === 'rejected' ? 'border-red-200 bg-red-50/30' : 'border-blue-200 bg-blue-50/30'}`}
                    >
                        <div className="relative flex items-center justify-between">
                            <div className="flex gap-2">
                                <h1 className="text-lg font-semibold">{app.schemaInfo.name}</h1>
                                <div
                                    className={`flex gap-1 font-bold items-center px-2 rounded-xl ${app.status === 'rejected' ? 'text-red-900 bg-red-100' : 'text-blue-900 bg-blue-100'}`}
                                >
                                    {app.status === 'rejected' ? <FaRegTimesCircle /> : <GoClock />}
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
                        <span className="text-sm">{app.schemaInfo.description}</span>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">코호트 이름:</span>
                                <span className="ml-2 font-medium">{app.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">코호트 타입:</span>
                                <span className="ml-2 font-medium">{app.origin}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">신청일:</span>
                                <span className="ml-2 font-medium">
                                    {format(new Date(app.appliedDate), 'yyyy-MM-dd hh:mm')}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">검토일:</span>
                                <span className="ml-2 font-medium">
                                    {app.resolvedDate
                                        ? format(new Date(app.resolvedDate), 'yyyy-MM-dd hh:mm')
                                        : ''}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">선택 테이블:</span>
                                <span className="ml-2 font-medium">
                                    {app.tables.filter((table) => table.checked).length}개
                                </span>
                            </div>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">승인된 테이블:</span>
                            <div className="flex flex-wrap gap-1">
                                {app.tables
                                    .filter((table) => table.checked)
                                    .map((table, idx) => (
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
    );
}
