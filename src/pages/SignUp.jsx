import {useContext, useEffect, useState} from 'react';
import CustomTextInput from '../components/CustomTextInput';
import { registerUser } from '../auxiliaryFunctions/connectToXMPP';
import {useNavigate} from "react-router-dom";
import AuthContext from "../auxiliaryFunctions/AuthContext.jsx";
import logo from '/logo2-removebg.png';


function SignUp() {
    const [newUser, setNewUser] = useState('');
    const [password, setPassword] = useState('');
    const {clearUserContext} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        clearUserContext();
    }, [clearUserContext]);

    /**
     * Handle register
     * @param e
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("En handleSubmit\n");
        try {
            await registerUser(newUser, password);
            navigate('/');
        } catch (error) {
            console.error('Error al registrar usuario:', error);
        }
    }

    return (
        <div className="flex justify-center">
            <div className="flex flex-col items-center">
                <div className='flex flex-col items-center'>
                    <img src={logo} alt="logo" className='w-80 h-80'/>
                    <h1 className="text-6xl font-bold text-blue-400 mb-10">Ale Chat</h1>
                </div>
                <h1 className='text-4xl'>¡Únete y Chatea!</h1>
                <p className='text-normal mt-2'>Regístrate para empezar a chatear</p>
                <form className="w-full mt-4" onSubmit={handleSubmit}>
                    <CustomTextInput
                        label="Username"
                        name="username"
                        placeholder="tu usuario"
                        value={newUser}
                        onChange={(e) => setNewUser(e.target.value)}
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
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUp;