import { useEffect } from 'react';
import { FaFileAlt, FaTimes } from 'react-icons/fa';
import { IoMdDownload } from 'react-icons/io';
import { format } from 'date-fns';

export default function AppUnstructDetailModal({ isModalOpen, setIsModalOpen, application }) {
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
                            <h1 className="font-bold text-xl">비정형 데이터 신청 상세 정보</h1>
                            <span className="text-gray-700">
                                {application.creator}님의 데이터 접근 권한 신청 내용입니다.
                            </span>
                        </div>

                        <div>
                            <h1 className="font-bold text-lg">신청 정보</h1>
                            <div className="grid grid-cols-2 gap-2 text-gray-700 items-center justify-between">
                                <span>신청일 : {application.createdDate}</span>
                                <span>플랫폼 : {application.origin}</span>
                                <span>데이터 타입 : {application.unstructType.mainType}</span>
                                <span>데이터 종류 : {application.unstructType.subTypes}</span>
                            </div>
                        </div>

                        <div>
                            <h1 className="font-bold text-lg">코호트 정보</h1>
                            <span className="text-gray-900">{application.name}</span>
                            <span className="text-gray-700">{application.description}</span>
                        </div>

                        <div>
                            <h1 className="font-bold text-lg">데이터 수집 기간</h1>
                            <div>
                                {application.dateFilters
                                    .map((date) => {
                                        return `${format(new Date(date.startDate), 'yyyy-MM-dd hh:mm')} ~ ${format(new Date(date.endDate), 'yyyy-MM-dd hh:mm')}`;
                                    })
                                    .join(' or ')}
                            </div>
                        </div>

                        <div>
                            <h1 className="font-bold text-lg">IRB/DRB 파일</h1>
                            <div className="flex flex-col gap-2">
                                {application.irb_drb.map((file, idx) => (
                                    <div
                                        key={idx}
                                        className="flex gap-2 items-center bg-gray-100 px-2 py-1 rounded"
                                    >
                                        <FaFileAlt className="w-4 h-4" />
                                        <div>
                                            <p
                                                className="font-medium cursor-pointer underline underline-offset-1"
                                                onClick={() => {
                                                    const pdfFile = new File([file], 'sample.pdf', {
                                                        type: 'application/pdf',
                                                    });
                                                    const url = URL.createObjectURL(pdfFile);
                                                    window.open(url, '_blank');
                                                }}
                                            >
                                                {file.name}
                                            </p>
                                            <span className="text-gray-500">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                        </div>
                                        <IoMdDownload
                                            className="ml-auto cursor-pointer"
                                            size={20}
                                            onClick={() => {
                                                const url = URL.createObjectURL(file);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = file.name || 'download_file';
                                                document.body.appendChild(a);
                                                a.click();
                                                document.body.removeChild(a);
                                                URL.revokeObjectURL(url);
                                            }}
                                        />
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
