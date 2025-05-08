
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  name: string;
  email: string;
  avatar?: string;
  profileImage?: string; // Added missing property
}

interface BrandSettings {
  name: string;
  logo?: string;
  favicon?: string; // Added missing property
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  brandSettings: BrandSettings;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateBrandSettings: (settings: Partial<BrandSettings>) => void; // Added missing method
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>; // Added missing method
  updateUserProfile: (profile: Partial<User>) => void; // Added missing method
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
  updateBrandSettings: () => {}, // Added default implementation
  updatePassword: async () => false, // Added default implementation
  updateUserProfile: () => {}, // Added default implementation
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({
    name: "Undangan Digital",
    logo: "",
    favicon: "", // Initialize with empty string
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

  // Implement the missing methods
  const updateBrandSettings = (settings: Partial<BrandSettings>) => {
    const updatedSettings = { ...brandSettings, ...settings };
    setBrandSettings(updatedSettings);
    localStorage.setItem("brandSettings", JSON.stringify(updatedSettings));
  };

  const updateUserProfile = (profile: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...profile };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // In a real app, we would verify the current password on the server
    // For this mock implementation, we'll simulate success if the current password meets our criterion
    if (currentPassword.length >= 6) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success("Password berhasil diperbarui");
      return true;
    }
    
    toast.error("Password saat ini tidak valid");
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        brandSettings,
        login,
        logout,
        updateBrandSettings,
        updateUserProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
