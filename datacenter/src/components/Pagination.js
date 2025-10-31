/**
 * 재사용 가능한 페이지네이션 컴포넌트 (Tailwind CSS 스타일링)
 * * @param {number} currentPage - 현재 페이지 번호
 * @param {number} totalPages - 총 페이지 수
 * @param {function} setCurrentPage - 현재 페이지를 설정하는 함수
 */
export default function Pagination({ currentPage, totalPages, setCurrentPage }) {
    // 총 페이지가 1개 이하일 경우 페이지네이션을 표시할 필요가 없습니다.
    if (totalPages <= 1) {
        return null;
    }

    // 이전 페이지로 이동
    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    // 다음 페이지로 이동
    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    // 💡 화면에 보여줄 페이지 버튼의 최대 개수를 제한할 수 있습니다.
    // 여기서는 간단하게 전체 버튼을 모두 렌더링합니다.
    const pageNumbers = [...Array(totalPages)].map((_, index) => index + 1);

    return (
        // ✅ 페이지네이션 버튼 UI
        <div className="flex justify-center items-center gap-2 py-4">
            {/* 이전 버튼 */}
            <button
                onClick={handlePrev}
                className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition duration-150"
                disabled={currentPage === 1}
            >
                prev
            </button>

            {/* 페이지 번호 버튼 */}
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded-md transition duration-150 ${
                        page === currentPage
                            ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                    }`}
                >
                    {page}
                </button>
            ))}

            {/* 다음 버튼 */}
            <button
                onClick={handleNext}
                className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition duration-150"
                disabled={currentPage === totalPages}
            >
                next
            </button>
        </div>
    );
}
