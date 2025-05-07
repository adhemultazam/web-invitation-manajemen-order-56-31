
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  logo?: string;  // Added logo property to User type
};

type BrandSettings = {
  name: string;
  logo?: string;
  favicon?: string;
};

interface AuthContextType {
  user: User | null;
  brandSettings: BrandSettings;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateBrandSettings: (settings: Partial<BrandSettings>) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>; // Added updateUser function
}

// Create context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  brandSettings: { name: "Nikah Digital" },
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  updateBrandSettings: async () => {},
  updateUser: async () => {}, // Added default implementation
});

// Initial user data for demo purposes
const demoUser = {
  id: "1",
  name: "Admin",
  email: "admin@example.com",
  logo: "", // Added logo property to demoUser
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({ name: "Nikah Digital" });
  const navigate = useNavigate();
  
  // Check for saved user and brand settings in localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedBrandSettings = localStorage.getItem("brandSettings");
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        // If brand settings don't have a logo but user does, sync it
        if (!brandSettings.logo && parsedUser.logo) {
          updateBrandSettings({ logo: parsedUser.logo });
        }
      } catch (e) {
        console.error("Failed to parse saved user:", e);
      }
    }
    
    if (savedBrandSettings) {
      try {
        const parsedSettings = JSON.parse(savedBrandSettings) as BrandSettings;
        setBrandSettings(parsedSettings);
        
        // Apply favicon if it exists
        if (parsedSettings.favicon) {
          const existingFavicon = document.querySelector("link[rel*='icon']");
          if (existingFavicon) {
            existingFavicon.setAttribute("href", parsedSettings.favicon);
          } else {
            const newFavicon = document.createElement("link");
            newFavicon.rel = "icon";
            newFavicon.href = parsedSettings.favicon;
            document.head.appendChild(newFavicon);
          }
        }
        
        // Sync logo between user and brand settings if needed
        if (user && !user.logo && parsedSettings.logo) {
          updateUser({ ...user, logo: parsedSettings.logo });
        }
      } catch (e) {
        console.error("Failed to parse saved brand settings:", e);
      }
    }
  }, []);
  
  // Login function (simulated)
  const login = async (email: string, password: string): Promise<boolean> => {
    // For demo, we'll accept any email with "admin" and password "password"
    if (email.includes("admin") && password === "password") {
      setUser(demoUser);
      localStorage.setItem("user", JSON.stringify(demoUser));
      return true;
    }
    return false;
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Berhasil keluar dari sistem");
  };
  
  // Update brand settings
  const updateBrandSettings = async (settings: Partial<BrandSettings>): Promise<void> => {
    // Update brand settings with new values
    const newSettings = { ...brandSettings, ...settings };
    setBrandSettings(newSettings);
    localStorage.setItem("brandSettings", JSON.stringify(newSettings));
    
    // Sync logo with user if needed
    if (user && settings.logo && user.logo !== settings.logo) {
      updateUser({ ...user, logo: settings.logo });
    }
  };
  
  // Update user function
  const updateUser = async (userData: Partial<User>): Promise<void> => {
    if (!user) return;
    
    // Update user with new values
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    // Sync logo with brandSettings if needed
    if (userData.logo && brandSettings.logo !== userData.logo) {
      updateBrandSettings({ ...brandSettings, logo: userData.logo });
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      brandSettings, 
      isAuthenticated: !!user, 
      login, 
      logout,
      updateBrandSettings,
      updateUser, // Added updateUser to the context
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for easy context use
export const useAuth = () => useContext(AuthContext);
