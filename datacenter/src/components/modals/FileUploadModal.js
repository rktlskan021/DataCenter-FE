import { MdOutlineFileUpload } from 'react-icons/md';
import { BsCheck2Circle, BsTrash } from 'react-icons/bs';
import { useState } from 'react';

export default function FileUploadModal({ isOpen, setIsOpen, selectedFiles, setSelectedFiles }) {
    const [tmpFiles, setTmpFiles] = useState([]);

    const handleFiles = (files) => {
        const newFiles = Array.from(files);
        const updatedFiles = [...tmpFiles, ...newFiles];
        // 중복 제거 (파일명 기준으로)
        const uniqueFiles = updatedFiles.filter(
            (file, index, self) => index === self.findIndex((f) => f.name === file.name)
        );
        setTmpFiles(uniqueFiles);
    };

    const handleFileChange = (e) => {
        handleFiles(e.target.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleRemoveFile = (fileName) => {
        setSelectedFiles(selectedFiles.filter((file) => file.name !== fileName));
    };

    return (
        <div>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                        <h2 className="text-lg font-semibold text-gray-800">
                            IRB/DRB 승인서 업로드
                        </h2>
                        <p className="mb-4 font-normal text-gray-800 text-sm">
                            IRB/DRB 승인서 파일을 업로드하세요.
                        </p>
                        <div
                            className="flex flex-col items-center justify-center p-6 rounded-md border border-dashed border-gray-300 cursor-pointer hover:border-gray-600 transition"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <MdOutlineFileUpload className="w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-gray-700 font-medium mb-2">
                                파일을 여기로 드래그하거나 클릭하여 선택하세요
                            </p>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.zip,.hwp,.hwpx"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                                id="fileUpload"
                            />
                            <label
                                htmlFor="fileUpload"
                                className="inline-block px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                            >
                                파일 선택
                            </label>
                        </div>

                        {tmpFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <ul className="list-none pl-0 text-sm text-gray-700">
                                    {tmpFiles.map((file, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center justify-between gap-2 border p-2 rounded"
                                        >
                                            <div className="flex items-center gap-2">
                                                <BsCheck2Circle className="w-5 h-5 text-green-500" />
                                                <div>
                                                    <p className="font-medium">{file.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveFile(file.name)}
                                                className="text-gray-400 hover:text-gray-700"
                                            >
                                                <BsTrash className="w-5 h-5" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                닫기
                            </button>
                            <button
                                onClick={() => {
                                    alert('파일 업로드 완료!');
                                    setIsOpen(false);
                                    setSelectedFiles(tmpFiles);
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                업로드
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
