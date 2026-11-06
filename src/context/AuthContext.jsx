import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('medicare_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and check current user on app start
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('medicare_token');
      const storedUser = localStorage.getItem('medicare_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with server in background
          const response = await api.getMe();
          if (response && response.user) {
            setUser(response.user);
            localStorage.setItem('medicare_user', JSON.stringify(response.user));
          }
        } catch (err) {
          console.warn('Session verification failed, clearing expired session.');
          localStorage.removeItem('medicare_token');
          localStorage.removeItem('medicare_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    if (data.token && data.user) {
      localStorage.setItem('medicare_token', data.token);
      localStorage.setItem('medicare_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    if (data.token && data.user) {
      localStorage.setItem('medicare_token', data.token);
      localStorage.setItem('medicare_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('medicare_token');
    localStorage.removeItem('medicare_user');
    setUser(null);
    setToken(null);
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('medicare_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
