import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  login: (user: AdminUser, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('ai_test_admin_user');
    return saved ? JSON.parse(saved) : { id: 'admin_1', name: 'Dr. Sarah Connor', email: 'admin@test.com', role: 'admin' };
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('ai_test_token') || 'demo_admin_token';
  });

  const login = (userData: AdminUser, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('ai_test_admin_user', JSON.stringify(userData));
    localStorage.setItem('ai_test_token', tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ai_test_admin_user');
    localStorage.removeItem('ai_test_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
