// src/components/MessageItem.jsx
import PropTypes from 'prop-types';

function MessageItem({ name, message, isSent, timestamp }) {
    // Eliminar todo lo que va después del @ en el nombre del usuario
    const displayName = name.split('@')[0];
    // Obtener solo la hora del timestamp
    const displayTime = new Date(timestamp).toLocaleTimeString();

    return (
        <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2 w-2/3`}>
            <div className={`rounded-md p-2 ${isSent ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black w-full'}`}>
                <p className='text-xs mb-0.5'>{displayName}</p>
                <p className='text-md mb-0.5'>{message}</p>
                <p className='text-xs text-right'>{displayTime}</p>
            </div>
        </div>
    );
}

MessageItem.propTypes = {
    name: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    isSent: PropTypes.bool.isRequired,
    timestamp: PropTypes.string.isRequired,
};

export default MessageItem;