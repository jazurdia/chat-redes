// src/components/ChatWindow.jsx
import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import MessageItem from "./MessageItem.jsx";

function ChatWindow({ messages }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // chat window debería llamar la funcion de retrieve message history (no estoy seguro de como se llamará)
    // chatWindow debe recibir un objeto conversación y funcionar a partir de eso.

    return (
        <div className='w-full h-full p-4 flex flex-col'>
            <div className='flex-1 overflow-y-auto scrollbar-hide'>
                {messages.map((message, index) => (
                    <MessageItem
                        key={index}
                        name={message.name}
                        message={message.text}
                        isSent={index % 2 === 0}
                        timestamp={message.timestamp}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="w-full h-10 flex items-center bg-gray-100 rounded-md px-2 mt-4">
                <input
                    type="text"
                    placeholder="Escribe un mensaje"
                    className="flex-grow h-full px-2 bg-transparent outline-none"
                />
                <button
                    className="ml-2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Enviar
                </button>
            </div>
        </div>
    );
}

ChatWindow.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired,
    })).isRequired,
};

export default ChatWindow;
