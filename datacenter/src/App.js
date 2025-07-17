import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer, Slide } from 'react-toastify';

const App = () => {
    return (
        <BrowserRouter>
            <Header />
            <AppRoutes />
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar
                closeOnClick
                pauseOnHover={false}
                draggable={false}
                theme="colored"
                transition={Slide}
            />
        </BrowserRouter>
    );
};

export default App;
