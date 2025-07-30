import { useEffect } from 'react';

export default function InfoModal({ isModalOpen, setIsModalOpen, files }) {
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
                    <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            업로드된 파일 목록
                        </h2>
                        <ul className="space-y-2 text-gray-700 text-sm">
                            {files.map((file, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                    <span className="w-[80%] truncate">{file.name}</span>
                                    <span className="w-[20%] text-xs text-gray-500">
                                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-gray-400"
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
