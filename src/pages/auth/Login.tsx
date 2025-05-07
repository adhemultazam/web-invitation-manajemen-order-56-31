
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { Image, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { isAuthenticated, login, brandSettings } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(email, password, rememberMe);
    if (success) {
      navigate("/");
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim() || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      toast.error("Masukkan alamat email yang valid");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 800));
      setResetEmailSent(true);
      toast.success("Link reset password telah dikirim");
    } catch (error) {
      toast.error("Gagal mengirim link reset password");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <Card className="border shadow-xl">
          <CardHeader className="space-y-1 items-center text-center">
            <div className="flex justify-center mb-2">
              <div className="h-16 w-16 rounded-full overflow-hidden border shadow-sm bg-white dark:bg-gray-800 flex items-center justify-center">
                {brandSettings.logo ? (
                  <img src={brandSettings.logo} alt="Logo" className="h-12 w-12 object-contain" />
                ) : (
                  <Image className="h-8 w-8 text-wedding-primary" />
                )}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-wedding-primary">
              {brandSettings.name}
            </CardTitle>
            <CardDescription>Silahkan masuk untuk mengakses dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contoh@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" size="sm" className="px-0 text-sm font-normal h-auto">
                        Lupa Password?
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                          {resetEmailSent 
                            ? "Email reset password telah dikirim. Silahkan cek inbox Anda."
                            : "Masukkan email Anda untuk menerima tautan reset password."}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {!resetEmailSent ? (
                        <>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="reset-email">Email</Label>
                              <Input
                                id="reset-email"
                                type="email"
                                placeholder="contoh@email.com"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                disabled={loading}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Batal</Button>
                            </DialogClose>
                            <Button 
                              disabled={loading} 
                              onClick={handleForgotPassword}
                            >
                              {loading ? "Mengirim..." : "Kirim Link Reset"}
                            </Button>
                          </DialogFooter>
                        </>
                      ) : (
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button>Tutup</Button>
                          </DialogClose>
                        </DialogFooter>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    </span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember-me" className="text-sm">Ingat saya</Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-wedding-primary hover:bg-wedding-accent"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-500">
            <p className="w-full">
              Demo akses: admin@example.com / password
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
