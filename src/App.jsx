import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import AuthContext from './auxiliaryFunctions/AuthContext';

function App() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useContext(AuthContext);

    console.log("From App.jsx", isAuthenticated());

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={isAuthenticated() ? <Home /> : <Login />} />
            <Route path="/signup" element={<SignUp />} />
        </Routes>
    );
}

export default App;
