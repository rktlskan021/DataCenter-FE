export default function StatusBadge({ icon, label, className }) {
    return (
        <div className="flex gap-1 items-center">
            {icon}
            <div className={`px-2 py-1.5 rounded-xl text-xs font-bold cursor-default ${className}`}>
                {label}
            </div>
        </div>
    );
}
