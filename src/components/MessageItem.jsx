// src/components/MessageItem.jsx
import PropTypes from "prop-types";

function MessageItem({ name, message, isSent, timestamp }) {
    // Formatear el timestamp para mostrar solo la hora y el minuto
    const formattedTimestamp = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`max-w-xs min-w-[200px] p-2 rounded-lg text-sm ${isSent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                {!isSent && <div className="font-bold mb-1">{name}</div>}
                {message}
                <div className="text-xs text-gray-500 mt-1">{formattedTimestamp}</div>
            </div>
        </div>
    );
}

// propTypes
MessageItem.propTypes = {
    name: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    isSent: PropTypes.bool.isRequired,
    timestamp: PropTypes.string.isRequired,
};

export default MessageItem;
