import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

export function PasswordSettingsForm() {
  const { user, updatePassword } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Konfirmasi password tidak sesuai");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await updatePassword(formData.currentPassword, formData.newPassword);
      
      if (success) {
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
        
        toast.success("Password berhasil diperbarui");
      } else {
        toast.error("Password saat ini tidak sesuai");
      }
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

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  return (
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
                      defaultValue={user?.email}
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
        <div className="relative">
          <Input
            id="current-password"
            name="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
            onClick={() => togglePasswordVisibility('current')}
          >
            {showCurrentPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showCurrentPassword ? "Sembunyikan password" : "Tampilkan password"}
            </span>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="new-password">Password Baru</Label>
          <div className="relative">
            <Input
              id="new-password"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
              onClick={() => togglePasswordVisibility('new')}
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showNewPassword ? "Sembunyikan password" : "Tampilkan password"}
              </span>
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Konfirmasi Password</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
              onClick={() => togglePasswordVisibility('confirm')}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
              </span>
            </Button>
          </div>
        </div>
      </div>
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Menyimpan..." : "Perbarui Password"}
      </Button>
    </form>
  );
}
