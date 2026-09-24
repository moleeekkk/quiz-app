import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Regular User Auth State
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(localStorage.getItem('quiz_user_token') || null);

  // Admin Auth State
  const [adminUser, setAdminUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('quiz_admin_token') || null);

  const [loading, setLoading] = useState(true);

  const logoutAdmin = useCallback(() => {
    localStorage.removeItem('quiz_admin_token');
    setToken(null);
    setAdminUser(null);
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem('quiz_user_token');
    setUserToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const promises = [];

      if (userToken) {
        promises.push(
          api.verifyUserToken()
            .then((data) => setUser(data))
            .catch(() => logoutUser())
        );
      }

      if (token) {
        promises.push(
          api.verifyAdminToken()
            .then((data) => setAdminUser(data))
            .catch(() => logoutAdmin())
        );
      }

      await Promise.allSettled(promises);
      setLoading(false);
    };

    initAuth();
  }, [token, userToken, logoutAdmin, logoutUser]);

  const loginAdmin = async (email, password) => {
    const data = await api.loginAdmin({ email, password });
    localStorage.setItem('quiz_admin_token', data.token);
    setToken(data.token);
    setAdminUser(data);
    return data;
  };

  const loginUser = async (email, password) => {
    const data = await api.loginUser({ email, password });
    localStorage.setItem('quiz_user_token', data.token);
    setUserToken(data.token);
    setUser(data);
    return data;
  };

  const registerUser = async (name, email, password) => {
    const data = await api.registerUser({ name, email, password });
    localStorage.setItem('quiz_user_token', data.token);
    setUserToken(data.token);
    setUser(data);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        // Regular User state & methods
        user,
        userToken,
        isUserLoggedIn: !!user,
        loginUser,
        registerUser,
        logoutUser,

        // Admin state & methods
        adminUser,
        token,
        isAdmin: !!adminUser,
        login: loginAdmin,
        logout: logoutAdmin,

        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

