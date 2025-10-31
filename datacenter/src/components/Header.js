import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import Dropdown from './Dropdown';

export default function Header() {
    const { name, isLoggedIn, logout, isAdmin } = useAuthStore();
    const navigator = useNavigate();

    return (
        <header className="font-sans flex justify-center items-center h-24 w-full shadow-sm border-b border-gray-200 bg-white">
            <div className="flex max-w-[80%] w-full justify-between items-center">
                <div className="flex items-end justify-center gap-10">
                    <h1 className="text-4xl font-bold text-gray-900">
                        <Link to="/home">Data Center</Link>
                    </h1>
                    <div className="flex gap-8 text-gray-600 font-bold text-lg">
                        <Dropdown
                            label="Structured Data Application"
                            align="left"
                            hoverOpen
                            items={[
                                {
                                    label: 'New Structured Data Application',
                                    to: '/structured',
                                    description: 'New structured data requests',
                                },
                                {
                                    label: 'Apply for Structured Data Permissoin',
                                    to: '/schema',
                                    description:
                                        'Request Permission to use registered structured data',
                                },
                            ]}
                        />
                        <Link to="/unstructured">
                            <p className="text-gray-600 hover:text-gray-900 hover:-translate-y-0.5 transition-all duration-300 ">
                                Unstructured Data Application
                            </p>
                        </Link>
                    </div>
                </div>
                {isLoggedIn ? (
                    <div className="flex gap-3 items-center">
                        <span>Welcome, {name}</span>
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className="font-bold bg-white hover:bg-gray-100 border border-gray-200 rounded-md text-black text-xm px-5 py-3 transition duration-200 ease-in-out"
                            >
                                Admin Page
                            </Link>
                        )}
                        <button
                            className="font-bold bg-white hover:bg-gray-100 border border-gray-200 rounded-md text-black text-xm px-5 py-3 transition duration-200 ease-in-out"
                            onClick={() => {
                                logout();
                                navigator('/');
                            }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/"
                        className="font-bold bg-blue-600 hover:bg-blue-700 rounded-md text-white text-xm px-5 py-3 transition duration-200 ease-in-out"
                    >
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
}
