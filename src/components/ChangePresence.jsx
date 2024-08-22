import {useState, useContext} from 'react';
import {changePresence} from '../auxiliaryFunctions/connectToXMPP';
import AuthContext from '../auxiliaryFunctions/AuthContext';

const showOptions = ['chat', 'away', 'dnd', 'xa'];
const statusOptions = ['Available', 'Busy', 'Away', 'Do not disturb'];

function ChangePresence() {
    const {user} = useContext(AuthContext);
    const [status, setStatus] = useState('');
    const [show, setShow] = useState('');

    const handleChangePresence = async () => {
        try {
            await changePresence(user.client, show, status);
            console.log('Presence changed successfully');
        } catch (error) {
            console.error('Failed to change presence:', error);
        }
    };

    return (
        <div className='p-4 rounded flex flex-col'>
            <h1>Elige tu status y mensaje</h1>
            <div>
                <div className='mt-4'>
                    <label className='block mb-2'>Show:</label>
                    <select
                        value={show}
                        onChange={(e) => setShow(e.target.value)}
                        className='w-full p-2 rounded border border-black'
                    >
                        <option value=''>Select show</option>
                        {showOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='mt-4'>
                    <label className='block mb-2'>Status:</label>
                    <input
                        type='text'
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className='w-full p-2 rounded border border-black'
                        placeholder='Type your status'
                    />
                </div>
            </div>
            <button
                onClick={handleChangePresence}
                className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
                Change Presence
            </button>
        </div>
    );
}

export default ChangePresence;