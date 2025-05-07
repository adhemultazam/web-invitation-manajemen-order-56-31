
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Camera } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function GeneralSettings() {
  const { user, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg");
  const [email, setEmail] = useState<string>("admin@example.com");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved profile information if available
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("userProfile");
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (profile.email) setEmail(profile.email);
        if (profile.profileImage) setProfileImage(profile.profileImage);
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  }, []);

  // Handle profile image click to trigger file input
  const handleProfileImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection for profile image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a URL for the selected image to preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setProfileImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle saving profile information
  const handleSaveProfile = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Save profile data to localStorage
        const profileData = {
          email,
          profileImage
        };
        
        localStorage.setItem("userProfile", JSON.stringify(profileData));
        
        if (updateUserProfile) {
          updateUserProfile(profileData);
        }
        
        toast.success("Profil berhasil diperbarui", {
          description: "Data profil Anda telah disimpan"
        });
      } catch (error) {
        toast.error("Gagal menyimpan profil", {
          description: "Terjadi kesalahan saat menyimpan data"
        });
        console.error("Error saving profile:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  // Handle changing password
  const handleChangePassword = () => {
    // Validate passwords
    if (!currentPassword) {
      toast.error("Password saat ini diperlukan");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Password baru dan konfirmasi tidak cocok");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("Password baru minimal 8 karakter");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // In a real app, you would call an API to change the password
        toast.success("Password berhasil diubah", {
          description: "Password Anda telah diperbarui"
        });
        
        // Reset form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (error) {
        toast.error("Gagal mengubah password", {
          description: "Terjadi kesalahan saat mengubah password"
        });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Akun</CardTitle>
          <CardDescription>
            Kelola informasi akun dan keamanan Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Image Section */}
          <div>
            <Label className="text-base font-semibold mb-4 block">Gambar Profil</Label>
            <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6">
              <div className="relative group cursor-pointer" onClick={handleProfileImageClick}>
                <Avatar className="h-24 w-24 border-2 border-muted">
                  <AvatarImage src={profileImage} alt="Profile" />
                  <AvatarFallback className="bg-wedding-primary text-white text-lg">
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Unggah foto profil Anda. Format yang didukung: JPG, PNG.
                  Ukuran maksimal file: 1MB.
                </p>
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleProfileImageClick}
                  >
                    Ubah Foto
                  </Button>
                  {profileImage !== "/placeholder.svg" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setProfileImage("/placeholder.svg")}
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      Hapus
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <Label className="text-base font-semibold mb-4 block">Informasi Akun</Label>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <Label className="text-base font-semibold mb-4 block">Ubah Password</Label>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Password Saat Ini</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="current-password"
                    type="password"
                    className="pl-10"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="new-password">Password Baru</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type="password"
                    className="pl-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleChangePassword} 
                disabled={isLoading} 
                variant="outline"
              >
                {isLoading ? "Mengubah..." : "Ubah Password"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
