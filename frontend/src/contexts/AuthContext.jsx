import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [loading, setLoading] = useState(true);

  // Get API base URL from Vite environment variables
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/profile`);
          setUser(response.data);
          const storedRole = localStorage.getItem('userRole');
          if (storedRole) setUserRole(storedRole);
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email });
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      console.log('Login response:', response.data);

      const { token: newToken, role } = response.data;
      setToken(newToken);
      setUserRole(role);
      localStorage.setItem('token', newToken);
      localStorage.setItem('userRole', role);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      // Fetch user profile
      const profileResponse = await axios.get(`${API_BASE_URL}/profile`);
      console.log('Profile response:', profileResponse.data);
      setUser(profileResponse.data);

      return { success: true, role };
    } catch (error) {
      console.error('Login error:', error);
      const errorData = error.response?.data;
      return { 
        success: false, 
        error: errorData?.error || error.message || 'Login failed',
        attemptsLeft: errorData?.attemptsLeft,
        lockedUntil: errorData?.lockedUntil
      };
    }
  };

  const register = async (username, email, password, role) => {
    try {
      console.log('Attempting registration with:', { username, email, role });
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        username,
        email,
        password,
        role
      });
      console.log('Registration response:', response.data);
      return { success: true, role: response.data.role };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/profile`, profileData);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Profile update failed' 
      };
    }
  };

  const value = {
    user,
    token,
    userRole,
    login,
    register,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
