import React from 'react';

function ContactDisplay({ contactId, lastMessage, isGroup }) {
    return (
        <div className='m-2'>
            <div className={`rounded-md py-2 px-4 ${isGroup ? 'bg-blue-400' : 'bg-blue-500'}`}>
                <p className='text-normal mb-2'>{contactId}</p>
                <p className='text-xs'>{lastMessage}</p>
            </div>
        </div>
    );
}

export default ContactDisplay;