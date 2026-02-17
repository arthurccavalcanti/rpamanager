import { useAuth } from "../contexts/AuthContext";
import apiClient from "./axiosInstance";
import { useEffect } from "react";

const LogoutHandler = () => {

    const { logout }  = useAuth();

    useEffect(() => {
    const responseInterceptor = apiClient.interceptors.response.use(
        (response) => response,
        async (error) => {
        if (error.response && error.response.headers['invalid-token']) {
            console.log('Token inválido. Deslogando...');
            logout();
        }
        return Promise.reject(error); // Repassa erro
        }
    );

    return () => {
        // Descarta interceptor quando é deslogado.
        apiClient.interceptors.response.eject(responseInterceptor); 
    };
    }, [logout]); // Roda novamente se usuário desloga.

    return null;
};

export default LogoutHandler;