import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
  profileImage?: string;
}

interface BrandSettings {
  name: string;
  logo?: string;
  favicon?: string; // Added favicon property
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (profile: Partial<User>) => void;
  brandSettings: BrandSettings;
  updateBrandSettings: (settings: Partial<BrandSettings>) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
  updateUserProfile: () => {},
  brandSettings: { name: "" },
  updateBrandSettings: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({ name: "Undangan Digital" });

  // Load auth state from localStorage on init
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const { isAuthenticated: stored, user } = JSON.parse(storedAuth);
        setIsAuthenticated(stored);
        setUser(user || null);
      } catch (e) {
        console.error("Failed to parse auth data", e);
        localStorage.removeItem("auth");
      }
    }

    // Load brand settings
    const storedSettings = localStorage.getItem("brandSettings");
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings);
        setBrandSettings(settings);
      } catch (e) {
        console.error("Failed to parse brand settings", e);
      }
    }
  }, []);

  // For demonstration, use a mock login that always succeeds
  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) return false;

    // Simple validation to ensure some input is provided
    if (email.trim() === "" || password.trim() === "") {
      return false;
    }

    // Demo user setup
    const demoUser = {
      name: "Admin",
      email: email,
      profileImage: "",
    };

    setUser(demoUser);
    setIsAuthenticated(true);

    // Store auth state in localStorage
    localStorage.setItem(
      "auth",
      JSON.stringify({
        isAuthenticated: true,
        user: demoUser,
      })
    );

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("auth");
  };

  const updateUserProfile = (profile: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...profile };
    setUser(updatedUser);

    // Update localStorage
    localStorage.setItem(
      "auth",
      JSON.stringify({
        isAuthenticated,
        user: updatedUser,
      })
    );
  };

  const updateBrandSettings = (settings: Partial<BrandSettings>) => {
    const updatedSettings = { ...brandSettings, ...settings };
    setBrandSettings(updatedSettings);

    // Save to localStorage
    localStorage.setItem("brandSettings", JSON.stringify(updatedSettings));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        updateUserProfile,
        brandSettings,
        updateBrandSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
