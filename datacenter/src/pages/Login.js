import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import bmiLogo from '../assets/imgs/bmiLabLogo.svg';
import { postLogin } from '../api/users/users';

export default function Login() {
    const [userId, setUserId] = useState('');
    const [userPw, setuserPw] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, logout, isLoggedIn } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            logout();
            alert('로그아웃 되었습니다.');
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (userId === '' || userPw === '') {
            setError('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await postLogin(userId, userPw);
            const user = response;
            const userInfo = {
                id: user.id,
                name: user.name,
                token: user.token,
                isAdmin: user.role === 'admin',
            };
            login(userInfo);
            if (userInfo.isAdmin) {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } catch (err) {
            setError('로그인에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen -mt-24 flex items-center justify-center">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                {/* 로고 및 브랜딩 */}
                <div className="text-center mb-8">
                    <img src={bmiLogo} className="mx-auto mb-4" />
                    {/* <h1 className="text-2xl font-bold text-gray-900 mb-2">SNUH BMI LAB</h1> */}
                    <p className="text-gray-600 text-sm">Data Center</p>
                </div>

                {/* 로그인 폼 */}
                <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="userId"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                아이디
                            </label>
                            <input
                                id="userId"
                                type="text"
                                placeholder="아이디를 입력하세요"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-50"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="userPw"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                비밀번호
                            </label>
                            <input
                                id="userPw"
                                type="password"
                                placeholder="비밀번호를 입력하세요"
                                value={userPw}
                                onChange={(e) => setuserPw(e.target.value)}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-50"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
}
