import { useContext, useEffect } from 'react';
import AuthContext from '../auxiliaryFunctions/AuthContext.jsx';
import ChatWindow from "../components/ChatWindow.jsx";
import { getMessages } from '../auxiliaryFunctions/connectToXMPP.js';

function Home() {
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const messages = await getMessages(user.client);
                console.log('Messages (home)\n:', messages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        if (user && user.client) {
            fetchMessages();
        }
    }, [user]);

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="w-screen h-screen m-0 p-0 flex flex-col">
            <div className="w-full text-white bg-slate-700 p-4 space flex justify-around">
                <h1 className='text-4xl'>Chat de Alejandro</h1>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Cerrar sesión
                </button>
            </div>
            <div className='flex flex-row w-screen h-full'>
                <div className='w-1/3 bg-slate-300'>
                    <h1>Users</h1>
                </div>
                <div className='w-2/3 bg-slate-400'>
                    <ChatWindow messages={[]}/>
                </div>
            </div>
        </div>
    );
}

export default Home;