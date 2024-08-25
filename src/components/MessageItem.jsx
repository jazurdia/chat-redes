import PropTypes from 'prop-types';
import { useContext } from 'react';
import AuthContext from '../auxiliaryFunctions/AuthContext.jsx';

function MessageItem({ body, from, timestamp }) {
    const { user } = useContext(AuthContext);
    const loggedUser = user.client.jid.local;
    const isSent = from.includes(loggedUser);

    const isImage = body.endsWith('.png') || body.endsWith('.jpg') || body.endsWith('.jpeg') || body.endsWith('.gif');
    const isPDF = body.endsWith('.pdf');

    // Convert the timestamp to a more user-friendly format
    const formattedTimestamp = new Date(timestamp).toLocaleString();

    return (
        <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`rounded-lg p-3 ${isSent ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'} w-3/5`}>
                <p className='text-xs font-semibold mb-2'>{from}</p>
                {isImage ? (
                    <a href={body} download>
                        <img src={body} alt="file preview" className="w-full h-auto rounded mb-2" />
                    </a>
                ) : isPDF ? (
                    <a href={body} download target="_blank" rel="noopener noreferrer">
                        <embed src={body} type="application/pdf" className="w-full h-64 rounded mb-2" />
                    </a>
                ) : (
                    <p className='text-md mb-2'>{body}</p>
                )}
                <p className='text-xs text-right opacity-75'>{formattedTimestamp}</p>
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
