
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define the user type
interface User {
  name: string;
  email: string;
  profileImage?: string;
}

// Define the context type
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile?: (profileData: Partial<User>) => void;
}

// Create the Auth context
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
});

// Dummy authentication function (replace with actual auth)
const authenticateUser = async (email: string, password: string): Promise<boolean> => {
  // In a real app, you would call an API here
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo purposes, we'll accept any email with a password of "password"
      if (password === "password") {
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};

// Create the Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      const userAuth = localStorage.getItem("isAuthenticated");
      if (userAuth === "true") {
        setIsAuthenticated(true);
        
        // Load user data if available
        try {
          const savedProfile = localStorage.getItem("userProfile");
          if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            setUser({
              name: "Admin", // Default name
              email: profile.email || "admin@example.com",
              profileImage: profile.profileImage || "/placeholder.svg"
            });
          } else {
            // Set default user if no profile found
            setUser({
              name: "Admin",
              email: "admin@example.com",
              profileImage: "/placeholder.svg"
            });
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
          // Fallback to default user
          setUser({
            name: "Admin",
            email: "admin@example.com",
            profileImage: "/placeholder.svg"
          });
        }
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const isValid = await authenticateUser(email, password);
      
      if (isValid) {
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);
        
        // Save user profile data
        const userProfile = {
          name: "Admin", // Default name
          email: email,
          profileImage: "/placeholder.svg" // Default profile image
        };
        
        setUser(userProfile);
        
        // Store profile in localStorage if it doesn't exist yet
        if (!localStorage.getItem("userProfile")) {
          localStorage.setItem("userProfile", JSON.stringify({
            email: email,
            profileImage: "/placeholder.svg"
          }));
        }
        
        toast.success("Login berhasil", {
          description: "Selamat datang kembali!"
        });
        
        return true;
      } else {
        toast.error("Login gagal", {
          description: "Email atau password tidak valid"
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login gagal", {
        description: "Terjadi kesalahan, silakan coba lagi"
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
    toast.info("Logout berhasil", {
      description: "Anda telah keluar dari akun"
    });
  };
  
  const updateUserProfile = (profileData: Partial<User>) => {
    if (user) {
      // Update user state
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => useContext(AuthContext);
