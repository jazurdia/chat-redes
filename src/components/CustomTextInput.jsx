import PropTypes from "prop-types";
import styles from "./CustomTextInput.module.css"; // Importa los estilos como módulos

function CustomTextInput({ label, name, placeholder, value, onChange }) {
    return (
        <div className={styles.formGroup}>
            {label && <label htmlFor={name} className={styles.label}>{label}</label>}
            <input
                type={name === "password" ? "password" : "text"}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
}

CustomTextInput.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired, // Añadir el tipo para value
    onChange: PropTypes.func.isRequired, // Añadir el tipo para onChange
};

CustomTextInput.defaultProps = {
    label: '',
    placeholder: '',
};

export default CustomTextInput;
