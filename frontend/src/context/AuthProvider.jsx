import React, { createContext, useEffect, useState, useMemo } from 'react'
import axios from 'axios';

export const authContext = createContext();
const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    const value = useMemo(() => ({
        isAuth,
        setIsAuth,
        user,
        setUser,
        isLoading,
        setIsLoading
    }), [isAuth, user, isLoading]);
    const autoLogin = async (token) => {
        setIsLoading(true)
        try {
            console.log("inside auth provider")
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/auto-login`, { jwtToken: token }, {
                withCredentials: true,
            })
            console.log(data)
            setUser(data.user)
            setIsAuth(true)
            // navigate('/protected/profile')
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        const token = localStorage.getItem('jwtToken')
        if (token) {
            autoLogin(token)
        }else{
            setIsLoading(false)
        }
    }, [])
    console.log(isLoading, "inside authcontext")
    return (
        <>

            <authContext.Provider value={value}>
                {children}
            </authContext.Provider>
        </>
    )
}

export default AuthProvider;
