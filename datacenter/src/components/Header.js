import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../stores/useAuthStore';

export default function Header() {
    const { name, isLoggedIn, logout, isAdmin } = useAuthStore();
    const { i18n, t } = useTranslation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);

    let menuCloseTimer = null;

    const handleMouseEnter = (menu) => {
        clearTimeout(menuCloseTimer); // 닫기 타이머 취소
        setIsMenuOpen(true);
        setActiveMenu(menu);
    };

    const handleMouseLeave = () => {
        menuCloseTimer = setTimeout(() => {
            setIsMenuOpen(false);
            setActiveMenu(null);
        }, 0);
    };

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };

    const navigator = useNavigate();

    return (
        <div className="mb-[60px]">
            <header className="fixed left-0 top-0 z-50 w-full">
                <div className="absolute inset-0 border-b border-slate-300/80 bg-white/90 backdrop-blur-sm" />

                <div className="relative mx-auto max-w-[1280px] px-8">
                    <div className="flex h-[60px]">
                        <Link
                            to="/home"
                            className="flex h-[60px] w-[200px] items-center text-2xl font-bold"
                        >
                            Data Center
                        </Link>

                        <nav className="flex flex-1" aria-label="Main navigation">
                            <div className="flex">
                                {/* 각 메뉴 아이템: on:event -> onEvent */}
                                <Link
                                    to="/structured"
                                    onMouseEnter={() => handleMouseEnter('structured')}
                                    className={`flex h-[60px] w-[180px] items-center px-6 text-[15px] hover:text-slate-900 ${activeMenu === 'structured' ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}
                                >
                                    {t('header.nav.structured')}
                                </Link>
                                <Link
                                    to="/unstructured"
                                    onMouseEnter={() => handleMouseLeave()}
                                    className={`flex h-[60px] w-[180px] items-center px-6 text-[15px] hover:font-semibold hover:text-slate-900 `}
                                >
                                    {t('header.nav.unstructured')}
                                </Link>
                            </div>
                            <div className="flex w-full justify-end">
                                {isLoggedIn ? (
                                    <>
                                        <span className="flex h-[60px] items-center px-6 text-[15px]">
                                            {t('header.user_greeting', { username: name })}
                                        </span>
                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                className="flex h-[60px] items-center px-6 text-[15px] hover:font-semibold hover:text-slate-900"
                                            >
                                                Admin Page
                                            </Link>
                                        )}
                                        <button
                                            className="flex h-[60px] items-center px-6 text-[15px] hover:font-semibold hover:text-slate-900"
                                            onClick={() => {
                                                logout();
                                                navigator('/');
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/"
                                            className="flex h-[60px] items-center px-6 text-[15px] hover:font-semibold hover:text-slate-900"
                                        >
                                            Login
                                        </Link>
                                    </>
                                )}
                                <div className="flex h-[60px] items-center px-6 text-[15px]">
                                    <div className="flex bg-white border border-blue-200 rounded-lg">
                                        <button
                                            className={`px-1 text-center rounded-lg rounded-r-none px-4 ${i18n.language === 'en' ? 'bg-blue-200 text-blue-600 font-semibold' : 'bg-white text-blue-200'}`}
                                            onClick={() => changeLanguage('en')}
                                        >
                                            en
                                        </button>
                                        <button
                                            className={`px-1 text-center rounded-lg rounded-l-none px-4 ${i18n.language === 'ko' ? 'bg-blue-200 text-blue-600 font-semibold' : 'bg-white text-blue-200'}`}
                                            onClick={() => changeLanguage('ko')}
                                        >
                                            ko
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>

                {isMenuOpen && (
                    <div
                        className="absolute left-0 right-0 w-full border-b border-slate-300/80 bg-white/95 shadow-sm backdrop-blur-sm"
                        style={{ top: '60px' }}
                        onMouseEnter={() => clearTimeout(menuCloseTimer)} // 패널에 마우스가 들어가면 닫기 타이머 취소
                        onMouseLeave={handleMouseLeave} // 패널에서 마우스를 떼면 닫기
                    >
                        <div className="mx-auto max-w-[1280px] px-8">
                            <div className="flex">
                                <div className="w-[200px]" />
                                <div className="w-[180px] border-r py-4">
                                    <ul className="space-y-3">
                                        <li>
                                            <Link
                                                to="/structured"
                                                className="block px-6 text-sm text-slate-600 hover:text-blue-600"
                                            >
                                                {t('header.nav.content1')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/schema"
                                                className="block px-6 text-sm text-slate-600 hover:text-blue-600"
                                            >
                                                {t('header.nav.content2')}
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </div>
    );
}
