
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { BrandLogo } from "@/components/auth/BrandLogo";
import { Loader2 } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { ForgotPasswordDialog } from "@/components/auth/ForgotPasswordDialog";

interface AuthFormData {
  email: string;
  password: string;
  name?: string;
}

export default function Login() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { signIn, signUp, migrateData } = useSupabaseAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AuthFormData>({
    defaultValues: {
      email: "",
      password: "",
      name: ""
    }
  });
  
  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      if (activeTab === "login") {
        // Login logic
        const { error } = await signIn(data.email, data.password);
        if (error) throw error;
        
        // Migrate data from localStorage if needed
        const migrationResult = await migrateData();
        if (migrationResult.success) {
          console.log("Data migration successful or not needed");
        } else {
          console.warn("Data migration issue:", migrationResult.error);
        }
        
        const lastVisitedPath = sessionStorage.getItem("lastVisitedPath") || "/";
        navigate(lastVisitedPath, { replace: true });
      } else {
        // Register logic
        const { error } = await signUp(data.email, data.password, { name: data.name || "" });
        if (error) throw error;
        
        toast.success("Registrasi berhasil", {
          description: "Silahkan cek email Anda untuk verifikasi, atau langsung login jika verifikasi email dinonaktifkan"
        });
        
        // Switch to login tab after successful registration
        setActiveTab("login");
        reset();
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      
      // Improved error messages
      let errorMessage = error.message;
      
      if (error.message?.includes("credentials")) {
        errorMessage = "Email atau password salah";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Email belum diverifikasi. Silahkan cek inbox email Anda";
      } else if (error.message?.includes("already registered")) {
        errorMessage = "Email sudah terdaftar";
      }
      
      setAuthError(errorMessage);
      toast.error(
        activeTab === "login" ? "Login gagal" : "Registrasi gagal", 
        { description: errorMessage }
      );
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
          <CardDescription>
            Masuk ke akun Anda untuk melanjutkan
          </CardDescription>
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
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <TabsContent value="login" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nama@example.com" 
                    {...register("email", { required: "Email harus diisi" })}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <ForgotPasswordDialog />
                  </div>
                  <PasswordInput
                    id="password"
                    value={undefined}
                    onChange={(e) => register("password").onChange(e)}
                    required={true}
                    placeholder="Masukkan password Anda"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Masuk...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </Button>
              </TabsContent>

              
              <TabsContent value="register" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama</Label>
                  <Input 
                    id="name" 
                    placeholder="Nama lengkap" 
                    {...register("name", { required: "Nama harus diisi" })}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input 
                    id="registerEmail" 
                    type="email" 
                    placeholder="nama@example.com" 
                    {...register("email", { required: "Email harus diisi" })}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Password</Label>
                  <PasswordInput
                    id="registerPassword"
                    value={undefined}
                    onChange={(e) => register("password", { 
                      required: "Password harus diisi",
                      minLength: {
                        value: 6,
                        message: "Password minimal 6 karakter"
                      }
                    }).onChange(e)}
                    required={true}
                    placeholder="Minimal 6 karakter"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mendaftar...
                    </>
                  ) : (
                    "Daftar"
                  )}
                </Button>
              </TabsContent>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
