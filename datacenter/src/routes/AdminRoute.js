import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

export default function AdminRoute({ children }) {
    const { isLoggedIn, isAdmin } = useAuthStore();

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    if (!isAdmin) {
        alert('관리자만 접근 가능한 페이지입니다.');
        return <Navigate to="/home" replace />;
    }

    return children;
}
