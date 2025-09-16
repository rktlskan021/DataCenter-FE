// components/Dropdown.jsx
import { useEffect, useRef, useState, useId } from 'react';
import { Link } from 'react-router-dom';

export default function Dropdown({
    label,
    items,
    align = 'left',
    hoverOpen = true,
    className = '',
}) {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef(null);
    const menuRef = useRef(null);
    const hoverTimer = useRef(null);
    const menuId = useId();

    // 바깥 클릭 시 닫기
    useEffect(() => {
        function onDocClick(e) {
            if (!open) return;
            const t = e.target;
            if (menuRef.current?.contains(t) || buttonRef.current?.contains(t)) return;
            setOpen(false);
        }
        document.addEventListener('mousedown', onDocClick);
        return () => {
            document.removeEventListener('mousedown', onDocClick);
        };
    }, [open]);

    // 호버 열기/닫기(살짝 딜레이로 의도치 않은 깜빡임 방지)
    const handleMouseEnter = () => {
        if (!hoverOpen) return;
        if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
        hoverTimer.current = window.setTimeout(() => setOpen(true), 90);
    };
    const handleMouseLeave = () => {
        if (!hoverOpen) return;
        if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
        hoverTimer.current = window.setTimeout(() => setOpen(false), 120);
    };

    return (
        <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button
                ref={buttonRef}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={menuId}
                className={`text-gray-600 hover:text-gray-900 hover:-translate-y-0.5 transition-all duration-300 font-bold text-lg ${className}`}
                type="button"
            >
                {label}
            </button>

            {open && (
                <div
                    ref={menuRef}
                    id={menuId}
                    role="menu"
                    tabIndex={-1}
                    className={[
                        'absolute z-50 mt-2 min-w-[220px]',
                        align === 'right' ? 'right-0' : 'left-0',
                        'rounded-xl border border-gray-200 bg-white shadow-lg p-1',
                        'animate-in fade-in zoom-in-95',
                    ].join(' ')}
                >
                    {items.map((it) => (
                        <Link
                            key={it.to}
                            to={it.to}
                            role="menuitem"
                            className="flex flex-col gap-0.5 rounded-lg px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 hover:bg-gray-50"
                            onClick={() => setOpen(false)}
                        >
                            <span className="text-sm font-semibold text-gray-900">{it.label}</span>
                            {it.description && (
                                <span className="text-xs text-gray-500">{it.description}</span>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
