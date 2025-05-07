
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
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
}

// Create context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  brandSettings: { name: "Nikah Digital" },
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  updateBrandSettings: async () => {},
});

// Initial user data for demo purposes
const demoUser = {
  id: "1",
  name: "Admin",
  email: "admin@example.com",
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
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user:", e);
      }
    }
    
    if (savedBrandSettings) {
      try {
        setBrandSettings(JSON.parse(savedBrandSettings));
        
        // Apply favicon if it exists
        const settings = JSON.parse(savedBrandSettings) as BrandSettings;
        if (settings.favicon) {
          const existingFavicon = document.querySelector("link[rel*='icon']");
          if (existingFavicon) {
            existingFavicon.setAttribute("href", settings.favicon);
          } else {
            const newFavicon = document.createElement("link");
            newFavicon.rel = "icon";
            newFavicon.href = settings.favicon;
            document.head.appendChild(newFavicon);
          }
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
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      brandSettings, 
      isAuthenticated: !!user, 
      login, 
      logout,
      updateBrandSettings
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for easy context use
export const useAuth = () => useContext(AuthContext);
