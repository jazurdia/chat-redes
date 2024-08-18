// src/components/MessageItem.jsx
import PropTypes from 'prop-types';
import {useContext} from 'react';
import AuthContext from '../auxiliaryFunctions/AuthContext.jsx';

function MessageItem({body, from, timestamp}) {
    const {user} = useContext(AuthContext);
    const loggedUser = user.client.jid.local;
    const isSent = from.includes(loggedUser);

    return (
        <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2 w-2/3`}>
            <div className={`rounded-md p-2 ${isSent ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black w-full'}`}>
                <p className='text-xs mb-0.5'>{from}</p>
                <p className='text-md mb-0.5'>{body}</p>
                <p className='text-xs text-right'>{timestamp}</p>
            </div>
        </div>
    );
}

MessageItem.propTypes = {
    body: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
};

export default MessageItem;