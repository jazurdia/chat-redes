import { useState, useRef, useEffect } from 'react';
import MessageItem from "./MessageItem.jsx";

function ChatWindow() {
    const name = 'Alejandro';
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([
        { text: 'Buenos días', timestamp: '2021-09-10 08:00:00' },
        { text: 'Hola', timestamp: '2021-09-10 08:01:00' },
        { text: '¿Cómo estás?', timestamp: '2021-09-10 08:02:00' },
        { text: 'Bien, gracias, ¿y tú?', timestamp: '2021-09-10 08:03:00' },
        { text: 'También bien', timestamp: '2021-09-10 08:04:00' },
        { text: 'Me alegra escucharlo', timestamp: '2021-09-10 08:05:00' },
        { text: 'Mira, te quería preguntar algo, pero no se si es adecuado preguntartelo en este momento', timestamp: '2021-09-10 08:06:00' },
        { text: 'No te preocupes, puedes preguntarme lo que sea', timestamp: '2021-09-10 08:07:00' },
        { text: '¿Qué opinas de la situación actual de la pandemia?', timestamp: '2021-09-10 08:08:00' },
        { text: 'Es un tema complicado, pero creo que se está manejando de la mejor manera posible', timestamp: '2021-09-10 08:09:00' },
        { text: 'Sí, estoy de acuerdo contigo', timestamp: '2021-09-10 08:10:00' },
        { text: 'Bueno, me tengo que ir, pero hablamos luego', timestamp: '2021-09-10 08:11:00' },
        { text: 'Claro, hablamos luego', timestamp: '2021-09-10 08:12:00' },
    ]);

    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const newMessageObject = {
            text: newMessage,
            timestamp: new Date().toISOString()
        };

        setMessages([...messages, newMessageObject]);
        setNewMessage('');
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className='w-full h-full p-4 flex flex-col'>
            <div className='flex-1 overflow-y-auto scrollbar-hide'>
                {messages.map((message, index) => (
                    <MessageItem
                        name={name}
                        key={index}
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
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
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

export default ChatWindow;
