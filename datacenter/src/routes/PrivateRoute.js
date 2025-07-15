import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

export default function PrivateRoute({ children }) {
    const { isLoggedIn } = useAuthStore();

    if (!isLoggedIn) {
        alert('로그인을 해주세요.');
        return <Navigate to="/" replace />;
    }

    return children;
}
