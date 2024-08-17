import {useContext, useEffect, useState} from 'react';
import AuthContext from '../auxiliaryFunctions/AuthContext.jsx';
import ChatWindow from "../components/ChatWindow.jsx";
import {getMessages, listenForNewMessages} from '../auxiliaryFunctions/connectToXMPP.js';
import ContactDisplay from "../components/ContactDisplay.jsx";

function Home() {
    const {user, logout} = useContext(AuthContext);
    const [messages, setMessages] = useState([]);

    // temporal
    useEffect(() => {
        let removeListener;

        const fetchMessages = async () => {
            try {
                const fetchedMessages = await getMessages(user.client);
                setMessages(fetchedMessages);
                console.log('fetchedMessages:', fetchedMessages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        const handleNewMessage = (message) => {
            console.log('New message received:', message);
            setMessages((prevMessages) => [...prevMessages, message]);

        };

        if (user && user.client) {
            fetchMessages();
            removeListener = listenForNewMessages(user.client, handleNewMessage);

        }

        // Cleanup listener on unmount
        return () => {
            if (removeListener) {
                removeListener();
            }
        };
    }, [user]);

    //console.log(messages);



    const handleLogout = () => {
        logout();
    };

    return (
        <div className="w-screen h-screen m-0 p-0 flex flex-col">
            <div className="w-full text-white bg-slate-700 p-4 space flex justify-around">
                <h1 className='text-3xl'>Chat de Alejandro</h1>
                <button onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Cerrar sesión
                </button>
            </div>
            <div className='flex flex-row w-screen h-full'>
                <div className='w-1/3 bg-slate-300'>
                    <p>cantidad de mensajes: {messages.length}</p>
                    <ContactDisplay contactId={'contact45'} lastMessage={'hola tonoto'}/>
                    <ContactDisplay contactId={'group23'} lastMessage={'mira, con respecto a lo que te dije antes, estas seguro de que eso es lo que queres hacer? Yo estaba pensando en un par de cosas diferentes que podíamos probar. '} isGroup={true}/>
                </div>
                <div className='w-2/3 bg-slate-400'>
                    <ChatWindow messages={[]}/>
                </div>
            </div>
        </div>
    );
}

export default Home;