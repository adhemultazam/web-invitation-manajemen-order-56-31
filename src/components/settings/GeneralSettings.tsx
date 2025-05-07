
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, Upload, User, Mail, Lock, Camera, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface GeneralSettingsData {
  businessName: string;
  appName: string;
  appLogo: string;
  appIcon: string;
  sidebarTitle: string;
}

export function GeneralSettings() {
  // Use our useLocalStorage hook instead of manual localStorage handling
  const [settings, setSettings] = useLocalStorage<GeneralSettingsData>("generalSettings", {
    businessName: "Undangan Digital",
    appName: "Order Management",
    appLogo: "/placeholder.svg",
    appIcon: "/favicon.ico",
    sidebarTitle: "Order Management"
  });

  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profileImage: user?.profileImage || "/placeholder.svg",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input changes for app settings
  const handleInputChange = (field: keyof GeneralSettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Handle profile data changes
  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  // Handle password data changes
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  // Handle file upload (placeholder - would need actual upload functionality)
  const handleFileUpload = (field: keyof GeneralSettingsData) => {
    // This is a placeholder for file upload
    // In a real implementation, this would trigger a file picker and upload the file
    toast.info("File upload would be implemented here");
  };

  // Apply saved settings on initial load to make sure the UI is in sync with stored settings
  useEffect(() => {
    // Update document title based on stored settings
    document.title = settings.appName;
    
    // Update sidebar title if element exists
    const sidebarTitleElement = document.querySelector('.sidebar-title');
    if (sidebarTitleElement) {
      sidebarTitleElement.textContent = settings.sidebarTitle;
    }
    
    // Update sidebar logo if element exists
    const sidebarLogoElement = document.querySelector('.sidebar-logo') as HTMLImageElement;
    if (sidebarLogoElement && settings.appLogo) {
      sidebarLogoElement.src = settings.appLogo;
    }
  }, [settings]);

  // Save app settings
  const handleSaveSettings = () => {
    // Update document title
    document.title = settings.appName;
    
    // Update sidebar title
    const sidebarTitleElement = document.querySelector('.sidebar-title');
    if (sidebarTitleElement) {
      sidebarTitleElement.textContent = settings.sidebarTitle;
    }
    
    // Update sidebar logo
    const sidebarLogoElement = document.querySelector('.sidebar-logo') as HTMLImageElement;
    if (sidebarLogoElement && settings.appLogo) {
      sidebarLogoElement.src = settings.appLogo;
    }
    
    toast.success("Pengaturan umum berhasil disimpan");
  };

  // Save profile changes
  const handleSaveProfile = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        updateUser({
          name: profileData.name,
          email: profileData.email,
          profileImage: profileData.profileImage
        });
        
        toast.success("Profil berhasil diperbarui");
      } catch (error) {
        toast.error("Gagal memperbarui profil");
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  // Update password
  const handleUpdatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Konfirmasi password tidak sesuai");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        // In a real app, you would call an API to update the password
        toast.success("Password berhasil diperbarui");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } catch (error) {
        toast.error("Gagal memperbarui password");
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const togglePasswordVisibility = (field: string) => {
    if (field === 'current') {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else if (field === 'confirm') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Aplikasi</CardTitle>
          <CardDescription>
            Konfigurasi tampilan dan nama aplikasi di sidebar dan browser
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appName">Nama Aplikasi</Label>
              <Input
                id="appName"
                value={settings.appName}
                onChange={(e) => handleInputChange("appName", e.target.value)}
                placeholder="Order Management"
              />
              <p className="text-xs text-muted-foreground">
                Nama yang akan ditampilkan pada tab browser
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sidebarTitle">Judul Sidebar</Label>
              <Input
                id="sidebarTitle"
                value={settings.sidebarTitle}
                onChange={(e) => handleInputChange("sidebarTitle", e.target.value)}
                placeholder="Order Management"
              />
              <p className="text-xs text-muted-foreground">
                Teks yang akan ditampilkan di bagian atas sidebar
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Logo Aplikasi</Label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                  {settings.appLogo ? (
                    <img 
                      src={settings.appLogo} 
                      alt="App Logo" 
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-400">No Logo</span>
                  )}
                </div>
                <Button variant="outline" onClick={() => handleFileUpload("appLogo")}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Logo yang akan ditampilkan di sidebar (ukuran yang disarankan: 128x128 px)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Favicon</Label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                  {settings.appIcon ? (
                    <img 
                      src={settings.appIcon} 
                      alt="App Icon" 
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-400">No Icon</span>
                  )}
                </div>
                <Button variant="outline" onClick={() => handleFileUpload("appIcon")}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Favicon
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Icon yang akan ditampilkan pada tab browser (ukuran yang disarankan: 32x32 px)
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings}>
              <Save className="mr-2 h-4 w-4" />
              Simpan Pengaturan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Akun</CardTitle>
          <CardDescription>
            Kelola profil dan keamanan akun Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Profile Section */}
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                <User className="h-5 w-5" />
                Profil Pengguna
              </h3>
              <Separator className="mb-4" />
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="h-24 w-24 bg-gray-100">
                    <AvatarImage src={profileData.profileImage} />
                    <AvatarFallback className="bg-primary text-white">
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2 w-full">
                    <Label htmlFor="profileImage">Foto Profil</Label>
                    <Input
                      id="profileImage"
                      value={profileData.profileImage}
                      onChange={(e) => handleProfileChange("profileImage", e.target.value)}
                      placeholder="URL Foto (https://...)"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">Masukkan URL gambar profil Anda</p>
                  </div>
                </div>
                
                <div className="space-y-4 flex-1">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Pengguna</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => handleProfileChange("name", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleProfileChange("email", e.target.value)}
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={handleSaveProfile} disabled={isLoading}>
                  {isLoading ? "Menyimpan..." : "Simpan Profil"}
                </Button>
              </div>
            </div>
            
            {/* Password Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5" />
                Ubah Password
              </h3>
              <Separator className="mb-4" />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Password Saat Ini</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                      className="pl-10"
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
                    <Label htmlFor="newPassword">Password Baru</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                        className="pl-10"
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
                    <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                        className="pl-10"
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
                
                <div className="flex justify-end mt-2">
                  <Button onClick={handleUpdatePassword} disabled={isLoading}>
                    {isLoading ? "Memperbarui..." : "Perbarui Password"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
