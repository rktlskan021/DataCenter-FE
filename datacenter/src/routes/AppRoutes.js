import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import Login from '../pages/Login';
import Structured from '../pages/Structured';
import AdminPage from '../pages/AdminPage';
import Home from '../pages/Home';
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
                path="/structured/:id"
                element={
                    <PrivateRoute>
                        <CohortDetail />
                    </PrivateRoute>
                }
            />
            <Route
                path="/structured"
                element={
                    <PrivateRoute>
                        <Structured />
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
