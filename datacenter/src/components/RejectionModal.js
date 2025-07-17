import { useEffect } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';

export default function RejectionModal({ isModalOpen, setIsModalOpen, app }) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setIsModalOpen(false);
            }
        };

        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [setIsModalOpen]);
    return (
        <div className="flex items-center gap-2 text-sm">
            {/* 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6">
                        <div className="flex items-center text-red-700 gap-2">
                            <FaRegTimesCircle className="h-5 w-5" />
                            <h2 className="text-lg font-semibold">신청 반려 사유</h2>
                        </div>
                        <p className="text-gray-600 mb-5">
                            {app.cohortName} 신청이 반려된 사유입니다.
                        </p>
                        <h2 className="text-gray-900 font-bold text-lg">반려 사유</h2>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-800 text-justify">
                                {app.rejectionReason}
                            </p>
                        </div>
                        <div className="mt-4 flex justify-end gap-2 font-bold text-xm">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded hover:bg-gray-100"
                            >
                                수정 후 재신청
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-black text-white rounded hover:bg-black/70"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
