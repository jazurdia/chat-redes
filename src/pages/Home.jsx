import { useContext, useEffect, useState } from 'react';
import AuthContext from '../auxiliaryFunctions/AuthContext.jsx';
import ChatWindow from "../components/ChatWindow.jsx";
import { getMessages, listenForNewMessages } from '../auxiliaryFunctions/connectToXMPP.js';
import ContactDisplay from "../components/ContactDisplay.jsx";

function Home() {
    const { user, logout } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState({});
    const [selectedConversation, setSelectedConversation] = useState(null);

    useEffect(() => {
        let removeListener;

        const fetchMessages = async () => {
            try {
                const fetchedMessages = await getMessages(user.client);
                setMessages(fetchedMessages);
                classifyMessages(fetchedMessages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        const handleNewMessage = (message) => {
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, message];
                classifyMessages(updatedMessages);
                return updatedMessages;
            });
        };

        const classifyMessages = (messages) => {
            const convs = messages.reduce((acc, message) => {
                const { from } = message;
                if (!acc[from]) {
                    acc[from] = [];
                }
                acc[from].push(message);
                return acc;
            }, {});
            setConversations(convs);
        };

        if (user && user.client) {
            fetchMessages();
            removeListener = listenForNewMessages(user.client, handleNewMessage);
        }

        return () => {
            if (removeListener) {
                removeListener();
            }
        };
    }, [user]);

    const handleLogout = () => {
        logout();
    };

    const handleSelectConversation = (contactId) => {
        setSelectedConversation(contactId);
    };

    return (
        <div className="w-screen h-screen m-0 p-0 flex flex-col overflow-hidden">
            <div className="w-full text-white bg-slate-700 p-4 space flex justify-around h-[8%]">
                <h1 className='text-3xl'>Chat de Alejandro</h1>
                <button onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Cerrar sesión
                </button>
            </div>
            <div className='flex flex-row h-full h-[92%]'>
                <div className='w-1/3 bg-slate-300'>
                    <p>cantidad de mensajes: {messages.length}</p>
                    {Object.keys(conversations).map((contactId) => (
                        <ContactDisplay
                            key={contactId}
                            contactId={contactId}
                            lastMessage={conversations[contactId][conversations[contactId].length - 1].body}
                            onClick={() => handleSelectConversation(contactId)}
                        />
                    ))}
                </div>
                <div className='w-2/3 bg-slate-400'>
                    <ChatWindow messages={selectedConversation ? conversations[selectedConversation] : []} />
                </div>
            </div>
        </div>
    );
}

export default Home;