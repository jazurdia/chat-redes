import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomTextInput from '../components/CustomTextInput';
import AuthContext from '../auxiliaryFunctions/AuthContext.jsx';
import logo from '/logo2-removebg.png';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login(email, password);
            navigate('/home');
        } catch (error) {
            console.error('Error al conectar:', error);
        }
    };

    return (
        <div className="flex justify-around">
            <div className="flex flex-col items-center">
                <div className='flex flex-col items-center'>
                    <img src = {logo} alt="logo" className='w-80 h-80' />
                    <h1 className="text-6xl font-bold text-blue-400 mb-10">Ale Chat</h1>
                </div>
                <h1 className='text-4xl'>Ingresa tus credenciales</h1>
                <form onSubmit={handleSubmit} className="w-full mt-4">
                    <CustomTextInput
                        label="Username"
                        name="usernam"
                        placeholder="tu usuario"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <CustomTextInput
                        label="Password"
                        name="password"
                        placeholder="tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className='flex flex-row justify-evenly'>
                        <button type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-full mt-2">
                            Log in
                        </button>
                        <button type="button"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-full mt-2"
                                onClick={() => navigate('/signup')}>
                            Sign Up
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Login;