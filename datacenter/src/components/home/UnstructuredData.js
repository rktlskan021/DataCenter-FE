import { useEffect, useState } from 'react';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { GoClock } from 'react-icons/go';
import { FiDownload } from 'react-icons/fi';
import { format } from 'date-fns';
import { FaRegTimesCircle } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';
import RejectionModal from '../modals/RejectionModal';
import { useUnstructApplies } from '../../hooks/queries/useUsers';

export default function UnstructuredData({ setApprovedAppLength, setPendingAppLength }) {
    const [selectFilterCohort, setSelectFilterCohort] = useState(0);
    const [selectApp, setSelectApp] = useState(null);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [approvedApplications, setApprovedApplications] = useState([]);
    const [pendingApplications, setPendingApplications] = useState([]);

    const { data, isLoading } = useUnstructApplies();

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

    return (
        <div className="flex flex-col gap-3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div>
                <h1 className="font-bold text-2xl text-gray-900">비정형 데이터 신청 현황</h1>
                <span className="text-sm font-regular">
                    신청한 비정형 데이터의 승인 상태와 접근 정보를 확인할 수 있습니다.
                </span>
            </div>
            <div className="grid w-full grid-cols-2 bg-gray-100 py-1">
                <div
                    className={`flex items-center justify-center gap-2 py-2 ml-1 rounded transition-all duration-200 cursor-pointer ${selectFilterCohort === 0 ? 'bg-white text-gray-900' : 'bg-transparent text-gray-600'}`}
                    onClick={() => setSelectFilterCohort(0)}
                >
                    <IoMdCheckmarkCircleOutline className="h-5 w-5" />
                    <span className="font-bold">
                        승인된 비정형 데이터 ({approvedApplications.length})
                    </span>
                </div>
                <div
                    className={`flex items-center justify-center gap-2 py-2 mr-1 rounded transition-all duration-200 cursor-pointer ${selectFilterCohort === 1 ? 'bg-white text-gray-900' : 'bg-transparent text-gray-600'}`}
                    onClick={() => setSelectFilterCohort(1)}
                >
                    <GoClock className="h-5 w-5" />
                    <span className="font-bold ">
                        대기중/반려된 비정형 데이터 ({pendingApplications.length})
                    </span>
                </div>
            </div>
            {selectFilterCohort === 0 &&
                (approvedApplications.length === 0 ? (
                    <div className="text-center py-12">
                        <IoMdCheckmarkCircleOutline className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            승인된 비정형 데이터가 없습니다
                        </h3>
                        <p className="text-gray-500">
                            비정형 데이터 신청 후 승인되면 여기에 표시됩니다.
                        </p>
                    </div>
                ) : (
                    approvedApplications.map((app, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col gap-2 border border-emerald-200 bg-emerald-50/30 rounded-lg p-6 text-gray-900"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    <h1 className="text-lg font-semibold">{app.name}</h1>
                                    <div className="flex gap-1 font-bold text-purple-900 items-center px-2 rounded-xl bg-purple-100">
                                        <span className="text-xs">
                                            {app.unstructType?.mainType}
                                        </span>
                                    </div>
                                    {app.unstructType?.subTypes?.map((sub) => (
                                        <div className="flex gap-1 font-bold text-neutral-900 items-center px-2 rounded-xl bg-neutral-100">
                                            <span className="text-xs">{sub}</span>
                                        </div>
                                    ))}

                                    <div className="flex gap-1 font-bold text-emerald-900 items-center px-2 rounded-xl bg-emerald-100">
                                        <IoMdCheckmarkCircleOutline />
                                        <span className="text-xs">승인됨</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="flex items-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-gray-900 font-bold text-sm px-3 py-2 transition-all duration-200"
                                        onClick={() => {
                                            setSelectApp(app);
                                            // setIsConnectionInfoModalOpen(true);
                                        }}
                                    >
                                        <FiDownload className="text-xl" />
                                        <span>API 접근</span>
                                    </button>
                                </div>
                            </div>
                            <span className="text-sm">{app.description}</span>
                            <div className="grid grid-cols-5 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">총 파일 수:</span>
                                    <span className="ml-2 font-medium">
                                        {/* {app.statistics.totalFiles} */}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">환자 수:</span>
                                    <span className="ml-2 font-medium">
                                        {/* {app.statistics.patients} */}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">총 크기:</span>
                                    <span className="ml-2 font-medium">
                                        {/* {app.statistics.totalSize} */}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">평균 크기:</span>
                                    <span className="ml-2 font-medium">
                                        {/* {app.statistics.avgFileSize} */}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">데이터 수집 기간:</span>
                                    <span className="ml-2 font-medium">
                                        {/* {app.statistics.dateRange} */}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-5 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">신청일:</span>
                                    <span className="ml-2 font-medium">
                                        {format(new Date(app.appliedDate), 'yyyy-MM-dd hh:mm')}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">승인일:</span>
                                    <span className="ml-2 font-medium">
                                        {format(new Date(app.resolvedDate), 'yyyy-MM-dd hh:mm')}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">만료일:</span>
                                    <span className="ml-2 font-medium">
                                        {/* {format(
                                            new Date(app.apiInfo.expiryDate),
                                            'yyyy-MM-dd hh:mm'
                                        )} */}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ))}
            {selectFilterCohort === 1 &&
                (pendingApplications.length === 0 ? (
                    <div className="text-center py-12">
                        <IoMdCheckmarkCircleOutline className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            신청된 비정형 데이터가 없습니다
                        </h3>
                        <p className="text-gray-500">비정형 데이터 신청 후 여기에 표시됩니다.</p>
                    </div>
                ) : (
                    pendingApplications.map((app, idx) => (
                        <div
                            key={idx}
                            className={`flex flex-col gap-2 border rounded-lg p-6 text-gray-900 ${app.status === 'rejected' ? 'border-red-200 bg-red-50/30' : 'border-blue-200 bg-blue-50/30'}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    <h1 className="text-lg font-semibold">{app.name}</h1>
                                    <div className="flex gap-1 font-bold text-purple-900 items-center px-2 rounded-xl bg-purple-100">
                                        <span className="text-xs">
                                            {app.unstructType?.mainType}
                                        </span>
                                    </div>
                                    {app.unstructType?.subTypes?.map((sub) => (
                                        <div className="flex gap-1 font-bold text-neutral-900 items-center px-2 rounded-xl bg-neutral-100">
                                            <span className="text-xs">{sub}</span>
                                        </div>
                                    ))}
                                    <div
                                        className={`flex gap-1 font-bold items-center px-2 rounded-xl ${app.status === 'rejected' ? 'text-red-900 bg-red-100' : 'text-blue-900 bg-blue-100'}`}
                                    >
                                        {app.status === 'rejected' ? (
                                            <FaRegTimesCircle />
                                        ) : (
                                            <GoClock />
                                        )}
                                        <span className="text-xs">
                                            {app.status === 'rejected' ? '반려됨' : '대기중'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {app.status === 'rejected' && (
                                        <button
                                            className="flex items-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-gray-900 font-bold text-sm px-3 py-2 transition-all duration-200"
                                            onClick={() => {
                                                setSelectApp(app);
                                                setIsRejectionModalOpen(true);
                                            }}
                                        >
                                            <IoEyeOutline className="h-4 w-4" />
                                            <span>반려 사유</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <span className="text-sm">{app.description}</span>
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
                                            : '-'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ))}
            <RejectionModal
                isModalOpen={isRejectionModalOpen}
                setIsModalOpen={setIsRejectionModalOpen}
                app={selectApp}
            />
        </div>
    );
}
