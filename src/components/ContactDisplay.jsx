// src/components/ContactDisplay.jsx
import {useContext} from 'react';
import PropTypes from 'prop-types';
import AuthContext from "../auxiliaryFunctions/AuthContext.jsx";

function ContactDisplay({ contactId, lastMessage, isGroup, onClick }) {
    const { user } = useContext(AuthContext);
    const loggedUser = user.client.jid.local;

    //console.log("En ContactDisplay, loggedUser:", loggedUser);

    const displayedContactId = contactId.replace(loggedUser + "@alumchat.lol", '').replace('-', '');
    //console.log("En ContactDisplay, contactId:", contactId);

    return (
        <div className='p-2' onClick={onClick}>
            <div className={`rounded-md py-2 px-4 break-words ${isGroup ? 'bg-blue-400' : 'bg-blue-500'}`}>
                <p className='text-normal mb-2'>{displayedContactId}</p>
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
