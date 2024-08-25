import PropTypes from 'prop-types';
import { useEffect, useState, useContext } from "react";
import { removeContact } from '../auxiliaryFunctions/connectToXMPP';
import AuthContext from '../auxiliaryFunctions/AuthContext';
import userDeleteIcon from '/user-delete-svgrepo-com.svg';

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
        } catch (error) {
            console.error('Failed to remove contact:', error);
        }
    };

    return (
        <div 
        className='m-1 p-3 flex justify-between items-center bg-blue-950 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-y-105 cursor-pointer'
        onClick={onClick}
        >
            <div className='flex flex-row items-center w-full'>
                <div className='text-white w-full'>
                    <p className='text-lg font-semibold mb-2'>{jid}</p>
                    <p className='text-sm italic'>Status: {varStatus ? varStatus : 'available'}</p>
                    <p className='text-sm italic'>Show: {varShow ? varShow : 'Listo para chatear'}</p>
                </div>
                <button 
                    onClick={handleRemoveContact} 
                    className='ml-4 text-white rounded-full w-12 h-10 flex justify-center items-center transition duration-200 transform hover:scale-110'>
                    <img
                        src={userDeleteIcon}
                        alt='remove-contact-icon'
                        className='w-6 h-6'
                    />
                </button>
            </div>
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
