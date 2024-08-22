import PropTypes from 'prop-types';
import { useEffect, useState, useContext } from "react";
import { removeContact } from '../auxiliaryFunctions/connectToXMPP';
import AuthContext from '../auxiliaryFunctions/AuthContext';

function AddedContactDisplay({ jid, status, show, onClick }) {
    const [varStatus, setVarStatus] = useState('indefinido');
    const [varShow, setVarShow] = useState('indefinido');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        setVarStatus(status);
        setVarShow(show);
    }, [status, show]);

    const handleRemoveContact = async () => {
        try {
            await removeContact(user.client, jid);
            console.log('Contact removed successfully');
            // Optionally, you can add logic to update the contact list in the parent component
        } catch (error) {
            console.error('Failed to remove contact:', error);
        }
    };

    return (
        <div className='p-2 flex justify-between items-center' onClick={onClick}>
            <div className={`rounded-md py-2 px-4 break-words bg-blue-950 text-white w-full`}>
                <p className='text-normal mb-2'>{jid}</p>
                <p className='text-xs'>status: {varStatus}</p>
                <p className='text-xs'>show: {varShow}</p>
            </div>
            <button onClick={handleRemoveContact} className='ml-2 text-red-500'>❌</button>
        </div>
    );
}

AddedContactDisplay.propTypes = {
    jid: PropTypes.string.isRequired,
    status: PropTypes.string,
    show: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};

export default AddedContactDisplay;