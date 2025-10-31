import { LuX } from 'react-icons/lu';

export default function PeriodBox({ range, index, length, removeDateRange, updateDateRange }) {
    return (
        <div key={range.id} className="space-y-3 p-3 border rounded-lg bg-gray-50">
            {index > 0 && <p className="font-bold">OR</p>}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-xs text-gray-600 mb-1 block">Start</label>
                    <input
                        type="date"
                        value={range.startDate}
                        onChange={(e) => updateDateRange(range.id, 'startDate', e.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-600 mb-1 block">End</label>
                    <input
                        type="date"
                        value={range.endDate}
                        onChange={(e) => updateDateRange(range.id, 'endDate', e.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                </div>
            </div>
            {length > 1 && (
                <div className="flex justify-end">
                    <button
                        onClick={() => removeDateRange(range.id)}
                        className="flex items-center h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <LuX className="mr-1" />
                        <span className="text-sm">Delete</span>
                    </button>
                </div>
            )}
        </div>
    );
}
