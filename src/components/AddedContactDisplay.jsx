import PropTypes from 'prop-types';
import { useEffect, useState } from "react";

function AddedContactDisplay({ jid, status, show, onClick }) {
    const [varStatus, setVarStatus] = useState('indefinido');
    const [varShow, setVarShow] = useState('indefinido');

    useEffect(() => {
        setVarStatus(status);
        setVarShow(show);
    }, [status, show]);

    return (
        <div className='p-2' onClick={onClick}>
            <div className={`rounded-md py-2 px-4 break-words bg-blue-950 text-white`}>
                <p className='text-normal mb-2'>{jid}</p>
                <p className='text-xs'>status: {varStatus}</p>
                <p className='text-xs'>show: {varShow}</p>
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
