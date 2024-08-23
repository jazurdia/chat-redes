// src/components/Notifications.jsx
import PropTypes from "prop-types";

function Notifications({ notifications, onAcceptContactRequest }) {
    return (
        <div className="notifications">
            <h2>Notificaciones</h2>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>
                        {notification.type === 'contact_request' && (
                            <>
                                <strong>Solicitud de contacto:</strong> {notification.from}
                                <button
                                    onClick={() => {
                                        console.log('Accepting contact request from:', notification.from); // Verifica que el JID es correcto
                                        onAcceptContactRequest(notification.from);
                                    }}
                                    className="ml-4 bg-green-500 text-white px-2 py-1 rounded"
                                >
                                    Aceptar
                                </button>
                            </>
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