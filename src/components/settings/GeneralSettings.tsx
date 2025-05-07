
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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
  
  // Handle input changes for app settings
  const handleInputChange = (field: keyof GeneralSettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Handle file upload (placeholder - would need actual upload functionality)
  const handleFileUpload = (field: keyof GeneralSettingsData) => {
    // This is a placeholder for file upload
    toast.info("File upload would be implemented here");
  };

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

  return (
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
  );
}
