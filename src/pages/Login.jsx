import {useState} from "react";
import CustomTextInput from "../components/CustomTextInput";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email: ", email);
        console.log("Password: ", password);
    };

    return (
        <div className="flex justify-center mt-[20vh] ">
            <div className="flex flex-col items-center">
                <h1 className='text-4xl'>Ingresa tus credenciales</h1>
                <form onSubmit={handleSubmit} className="w-full mt-4">
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
                </form>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-full mt-2">
                    Log in
                </button>
            </div>
        </div>
    );
}

export default Login;
