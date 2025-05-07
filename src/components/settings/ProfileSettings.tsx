
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Image, Upload, User } from "lucide-react";

export function ProfileSettings() {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [profileImagePreview, setProfileImagePreview] = useState(user?.profileImage || "");
  
  // Load saved settings initially
  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setProfileImage(user?.profileImage || "");
    setProfileImagePreview(user?.profileImage || "");
  }, [user]);
  
  // Handle profile image upload
  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size > 500000) { // 500 KB limit
      toast.error("Ukuran gambar terlalu besar", {
        description: "Maksimum ukuran gambar adalah 500KB"
      });
      return;
    }
    
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
      toast.error("Format file tidak didukung", {
        description: "Format yang didukung: JPEG, PNG, SVG"
      });
      return;
    }
    
    // Read and preview the file
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setProfileImagePreview(result);
      setProfileImage(result);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle save
  const handleSave = () => {
    updateUserProfile({
      name,
      email,
      profileImage
    });
    
    toast.success("Profil berhasil diperbarui");
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="profile-image">Gambar Profil</Label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full overflow-hidden border flex items-center justify-center bg-muted">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Gambar Profil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="space-y-1 flex-1">
                <Input
                  id="profile-image"
                  type="file"
                  accept="image/jpeg,image/png,image/svg+xml"
                  className="hidden"
                  onChange={handleProfileImageUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("profile-image")?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Gambar
                </Button>
                <p className="text-xs text-muted-foreground">
                  Format: JPG, PNG, SVG. Maks 500KB
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email Anda"
            />
          </div>
          
          <Button onClick={handleSave}>Simpan Profil</Button>
        </div>
      </CardContent>
    </Card>
  );
}
