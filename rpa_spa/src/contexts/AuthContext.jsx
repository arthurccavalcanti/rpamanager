import apiClient from '../api/axiosInstance';
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getAccessToken, setAccessToken, removeAccessToken } from '../utils/localStorageService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          const response = await apiClient.get('/user/me');
          setUser(response.data);
          setUserRole(response.data.role);
          setIsAuthenticated(true);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
          console.error('Validação falhou:\n', error);
          logout();
        }
      }
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);

  // LOGIN
  const login = useCallback(async (userEmail, userPassword) => {
    try {
      const reqBody = {username: userEmail, password: userPassword};
      const response = await apiClient.post('/auth/login', reqBody);
      const user = response.data;
      const token = response.headers['authorization'].split(' ')[1]; // Regex para remover 'Bearer ' do header
      setAccessToken(token);
      setIsAuthenticated(true);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      setUserRole(user.role);
      return {success: true, error: null};
    } catch (err) {
      return {success: false, error: err};
    }
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
    removeAccessToken();
    delete apiClient.defaults.headers.common['Authorization'];
  }, []);

  // REGISTRO
  const register = async (userEmail, userPassword) => {
    try {
        const reqBody = {username: userEmail, password: userPassword};
        await apiClient.post('/auth/register', reqBody);
        return {success: true, error: null};
    } catch (err) {
      console.log("Erro no cadastro.");
      return {success: false, error: err};
    }
  };

  const setUserRole = (role) => {
    if (role == 'ADMIN') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }

  const contextValue = {
    isAuthenticated,
    isAdmin,
    user,
    isLoading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};