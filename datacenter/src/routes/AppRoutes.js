import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import Login from '../pages/Login';
import Structured from '../pages/Structured';
import AdminPage from '../pages/AdminPage';
import Home from '../pages/Home';
import CohortDetail from '../pages/CohortDetail';
import Unstructured from '../pages/Unstructured';
import UnStructuredDetail from '../pages/UnstructuredDetail';
import CohortDetailModify from '../pages/CohortDetailModify';
import StructuredRequest from '../pages/StructuredRequest';

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
                path="/structured/modify/:id"
                element={
                    <PrivateRoute>
                        <CohortDetailModify />
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
                path="/unstructured/:id"
                element={
                    <PrivateRoute>
                        <UnStructuredDetail />
                    </PrivateRoute>
                }
            />
            <Route
                path="/unstructured"
                element={
                    <PrivateRoute>
                        <Unstructured />
                    </PrivateRoute>
                }
            />
            <Route
                path="/schema"
                element={
                    <PrivateRoute>
                        <StructuredRequest />
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
