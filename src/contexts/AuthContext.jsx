// src/contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userFromCookie = Cookies.get("user");
        if (userFromCookie) {
            try {
                setUser(JSON.parse(userFromCookie));
            } catch {
                setUser(null);
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
