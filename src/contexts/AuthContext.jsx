// src/contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getOneById } from "@apis/cinemaService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [cinema, setCinema] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userFromCookie = Cookies.get("user");
        if (userFromCookie) {
            try {
                const parsedUser = JSON.parse(userFromCookie);
                setUser(parsedUser);

                // ✅ Nếu là Staff thì gọi API để lấy cinema
                if (parsedUser.roleName === 'Staff') {
                    getOneById(parsedUser.cinemaId)
                        .then(res => {
                            const cinemaData = {
                                _id: res.data._id,
                                name: res.data.name,
                            };
                            setCinema(cinemaData);
                            localStorage.setItem("cinemaStaff", JSON.stringify(cinemaData)); // Optional
                        })
                        .catch(err => {
                            console.error("Failed to fetch cinema", err);
                            setCinema(null);
                        });
                }
            } catch {
                setUser(null);
            }
        }

        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, cinema, setCinema, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
