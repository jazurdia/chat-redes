import {useContext, useEffect, useState} from 'react';
import AuthContext from '../auxiliaryFunctions/AuthContext.jsx';
import ChatWindow from "../components/ChatWindow.jsx";
import {
    getMessages,
    listenForNewMessages,
    deleteAccount,
    getContacts,
    listenForStatusChanges,
    addContact,
} from '../auxiliaryFunctions/connectToXMPP.js';
import ContactDisplay from "../components/ContactDisplay.jsx";
import AddedContactDisplay from "../components/AddedContactDisplay.jsx";
import SearchForContact from "../components/SearchForContact.jsx";

function Home() {
    const {user, logout} = useContext(AuthContext);
    const [conversations, setConversations] = useState({});
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [destinatary, setDestinatary] = useState("");
    // eslint-disable-next-line no-unused-vars
    const [isGroup, setIsGroup] = useState(false);
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        let removeListener;
        let removeStatusListener;

        const fetchMessages = async () => {
            try {
                const fetchedMessages = await getMessages(user.client);
                console.log("fetchedMessages", fetchedMessages);
                classifyMessages(fetchedMessages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        const fetchContacts = async () => {
            try {
                const contacts = await getContacts(user.client);
                setContacts(contacts);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };

        const handleNewMessage = (message) => {
            addMessageToConversation(message);
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

        // Cleanup de los listeners
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

        const updatedConversations = {...conversations};

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
    };

    const addMessageToConversation = (newMessage) => {
        // Extraer el identificador base sin el recurso (/web) para usuarios individuales
        const normalizeJid = (jid) => jid.split('@alumchat.lol')[0] + '@alumchat.lol';

        console.log("newMessage", newMessage);
        const otherParticipant = normalizeJid(
            newMessage.from === (user.client.jid.local + "@alumchat.lol")
                ? newMessage.to
                : newMessage.from
        );
        console.log("otherParticipant", otherParticipant.from, otherParticipant.to);

        setConversations((prevConversations) => {
            // Clone the existing conversations
            const updatedConversations = {...prevConversations};

            // Ensure the conversation array exists
            if (!updatedConversations[otherParticipant]) {
                updatedConversations[otherParticipant] = [];
            }

            // Add the new message to the appropriate conversation
            updatedConversations[otherParticipant] = [...updatedConversations[otherParticipant], newMessage];

            return updatedConversations;
        });
    };

    const handleLogout = () => {
        logout();
    };

    const handleSelectConversation = (contactId) => {
        const loggedUser = user.client.jid.local + "@alumchat.lol";
        let contactJid = contactId.includes(loggedUser) ? contactId : `${contactId}@alumchat.lol`;

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
        try {
            await deleteAccount(user.client);
            logout();
        } catch (error) {
            console.error('Error al eliminar cuenta:', error);
        }
    };

    const handleAddContact = async (contactJid) => {
        try {
            await addContact(user.client, contactJid);
            const updatedContacts = await getContacts(user.client);
            setContacts(updatedContacts);
        } catch (error) {
            console.error('Error al añadir contacto:', error);
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
                        <SearchForContact onAddContact={handleAddContact}/>
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
                    <ChatWindow
                        destinatary={destinatary}
                        addMessageToConversation={addMessageToConversation}
                        selectedMessages={conversations[selectedConversation]} // Usar selectedConversation para mostrar mensajes
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;
