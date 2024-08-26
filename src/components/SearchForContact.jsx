import {useState} from "react";
import PropTypes from "prop-types";

function SearchForContact({onAddContact, placeholder}) {
    const [searchTerm, setSearchTerm] = useState('');

    /**
     * Handle search
     * @param e
     */
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    /**
     * Handle add contact
     * @returns {Promise<void>}
     */
    const handleAddContact = async () => {
        if (searchTerm.trim()){
            onAddContact(searchTerm.trim());
            setSearchTerm('');
        }
    };

    return (
        <div className="flex items-center space-x-2 p-1 w-full">
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleSearch}
                className="border border-gray-300 rounded-md p-2 flex-grow outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow transition duration-200"
                onClick={handleAddContact}
            >
                Añadir
            </button>
        </div>
    );
    
}

export default SearchForContact;

// props
SearchForContact.propTypes = {
    onAddContact: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
};
