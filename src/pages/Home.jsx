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
    listenForNotifications,
} from '../auxiliaryFunctions/connectToXMPP.js';
import ContactDisplay from "../components/ContactDisplay.jsx";
import AddedContactDisplay from "../components/AddedContactDisplay.jsx";
import SearchForContact from "../components/SearchForContact.jsx";
import ChangePresence from "../components/ChangePresence.jsx";
import Notifications from "../components/Notifications.jsx";

function Home() {
    const {user, logout} = useContext(AuthContext);
    const [conversations, setConversations] = useState({});
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [destinatary, setDestinatary] = useState("");
    // eslint-disable-next-line no-unused-vars
    const [isGroup, setIsGroup] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [isChangePresenceVisible, setIsChangePresenceVisible] = useState(false);
    const [areNotificationsVisible, setAreNotificationsVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        let removeListener;
        let removeStatusListener;
        let removeNotificationListener;


        /**
         * Fetches messages from the server and classifies them into conversations.
         * @returns {Promise<void>}
         */
        const fetchMessages = async () => {
            try {
                const fetchedMessages = await getMessages(user.client);
                console.log("fetchedMessages", fetchedMessages);
                classifyMessages(fetchedMessages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        /**
         * Fetches contacts from the server and sets them in the state.
         * @returns {Promise<void>}
         */
        const fetchContacts = async () => {
            try {
                const contacts = await getContacts(user.client);
                setContacts(contacts);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };

        /**
         * Handles a new message by adding it to the conversation.
         * @param message
         */
        const handleNewMessage = (message) => {
            addMessageToConversation(message);
        };

        /**
         * Handles a status change by updating the status of the contact.
         * @param statusUpdate
         */
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

        /**
         * Handles a notification by adding it to the notifications state.
         * @param notification
         */
        const handleNotification = (notification) => {
            setNotifications((prevNotifications) => [...prevNotifications, notification]);
        }

        // Si el usuario está logueado, se inician los listeners
        if (user && user.client) {
            fetchMessages();
            fetchContacts();
            removeListener = listenForNewMessages(user.client, handleNewMessage);
            removeStatusListener = listenForStatusChanges(user.client, handleStatusChange);
            removeNotificationListener = listenForNotifications(user.client, handleNotification);
        }

        // Cleanup de los listeners
        return () => {
            if (removeListener) removeListener();
            if (removeStatusListener) removeStatusListener();
            if (removeNotificationListener) removeNotificationListener();
        };
    }, [user]);

    /**
     * Classifies messages into conversations.
     * @param messages
     */
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

    /**
     * Adds a message to the conversation.
     * @param newMessage
     */
    const addMessageToConversation = (newMessage) => {
        const normalizeJid = (jid) => jid.split('@alumchat.lol')[0] + '@alumchat.lol';
    
        const otherParticipant = normalizeJid(
            newMessage.from === (user.client.jid.local + "@alumchat.lol")
                ? newMessage.to
                : newMessage.from
        );
    
        setConversations((prevConversations) => {
            const updatedConversations = { ...prevConversations };
            if (!updatedConversations[otherParticipant]) {
                updatedConversations[otherParticipant] = [];
            }
            updatedConversations[otherParticipant].push(newMessage);
            return updatedConversations;
        });
    };

    /**
     * Logs out the user.
     */
    const handleLogout = () => {
        logout();
    };

    /**
     * Handles the selection of a conversation.
     * @param contactId
     */
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

    const handleChangePresence = () => {
        setIsChangePresenceVisible(!isChangePresenceVisible);
    };

    const handleNotificationsVisibility = () => {
        setAreNotificationsVisible(!areNotificationsVisible);
    }

    const handleAcceptContactRequest = async (contactJid) => {
        console.log('lo que llega a handleAcceptContactRequest es :', contactJid);

        try {
            await addContact(user.client, contactJid);
            const updatedContacts = await getContacts(user.client);
            setContacts(updatedContacts);
        } catch (error) {
            console.error('Error al añadir contacto:', error);
        }

        // Actualiza el estado de las notificaciones
        setNotifications((prevNotifications) => {
            return prevNotifications.filter((notification) => notification.from !== contactJid);
        });
    };
    

    return (
        <div className="w-screen h-screen m-0 p-0 flex flex-col overflow-hidden">
            <div className="w-full text-white bg-slate-700 p-4 space flex justify-between h-[8%] shadow-md">
                <div className='flex flex-row gap-12 items-center'>
                    <p className='text-3xl px-2 font-bold tracking-wide'>🔵 {user.client.jid.local}</p>
                    <button onClick={handleNotificationsVisibility}>
                        <img
                            src="/notifications-active-svgrepo-com.svg"
                            alt="Notificaciones"
                            className="w-8 h-8 hover:opacity-50"
                        />
                    </button>
                </div>
                <div className='flex flex-row gap-4 items-center'>
                    <button onClick={handleChangePresence}
                            className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded shadow">
                        Cambiar Presencia
                    </button>
                    <button onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow">
                        Cerrar sesión
                    </button>
                    <button onClick={handleDeleteAccount}
                            className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded shadow">
                        Eliminar Cuenta
                    </button>
                </div>
            </div>
            <div className='flex flex-row h-full h-[92%] overflow-hidden'>
                <div className='w-1/3 bg-slate-300 overflow-hidden overflow-y-scroll scrollbar-hide p-4'>
                    <div className='mb-4'>
                        <p className='p-2 text-xl font-semibold tracking-wide text-slate-700'>Conversaciones</p>
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
                        <p className='p-2 text-xl font-semibold tracking-wide text-slate-700'>Contactos</p>
                        <SearchForContact onAddContact={handleAddContact} placeholder={'Nuevo Contacto'}/>
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
                <div className='w-2/3 bg-slate-400 overflow-hidden overflow-y-scroll scrollbar-hide p-4'>
                    <ChatWindow
                        destinatary={destinatary}
                        addMessageToConversation={addMessageToConversation}
                        selectedMessages={conversations[selectedConversation]} // Usar selectedConversation para mostrar mensajes
                    />
                </div>
            </div>
            {isChangePresenceVisible && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-white p-4 rounded shadow-lg">
                        <button
                            onClick={handleChangePresence}
                            className="absolute top-2 right-2"
                        >
                            ❌
                        </button>
                        <ChangePresence/>
                    </div>
                </div>
            )}
            {areNotificationsVisible && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-white p-4 rounded shadow-lg">
                        <button
                            onClick={handleNotificationsVisibility}
                            className="absolute top-2 right-2"
                        >
                            ❌
                        </button>
                        <Notifications notifications={notifications}
                                       onAcceptContactRequest={handleAcceptContactRequest}/> {/* Pasar notificaciones al componente */}
                    </div>
                </div>
            )}
        </div>
    );
    
}

export default Home;
