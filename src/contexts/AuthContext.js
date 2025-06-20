// src/contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as authLogin, register as authRegister, logout as authLogout } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check for token on initial load
  useEffect(() => {
    const validateToken = async () => {
      try {
        if (token) {
          // Here you would typically validate the token with your backend
          // For now, we'll just store it
          localStorage.setItem('token', token);
        }
      } catch (err) {
        console.error('Token validation failed:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const { user, token } = await authLogin(credentials);
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const { user, token } = await authRegister(userData);
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);