import { Link } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

export default function Header() {
    const { name, isLoggedIn, logout } = useAuthStore();

    return (
        <header className="font-sans flex justify-center items-center h-24 w-full shadow-sm border-b border-gray-200 bg-white">
            <div className="flex max-w-[90%] w-full justify-between">
                <h1 className="text-4xl font-bold text-gray-900">Data Center</h1>
                {isLoggedIn ? (
                    <div className="flex gap-3 items-center">
                        <span className="">안녕하세요, {name}님</span>
                        <button className="font-bold bg-white hover:bg-gray-300 border border-gray-200 rounded-md text-black text-xm px-5 py-3 transition duration-200 ease-in-out">
                            <Link to="/mypage">Mypage</Link>
                        </button>
                        <button
                            className="font-bold bg-white hover:bg-gray-300 border border-gray-200 rounded-md text-black text-xm px-5 py-3 transition duration-200 ease-in-out"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button className="font-bold bg-blue-600 hover:bg-blue-700 rounded-md text-white text-xm px-5 py-3 transition duration-200 ease-in-out">
                        <Link to="/login">Login</Link>
                    </button>
                )}
            </div>
        </header>
    );
}
