import PropTypes from "prop-types";

function Notifications({notifications}) { // Recibir las notificaciones como props
    return (
        <div className="notifications">
            <h2>Notificaciones</h2>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>
                        {notification.type === 'contact_request' && (
                            <>
                                <strong>Solicitud de contacto:</strong> {notification.from}
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
};

