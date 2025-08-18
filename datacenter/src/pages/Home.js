import { useState } from 'react';
import useAuthStore from '../stores/useAuthStore';
import { LuUser } from 'react-icons/lu';

import SchemaRequests from '../components/home/SchemaRequests';
import UnstructuredData from '../components/home/UnstructuredData';

export default function Home() {
    const [approvedAppLength, setApprovedAppLength] = useState();
    const [pendingAppLength, setPendingAppLength] = useState();
    const [activeTab, setActiveTab] = useState('cohort-requests');

    const { id, name } = useAuthStore();

    return (
        <div className="min-h-screen">
            <div className="flex flex-col gap-10 max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
                <div className="flex gap-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="w-16 h-16 rounded-full bg-cyan-600 flex items-center justify-center shadow-sm border border-gray-200">
                        <span className="text-xl font-bold text-white">{name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                        <div className="flex items-center gap-2 text-gray-900">
                            <LuUser className="h-4 w-4" />
                            <span className="text-sm font-regular bg-gray-100 px-2 py-1 rounded">
                                {id}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-emerald-600">
                                {approvedAppLength}
                            </div>
                            <div className="text-gray-600">승인된 스키마</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">
                                {pendingAppLength}
                            </div>
                            <div className="text-gray-600">대기중 신청</div>
                        </div>
                    </div>
                </div>
                {/* Tab Navigation */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('cohort-requests')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'cohort-requests'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                스키마 신청 관리
                            </button>
                            <button
                                onClick={() => setActiveTab('schema-requests')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'schema-requests'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                스키마 권한 요청
                            </button>
                            <button
                                onClick={() => setActiveTab('unstructured-data')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'unstructured-data'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                비정형 데이터 신청
                            </button>
                        </nav>
                    </div>
                </div>
                {activeTab === 'cohort-requests' && (
                    <SchemaRequests
                        setApprovedAppLength={setApprovedAppLength}
                        setPendingAppLength={setPendingAppLength}
                    />
                )}

                {activeTab === 'unstructured-data' && (
                    <UnstructuredData
                        setApprovedAppLength={setApprovedAppLength}
                        setPendingAppLength={setPendingAppLength}
                    />
                )}
            </div>
        </div>
    );
}
