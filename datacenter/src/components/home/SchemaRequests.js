import { useState, useEffect } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';
import { format } from 'date-fns';
import { BiSolidEdit } from 'react-icons/bi';
import { AiFillExclamationCircle } from 'react-icons/ai';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { GoClock } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import RejectionModal from '../../components/modals/RejectionModal';
import ConnectionInfoModal from '../../components/modals/ConnectionInfoModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../Pagination';

export default function SchemaRequests({
    approvedApplications,
    pendingApplications,
    isLoading,
    // 💡 Home.js로부터 받은 새로운 Pagination Props
    approvedPagination,
    pendingPagination,
}) {
    const [selectFilterCohort, setSelectFilterCohort] = useState(0);
    const [selectApp, setSelectApp] = useState(null);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [isConnectionInfoModalOpen, setIsConnectionInfoModalOpen] = useState(false);

    const navigator = useNavigate();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="flex flex-col gap-3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div>
                <h1 className="font-bold text-2xl text-gray-900">Schema Applications Status</h1>
                <span className="text-sm font-regular">
                    You can check the approval status and access information of the applied schema.
                </span>
            </div>
            <div className="grid w-full grid-cols-2 bg-gray-100 py-1">
                <div
                    className={`flex items-center justify-center gap-2 py-2 ml-1 rounded transition-all duration-200 cursor-pointer ${selectFilterCohort === 0 ? 'bg-white text-gray-900' : 'bg-transparent text-gray-600'}`}
                    onClick={() => setSelectFilterCohort(0)}
                >
                    <IoMdCheckmarkCircleOutline className="h-5 w-5" />
                    <span className="font-bold">
                        Approved Schema ({approvedPagination.totalItems})
                    </span>{' '}
                    {/* 💡 totalItems 표시 */}
                </div>
                <div
                    className={`flex items-center justify-center gap-2 py-2 mr-1 rounded transition-all duration-200 cursor-pointer ${selectFilterCohort === 1 ? 'bg-white text-gray-900' : 'bg-transparent text-gray-600'}`}
                    onClick={() => setSelectFilterCohort(1)}
                >
                    <GoClock className="h-5 w-5" />
                    <span className="font-bold ">
                        Pending/Rejected Schema ({pendingPagination.totalItems}){' '}
                        {/* 💡 totalItems 표시 */}
                    </span>
                </div>
            </div>
            {/* ------------------- 승인된 스키마 목록 (selectFilterCohort === 0) ------------------- */}
            {selectFilterCohort === 0 ? (
                approvedApplications.length === 0 ? (
                    <div className="text-center py-12">
                        <IoMdCheckmarkCircleOutline className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data.</h3>
                        <p className="text-gray-500">
                            After applying for a schema, if it is approved, it will appear hear.
                        </p>
                    </div>
                ) : (
                    <>
                        {approvedApplications.map((app, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col gap-2 border border-emerald-200 bg-emerald-50/30 rounded-lg p-6 text-gray-900"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        {!app.isSynced && app.source === 'mine' && (
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
                                                    Needs synchronization
                                                </div>
                                            </div>
                                        )}
                                        <h1 className="text-lg font-semibold">
                                            {app.schemaInfo.name}
                                        </h1>
                                        <div className="flex gap-1 font-bold text-emerald-900 items-center px-2 rounded-xl bg-emerald-100">
                                            <span className="text-xs">
                                                {app.source === 'mine' ? 'Schema' : 'Permission'}
                                            </span>
                                        </div>
                                        <div className="flex gap-1 font-bold text-emerald-900 items-center px-2 rounded-xl bg-emerald-100">
                                            <IoMdCheckmarkCircleOutline />
                                            <span className="text-xs">Approved</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {app.source === 'mine' && (
                                            <button
                                                className="flex justify-center items-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-gray-900 font-bold text-sm px-2 py-2 transition-all duration-200"
                                                onClick={() => {
                                                    navigator(`/structured/modify/${app.id}`);
                                                }}
                                            >
                                                <BiSolidEdit size={20} />
                                                <span>Edit</span>
                                            </button>
                                        )}
                                        <button
                                            className="flex gap-3 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-gray-900 font-bold text-sm px-2 py-2 transition-all duration-200"
                                            onClick={() => {
                                                setSelectApp(app);
                                                setIsConnectionInfoModalOpen(true);
                                            }}
                                        >
                                            <span>{'< >'}</span>
                                            <span>Connection</span>
                                        </button>
                                    </div>
                                </div>
                                <span className="text-sm">{app.schemaInfo.description}</span>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Cohort Name:</span>
                                        <span className="ml-2 font-medium">{app.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Cohort Type:</span>
                                        <span className="ml-2 font-medium">{app.origin}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Application Date</span>
                                        <span className="ml-2 font-medium">
                                            {(() => {
                                                const dateString =
                                                    app.source === 'mine'
                                                        ? app.appliedDate
                                                        : app.accessAppliedAt;

                                                if (dateString && !isNaN(Date.parse(dateString))) {
                                                    return format(
                                                        new Date(dateString),
                                                        'yyyy-MM-dd hh:mm'
                                                    );
                                                }
                                                return '-';
                                            })()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Approval Date:</span>
                                        <span className="ml-2 font-medium">
                                            {(() => {
                                                const dateString =
                                                    app.source === 'mine'
                                                        ? app.resolvedDate
                                                        : app?.accessResolvedAt;

                                                if (dateString && !isNaN(Date.parse(dateString))) {
                                                    return format(
                                                        new Date(dateString),
                                                        'yyyy-MM-dd hh:mm'
                                                    );
                                                }
                                                return '-';
                                            })()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Selected Tables:</span>
                                        <span className="ml-2 font-medium">
                                            {app.tables.length} tables
                                        </span>
                                    </div>
                                </div>
                                <div className="flex">
                                    <span className="text-sm text-gray-500">Approved Tables:</span>
                                    <div className="ml-2 flex flex-wrap gap-1">
                                        {app.tables.map((table, idx) => (
                                            <div
                                                key={idx}
                                                className="font-bold text-center bg-gray-200 text-xs px-1.5 py-1 rounded-xl"
                                            >
                                                {table}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* 💡 승인된 목록 페이지네이션 */}
                        <Pagination {...approvedPagination} />
                    </>
                )
            ) : /* ------------------- 대기중/반려된 스키마 목록 (selectFilterCohort === 1) ------------------- */
            pendingApplications.length === 0 ? (
                <div className="text-center py-12">
                    <IoMdCheckmarkCircleOutline className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Data.</h3>
                    <p className="text-gray-500">If you apply for a schema, it will appear hear.</p>
                </div>
            ) : (
                <>
                    {pendingApplications.map((app) => (
                        <div
                            key={app.id}
                            className={`flex flex-col gap-2 border rounded-lg p-6 text-gray-900 ${app.status === 'rejected' || app.rejectReason !== null ? 'border-red-200 bg-red-50/30' : 'border-blue-200 bg-blue-50/30'}`}
                        >
                            <div className="relative flex items-center justify-between">
                                <div className="flex gap-2">
                                    <h1 className="text-lg font-semibold">{app.schemaInfo.name}</h1>
                                    <div className="flex gap-1 font-bold text-emerald-900 items-center px-2 rounded-xl bg-emerald-100">
                                        <span className="text-xs">
                                            {app.source === 'mine' ? 'Schema' : 'Permission'}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex gap-1 font-bold items-center px-2 rounded-xl ${app.status === 'rejected' ? 'text-red-900 bg-red-100' : 'text-blue-900 bg-blue-100'}`}
                                    >
                                        {app.status === 'rejected' || app.rejectReason !== null ? (
                                            <FaRegTimesCircle />
                                        ) : (
                                            <GoClock />
                                        )}
                                        <span className="text-xs">
                                            {app.status === 'rejected' || app.rejectReason !== null
                                                ? 'Rejected'
                                                : 'Pending'}
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
                                        <span>Reason for rejection</span>
                                    </button>
                                )}
                            </div>
                            <span className="text-sm">{app.schemaInfo.description}</span>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Cohort Name:</span>
                                    <span className="ml-2 font-medium">{app.name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Cohort Type:</span>
                                    <span className="ml-2 font-medium">{app.origin}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Application Date:</span>
                                    <span className="ml-2 font-medium">
                                        {format(new Date(app.appliedDate), 'yyyy-MM-dd hh:mm')}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Review Date:</span>
                                    <span className="ml-2 font-medium">
                                        {app.resolvedDate
                                            ? format(new Date(app.resolvedDate), 'yyyy-MM-dd hh:mm')
                                            : ''}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Selected Tables:</span>
                                    <span className="ml-2 font-medium">
                                        {app.tables.length} tables
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="whitespace-nowrap self-start text-sm text-gray-500 mr-1">
                                    Approved Tables:
                                </span>
                                <div className="flex flex-wrap gap-1">
                                    {app.tables.map((table, idx) => (
                                        <div
                                            key={idx}
                                            className="font-bold text-center bg-gray-200 text-xs px-1.5 py-1 rounded-xl"
                                        >
                                            {table}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* 💡 대기/반려 목록 페이지네이션 */}
                    <Pagination {...pendingPagination} />
                </>
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
