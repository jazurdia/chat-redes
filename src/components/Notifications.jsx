// src/components/Notifications.jsx
import PropTypes from "prop-types";

function Notifications({ notifications, onAcceptContactRequest }) {
    return (
        <div className="notifications bg-white shadow-lg rounded-lg p-4">
            <div className="flex items-center mb-4">
                <h2 className="text-lg font-bold">Notificaciones</h2>
            </div>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index} className="mb-2">
                        {notification.type === 'contact_request' && (
                            <div className="flex">
                                <span>
                                    <strong>Solicitud de contacto:</strong> {notification.from}
                                </span>
                                <button
                                    onClick={() => {
                                        console.log('Accepting contact request from:', notification.from);
                                        onAcceptContactRequest(notification.from);
                                    }}
                                    className="ml-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    Aceptar
                                </button>
                            </div>
                        )}
                        {notification.type === 'contact_removed' && (
                            <div>
                                <strong>Contacto eliminado:</strong> {notification.from}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Notifications;

Notifications.propTypes = {
    notifications: PropTypes.array.isRequired,
    onAcceptContactRequest: PropTypes.func.isRequired,
};
