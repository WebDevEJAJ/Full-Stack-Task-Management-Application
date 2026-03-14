'use client';

import React, { createContext, useState, useEffect } from 'react';
import { getProfile, login as loginAPI, register as registerAPI, logout as logoutAPI } from '../utils/apiService';
import { setAuthToken, removeAuthToken, getAuthToken } from '../utils/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (getAuthToken()) {
          const response = await getProfile();
          setUser(response.data.user);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        removeAuthToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (email, password, fullName) => {
    try {
      setError(null);
      const response = await registerAPI(email, password, fullName);
      setUser(response.data.user);
      setAuthToken(response.data.token);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await loginAPI(email, password);
      setUser(response.data.user);
      setAuthToken(response.data.token);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutAPI();
      setUser(null);
      removeAuthToken();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
