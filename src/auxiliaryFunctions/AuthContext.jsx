import { createContext, useState, useEffect } from 'react';
import { connectToXMPP } from './connectToXMPP';

const AuthContext = createContext(undefined);

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const email = localStorage.getItem('email');
        const password = localStorage.getItem('password');

        if (email && password) {
            connectToXMPP(email, password)
                .then(client => {
                    setUser({ email, client });
                })
                .catch(error => {
                    console.error('Error al conectar automáticamente:', error);
                });
        }
    }, []);

    const login = async (email, password) => {
        try {
            const client = await connectToXMPP(email, password);
            setUser({ email, client });
            localStorage.setItem('email', email);
            localStorage.setItem('password', password);
        } catch (error) {
            console.error('Error al conectar:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('email');
        localStorage.removeItem('password');

        // regresa a la página de login
        window.location.href = '/';

    };

    const isAuthenticated = () => {
        return !!user;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;