import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomTextInput from '../components/CustomTextInput';
import AuthContext from '../auxiliaryFunctions/AuthContext.jsx';

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
        <div className="flex justify-center mt-[20vh] ">
            <div className="flex flex-col items-center">
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
                    <button type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-full mt-2">
                        Log in
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;