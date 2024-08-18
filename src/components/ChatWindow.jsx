// src/components/ChatWindow.jsx
import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import MessageItem from "./MessageItem.jsx";
import { useContext } from 'react';
import AuthContext from '../auxiliaryFunctions/AuthContext.jsx';

function ChatWindow({ messages }) {
    const messagesEndRef = useRef(null);
    // eslint-disable-next-line no-unused-vars
    const { user } = useContext(AuthContext);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className='w-full h-full px-2 flex flex-col overflow-hidden p-2'>
            <div className={`h-[95%] flex-col overflow-hidden`}>
                {messages.map((message, index) => (
                    <MessageItem
                        key={index}
                        body={message.body}
                        from={message.from}
                        timestamp={message.timestamp}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className={`w-full h-[5%] flex items-center bg-gray-100 rounded-md px-2`}>
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
        from: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired,
    })).isRequired,
};

export default ChatWindow;