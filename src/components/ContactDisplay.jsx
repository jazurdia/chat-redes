import {useContext} from 'react';
import PropTypes from 'prop-types';
import AuthContext from "../auxiliaryFunctions/AuthContext.jsx";

function ContactDisplay({ contactId, lastMessage, isGroup, onClick }) {
    const { user } = useContext(AuthContext);
    const loggedUser = user.client.jid.local;

    const displayedContactId = contactId.replace(loggedUser + "@alumchat.lol", '').replace('-', '');

    return (
        <div 
            className='m-2 hover:shadow-lg transition duration-300 transform hover:scale-y-105 cursor-pointer' 
            onClick={onClick}
        >
            <div 
                className={`rounded-lg py-3 px-5 break-words text-white shadow-md ${isGroup ? 'bg-blue-400' : 'bg-blue-500'}`}
            >
                <p className='text-lg font-semibold mb-1'>{displayedContactId}</p>
                <p className='text-sm italic opacity-75'>{lastMessage}</p>
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
