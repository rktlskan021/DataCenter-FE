import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import Login from '../pages/Login';
import Home from '../pages/Home';
import AdminPage from '../pages/AdminPage';
import Mypage from '../pages/Mypage';
import CohortDetail from '../pages/CohortDetail';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route
                path="/home"
                element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                }
            />
            <Route
                path="/cohort/:id"
                element={
                    <PrivateRoute>
                        <CohortDetail />
                    </PrivateRoute>
                }
            />
            <Route
                path="/mypage"
                element={
                    <PrivateRoute>
                        <Mypage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminPage />
                    </AdminRoute>
                }
            />
        </Routes>
    );
}
