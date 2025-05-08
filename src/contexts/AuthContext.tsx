
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface BrandSettings {
  name: string;
  logo?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  brandSettings: BrandSettings;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  brandSettings: {
    name: "Undangan Digital",
    logo: "",
  },
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({
    name: "Undangan Digital",
    logo: "",
  });

  useEffect(() => {
    // Check if user is already authenticated
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
      
      // Load user data if available
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user data", e);
        }
      } else {
        // Default user if authenticated but no data
        setUser({
          name: "Admin",
          email: "admin@example.com",
        });
      }
      
      // Load brand settings if available
      const storedSettings = localStorage.getItem("brandSettings");
      if (storedSettings) {
        try {
          setBrandSettings(JSON.parse(storedSettings));
        } catch (e) {
          console.error("Failed to parse stored brand settings", e);
        }
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple mock authentication
    if (email === "admin@example.com" && password.length >= 6) {
      const userData = {
        name: "Admin",
        email: "admin@example.com",
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store authentication state and user data
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Mock loading for realistic feel
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success("Login berhasil");
      return true;
    }
    
    toast.error("Login gagal", {
      description: "Email atau password tidak valid",
    });
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    toast.success("Logout berhasil");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        brandSettings,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
