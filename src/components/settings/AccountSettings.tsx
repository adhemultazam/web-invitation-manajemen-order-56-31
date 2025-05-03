
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
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
import { useAuth } from "@/contexts/AuthContext";
import { User, Lock, Mail } from "lucide-react";

export function AccountSettings() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      updateUser({
        ...user, 
        name: formData.name,
        email: formData.email
      });
      
      toast.success("Profil berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui profil");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Konfirmasi password tidak sesuai");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
      toast.success("Password berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui password");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setResetEmailSent(true);
    } catch (error) {
      toast.error("Gagal mengirim tautan reset password");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Pengaturan Akun
        </CardTitle>
        <CardDescription>
          Kelola detail akun dan password Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Profile Settings */}
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <h3 className="text-lg font-medium">Detail Profil</h3>
            <Separator />
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Pengguna</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
          
          {/* Password Settings */}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Ubah Password
              </h3>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    <Mail className="mr-2 h-4 w-4" />
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
                            defaultValue={formData.email}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Batal</Button>
                        </DialogClose>
                        <Button 
                          disabled={isLoading} 
                          onClick={handleResetPassword}
                        >
                          {isLoading ? "Mengirim..." : "Kirim Link Reset"}
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
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="current-password">Password Saat Ini</Label>
              <Input
                id="current-password"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">Password Baru</Label>
                <Input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Perbarui Password"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
