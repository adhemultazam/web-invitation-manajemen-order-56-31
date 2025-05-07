
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define the user type
interface User {
  name: string;
  email: string;
  profileImage?: string;
  logo?: string; // Property for the company logo
}

// Define the context type
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateUserProfile?: (profileData: Partial<User>) => void; // For backward compatibility
}

// Create the Auth context
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
  updateUser: () => {},
});

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
              name: profile.name || "Admin", // Use saved name if available
              email: profile.email || "admin@example.com",
              profileImage: profile.profileImage || "/placeholder.svg",
              logo: profile.logo || "" // Add logo property
            });
          } else {
            // Set default user if no profile found
            setUser({
              name: "Admin",
              email: "admin@example.com",
              profileImage: "/placeholder.svg",
              logo: "" // Add default logo
            });
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
          // Fallback to default user
          setUser({
            name: "Admin",
            email: "admin@example.com",
            profileImage: "/placeholder.svg",
            logo: "" // Add default logo
          });
        }
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check if user exists in localStorage
      const savedProfile = localStorage.getItem("userProfile");
      let isValid = false;
      
      if (savedProfile) {
        // If we have a saved profile, check if email and password match
        const profile = JSON.parse(savedProfile);
        
        // Check if email matches the saved profile
        if (profile.email === email) {
          // For demo purposes, we'll accept "password" or the stored password if it exists
          const savedPassword = profile.password || "password";
          isValid = password === savedPassword;
        }
      } else {
        // Default login for the demo
        isValid = password === "password";
      }
      
      if (isValid) {
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);
        
        // Get profile or create default
        let userProfile;
        if (savedProfile) {
          userProfile = JSON.parse(savedProfile);
        } else {
          userProfile = {
            name: "Admin", // Default name
            email: email,
            profileImage: "/placeholder.svg", // Default profile image
            logo: "" // Default logo
          };
          
          // Store default profile
          localStorage.setItem("userProfile", JSON.stringify(userProfile));
        }
        
        setUser(userProfile);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
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
  
  // Update user profile function
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      // Update user state
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Update localStorage
      try {
        const savedProfile = localStorage.getItem("userProfile");
        const profileData = savedProfile ? JSON.parse(savedProfile) : {};
        const updatedProfile = { ...profileData, ...userData };
        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      } catch (error) {
        console.error("Error saving profile to localStorage:", error);
      }
    }
  };
  
  // For backward compatibility
  const updateUserProfile = updateUser;

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      updateUser,
      updateUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => useContext(AuthContext);
