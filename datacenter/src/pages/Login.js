import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

export default function Login() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!id || !password) return;
        console.log('로그인');
    };

    return (
        <div className="flex flex-col justify-center items-center gap-10 max-w-[90%] mx-auto px-4 py-8 font-sans">
            <div className="flex flex-col gap-4 items-center mt-10">
                <h1 className="font-bold text-4xl">로그인</h1>
                <span className="font-medium">Data Center Login Page</span>
            </div>
            <div className="flex flex-col gap-8 border border-gray-200 bg-gray-50 px-6 py-7">
                <div className="flex flex-col gap-4 items-center">
                    <h1 className="font-bold text-xl">계정 로그인</h1>
                    <span className="text-gray-600">통합 계정으로 안전하게 로그인하세요</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <span className="font-bold text-gray-700">아이디</span>
                        <input
                            placeholder="아이디를 입력하세요"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="bg-transparent w-full border border-gray-200 px-4 py-2 rounded"
                        />
                    </div>

                    <div className="relative">
                        <span className="font-bold text-gray-700">비밀번호</span>
                        <input
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            type={showPassword ? 'text' : 'password'}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-transparent w-full border border-gray-200 px-4 py-2 rounded"
                        />
                        <button
                            className="absolute right-0 top-5 h-12 px-3"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <FaRegEyeSlash className="text-gray-400" />
                            ) : (
                                <FaRegEye className="text-gray-400" />
                            )}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-12 text-white font-bold rounded bg-blue-600 hover:bg-blue-700"
                    >
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
}
