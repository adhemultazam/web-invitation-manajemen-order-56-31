
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { User, Image } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function ProfileSettingsForm() {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profileImage: user?.profileImage || "",
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Sync with user data when it changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);

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
      
      // Update user profile
      updateUserProfile({
        name: formData.name,
        email: formData.email,
        profileImage: formData.profileImage
      });
      
      toast.success("Profil berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui profil");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleProfileUpdate} className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <User className="h-5 w-5" />
        Detail Profil
      </h3>
      <Separator />
      
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex flex-col items-center gap-3">
          <Avatar className="h-24 w-24 bg-gray-100">
            <AvatarImage src={formData.profileImage} />
            <AvatarFallback className="bg-wedding-primary text-white">
              <Image className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2 w-full">
            <Label htmlFor="profileImage">Gambar Profile</Label>
            <Input
              id="profileImage"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              placeholder="URL Gambar (https://...)"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Masukkan URL gambar profile Anda</p>
          </div>
        </div>

        <div className="space-y-4 flex-1">
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
        </div>
      </div>
      
      <Button type="submit" disabled={isLoading} className="mt-4">
        {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  );
}
