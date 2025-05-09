
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
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Info } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
    
    // Basic validation
    if (!username) {
      toast.error("Username diperlukan", {
        description: "Silakan masukkan username Anda"
      });
      return;
    }
    
    if (!password) {
      toast.error("Password diperlukan", {
        description: "Silakan masukkan password Anda"
      });
      return;
    }

    setLoading(true);
    try {
      const success = await login(username, password, rememberMe);
      if (success) {
        const storedPath = sessionStorage.getItem("lastVisitedPath") || "/";
        navigate(storedPath);
      }
    } finally {
      setLoading(false);
    }
  };

  // Detect if user is on a public/shared device
  const isPublicDevice = () => {
    // Check if there are multiple recent user cookies or localStorage items
    const hasMultipleUsers = Object.keys(localStorage).some(key => key.includes('user_'));
    return hasMultipleUsers;
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-4",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <Card className={cn(
        "w-full max-w-md shadow-xl animate-fade-in",
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
                className={cn(
                  isDarkMode ? "bg-gray-700 border-gray-600" : "",
                  "focus:ring-wedding-primary focus:border-wedding-primary"
                )}
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
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe} 
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label 
                htmlFor="remember" 
                className="text-sm cursor-pointer"
              >
                Ingat saya
              </Label>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-wedding-primary hover:bg-wedding-accent transition-colors" 
              disabled={loading}
            >
              {loading ? "Memuat..." : "Masuk"}
            </Button>
          </form>
          
          {/* Security information */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm flex gap-2">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-blue-700 dark:text-blue-300">
              <p className="font-medium">Informasi Keamanan</p>
              <p className="mt-1 text-xs">
                {isPublicDevice() ? 
                  "Anda tampaknya berada di perangkat umum. Jangan aktifkan 'Ingat saya' jika ini bukan perangkat pribadi Anda." : 
                  "Pastikan Anda logout setelah selesai jika menggunakan perangkat publik."}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="flex items-center gap-1 text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            <Shield className="h-3.5 w-3.5" /> 
            <p>Credential demo: admin / admin</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
