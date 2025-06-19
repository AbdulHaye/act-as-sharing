import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  createdAt: string;
  isEmailVerified?: boolean; // Optional field
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { firstname: string; lastname: string; email: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshToken: () => Promise<string>;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      console.log('Initializing auth - Stored user:', storedUser, 'Token:', token);

      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          if (parsedUser.isEmailVerified === false) { // Only check if explicitly false
            setIsAuthenticated(false);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error('Error parsing stored user:', err);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const redirectToDashboard = (role: string) => {
    switch (role) {
      case 'admin':
        navigate('/dashboard/admin');
        break;
      case 'host':
        navigate('/dashboard/host');
        break;
      case 'guest':
        navigate('/dashboard/guest');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const refreshToken = async (): Promise<string> => {
    try {
      const response = await axiosInstance.post('/users/refresh-token', {}, {
        headers: { 'X-Skip-Redirect': 'true' },
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/users/login', { email, password });
      const { token, user } = response.data;
      console.log('Login response:', response.data); // Debug log
      // Default isEmailVerified to true if not provided
      const isVerified = user.isEmailVerified !== false; // Treat undefined as true
      if (!isVerified) {
        throw new Error('Please verify your email before logging in');
      }
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ ...user, isEmailVerified: isVerified }));
      setUser({ ...user, isEmailVerified: isVerified });
      setIsAuthenticated(true);
      redirectToDashboard(user.role);
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      if (error.response?.status === 403) {
        throw new Error('Please verify your email before logging in');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid credentials');
      }
      throw error; // Re-throw other errors
    }
  };

  const register = async (userData: { firstname: string; lastname: string; email: string; password: string; role: string }) => {
    try {
      const response = await axiosInstance.post('/users/register', userData);
      const { message } = response.data;
      console.log('Registration successful:', message);
      return message;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      console.error('Registration failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: errorMessage,
      });
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated, refreshToken, setUser, loading }}
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