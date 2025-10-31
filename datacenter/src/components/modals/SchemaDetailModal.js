import { useEffect } from 'react';
import { FaFileAlt, FaTimes } from 'react-icons/fa';
import { IoMdDownload } from 'react-icons/io';
import { format } from 'date-fns';

export default function SchemaDetailModal({ isModalOpen, setIsModalOpen, schema }) {
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
                            <h1 className="font-bold text-xl">스키마 상세 정보</h1>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between bg-gray-100 rounded-lg px-2 py-2">
                                <span>이름 : </span>
                                <p className="text-black font-medium">{schema.schema_name}</p>
                            </div>
                            <div className="flex justify-between bg-gray-100 rounded-lg px-2 py-2">
                                <span>작성자 : </span>
                                <p className="text-black font-medium">{schema.creator_name}</p>
                            </div>
                            <div className="flex justify-between bg-gray-100 rounded-lg px-2 py-2">
                                <span>승인일 : </span>
                                <p className="text-black font-medium">
                                    {format(new Date(schema.resolved_at), 'yyyy-MM-dd hh:mm')}
                                </p>
                            </div>
                            <div className="flex justify-between bg-gray-100 rounded-lg px-2 py-2">
                                <span>환자수 : </span>
                                <p className="text-black font-medium">{schema.patient_count}</p>
                            </div>
                            <div className="bg-gray-100 rounded-lg px-2 py-2">
                                <span className="text-nowrap">설명 : </span>
                                <p className="text-black font-medium break-all">
                                    {schema.schema_description}
                                    sdkjfsdjfjdslkfjdlksjfkldsjflkdsjflksdlkfdskljksdjfldsjfkldsjklfjdsklfjdsklfjdsklfjdlskjf
                                </p>
                            </div>
                        </div>

                        <div>
                            <h1 className="font-bold text-lg">
                                선택된 테이블 ({schema.tables.length})
                            </h1>
                            <div className="flex flex-wrap gap-1">
                                {schema.tables.map((table, idx) => (
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
                </div>
            )}
        </div>
    );
}
