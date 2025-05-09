
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  brandSettings: {
    name: string;
    logo: string;
  };
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateBrandSettings: (settings: { name: string; logo: string }) => void;
}

const defaultBrandSettings = {
  name: "Undangan Digital",
  logo: ""
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  brandSettings: defaultBrandSettings,
  login: async () => false,
  logout: () => {},
  updateBrandSettings: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Use localStorage to persist auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = sessionStorage.getItem("isAuthenticated");
    return savedAuth === "true";
  });
  
  // Use localStorage to persist brand settings
  const [brandSettings, setBrandSettings] = useState(() => {
    const savedSettings = localStorage.getItem("brandSettings");
    return savedSettings ? JSON.parse(savedSettings) : defaultBrandSettings;
  });
  
  // Effect to save auth state when it changes
  useEffect(() => {
    sessionStorage.setItem("isAuthenticated", String(isAuthenticated));
  }, [isAuthenticated]);
  
  // Effect to save brand settings when they change
  useEffect(() => {
    localStorage.setItem("brandSettings", JSON.stringify(brandSettings));
  }, [brandSettings]);
  
  // Login function - in a real app this would call an API
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Simple validation for demo purposes
      if (username === "admin" && password === "admin") {
        setIsAuthenticated(true);
        toast.success("Login berhasil!", {
          description: "Selamat datang kembali!"
        });
        return true;
      } else {
        toast.error("Login gagal!", {
          description: "Username atau password salah. Coba lagi."
        });
        return false;
      }
    } catch (error) {
      toast.error("Login error", {
        description: "Terjadi kesalahan saat login. Coba lagi nanti."
      });
      console.error("Login error:", error);
      return false;
    }
  };
  
  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    toast.success("Logout berhasil", {
      description: "Anda telah keluar dari sistem."
    });
  };
  
  // Update brand settings
  const updateBrandSettings = (settings: { name: string; logo: string }) => {
    setBrandSettings(settings);
  };
  
  const value = {
    isAuthenticated,
    brandSettings,
    login,
    logout,
    updateBrandSettings
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
