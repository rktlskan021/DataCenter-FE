export default function CheckboxCard({ table, isSelected, onClick, color }) {
    return (
        <div
            className={`flex gap-3 items-start border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                isSelected
                    ? `bg-${color}-50 border-${color}-600  shadow-md`
                    : `border-gray-300 hover:border-${color}-400 hover:shadow-sm bg-white`
            }`}
            onClick={onClick}
        >
            <div
                className={`w-4 h-4 border border-black rounded-sm flex items-center justify-center mt-1 ${isSelected ? 'bg-black' : ''}`}
            >
                {isSelected && (
                    <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
            <div className="flex flex-col">
                <h3 className="font-semibold text-xm align-middle">{table.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{table.description}</p>
                <p className="text-xs text-gray-500">레코드 수 : {table.recordCount}</p>
            </div>
        </div>
    );
}
