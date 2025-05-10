import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  remember?: boolean;
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { signIn, migrateData, rememberSession, setRememberSession } = useSupabaseAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<AuthFormData>({
    defaultValues: {
      email: "",
      password: "",
      remember: rememberSession
    }
  });

  const rememberValue = watch("remember", rememberSession);
  useState(() => {
    setValue("remember", rememberSession);
  });

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
          <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="nama@example.com" {...register("email", { required: "Email harus diisi" })} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <ForgotPasswordDialog />
              </div>
              <PasswordInput id="password" placeholder="Masukkan password Anda" {...register("password", { required: "Password harus diisi" })} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" {...register("remember")} />
              <label htmlFor="remember" className="text-sm font-medium leading-none">Ingat saya</label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Masuk...</> : "Masuk"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
