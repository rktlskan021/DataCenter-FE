import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import bmiLogo from '../assets/imgs/bmiLabLogo.svg';
import { postLogin } from '../api/users/users';
import { Database, Shield, Users, BarChart3 } from 'lucide-react';

export default function Login() {
    const [userId, setUserId] = useState('');
    const [userPw, setuserPw] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, logout, isLoggedIn } = useAuthStore();
    const navigate = useNavigate();

    const features = [
        {
            icon: Database,
            title: 'OMOP CDM Data', // OMOP CDM 데이터
            description: 'Secure data access through a standardized medical data model.', // 표준화된 의료 데이터 모델을 통한 안전한 데이터 접근
        },
        {
            icon: Shield,
            title: 'Enhanced Security', // 보안 강화
            description: 'Strict data security management through IRB/DRB approval.', // IRB/DRB 승인을 통한 엄격한 데이터 보안 관리
        },
        {
            icon: Users,
            title: 'Cohort Management', // 코호트 관리
            description:
                'Creation and management of patient cohorts suitable for research purposes.', // 연구 목적에 맞는 환자 코호트 생성 및 관리
        },
        {
            icon: BarChart3,
            title: 'Data Analysis', // 데이터 분석
            description: 'Provision of advanced analysis tools utilizing approved data.', // 승인된 데이터를 활용한 고급 분석 도구 제공
        },
    ];

    useEffect(() => {
        if (isLoggedIn) {
            logout();
            alert('You have been logout');
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (userId === '' || userPw === '') {
            setError('Please enter both ID and Password');
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
            setError('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        // ✅ 화면을 2칸으로 나눔 (모바일 1칸, md 이상 2칸)
        <div className="h-[calc(100vh-96px)] w-screen grid grid-cols-1 md:grid-cols-2">
            {/* 왼쪽 칸: 카드 가운데 정렬 */}
            <div className="flex items-center justify-center p-6 bg-white">
                <div className="w-full max-w-md p-10 rounded-2xl shadow-xl border border-gray-100">
                    {/* 로고 및 브랜딩 */}
                    <div className="text-center mb-8">
                        <img src={bmiLogo} alt="BMI Lab" className="mx-auto mb-4" />
                        <p className="text-gray-600 text-sm font-bold">Data Center</p>
                    </div>

                    {/* 로그인 폼 */}
                    <form onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="userId"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    ID
                                </label>
                                <input
                                    id="userId"
                                    type="text"
                                    placeholder="Enter ID"
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
                                    Password
                                </label>
                                <input
                                    id="userPw"
                                    type="password"
                                    placeholder="Enter PW"
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
                            Login
                        </button>
                    </form>
                </div>
            </div>

            {/* 오른쪽 칸: 파란 배경 (그냥 절반 차지) */}
            <div className="flex justify-start items-center bg-gradient-to-br from-blue-600 to-blue-700">
                <div className="px-20 text-white ">
                    <h2 className="text-4xl font-bold mb-6">Medical Data Research Platform</h2>{' '}
                    {/* 의료 데이터 연구 플랫폼 */}
                    <p className="text-xl font-medium text-blue-100 mb-12">
                        Access standardized and secure medical data to conduct innovative research.{' '}
                        {/* 안전하고 표준화된 의료 데이터에 접근하여 혁신적인 연구를 수행하세요 */}
                    </p>
                    <div className="space-y-8">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                        <feature.icon className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                                    <p className="text-blue-100">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                        <h3 className="text-lg font-bold mb-2">Compliance with Research Ethics</h3>{' '}
                        {/* 연구 윤리 준수 */}
                        <p className="text-blue-100 text-sm font-medium">
                            All data access is strictly managed through approval from the IRB
                            (Institutional Review Board) or DRB (Data Review Board).{' '}
                            {/* 모든 데이터 접근은 IRB(기관생명윤리위원회) 또는 DRB(데이터심의위원회) 승인을 통해 엄격하게 관리됩니다. */}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
