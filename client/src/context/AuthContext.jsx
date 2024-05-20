import React, { createContext, useState, useEffect } from 'react';
import axios from "axios";
export const AuthContext = createContext();

export default ({ children }) => {
    const [globalUser, setGlobalUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(true);

    // useEffect(() => {
    //     getUser();
    // }, []);

    async function getUser() {
        try {
            const res = await axios.get("/info");
            if (res.status === 200) {
                setGlobalUser(res.data.user);
                setIsAuthenticated(true);
                setIsLoaded(true);
            } else {
                setIsAuthenticated(false);
                setIsLoaded(true);
            }
        } catch (error) {
            setIsAuthenticated(false);
            setIsLoaded(true);
        }
    }

    async function loginAndRegister(user) {
        try {
            const res = await axios.post("/register", {
                address: user.wallet.address,
                username: user.twitter.username,
                profileImg: user.twitter.profilePictureUrl,
                privyId: user.id.substring('did:privy:'.length)
            });
            if (res.status === 200) {
                setGlobalUser(res.data.user);
                setIsAuthenticated(true);
                setIsLoaded(true);
            } else {
                setIsAuthenticated(false);
                setIsLoaded(true);
            }
        } catch (error) {
            console.log(error);
            setIsAuthenticated(false);
            setIsLoaded(true);
        }
    }

    return (
        <div>
            {!isLoaded ? <div></div> :
                <AuthContext.Provider value={{ isAuthenticated, globalUser, setGlobalUser, setIsAuthenticated, setIsLoaded, loginAndRegister }}>
                    {children}
                </AuthContext.Provider>}
        </div>
    )
}