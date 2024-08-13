// src/pages/Home.jsx
import { useContext } from 'react';
import AuthContext from '../auxiliaryFunctions/AuthContext.jsx';
import ChatWindow from "../components/ChatWindow.jsx";

function Home() {
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="w-screen h-screen m-0 p-0 flex flex-col overflow-hidden">
            <div className="w-full text-white bg-slate-700 p-4 flex justify-around">
                <h1 className='text-4xl'>Chat de Alejandro</h1>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Cerrar sesión
                </button>
            </div>
            <div className='flex flex-row w-full h-full overflow-hidden'>
                <div className='w-1/3 bg-slate-300 overflow-y-auto'>
                    <h1>Users</h1>
                </div>
                <div className='w-2/3 bg-slate-400 overflow-y-auto'>
                    <ChatWindow/>
                </div>
            </div>
        </div>
    );
}

export default Home;
