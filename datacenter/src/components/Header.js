import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="flex justify-center items-center h-24 w-full shadow-sm border-b border-gray-200 bg-white">
            <div className="flex max-w-[90%] w-full justify-between">
                <h1 className="text-4xl font-sans font-bold text-gray-900">Data Center</h1>
                <button className="font-bold bg-blue-600 hover:bg-blue-700 rounded-md text-white text-xm px-5 py-3">
                    <Link to="/login">Login</Link>
                </button>
            </div>
        </header>
    );
}
