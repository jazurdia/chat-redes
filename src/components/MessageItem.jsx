import PropTypes from 'prop-types';
import { useContext } from 'react';
import AuthContext from '../auxiliaryFunctions/AuthContext.jsx';

function MessageItem({ body, from, timestamp }) {
    const { user } = useContext(AuthContext);
    const loggedUser = user.client.jid.local;
    const isSent = from.includes(loggedUser);

    const isImage = body.endsWith('.png') || body.endsWith('.jpg') || body.endsWith('.jpeg') || body.endsWith('.gif');
    const isPDF = body.endsWith('.pdf');

    return (
        <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`rounded-md p-2 ${isSent ? 'bg-blue-500 text-white w-3/5' : 'bg-gray-300 text-black w-3/5'}`}>
                <p className='text-xs mb-0.5'>{from}</p>
                {isImage ? (
                    <a href={body} download>
                        <img src={body} alt="file preview" className="w-full h-auto mb-0.5 cursor-pointer" />
                    </a>
                ) : isPDF ? (
                    <a href={body} download target="_blank" rel="noopener noreferrer">
                        <embed src={body} type="application/pdf" className="w-full h-64 mb-0.5" />
                    </a>
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
    isFile: PropTypes.bool,
};
