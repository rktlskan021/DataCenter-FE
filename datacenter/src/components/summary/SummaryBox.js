export default function SummaryBox({ label, color = 'text-gray-800', count }) {
    return (
        <div className="flex flex-col gap-2 border border-gray-200 bg-white px-6 py-5 rounded">
            <p className="font-medium">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{count}</p>
        </div>
    );
}
