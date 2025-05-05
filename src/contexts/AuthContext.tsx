
import React, { createContext, useContext, useState, useEffect } from "react";

// Define types for our context
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  logo?: string; // Added logo property as optional
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember: boolean) => boolean;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  updateUser: () => {},
});

// Define the provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check for saved authentication on component mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        setUser(parsedAuth.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing saved auth:", error);
        localStorage.removeItem("auth");
      }
    }
  }, []);

  // Login function that accepts a remember parameter
  const login = (email: string, password: string, remember: boolean): boolean => {
    // This is a mock authentication - in a real app, this would call an API
    if (email === "admin@example.com" && password === "password") {
      const userData: User = {
        id: "1",
        name: "Admin",
        email: "admin@example.com",
        role: "admin",
        logo: "", // Initialize with empty string
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Save to localStorage if remember is true
      if (remember) {
        localStorage.setItem("auth", JSON.stringify({
          user: userData,
          timestamp: new Date().getTime(),
        }));
      }
      
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
  };

  // Update user function to modify user data
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    
    // If user was remembered, update localStorage as well
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        localStorage.setItem("auth", JSON.stringify({
          ...parsedAuth,
          user: updatedUser,
        }));
      } catch (error) {
        console.error("Error updating saved user:", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export function useAuth() {
  return useContext(AuthContext);
}
