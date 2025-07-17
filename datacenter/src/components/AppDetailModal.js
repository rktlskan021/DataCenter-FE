import { useEffect } from 'react';
import { FaFileAlt, FaTimes } from 'react-icons/fa';

export default function AppDetailModal({ isModalOpen, setIsModalOpen, application }) {
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
        <div className="flex items-center gap-2 text-sm font-sans">
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative flex flex-col gap-3 bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                        {/* X 버튼 */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            aria-label="닫기"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>

                        <div>
                            <h1 className="font-bold text-xl">신청 상세 정보</h1>
                            <span className="text-gray-700">
                                {application.userName}님의 데이터 접근 권한 신청 내용입니다.
                            </span>
                        </div>

                        <div>
                            <h1 className="font-bold text-lg">신청자 정보</h1>
                            <span className="text-gray-700">이름 : {application.userName}</span>
                        </div>

                        <div>
                            <h1 className="font-bold text-lg">코호트 정보</h1>
                            <span className="text-gray-700">이름 : {application.cohortName}</span>
                        </div>

                        <div>
                            <h1 className="font-bold text-lg">
                                선택된 테이블 ({application.selectedTables.length})
                            </h1>
                            <div className="flex flex-wrap gap-1">
                                {application.selectedTables.map((table, idx) => (
                                    <div
                                        key={idx}
                                        className="font-bold text-center bg-gray-200 text-xs px-1.5 py-1 rounded-xl"
                                    >
                                        {table}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h1 className="font-bold text-lg">IRB/DRB 파일</h1>
                            {application.irbFiles.map((file, idx) => (
                                <div
                                    key={idx}
                                    className="flex gap-2 items-center bg-gray-100 px-2 py-1 rounded"
                                >
                                    <FaFileAlt className="w-4 h-4" />
                                    <div>
                                        <span className="font-medium">{file.name}</span>
                                        <br />
                                        <span className="text-gray-500">{file.size}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
