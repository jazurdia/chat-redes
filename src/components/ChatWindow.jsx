import { useRef, useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import AuthContext from "../auxiliaryFunctions/AuthContext.jsx";
import { sendMessage } from '../auxiliaryFunctions/connectToXMPP.js';
import MessageItem from './MessageItem.jsx';
import FilePlusIcon from '/file-plus-svgrepo-com.svg';

function ChatWindow({ destinatary, addMessageToConversation, selectedMessages }) {
    const messagesEndRef = useRef(null);
    const [toSelected, setToSelected] = useState("");
    const [messageText, setMessageText] = useState("");
    const { user } = useContext(AuthContext);

    useEffect(() => {
        setToSelected(destinatary);
    }, [destinatary]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedMessages]);

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

    const handleSendArchive = async () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('files', file);  // 'files' es el campo esperado por el servidor
    
            const directory = 'alejandro';  // Asegúrate de usar el nombre correcto del directorio
    
            try {
                const response = await fetch(`https://redes-markalbrand56.koyeb.app/files/${directory}`, {
                    method: 'POST',
                    body: formData,
                });
    
                if (response.ok) {
                    const result = await response.json();
                    console.log('Archivo enviado exitosamente:', result);
                } else {
                    const errorText = await response.text();
                    console.error('Error al enviar el archivo:', errorText);
                }
            } catch (error) {
                console.error('Error en la solicitud de archivo:', error);
            }
        };
        fileInput.click();
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
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage().then(r => r);
                        }
                    }}
                />
                <button
                    className="ml-2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    onClick={handleSendMessage}
                >
                    Enviar
                </button>
                <button onClick={handleSendArchive}>
                    <img src={FilePlusIcon} alt="file-plus-icon" className="w-8 h-8" />
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
