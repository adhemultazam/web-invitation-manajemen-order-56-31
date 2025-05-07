
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(email, password)
        .then(success => {
          setIsLoading(false);
          if (!success) {
            toast.error("Login gagal", {
              description: "Email atau password tidak valid.",
            });
          } else {
            toast.success("Login berhasil", {
              description: "Selamat datang kembali!",
            });
          }
        })
        .catch(() => {
          setIsLoading(false);
          toast.error("Login gagal", {
            description: "Terjadi kesalahan. Silakan coba lagi.",
          });
        });
    }, 1000); // Simulate API call delay
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-wedding-primary mb-2">
            Undangan Digital
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Login ke Sistem Manajemen Pesanan
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Masukkan email Anda"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Masukkan password Anda"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember" 
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)} 
            />
            <Label htmlFor="remember" className="cursor-pointer">
              Ingat Saya
            </Label>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Memproses..." : "Login"}
          </Button>
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            <p>
              Demo: admin@example.com / password
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
