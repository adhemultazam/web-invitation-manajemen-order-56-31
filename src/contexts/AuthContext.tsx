
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface User {
  name: string;
  email: string;
  profileImage?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  username: string;
  user?: User;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (profile: Partial<User>) => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  brandSettings: {
    name: string;
    logo: string;
    favicon?: string;
  };
  updateBrandSettings: (settings: { name?: string; logo?: string; favicon?: string }) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  username: "",
  login: async () => false,
  logout: () => {},
  updateUserProfile: () => {},
  updatePassword: async () => false,
  brandSettings: {
    name: "Nikah Digital",
    logo: "",
    favicon: "",
  },
  updateBrandSettings: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<User | undefined>(undefined);
  const [brandSettings, setBrandSettings] = useState({
    name: "Nikah Digital",
    logo: "",
    favicon: "",
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setIsAuthenticated(parsedAuth.isAuthenticated);
        setUsername(parsedAuth.username || "");
        
        // Initialize user if available
        if (parsedAuth.user) {
          setUser(parsedAuth.user);
        } else {
          // Create default user from username
          setUser({
            name: parsedAuth.username || "",
            email: `${parsedAuth.username || "user"}@example.com`,
          });
        }
      } catch (e) {
        console.error("Error parsing auth data:", e);
      }
    }

    // Load brand settings
    const storedSettings = localStorage.getItem("brandSettings");
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        setBrandSettings({
          ...parsedSettings,
          favicon: parsedSettings.favicon || "", // Ensure favicon exists
        });
      } catch (e) {
        console.error("Error parsing brand settings:", e);
      }
    }
  }, []);

  // Mock login function
  const login = async (username: string, password: string) => {
    // Demo credentials for testing
    if (username && password) {
      const newUser = {
        name: username,
        email: `${username}@example.com`,
      };
      
      setIsAuthenticated(true);
      setUsername(username);
      setUser(newUser);
      
      // Save auth state to localStorage
      localStorage.setItem(
        "auth",
        JSON.stringify({ 
          isAuthenticated: true, 
          username,
          user: newUser
        })
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
    setUser(undefined);
    
    // Clear auth state from localStorage
    localStorage.setItem(
      "auth",
      JSON.stringify({ isAuthenticated: false, username: "" })
    );
    
    // Clear the lastVisitedPath to ensure clean state on next login
    sessionStorage.removeItem("lastVisitedPath");
    
    toast.success("Logout berhasil");
  }, []);

  // Update user profile
  const updateUserProfile = useCallback((profile: Partial<User>) => {
    setUser(prev => {
      if (!prev) return profile as User;
      
      const updated = { ...prev, ...profile };
      
      // Update auth in localStorage
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        try {
          const parsedAuth = JSON.parse(storedAuth);
          localStorage.setItem(
            "auth",
            JSON.stringify({ 
              ...parsedAuth,
              user: updated 
            })
          );
        } catch (e) {
          console.error("Error updating user profile:", e);
        }
      }
      
      return updated;
    });
    
    toast.success("Profil berhasil diperbarui");
  }, []);

  // Update password
  const updatePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // In a real app, this would call an API to verify current password
    // Here we'll just simulate success
    await new Promise(resolve => setTimeout(resolve, 800));
    return true;
  }, []);

  // Update brand settings
  const updateBrandSettings = useCallback((settings: { name?: string; logo?: string; favicon?: string }) => {
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
    user,
    login,
    logout,
    updateUserProfile,
    updatePassword,
    brandSettings,
    updateBrandSettings,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
