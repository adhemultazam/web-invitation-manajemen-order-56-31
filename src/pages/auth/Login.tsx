import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/contexts/auth";
import { BrandLogo } from "@/components/auth/BrandLogo";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { ForgotPasswordDialog } from "@/components/auth/ForgotPasswordDialog";

interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  remember?: boolean;
}

export default function Login() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { signIn, signUp, migrateData, rememberSession, setRememberSession } = useSupabaseAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm<AuthFormData>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      remember: rememberSession
    }
  });

  const rememberValue = watch("remember", rememberSession);
  useState(() => {
    setValue("remember", rememberSession);
  });

  // Login Submission Handler
  const onLoginSubmit = async (data: AuthFormData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const { error } = await signIn(data.email, data.password, !!data.remember);
      if (error) throw error;
      setRememberSession(!!data.remember);
      await migrateData();
      const lastVisitedPath = sessionStorage.getItem("lastVisitedPath") || "/";
      navigate(lastVisitedPath, { replace: true });
    } catch (error: any) {
      setAuthError(error.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  // Register Submission Handler
  const onRegisterSubmit = async (data: AuthFormData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const { error } = await signUp(data.email, data.password, { name: data.name || "" });
      if (error) throw error;
      toast.success("Registrasi berhasil", { description: "Silahkan cek email Anda untuk verifikasi." });
      setActiveTab("login");
      reset();
    } catch (error: any) {
      setAuthError(error.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <BrandLogo name="App" size={48} />
          </div>
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>Masuk ke akun Anda untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent>
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Masuk</TabsTrigger>
              <TabsTrigger value="register">Daftar</TabsTrigger>
            </TabsList>

            {/* LOGIN FORM */}
            <TabsContent value="login" className="space-y-4 mt-4">
              <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="nama@example.com" {...register("email", { required: "Email harus diisi" })} />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <ForgotPasswordDialog />
                  </div>
                  <PasswordInput id="password" placeholder="Masukkan password Anda" {...register("password", { required: "Password harus diisi" })} />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" {...register("remember")} />
                  <label htmlFor="remember" className="text-sm font-medium leading-none">Ingat saya</label>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Masuk...</> : "Masuk"}
                </Button>
              </form>
            </TabsContent>

            {/* REGISTER FORM */}
            <TabsContent value="register" className="space-y-4 mt-4">
              <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama</Label>
                  <Input id="name" placeholder="Nama lengkap" {...register("name", { required: "Nama harus diisi" })} />
                </div>
                <div>
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input id="registerEmail" type="email" placeholder="nama@example.com" {...register("email", { required: "Email harus diisi" })} />
                </div>
                <div>
                  <Label htmlFor="registerPassword">Password</Label>
                  <PasswordInput id="registerPassword" placeholder="Minimal 6 karakter" {...register("password", { required: "Password harus diisi", minLength: { value: 6, message: "Password minimal 6 karakter" } })} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mendaftar...</> : "Daftar"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
