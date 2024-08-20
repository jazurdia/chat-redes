import {useContext, useEffect, useState} from 'react';
import AuthContext from '../auxiliaryFunctions/AuthContext.jsx';
import ChatWindow from "../components/ChatWindow.jsx";
import {getMessages, listenForNewMessages, deleteAccount} from '../auxiliaryFunctions/connectToXMPP.js';
import ContactDisplay from "../components/ContactDisplay.jsx";

function Home() {
    const {user, logout} = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState({});
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [destinatary, setDestinatary] = useState("");
    const [isGroup, setIsGroup] = useState(false);

    useEffect(() => {
        let removeListener;

        const fetchMessages = async () => {
            try {
                const fetchedMessages = await getMessages(user.client);
                setMessages(fetchedMessages);
                console.log("fetched messages", fetchedMessages);
                classifyMessages(fetchedMessages);
                console.log("classified messages", fetchedMessages);
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

    //console.log("Mesajes recibidos raw: ", messages);

    const classifyMessages = (messages) => {
        const groupMessages = [];
        const contactMessages = [];

        messages.forEach((message) => {
            if ((message.from && message.from.includes("conference")) || (message.to && message.to.includes("conference"))) {
                groupMessages.push(message);
            } else {
                contactMessages.push(message);
            }
        });

        contactMessages.forEach((message) => {
            if (message.from) {
                message.from = message.from.split('/')[0];
            }
            if (message.to) {
                message.to = message.to.split('/')[0];
            }
        });

        const updatedConversations = {...conversations}; // Clonar el estado actual

        contactMessages.forEach((message) => {
            const participants = [message.from, message.to].sort().join('-');
            if (!updatedConversations[participants]) {
                updatedConversations[participants] = [];
            }
            updatedConversations[participants].push(message);
        });

        groupMessages.forEach((message) => {
            const groupName = message.to.split('@')[0];
            if (!updatedConversations[groupName]) {
                updatedConversations[groupName] = [];
            }
            updatedConversations[groupName].push(message);
        });

        setConversations(updatedConversations);
    };

    const handleLogout = () => {
        logout();
    };

    const handleSelectConversation = (contactId) => {
        setSelectedConversation(contactId);
        setIsGroup(contactId.includes('conference'));
        console.log("Selected conversations: ", contactId);
        console.log("Is group: ", isGroup);

        // obtener destinatario
        const logged_user = user.client.jid.local + "@alumchat.lol";

        if (!isGroup) {
            if (contactId.includes(logged_user)) {
                const contact = contactId.replace(logged_user, '').replace('-', '');
                setDestinatary(contact);
                //console.log("Destinatario: ", destinatary);
            } else {
                console.log("Algo salio mal al obtener el destinatario");
            }
        }


    };

    //console.log("conversation", conversations);

    const handleDeleteAccount = async () => {
        console.log("Boton de eliminar cuenta");
        try {
            await deleteAccount(user.client);
            logout();
        } catch (error) {
            console.error('Error al eliminar cuenta:', error);
        }
    }

    return (
        <div className="w-screen h-screen m-0 p-0 flex flex-col overflow-hidden">
            <div className="w-full text-white bg-slate-700 p-4 space flex justify-between h-[8%]">
                <h1 className='text-3xl'>Chat de Alejandro</h1>
                <div className='flex flex-row gap-4'>
                    <button onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Cerrar sesión
                    </button>
                    <button onClick={handleDeleteAccount}
                            className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                        Eliminar Cuenta
                    </button>
                </div>

            </div>
            <div className='flex flex-row h-full h-[92%] overflow-hidden overflow-y-scroll'>
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
                <div className='w-2/3 bg-slate-400 overflow-hidden overflow-y-scroll scrollbar-hide'>
                    <ChatWindow messages={selectedConversation ? conversations[selectedConversation] : []}
                                destinatary={destinatary}
                                setMessages={setMessages}
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;