import { useEffect } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function RejectionModal({ isModalOpen, setIsModalOpen, app }) {
    const navigate = useNavigate();

    const { t } = useTranslation();

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
                    <div className="space-y-2 bg-white rounded-lg shadow-lg max-w-xl w-full p-6">
                        <div className="flex items-center text-red-700 gap-2">
                            <FaRegTimesCircle className="h-5 w-5" />
                            <h2 className="text-lg font-semibold">
                                {t('home.schema_request.reject_modal.reason')}
                            </h2>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-800 text-justify">
                                {app.source === 'mine' ? app.review : app.rejectReason}
                            </p>
                        </div>
                        <div className="mt-4 flex justify-end gap-2 font-bold text-xm">
                            {app.source === 'mine' && (
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        navigate(`/structured/modify/${app.id}`);
                                    }}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded hover:bg-gray-100"
                                >
                                    {t('home.schema_request.reject_modal.re_apply')}
                                </button>
                            )}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-black text-white rounded hover:bg-black/70"
                            >
                                {t('home.schema_request.reject_modal.close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
