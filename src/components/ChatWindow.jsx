import { useRef, useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import AuthContext from "../auxiliaryFunctions/AuthContext.jsx";
import { sendMessage } from '../auxiliaryFunctions/connectToXMPP.js';
import MessageItem from './MessageItem.jsx';

function ChatWindow({ destinatary, addMessageToConversation, selectedMessages }) {
    const messagesEndRef = useRef(null);
    const [toSelected, setToSelected] = useState("");
    const [messageText, setMessageText] = useState("");
    const { user } = useContext(AuthContext);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        setToSelected(destinatary);
    }, [destinatary]);

    const handleSendMessage = async () => {
        if (messageText.trim() === "") return;
        try {
            await sendMessage(user.client, toSelected, messageText);
            setMessageText(""); // Clear the input field after sending the message

            const timestamp = new Date().toISOString();
            const newMessage = {
                from: user.client.jid.local + '@' + user.client.jid.domain,
                to: toSelected,
                body: messageText,
                timestamp,
            };

            // add the sent message to chat
            addMessageToConversation(newMessage);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <div className='w-full h-full px-2 flex flex-col overflow-hidden p-2'>
            <div className='h-[95%] flex-col overflow-hidden overflow-y-scroll scrollbar-hide'>
                {selectedMessages && selectedMessages.map((message, index) => (
                    <MessageItem
                        key={index}
                        body={message.body}
                        from={message.from}
                        timestamp={message.timestamp}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className='w-full h-[5%] flex items-center bg-gray-100 rounded-md px-2'>
                <input
                    type="text"
                    placeholder="Escribe un mensaje"
                    className="flex-grow h-full px-2 bg-transparent outline-none"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                />
                <button
                    className="ml-2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    onClick={handleSendMessage}
                >
                    Enviar
                </button>
            </div>
        </div>
    );
}

ChatWindow.propTypes = {
    destinatary: PropTypes.string,
    addMessageToConversation: PropTypes.func.isRequired,
    selectedMessages: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.string.isRequired,
        from: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired,
    })),
};

export default ChatWindow;
