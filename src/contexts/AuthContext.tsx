import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
  profileImage?: string;
}

interface BrandSettings {
  name: string;
  logo?: string;
  favicon?: string; 
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (profile: Partial<User>) => void;
  brandSettings: BrandSettings;
  updateBrandSettings: (settings: Partial<BrandSettings>) => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
  updateUserProfile: () => {},
  brandSettings: { name: "" },
  updateBrandSettings: () => {},
  updatePassword: async () => false,
});

export const useAuth = () => useContext(AuthContext);

// Default login credentials
const DEFAULT_EMAIL = "admin@example.com";
const DEFAULT_PASSWORD = "password123";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({ name: "Undangan Digital" });
  const [currentPassword, setCurrentPassword] = useState<string>(DEFAULT_PASSWORD);

  // Load auth state from localStorage on init
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const { isAuthenticated: stored, user, password } = JSON.parse(storedAuth);
        setIsAuthenticated(stored);
        setUser(user || null);
        if (password) {
          setCurrentPassword(password);
        }
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

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) return false;

    // Simple validation to ensure some input is provided
    if (email.trim() === "" || password.trim() === "") {
      return false;
    }

    // Check against the stored credentials
    const storedAuth = localStorage.getItem("auth");
    let storedEmail = DEFAULT_EMAIL;
    let storedPassword = currentPassword;

    if (storedAuth) {
      try {
        const { user, password } = JSON.parse(storedAuth);
        if (user && user.email) {
          storedEmail = user.email;
        }
        if (password) {
          storedPassword = password;
        }
      } catch (e) {
        console.error("Failed to parse auth data for login", e);
      }
    }

    // Validate credentials
    if (email !== storedEmail || password !== storedPassword) {
      return false;
    }

    // If we get here, login is successful
    const demoUser = {
      name: user?.name || "Admin",
      email: storedEmail,
      profileImage: user?.profileImage || "",
    };

    setUser(demoUser);
    setIsAuthenticated(true);

    // Store auth state in localStorage
    localStorage.setItem(
      "auth",
      JSON.stringify({
        isAuthenticated: true,
        user: demoUser,
        password: storedPassword
      })
    );

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // We keep the password in localStorage for future logins
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const { password, user } = JSON.parse(storedAuth);
        localStorage.setItem(
          "auth",
          JSON.stringify({
            isAuthenticated: false,
            user,  // Keep the user data for when they log back in
            password
          })
        );
      } catch (e) {
        localStorage.removeItem("auth");
      }
    } else {
      localStorage.removeItem("auth");
    }
  };

  const updateUserProfile = (profile: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...profile };
    setUser(updatedUser);

    // Update localStorage
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        localStorage.setItem(
          "auth",
          JSON.stringify({
            ...parsed,
            user: updatedUser,
          })
        );
      } catch (e) {
        console.error("Error updating user profile in localStorage", e);
      }
    } else {
      localStorage.setItem(
        "auth",
        JSON.stringify({
          isAuthenticated,
          user: updatedUser,
          password: currentPassword
        })
      );
    }
  };

  const updatePassword = async (currentEnteredPassword: string, newPassword: string): Promise<boolean> => {
    // Verify current password
    if (currentEnteredPassword !== currentPassword) {
      return false;
    }

    // Update password
    setCurrentPassword(newPassword);

    // Update localStorage
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        localStorage.setItem(
          "auth",
          JSON.stringify({
            ...parsed,
            password: newPassword
          })
        );
      } catch (e) {
        console.error("Error updating password in localStorage", e);
      }
    } else {
      localStorage.setItem(
        "auth",
        JSON.stringify({
          isAuthenticated,
          user,
          password: newPassword
        })
      );
    }

    return true;
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
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
