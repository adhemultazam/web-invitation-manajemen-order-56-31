
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthState } from '@/types/types';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Default admin credentials (in a real app, these would be stored securely on a server)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      isAuthenticated: !!storedUser
    };
  });

  // Persist auth state to localStorage when it changes
  useEffect(() => {
    if (authState.user) {
      localStorage.setItem('user', JSON.stringify(authState.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [authState.user]);

  const login = async (username: string, password: string): Promise<boolean> => {
    // For demo purposes, we're using a simple credential check
    // In a real app, this would make an API request to validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const user: User = {
        username,
        name: 'Administrator',
        role: 'admin'
      };
      
      setAuthState({
        user,
        isAuthenticated: true
      });
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
