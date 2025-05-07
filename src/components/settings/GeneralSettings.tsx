
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, User, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAuth } from "@/contexts/AuthContext";
import { GeneralSettingsBasic } from "./GeneralSettingsBasic";
import { LogoSettings } from "./LogoSettings";
import { FaviconSettings } from "./FaviconSettings";
import { ProfileSettingsForm } from "./ProfileSettingsForm";
import { PasswordSettingsForm } from "./PasswordSettingsForm";

interface GeneralSettingsData {
  businessName: string;
  appName: string;
  appLogo: string;
  appIcon: string;
  sidebarTitle: string;
}

export function GeneralSettings() {
  const { updateBrandSettings, brandSettings, user, updateUserProfile } = useAuth();
  
  // Use our useLocalStorage hook instead of manual localStorage handling
  const [settings, setSettings] = useLocalStorage<GeneralSettingsData>("generalSettings", {
    businessName: "Undangan Digital",
    appName: "Order Management",
    appLogo: user?.profileImage || "/placeholder.svg",
    appIcon: "/favicon.ico",
    sidebarTitle: "Order Management"
  });
  
  // URLs for direct input
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  
  // Sync settings with brandSettings on mount only
  useEffect(() => {
    // Initialize with brandSettings values if available
    setSettings(prev => ({
      ...prev,
      appLogo: brandSettings.logo || user?.profileImage || prev.appLogo,
      sidebarTitle: brandSettings.name || prev.sidebarTitle
    }));
    
    // Set initial URL values
    setLogoUrl(brandSettings.logo || user?.profileImage || settings.appLogo);
    setFaviconUrl(settings.appIcon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only on mount
  
  // Handle input changes for app settings
  const handleInputChange = (field: keyof GeneralSettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Apply URL inputs to settings
  const applyLogoUrl = () => {
    if (logoUrl) {
      setSettings(prev => ({ ...prev, appLogo: logoUrl }));
      
      // Update user profile image as well for synchronization
      if (user) {
        updateUserProfile({ profileImage: logoUrl });
      }
      
      toast.success("URL logo berhasil diterapkan");
    }
  };
  
  const applyFaviconUrl = () => {
    if (faviconUrl) {
      setSettings(prev => ({ ...prev, appIcon: faviconUrl }));
      toast.success("URL favicon berhasil diterapkan");
    }
  };

  // Save app settings
  const handleSaveSettings = () => {
    // Update document title
    document.title = settings.appName;
    
    // Update brandSettings context
    updateBrandSettings({
      name: settings.sidebarTitle,
      logo: settings.appLogo,
      favicon: settings.appIcon
    });
    
    toast.success("Pengaturan umum berhasil disimpan");
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Pengaturan Aplikasi
          </CardTitle>
          <CardDescription>
            Konfigurasi tampilan dan nama aplikasi di sidebar dan browser
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GeneralSettingsBasic 
            appName={settings.appName}
            sidebarTitle={settings.sidebarTitle}
            onAppNameChange={(value) => handleInputChange("appName", value)}
            onSidebarTitleChange={(value) => handleInputChange("sidebarTitle", value)}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LogoSettings 
              logoUrl={logoUrl}
              setLogoUrl={setLogoUrl}
              appLogo={settings.appLogo}
              onApplyLogo={applyLogoUrl}
            />
            
            <FaviconSettings
              faviconUrl={faviconUrl}
              setFaviconUrl={setFaviconUrl}
              appIcon={settings.appIcon}
              onApplyFavicon={applyFaviconUrl}
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings}>
              <Save className="mr-2 h-4 w-4" />
              Simpan Pengaturan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings Card */}
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
            <ProfileSettingsForm />
            
            <Separator />
            
            {/* Password Settings */}
            <PasswordSettingsForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
