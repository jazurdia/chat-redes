// src/components/MessageItem.jsx
import PropTypes from 'prop-types';
import {useContext} from 'react';
import AuthContext from '../auxiliaryFunctions/AuthContext.jsx';

function MessageItem({ body, from, timestamp, isFile }) {
    const { user } = useContext(AuthContext);
    const loggedUser = user.client.jid.local;
    const isSent = from.includes(loggedUser);

    return (
        <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`rounded-md p-2 ${isSent ? 'bg-blue-500 text-white w-3/5' : 'bg-gray-300 text-black w-3/5'}`}>
                <p className='text-xs mb-0.5'>{from}</p>
                {isFile ? (
                    <img src={body} alt="file preview" className="w-full h-auto mb-0.5" />
                ) : (
                    <p className='text-md mb-0.5'>{body}</p>
                )}
                <p className='text-xs text-right'>{timestamp}</p>
            </div>
        </div>
    );
}

export default MessageItem;

MessageItem.propTypes = {
    body: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    isFile: PropTypes.bool, // Añadir esta línea
};