// src/components/MessageItem.jsx
import PropTypes from 'prop-types';

function MessageItem({ name, message, isSent, timestamp }) {
    return (
        <div className={`message-item ${isSent ? 'sent' : 'received'}`}>
            <div className="message-header">
                <span className="message-name">{name}</span>
                <span className="message-timestamp">{timestamp}</span>
            </div>
            <div className="message-body">
                <p>{message}</p>
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
