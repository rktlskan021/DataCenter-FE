import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function AppReviewModal({
    isModalOpen,
    setIsModalOpen,
    application,
    reviewComment,
    setReviewComment,
}) {
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
                            <h1 className="font-bold text-lg">신청 검토</h1>
                            <span className="text-gray-700">
                                {application.userName}님의 신청을 검토하고 승인 또는 거부하세요.
                            </span>
                        </div>
                        <div>
                            <h1 className="text-gray-900">검토 의견</h1>
                            <textarea
                                placeholder="검토 의견을 입력하세요..."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                className="mt-1 w-full h-20 border border-gray-300 p-2 rounded-lg min-h-[40px]"
                            />
                        </div>
                        <div className="flex gap-2 justify-end items-center font-bold">
                            <button className="border border-gray-300 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100">
                                취소
                            </button>
                            <button className="border border-gray-300 text-white bg-red-600 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-red-700">
                                거부
                            </button>
                            <button className="border border-gray-300 text-white bg-green-600 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-green-700">
                                승인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
