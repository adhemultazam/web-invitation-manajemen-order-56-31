
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  brandSettings: {
    name: string;
    logo: string;
  };
  updateBrandSettings: (settings: { name?: string; logo?: string }) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  username: "",
  login: async () => false,
  logout: () => {},
  brandSettings: {
    name: "Nikah Digital",
    logo: "",
  },
  updateBrandSettings: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [brandSettings, setBrandSettings] = useState({
    name: "Nikah Digital",
    logo: "",
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setIsAuthenticated(parsedAuth.isAuthenticated);
        setUsername(parsedAuth.username || "");
      } catch (e) {
        console.error("Error parsing auth data:", e);
      }
    }

    // Load brand settings
    const storedSettings = localStorage.getItem("brandSettings");
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        setBrandSettings(parsedSettings);
      } catch (e) {
        console.error("Error parsing brand settings:", e);
      }
    }
  }, []);

  // Mock login function
  const login = async (username: string, password: string) => {
    // Demo credentials for testing
    if (username && password) {
      setIsAuthenticated(true);
      setUsername(username);
      
      // Save auth state to localStorage
      localStorage.setItem(
        "auth",
        JSON.stringify({ isAuthenticated: true, username })
      );
      
      toast.success("Login berhasil", {
        description: `Selamat datang, ${username}!`,
      });
      
      return true;
    }
    
    toast.error("Login gagal", {
      description: "Username atau password salah",
    });
    
    return false;
  };

  // Logout function
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUsername("");
    
    // Clear auth state from localStorage
    localStorage.setItem(
      "auth",
      JSON.stringify({ isAuthenticated: false, username: "" })
    );
    
    // Clear the lastVisitedPath to ensure clean state on next login
    sessionStorage.removeItem("lastVisitedPath");
    
    toast.success("Logout berhasil");
  }, []);

  // Update brand settings
  const updateBrandSettings = useCallback((settings: { name?: string; logo?: string }) => {
    setBrandSettings(prev => {
      const newSettings = {
        ...prev,
        ...settings,
      };
      
      // Save to localStorage
      localStorage.setItem("brandSettings", JSON.stringify(newSettings));
      
      return newSettings;
    });
  }, []);

  const contextValue = {
    isAuthenticated,
    username,
    login,
    logout,
    brandSettings,
    updateBrandSettings,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
