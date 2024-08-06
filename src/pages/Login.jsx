import { useState } from "react";
import CustomTextInput from "../components/CustomTextInput";
import styles from "./Login.module.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email: ", email);
        console.log("Password: ", password);
    };

    return (
        <div className={styles.maingroup}>
            <h1 className='text-4xl'>Login</h1>
            <form className={styles.formgroup} onSubmit={handleSubmit}>
                <CustomTextInput
                    label="Email"
                    name="email"
                    placeholder="tu usuario"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <CustomTextInput
                    label="Password"
                    name="password"
                    placeholder="tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className='bg-black text-white px-4 py-2'>Login</button>
            </form>
        </div>
    );
}

export default Login;
