import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import bmiLogo from '../assets/imgs/bmiLabLogo.svg';

export default function Login() {
    const [userId, setUserId] = useState('');
    const [userPw, setuserPw] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (userId === '' || userPw === '') {
            setError('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const dummyUser = { id: 1, name: '홍길동' };
            const dummyToken = 'fake-jwt-token-123';
            login(dummyUser, dummyToken);
            console.log('로그인 됨');
        } catch (err) {
            setError(err.message || '로그인에 실패했습니다.');
        } finally {
            setLoading(false);
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
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

// import { useState } from 'react';
// import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
// import useAuthStore from '../stores/useAuthStore';

// export default function Login() {
//     const [id, setId] = useState('');
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const { login } = useAuthStore();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!id || !password) return;
//         const dummyUser = { id: 1, name: '홍길동' };
//         const dummyToken = 'fake-jwt-token-123';
//         login(dummyUser, dummyToken);
//     };

//     return (
//         <div className="flex flex-col justify-center items-center gap-10 max-w-[90%] mx-auto px-4 py-8 font-sans">
//             <div className="flex flex-col gap-4 items-center mt-10">
//                 <h1 className="font-bold text-4xl">로그인</h1>
//                 <span className="font-medium">Data Center Login Page</span>
//             </div>
//             <div className="flex flex-col gap-8 border border-gray-200 bg-gray-50 px-6 py-7">
//                 <div className="flex flex-col gap-4 items-center">
//                     <h1 className="font-bold text-xl">계정 로그인</h1>
//                     <span className="text-gray-600">통합 계정으로 안전하게 로그인하세요</span>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div>
//                         <span className="font-bold text-gray-700">아이디</span>
//                         <input
//                             placeholder="아이디를 입력하세요"
//                             value={id}
//                             onChange={(e) => setId(e.target.value)}
//                             className="bg-transparent w-full border border-gray-200 px-4 py-2 rounded"
//                         />
//                     </div>

//                     <div className="relative">
//                         <span className="font-bold text-gray-700">비밀번호</span>
//                         <input
//                             placeholder="비밀번호를 입력하세요"
//                             value={password}
//                             type={showPassword ? 'text' : 'password'}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="bg-transparent w-full border border-gray-200 px-4 py-2 rounded"
//                         />
//                         <button
//                             className="absolute right-0 top-5 h-12 px-3"
//                             onClick={() => setShowPassword(!showPassword)}
//                         >
//                             {showPassword ? (
//                                 <FaRegEyeSlash className="text-gray-400" />
//                             ) : (
//                                 <FaRegEye className="text-gray-400" />
//                             )}
//                         </button>
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full h-12 text-white font-bold rounded bg-blue-600 hover:bg-blue-700"
//                     >
//                         로그인
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }
