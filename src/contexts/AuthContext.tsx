
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define initial brand settings - these can be overridden from localStorage
const DEFAULT_BRAND = {
  name: "Order Management",
  logo: "/placeholder.svg"
};

// Define types for context
interface AuthContextType {
  isAuthenticated: boolean;
  user: UserType | null;
  login: (email: string, password: string, remember: boolean) => Promise<boolean>;
  logout: () => void;
  brandSettings: {
    name: string;
    logo: string;
  };
  updateBrandSettings: (settings: {name?: string, logo?: string}) => void;
}

interface UserType {
  id: string;
  email: string;
  name: string;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
  brandSettings: DEFAULT_BRAND,
  updateBrandSettings: () => {}
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [brandSettings, setBrandSettings] = useState(DEFAULT_BRAND);
  
  const navigate = useNavigate();
  
  // Load auth state from localStorage on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem("isAuthenticated");
      if (storedAuth === "true") {
        setIsAuthenticated(true);
        
        // Load user info if available
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error("Error parsing stored user:", e);
          }
        }
      }
    };
    
    const loadBrandSettings = () => {
      try {
        // First try to load from generalSettings
        const generalSettings = localStorage.getItem("generalSettings");
        if (generalSettings) {
          const settings = JSON.parse(generalSettings);
          const brandData = {
            name: settings.sidebarTitle || DEFAULT_BRAND.name,
            logo: settings.appLogo || DEFAULT_BRAND.logo
          };
          setBrandSettings(brandData);
        }
      } catch (e) {
        console.error("Error loading brand settings:", e);
      }
    };
    
    checkAuth();
    loadBrandSettings();
  }, []);
  
  // Update brand settings in context and localStorage
  const updateBrandSettings = (settings: {name?: string, logo?: string}) => {
    try {
      const newSettings = {
        ...brandSettings,
        ...settings
      };
      
      setBrandSettings(newSettings);
      
      // Update in localStorage
      const generalSettings = localStorage.getItem("generalSettings");
      const parsedSettings = generalSettings ? JSON.parse(generalSettings) : {};
      
      const updatedSettings = {
        ...parsedSettings,
        sidebarTitle: newSettings.name,
        appLogo: newSettings.logo
      };
      
      localStorage.setItem("generalSettings", JSON.stringify(updatedSettings));
    } catch (e) {
      console.error("Error updating brand settings:", e);
    }
  };
  
  // Mock login function - normally would call an API
  const login = async (email: string, password: string, remember: boolean): Promise<boolean> => {
    if (email === "admin@example.com" && password === "password") {
      // Store user info
      const userData = {
        id: "user-1",
        email: email,
        name: "Admin User"
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store in localStorage for persistence
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast.success("Login berhasil", {
        description: "Selamat datang di Aplikasi Manajemen Pesanan"
      });
      
      return true;
    } else {
      toast.error("Login gagal", {
        description: "Email atau password salah"
      });
      return false;
    }
  };
  
  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    navigate("/login");
  };
  
  // Provide context values
  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    brandSettings,
    updateBrandSettings
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
