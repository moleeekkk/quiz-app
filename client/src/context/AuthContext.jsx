import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('quiz_admin_token') || null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('quiz_admin_token');
    setToken(null);
    setAdminUser(null);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const user = await api.verifyAdminToken();
          setAdminUser(user);
        } catch (err) {
          console.error('Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token, logout]);

  const login = async (email, password) => {
    const data = await api.loginAdmin({ email, password });
    localStorage.setItem('quiz_admin_token', data.token);
    setToken(data.token);
    setAdminUser(data);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        token,
        isAdmin: !!adminUser,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
