
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Define a user type
interface User {
  name: string;
  email: string;
  profileImage?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  brandSettings: {
    name: string;
    logo: string;
    favicon?: string;
  };
  login: (username: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  updateBrandSettings: (settings: { name: string; logo: string; favicon?: string }) => void;
  updateUserProfile: (profile: Partial<User>) => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const defaultBrandSettings = {
  name: "Undangan Digital",
  logo: "",
  favicon: ""
};

const defaultUser = {
  name: "Admin User",
  email: "admin@example.com",
  profileImage: ""
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  brandSettings: defaultBrandSettings,
  login: async () => false,
  logout: () => {},
  updateBrandSettings: () => {},
  updateUserProfile: () => {},
  updatePassword: async () => false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Use localStorage to persist auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = sessionStorage.getItem("isAuthenticated") || localStorage.getItem("isAuthenticated");
    return savedAuth === "true";
  });
  
  // Store user data
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : isAuthenticated ? defaultUser : null;
  });
  
  // Use localStorage to persist brand settings
  const [brandSettings, setBrandSettings] = useState(() => {
    const savedSettings = localStorage.getItem("brandSettings");
    return savedSettings ? JSON.parse(savedSettings) : defaultBrandSettings;
  });
  
  // Effect to save auth state when it changes
  useEffect(() => {
    // Auth state is managed in login/logout functions now to respect rememberMe
    
    // If logging out, set user to null
    if (!isAuthenticated) {
      setUser(null);
    } else if (!user) {
      // If logging in and no user exists, set default user
      setUser(defaultUser);
    }
  }, [isAuthenticated, user]);
  
  // Effect to save user data when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);
  
  // Effect to save brand settings when they change
  useEffect(() => {
    localStorage.setItem("brandSettings", JSON.stringify(brandSettings));
  }, [brandSettings]);
  
  // Login function - in a real app this would call an API
  const login = async (username: string, password: string, rememberMe = false): Promise<boolean> => {
    try {
      // Simple validation for demo purposes
      if (username === "admin" && password === "admin") {
        setIsAuthenticated(true);
        setUser(defaultUser); // Set default user on login
        
        // Store auth state based on rememberMe preference
        if (rememberMe) {
          localStorage.setItem("isAuthenticated", "true");
          // Remove from session storage to avoid conflicts
          sessionStorage.removeItem("isAuthenticated");
        } else {
          sessionStorage.setItem("isAuthenticated", "true");
          // Remove from local storage to respect user preference
          localStorage.removeItem("isAuthenticated");
        }
        
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
    setUser(null);
    
    // Clear auth state from both storage options
    localStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("isAuthenticated");
    
    toast.success("Logout berhasil", {
      description: "Anda telah keluar dari sistem."
    });
  };
  
  // Update brand settings
  const updateBrandSettings = (settings: { name: string; logo: string; favicon?: string }) => {
    setBrandSettings({
      ...brandSettings,
      ...settings
    });
  };

  // Update user profile
  const updateUserProfile = (profile: Partial<User>) => {
    if (user) {
      setUser({
        ...user,
        ...profile
      });
      toast.success("Profil berhasil diperbarui");
    }
  };

  // Update password
  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // In a real app, this would make an API call
    // For demo purposes, we'll just check if the current password is "admin"
    if (currentPassword === "admin") {
      // Password updated successfully
      toast.success("Password berhasil diperbarui");
      return true;
    } else {
      // Current password is incorrect
      toast.error("Password saat ini tidak sesuai");
      return false;
    }
  };
  
  const value = {
    isAuthenticated,
    user,
    brandSettings,
    login,
    logout,
    updateBrandSettings,
    updateUserProfile,
    updatePassword
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
