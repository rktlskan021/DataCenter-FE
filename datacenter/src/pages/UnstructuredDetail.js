import { useState, useRef, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';
import { useCohortDetail, useApplyCohort } from '../hooks/queries/useCohorts';
import { FaRegFileAlt } from 'react-icons/fa';
import { CiWavePulse1 } from 'react-icons/ci';
import { FiImage } from 'react-icons/fi';
import { VscGraph } from 'react-icons/vsc';
import { LuDna } from 'react-icons/lu';
import { format } from 'date-fns';
import { MdOutlineFileUpload } from 'react-icons/md';
import { FiInfo } from 'react-icons/fi';
import { BsCheck2Circle } from 'react-icons/bs';
import InfoModal from '../components/modals/InfoModal';
import FileUploadModal from '../components/modals/FileUploadModal';
import { IoSettingsOutline } from 'react-icons/io5';
import { TiPlus } from 'react-icons/ti';
import PeriodBox from '../components/unstructured/PeriodBox';

// 비정형 데이터 타입 정의
const dataTypes = [
    {
        id: 'biosignal',
        name: '생체신호',
        description: '심전도, 근전도 등 생체에서 발생하는 전기적 신호 데이터',
        icon: CiWavePulse1,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        subtypes: [
            { id: 'ecg', name: 'ECG (심전도)', description: '심장의 전기적 활동을 측정한 데이터' },
            { id: 'emg', name: 'EMG (근전도)', description: '근육의 전기적 활동을 측정한 데이터' },
            { id: 'eeg', name: 'EEG (뇌전도)', description: '뇌의 전기적 활동을 측정한 데이터' },
        ],
    },
    {
        id: 'image',
        name: '이미지',
        description: 'CT, MRI, X-ray 등 의료 영상 데이터',
        icon: FiImage,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        subtypes: [
            { id: 'ct', name: 'CT', description: '컴퓨터 단층촬영 영상 데이터' },
            { id: 'mri', name: 'MRI', description: '자기공명영상 데이터' },
            { id: 'xray', name: 'X-ray', description: 'X선 촬영 영상 데이터' },
            { id: 'ultrasound', name: '초음파', description: '초음파 영상 데이터' },
        ],
    },
    {
        id: 'genomic',
        name: '유전체',
        description: 'WES, RNA-seq 등 유전체 분석 데이터',
        icon: LuDna,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        subtypes: [
            { id: 'wes', name: 'WES', description: '전체 엑솜 시퀀싱 데이터' },
            { id: 'wgs', name: 'WGS', description: '전체 게놈 시퀀싱 데이터' },
            { id: 'rnaseq', name: 'RNA-seq', description: 'RNA 시퀀싱 데이터' },
        ],
    },
];

function useOutsideClose(onClose) {
    const ref = useRef(null);
    useEffect(() => {
        const onDown = (e) => {
            if (!ref.current) return;
            if (!ref.current.contains(e.target)) onClose();
        };
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [onClose]);
    return ref;
}

export default function UnStructuredDetail() {
    const [selectDataType, setSelectDataType] = useState(null);
    const [selectSubType, setSelectSubType] = useState([]);
    const [requestReason, setRequestReason] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isFileUploadOpen, setFileUploadOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [period, setPeriod] = useState([]);
    const [dateRanges, setDateRanges] = useState([
        {
            id: '1',
            startDate: undefined,
            endDate: undefined,
            operator: 'AND',
        },
    ]);

    const popoverRef = useOutsideClose(() => setOpen(false));

    const cohort_id = useParams().id;

    const canSubmitRequest =
        selectDataType &&
        selectSubType.length > 0 &&
        selectedFiles.length > 0 &&
        requestReason.trim();
    const { data, isLoading } = useCohortDetail(cohort_id);

    const onApply = () => {
        setPeriod(dateRanges);
        console.log('적용:', period);
        setOpen(false);
    };

    const addDateRange = () => {
        const newRange = {
            id: Date.now().toString(),
            startDate: undefined,
            endDate: undefined,
        };
        setDateRanges([...dateRanges, newRange]);
    };

    const removeDateRange = (id) => {
        if (dateRanges.length > 1) {
            setDateRanges(dateRanges.filter((range) => range.id !== id));
        }
    };

    const updateDateRange = (id, field, value) => {
        setDateRanges(
            dateRanges.map((range) => (range.id === id ? { ...range, [field]: value } : range))
        );
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <div className="flex flex-col gap-10 max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
                <div className="flex flex-col gap-3 bg-white border border-gray-200 px-5 py-6 rounded-xl">
                    <h1 className="font-bold text-2xl">{data.name}</h1>
                    <span>{data.description}</span>
                    <div className="flex gap-5">
                        <span>작성자: {data.creator}</span>
                        <span>
                            생성일: {format(new Date(data.createdDate), 'yyyy-MM-dd hh:mm')}
                        </span>
                        <span>
                            수정일: {format(new Date(data.modifiedDate), 'yyyy-MM-dd hh:mm')}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col bg-white border border-purple-200 bg-purple-50/30 rounded-xl">
                    <div className="flex items-center justify-between bg-purple-50 border-b px-5 py-6 border-purple-200">
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                <FaRegFileAlt className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg text-purple-900 font-bold">
                                    비정형 데이터 타입 선택
                                </h1>
                                <span className="text-purple-700 font-medium">
                                    요청할 비정형 데이터의 타입을 선택해주세요.
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 mx-5 p-3">
                        {dataTypes.map((dataType) => {
                            const Icon = dataType.icon;
                            return (
                                <div
                                    key={dataType.id}
                                    className={`flex-1 border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                                        selectDataType?.id === dataType.id
                                            ? `border-gray-400 ${dataType.bgColor} shadow-md`
                                            : 'border-gray-300 hover:border-gray-400 hover:shadow-sm bg-white'
                                    }`}
                                    onClick={() => {
                                        setSelectDataType(dataType);
                                    }}
                                >
                                    <div className="text-center">
                                        <div
                                            className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${dataType.bgColor} mb-3`}
                                        >
                                            <Icon className={`h-6 w-6 ${dataType.color}`} />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            {dataType.name}
                                        </h3>
                                        <p className="text-xs text-gray-600">
                                            {dataType.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {selectDataType && (
                    <div className="flex flex-col border border-blue-200 bg-blue-50/30 rounded-xl">
                        <div className="flex items-center justify-between bg-blue-50 border-b px-5 py-6 border-blue-200">
                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <FiImage className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg text-blue-900 font-bold">
                                        구체적인 데이터 종류 선택
                                    </h1>
                                    <span className="text-blue-700 font-medium">
                                        이미지 데이터 중에서 필요한 종류를 선택해주세요
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 p-4 bg-">
                            {selectDataType.subtypes.map((subType) => (
                                <button
                                    key={subType.id}
                                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                                        selectSubType.includes(subType.id)
                                            ? 'border-blue-600 bg-blue-50 shadow-md'
                                            : 'border-gray-300 hover:border-blue-400 hover:shadow-sm bg-white'
                                    }`}
                                    onClick={() => {
                                        if (selectSubType.includes(subType.id)) {
                                            const tmp = selectSubType.filter(
                                                (e) => e !== subType.id
                                            );
                                            setSelectSubType(tmp);
                                        } else {
                                            setSelectSubType((prev) => [...prev, subType.id]);
                                        }
                                    }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-2">
                                                {subType.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {subType.description}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {selectSubType.length > 0 && (
                    <div className="flex flex-col border border-green-200 bg-green-50/30 rounded-xl">
                        <div className="flex items-center justify-between bg-green-50 border-b px-5 py-6 border-green-200">
                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                    <VscGraph className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg text-green-900 font-bold">
                                        데이터 통계
                                    </h1>
                                    <span className="text-green-700 font-medium">
                                        선택한 조건에 해당하는 데이터의 통계 정보입니다
                                    </span>
                                </div>
                            </div>
                            <div className="relative">
                                {/* 트리거 버튼 */}
                                <button
                                    type="button"
                                    onClick={() => setOpen((v) => !v)}
                                    aria-haspopup="dialog"
                                    aria-expanded={open}
                                    className="flex gap-4 items-center justify-center justify-self-end border border-emerald-200 bg-white rounded-lg px-2 py-2 transition duration-200 ease-in-out hover:bg-neutral-100"
                                >
                                    <IoSettingsOutline size={17} />
                                    <span className="font-medium text-sm">수집 기간 설정</span>
                                </button>

                                {/* Popover */}
                                {open && (
                                    <div
                                        ref={popoverRef}
                                        className="absolute z-50 mt-2 right-0 w-96 rounded-xl border border-gray-200 bg-white shadow-xl"
                                    >
                                        {/* 화살표 */}
                                        <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 bg-white border-t border-l border-gray-200" />

                                        <div className="p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-semibold">수집 기간</h3>
                                                <button
                                                    className="flex items-center justify-center gap-2 rounded-lg border border-neutral-300 px-2 py-1 transition duration-200 ease-in-out hover:bg-neutral-100"
                                                    onClick={addDateRange}
                                                >
                                                    <TiPlus />
                                                    <span className="font-medium text-xs">
                                                        기간 추가
                                                    </span>
                                                </button>
                                            </div>

                                            {dateRanges.map((range, index) => (
                                                <PeriodBox
                                                    range={range}
                                                    index={index}
                                                    length={dateRanges.length}
                                                    removeDateRange={removeDateRange}
                                                    updateDateRange={updateDateRange}
                                                />
                                            ))}

                                            <div className="flex justify-end gap-2 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpen(false)}
                                                    className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
                                                >
                                                    취소
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={onApply}
                                                    className="px-3 py-2 text-sm rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                                                >
                                                    적용
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-around text-center pt-6 pb-6">
                            <div>
                                <p className="font-bold text-blue-600 text-4xl">441</p>
                                <p className="font-medium text-gray-500">총 파일 수</p>
                            </div>
                            <div>
                                <p className="font-bold text-green-600 text-4xl">352</p>
                                <p className="font-medium text-gray-500">대상 환자 수</p>
                            </div>
                            <div>
                                <p className="font-bold text-purple-600 text-4xl">220.5GB</p>
                                <p className="font-medium text-gray-500">총 데이터 크기</p>
                            </div>
                            <div>
                                <p className="font-bold text-red-600 text-4xl">512MB</p>
                                <p className="font-medium text-gray-500">평균 파일 크기</p>
                            </div>
                        </div>

                        <div className="border-t border-green-200 mx-5 py-6">
                            <div className="text-sm text-green-800">
                                <strong>데이터 수집 기간 :</strong>{' '}
                                {period
                                    .map((date) => {
                                        return `${date.startDate} ~ ${date.endDate}`;
                                    })
                                    .join(' or ')}
                            </div>
                        </div>
                    </div>
                )}
                {selectDataType && selectSubType.length > 0 && (
                    <div className="flex flex-col gap-5 bg-white border border-gray-200 px-5 py-6 rounded-xl">
                        <div>
                            <h1 className="text-2xl font-black font-normal">
                                IRB/DRB 승인서 업로드
                            </h1>
                            <span className="font-normal text-gray-700">
                                데이터 접근 권한 신청을 위해 IRB/DRB 승인서를 업로드하세요
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <button
                                className="flex gap-3 items-center border border-gray-300 rounded px-4 py-2 hover:bg-gray-100"
                                onClick={() => setFileUploadOpen(true)}
                            >
                                <MdOutlineFileUpload className="h-6 w-6" />
                                <span className="font-bold text-xs">파일 업로드</span>
                            </button>
                            {selectedFiles.length > 0 ? (
                                <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                                    <BsCheck2Circle className="h-4 w-4" />
                                    <span>
                                        {selectedFiles[0].name} 업로드 완료
                                        {selectedFiles.length !== 1
                                            ? ` (외 ${selectedFiles.length - 1}건)`
                                            : null}
                                    </span>
                                    <button
                                        onClick={() => setIsInfoModalOpen(true)}
                                        className="text-gray-500 hover:text-gray-700"
                                        aria-label="전체 파일 보기"
                                    >
                                        <FiInfo className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}
                {selectDataType && selectSubType.length > 0 && (
                    <div className="px-5 py-6 bg-white rounded-xl">
                        <div className="mb-8">
                            <p className="font-bold text-gray-900 text-2xl">신청 사유</p>
                            <p className="font-normal text-gray-500 text-base">
                                비정형 데이터 신청 사유와 사용 목적을 상세히 작성해주세요
                            </p>
                        </div>
                        <textarea
                            value={requestReason}
                            onChange={(e) => setRequestReason(e.target.value)}
                            placeholder="예: 심전도 데이터를 활용해 부정맥 예측 모델 개발을 위해 해당 데이터가 필요합니다."
                            className="w-full min-h-[120px] p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                )}
                <div className="flex flex-col gap-2 items-end">
                    {selectedFiles.length ? null : (
                        <div className="flex items-center gap-2 text-sm text-amber-600">
                            <FiInfo className="h-4 w-4" />
                            <span>모든 항목을 선택하고 신청 사유를 작성해주세요</span>
                        </div>
                    )}
                    <button
                        disabled={!canSubmitRequest}
                        className={`px-8 bg-blue-600 text-white rounded py-3 font-bold ${
                            !canSubmitRequest
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-blue-700'
                        }`}
                    >
                        비정형 데이터 접근 신청
                    </button>
                </div>
            </div>
            {isInfoModalOpen && (
                <InfoModal
                    isModalOpen={isInfoModalOpen}
                    setIsModalOpen={setIsInfoModalOpen}
                    files={selectedFiles}
                />
            )}
            {isFileUploadOpen && (
                <FileUploadModal
                    isOpen={isFileUploadOpen}
                    setIsOpen={setFileUploadOpen}
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                />
            )}
        </>
    );
}
