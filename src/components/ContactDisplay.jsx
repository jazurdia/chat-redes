import React from 'react';
import PropTypes from 'prop-types';

function ContactDisplay({ contactId, lastMessage, isGroup, onClick }) {
    // Eliminar todo lo que va después del @ en el contactId
    const displayContactId = contactId.split('@')[0];

    return (
        <div className='p-2' onClick={onClick}>
            <div className={`rounded-md py-2 px-4 break-words ${isGroup ? 'bg-blue-400' : 'bg-blue-500'}`}>
                <p className='text-normal mb-2'>{displayContactId}</p>
                <p className='text-xs'>{lastMessage}</p>
            </div>
        </div>
    );
}

ContactDisplay.propTypes = {
    contactId: PropTypes.string.isRequired,
    lastMessage: PropTypes.string.isRequired,
    isGroup: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
};

export default ContactDisplay;