
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

interface AuthFormData {
  email: string;
  password: string;
  name?: string;
}

export default function Login() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useSupabaseAuth();
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
    
    try {
      if (activeTab === "login") {
        // Login logic
        const { error } = await signIn(data.email, data.password);
        if (error) throw error;
        
        const lastVisitedPath = sessionStorage.getItem("lastVisitedPath") || "/";
        navigate(lastVisitedPath, { replace: true });
      } else {
        // Register logic
        const { error } = await signUp(data.email, data.password, { name: data.name || "" });
        if (error) throw error;
        
        toast.success("Registrasi berhasil", {
          description: "Silahkan cek email Anda untuk verifikasi"
        });
        
        // Switch to login tab after successful registration
        setActiveTab("login");
        reset();
      }
    } catch (error: any) {
      toast.error(
        activeTab === "login" ? "Login gagal" : "Registrasi gagal", 
        { description: error.message }
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
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    {...register("password", { required: "Password harus diisi" })}
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
                  <Input 
                    id="registerPassword" 
                    type="password" 
                    {...register("password", { 
                      required: "Password harus diisi",
                      minLength: {
                        value: 6,
                        message: "Password minimal 6 karakter"
                      }
                    })}
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
