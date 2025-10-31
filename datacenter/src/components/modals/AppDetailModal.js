import { useEffect } from 'react';
import { FaFileAlt, FaTimes } from 'react-icons/fa';
import { IoMdDownload } from 'react-icons/io';
import { format } from 'date-fns';

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
                            <h1 className="font-bold text-xl">Application Details</h1>
                            <span className="text-gray-700">
                                {application?.accessId
                                    ? `This is the schema access request submitted by ${application.applicant}.`
                                    : `This is the data access request submitted by ${application.creator}.`}
                            </span>
                        </div>

                        <div>
                            <h1 className="font-bold text-lg">Application Information</h1>
                            <span className="text-gray-700">
                                Name :{' '}
                                {application?.accessId
                                    ? application.applicant
                                    : application.creator}
                            </span>
                        </div>

                        <div>
                            {application.applicant ? (
                                <>
                                    <h1 className="font-bold text-lg">Schema Infomation</h1>
                                    <p className="text-gray-700">
                                        Name : {application?.schemaInfo?.name}
                                    </p>
                                    <p className="text-gray-700">
                                        Creator : {application?.creator}
                                    </p>
                                    <p className="text-gray-700">
                                        Approval Date :{' '}
                                        {format(
                                            new Date(application?.appliedDate),
                                            'yyyy-MM-dd HH:mm'
                                        )}
                                    </p>
                                    <p className="text-gray-700">
                                        Description : {application?.schemaInfo?.description}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h1 className="font-bold text-lg">Cohort Information</h1>
                                    <span className="text-gray-700">Name : {application.name}</span>
                                </>
                            )}
                        </div>

                        <div>
                            <h1 className="font-bold text-lg">
                                Selected Tables ({application.tables.length})
                            </h1>
                            <div className="flex flex-wrap gap-1">
                                {application.tables.map((table, idx) => (
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
                            <h1 className="font-bold text-lg">IRB/DRB File</h1>
                            <div className="flex flex-col gap-2">
                                {application.files.map((file, idx) => (
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
                        {application.accessId && (
                            <div>
                                <h1 className="font-bold text-lg">Reason for application</h1>
                                <p className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                    {application.purpose}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
