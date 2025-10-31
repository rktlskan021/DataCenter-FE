import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useApplySchema } from '../../hooks/queries/useStructs';
import { toast } from 'react-toastify';

export default function SchemaApplyModal({
    isModalOpen,
    setIsModalOpen,
    schema,
    purpose,
    setPurpose,
    refetch,
}) {
    const { mutate } = useApplySchema();

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setPurpose('');
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
                            <h1 className="font-bold text-lg">Request schema access permission</h1>
                            <span className="text-gray-700">
                                Requesting access to schema {schema.schema_name}.
                            </span>
                        </div>
                        <div>
                            <h1 className="text-gray-900">Perpose of application</h1>
                            <textarea
                                placeholder="Please enter your application purpose..."
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                className="mt-1 w-full h-20 border border-gray-300 p-2 rounded-lg min-h-[40px]"
                            />
                        </div>
                        <div className="flex gap-2 justify-end items-center font-bold">
                            <button
                                className="border border-gray-300 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
                                onClick={() => {
                                    setPurpose('');
                                    setIsModalOpen(false);
                                }}
                            >
                                Close
                            </button>
                            <button
                                className="text-white bg-blue-600 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-blue-700"
                                onClick={() => {
                                    if (purpose.length === 0) {
                                        toast(`신청 목적을 작성해주세요.`, {
                                            className:
                                                'border border-gray-200 bg-gray-100 text-gray-800 font-medium rounded-md shadow-sm',
                                            bodyClassName: 'text-sm whitespace-nowrap max-w-full',
                                        });
                                    } else {
                                        mutate({ schema_id: schema.schema_id, purpose: purpose });
                                        setPurpose('');
                                        setIsModalOpen(false);
                                        refetch();
                                    }
                                }}
                            >
                                Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
