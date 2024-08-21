// src/pages/Home.jsx
import {useContext, useEffect, useState} from 'react';
import AuthContext from '../auxiliaryFunctions/AuthContext.jsx';
import ChatWindow from "../components/ChatWindow.jsx";
import {
    getMessages,
    listenForNewMessages,
    deleteAccount,
    getContacts,
    listenForStatusChanges
} from '../auxiliaryFunctions/connectToXMPP.js';
import ContactDisplay from "../components/ContactDisplay.jsx";
import AddedContactDisplay from "../components/AddedContactDisplay.jsx";

function Home() {
    const {user, logout} = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState({});
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [destinatary, setDestinatary] = useState("");
    const [isGroup, setIsGroup] = useState(false);
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        let removeListener;
        let removeStatusListener;

        const fetchMessages = async () => {
            try {
                const fetchedMessages = await getMessages(user.client);
                setMessages(fetchedMessages);
                classifyMessages(fetchedMessages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        const fetchContacts = async () => {
            try {
                const contacts = await getContacts(user.client);
                console.log("Contactos recibidos: \n", contacts);
                setContacts(contacts);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        }

        const handleNewMessage = (message) => {
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, message];
                console.log("tipo de updatedMessages: ", typeof updatedMessages);
                classifyMessages(updatedMessages);
                return updatedMessages;
            });
        };

        const handleStatusChange = (statusUpdate) => {
            setContacts((prevContacts) => {
                return prevContacts.map(contact => {
                    if (contact.jid === statusUpdate.from.split('/')[0]) {
                        return {...contact, status: statusUpdate.status, show: statusUpdate.show};
                    }
                    return contact;
                });
            });
        };

        if (user && user.client) {
            fetchMessages();
            fetchContacts();
            removeListener = listenForNewMessages(user.client, handleNewMessage);
            removeStatusListener = listenForStatusChanges(user.client, handleStatusChange);
        }

        return () => {
            if (removeListener) {
                removeListener();
            }
            if (removeStatusListener) {
                removeStatusListener();
            }
        };
    }, [user]);

    const classifyMessages = (messages) => {

        if (!Array.isArray(messages)) {
            console.log("En classify messages (home)");
            console.log("tipo de messages: ", typeof messages);
            console.log("messages: ", messages);
            console.error('Expected messages to be an array, but got:', messages);
            return;
        }

        const groupMessages = [];
        const contactMessages = [];
        const loggedUserJid = user.client.jid.local + "@alumchat.lol";

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

        const updatedConversations = {...conversations}; // Clone the current state

        contactMessages.forEach((message) => {
            const otherParticipant = message.from === loggedUserJid ? message.to : message.from;
            if (!updatedConversations[otherParticipant]) {
                updatedConversations[otherParticipant] = [];
            }
            updatedConversations[otherParticipant].push(message);
        });

        groupMessages.forEach((message) => {
            const groupName = message.to.split('@')[0];
            if (!updatedConversations[groupName]) {
                updatedConversations[groupName] = [];
            }
            updatedConversations[groupName].push(message);
        });

        setConversations(updatedConversations);
        console.log("(HOME) Conversaciones actualizadas: \n", updatedConversations);
    };
    const handleLogout = () => {
        logout();
    };

    const handleSelectConversation = (contactId) => {
        const loggedUser = user.client.jid.local + "@alumchat.lol";
        let contactJid = contactId.includes(loggedUser) ? contactId : `${contactId}@alumchat.lol`;

        // Ensure only one instance of '@alumchat.lol'
        if (contactJid.split('@alumchat.lol').length > 2) {
            contactJid = contactJid.replace('@alumchat.lol@alumchat.lol', '@alumchat.lol');
        }

        let foundConversation = null;
        Object.keys(conversations).forEach((convId) => {
            if (convId.includes(contactJid)) {
                foundConversation = convId;
            }
        });

        if (foundConversation) {
            setSelectedConversation(foundConversation);
            setIsGroup(foundConversation.includes('conference'));
            setDestinatary(contactJid);
        } else {
            setSelectedConversation(contactJid);
            setIsGroup(false);
            setDestinatary(contactJid);
        }
    };
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
                <p className='text-3xl px-2'>🔵 {user.client.jid.local}</p>
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
            <div className='flex flex-row h-full h-[92%] overflow-hidden'>
                <div className='w-1/3 bg-slate-300 overflow-hidden overflow-y-scroll scrollbar-hide'>
                    <div>
                        <p className='p-2 text-xl'>Conversaciones</p>
                        {Object.keys(conversations).map((contactId) => (
                            <ContactDisplay
                                key={contactId}
                                contactId={contactId}
                                lastMessage={conversations[contactId][conversations[contactId].length - 1].body}
                                onClick={() => handleSelectConversation(contactId)}
                            />
                        ))}
                    </div>
                    <div>
                        <p className='p-2 text-xl'>Contactos</p>
                        {contacts.map((contact) => (
                            <AddedContactDisplay
                                key={contact.jid}
                                jid={contact.jid}
                                status={contact.status}
                                show={contact.show}
                                onClick={() => handleSelectConversation(contact.jid)}
                            />
                        ))}
                    </div>
                </div>
                <div className='w-2/3 bg-slate-400 overflow-hidden overflow-y-scroll scrollbar-hide'>
                    <ChatWindow messages={selectedConversation ? conversations[selectedConversation] : []}
                                destinatary={destinatary}
                                setMessages={(newMessages) => {
                                    setMessages(newMessages);
                                    classifyMessages(newMessages);
                                }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;
