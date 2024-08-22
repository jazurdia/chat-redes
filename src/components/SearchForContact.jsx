import {useState} from "react";
import PropTypes from "prop-types";

function SearchForContact({onAddContact}) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAddContact = async () => {
        if (searchTerm.trim()){
            onAddContact(searchTerm.trim());
            setSearchTerm('');
        }
    };

    return (
        <div className="flex items-center space-x-2 p-2">
            <input
                type="text"
                placeholder="Nuevo Contacto"
                value={searchTerm}
                onChange={handleSearch}
                className="border border-gray-300 rounded-md p-2 flex-grow"
            />
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
};
