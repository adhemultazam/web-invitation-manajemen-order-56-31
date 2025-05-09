
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { ForgotPasswordDialog } from "@/components/auth/ForgotPasswordDialog";
import { BrandLogo } from "@/components/auth/BrandLogo";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, login, brandSettings } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Handle redirect when already logged in or after login
  useEffect(() => {
    if (isAuthenticated) {
      // Check for a stored path first
      const storedPath = sessionStorage.getItem("lastVisitedPath");
      
      if (storedPath) {
        navigate(storedPath);
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        const storedPath = sessionStorage.getItem("lastVisitedPath") || "/";
        navigate(storedPath);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const success = await login("admin", "admin");
      if (success) {
        const storedPath = sessionStorage.getItem("lastVisitedPath") || "/";
        navigate(storedPath);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-4",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <Card className={cn(
        "w-full max-w-md shadow-xl",
        isDarkMode ? "bg-gray-800 text-gray-100 border-gray-700" : "bg-white"
      )}>
        <CardHeader className="space-y-4 flex flex-col items-center justify-center">
          <BrandLogo logo={brandSettings.logo} name={brandSettings.name} />
          <div className="text-center space-y-1">
            <CardTitle className="text-2xl">{brandSettings.name}</CardTitle>
            <CardDescription>Masuk ke akun manajemen Anda</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <ForgotPasswordDialog />
              </div>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Masukkan password"
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-wedding-primary hover:bg-wedding-accent" 
              disabled={loading}
            >
              {loading ? "Memuat..." : "Masuk"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
            <p>Demo credentials: admin / admin</p>
          </div>
          <Button 
            variant="outline" 
            className="mt-2 w-full" 
            onClick={handleDemoLogin}
            disabled={loading}
          >
            Login Demo
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
