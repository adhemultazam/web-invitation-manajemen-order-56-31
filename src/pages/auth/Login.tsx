import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { ForgotPasswordDialog } from "@/components/auth/ForgotPasswordDialog";
import { BrandLogo } from "@/components/auth/BrandLogo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    login,
    isAuthenticated,
    brandSettings
  } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Login berhasil", {
          description: "Selamat datang kembali"
        });
        navigate("/");
      } else {
        toast.error("Login gagal", {
          description: "Email atau password salah"
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba beberapa saat lagi"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md px-8">
        <div className="mx-auto mb-8 flex flex-col items-center">
          <BrandLogo logo={brandSettings.logo} name={brandSettings.name} />
          
          <h1 className="mt-4 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
            {brandSettings.name}
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">Order Management Dashboard</p>
        </div>

        <div className="rounded-lg border bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="contoh@email.com" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <ForgotPasswordDialog disabled={isLoading} />
              </div>
              <PasswordInput id="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" disabled={isLoading} />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Masuk..." : "Masuk"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p className="text-xs">Silahkan masukkan Email dan Password untuk melanjutkan</p>
          </div>
        </div>
      </div>
    </div>;
}