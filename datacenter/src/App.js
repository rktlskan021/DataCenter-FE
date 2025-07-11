import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Login from './pages/Login';
import CohortDetail from './pages/CohortDetail';

const App = () => {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
            <Routes>
                <Route path="/login" element={<Login />} />
            </Routes>
            <Routes>
                <Route path="/cohort/:id" element={<CohortDetail />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
