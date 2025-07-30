import { useEffect } from 'react';
import { GoDatabase } from 'react-icons/go';
import { MdContentCopy } from 'react-icons/md';
import { toast } from 'react-toastify';

const TOAST_ID = 'clipboard-toast';

const generatePythonCode = (app) => {
    return `# ${app.cohortName} 데이터 접속 예시 코드
import psycopg2
import pandas as pd

# 데이터베이스 연결 정보
connection_params = {
    'host': '${app.connectInfo.host}',
    'port': '${app.connectInfo.port}',
    'database': '${app.connectInfo.database}',
    'user': '${app.connectInfo.username}',
    'password': '${app.connectInfo.password}'
}

# 데이터베이스 연결
conn = psycopg2.connect(**connection_params)

# 승인된 테이블 조회 예시
schema_name = '${app.connectInfo.schema}'

# PERSON 테이블 조회
person_query = f"""
SELECT person_id, gender_concept_id, year_of_birth, race_concept_id
FROM {schema_name}.person 
LIMIT 100
"""
person_df = pd.read_sql(person_query, conn)

# CONDITION_OCCURRENCE 테이블 조회 (예시)
condition_query = f"""
SELECT person_id, condition_concept_id, condition_start_date, condition_end_date
FROM {schema_name}.condition_occurrence 
WHERE condition_start_date >= '2023-01-01'
LIMIT 100
"""
condition_df = pd.read_sql(condition_query, conn)

# 연결 종료
conn.close()

print(f"PERSON 테이블 레코드 수: {len(person_df)}")
print(f"CONDITION_OCCURRENCE 테이블 레코드 수: {len(condition_df)}")
`;
};

const generateSQLCode = (app) => {
    return `-- ${app.cohortName} 데이터 접속 SQL 예시
-- 스키마: ${app.connectInfo.schema}

-- 승인된 테이블 목록 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = '${app.connectInfo.schema}';

-- PERSON 테이블 기본 통계
SELECT 
    COUNT(*) as total_patients,
    COUNT(DISTINCT gender_concept_id) as gender_types,
    MIN(year_of_birth) as min_birth_year,
    MAX(year_of_birth) as max_birth_year
FROM ${app.connectInfo.schema}.person;

-- 조건별 환자 수 (CONDITION_OCCURRENCE 테이블)
SELECT 
    condition_concept_id,
    COUNT(DISTINCT person_id) as patient_count,
    COUNT(*) as total_occurrences
FROM ${app.connectInfo.schema}.condition_occurrence
GROUP BY condition_concept_id
ORDER BY patient_count DESC
LIMIT 10;

-- 연도별 방문 현황 (VISIT_OCCURRENCE 테이블)
SELECT 
    EXTRACT(YEAR FROM visit_start_date) as visit_year,
    COUNT(DISTINCT person_id) as unique_patients,
    COUNT(*) as total_visits
FROM ${app.connectInfo.schema}.visit_occurrence
GROUP BY EXTRACT(YEAR FROM visit_start_date)
ORDER BY visit_year;
`;
};

export default function ConnectionInfoModal({ isModalOpen, setIsModalOpen, app }) {
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        if (!toast.isActive(TOAST_ID)) {
            toast(`클립보드에 복사되었습니다!`, {
                toastId: TOAST_ID,
                className:
                    'flex items-center bg-gray-100 text-gray-800 font-medium rounded-md shadow-sm',
                bodyClassName: 'text-sm whitespace-nowrap max-w-full',
            });
        }
    };

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
                    <div className="bg-white rounded-lg shadow-lg max-w-4xl max-h-[80vh] overflow-y-auto w-full p-6">
                        <div className="flex items-center text-gray-900 gap-2">
                            <GoDatabase className="h-5 w-5" />
                            <h2 className="text-lg font-semibold">
                                {app.cohortName} - 데이터 접속 정보
                            </h2>
                        </div>
                        <p className="text-gray-600 mb-5">
                            승인된 스키마에 접속하기 위한 정보와 예시 코드입니다.
                        </p>
                        <h2 className="text-gray-900 font-bold text-lg">데이터베이스 연결 정보</h2>
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-5">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">호스트:</span>
                                <div className="flex items-center gap-2">
                                    <div className="bg-white px-2 py-1 rounded">
                                        {app.connectInfo.host}
                                    </div>
                                    <button onClick={() => copyToClipboard(app.connectInfo.host)}>
                                        <MdContentCopy className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">포트:</span>
                                <div className="flex items-center gap-2">
                                    <div className="bg-white px-2 py-1 rounded">
                                        {app.connectInfo.port}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">데이터베이스:</span>
                                <div className="flex items-center gap-2">
                                    <div className="bg-white px-2 py-1 rounded">
                                        {app.connectInfo.database}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">스키마:</span>
                                <div className="flex items-center gap-2">
                                    <div className="bg-white px-2 py-1 rounded">
                                        {app.connectInfo.schema}
                                    </div>
                                    <button onClick={() => copyToClipboard(app.connectInfo.schema)}>
                                        <MdContentCopy className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">사용자명:</span>
                                <div className="flex items-center gap-2">
                                    <div className="bg-white px-2 py-1 rounded">
                                        {app.connectInfo.username}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(app.connectInfo.username)}
                                    >
                                        <MdContentCopy className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">비밀번호:</span>
                                <div className="flex items-center gap-2">
                                    <div className="bg-white px-2 py-1 rounded">
                                        {app.connectInfo.password}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(app.connectInfo.password)}
                                    >
                                        <MdContentCopy className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <h2 className="text-gray-900 font-bold text-lg">Python 접속 예시 코드</h2>
                        <div className="relative mb-3">
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                                <code>{generatePythonCode(app)}</code>
                            </pre>
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                                onClick={() => copyToClipboard(generatePythonCode(app))}
                            >
                                <MdContentCopy className="h-4 w-4" />
                            </button>
                        </div>
                        <h2 className="text-gray-900 font-bold text-lg">SQL 쿼리 예시</h2>
                        <div className="relative">
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                                <code>{generateSQLCode(app)}</code>
                            </pre>
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                                onClick={() => copyToClipboard(generateSQLCode(app))}
                            >
                                <MdContentCopy className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="mt-4 flex justify-end gap-2 font-bold text-xm">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-black text-white rounded hover:bg-black/70"
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
