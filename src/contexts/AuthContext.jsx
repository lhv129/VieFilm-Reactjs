// src/contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // ➕ thêm loading

    useEffect(() => {
        const userFromCookie = Cookies.get("user");
        if (userFromCookie) {
            try {
                setUser(JSON.parse(userFromCookie));
            } catch {
                setUser(null);
            }
        }
        setLoading(false); // ✅ đánh dấu đã xong
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
