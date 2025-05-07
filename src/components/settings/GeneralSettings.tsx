
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Upload, Link } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface GeneralSettingsData {
  businessName: string;
  appName: string;
  appLogo: string;
  appIcon: string;
  sidebarTitle: string;
}

export function GeneralSettings() {
  const { updateBrandSettings, brandSettings } = useAuth();
  
  // Use our useLocalStorage hook instead of manual localStorage handling
  const [settings, setSettings] = useLocalStorage<GeneralSettingsData>("generalSettings", {
    businessName: "Undangan Digital",
    appName: "Order Management",
    appLogo: brandSettings.logo || "/placeholder.svg",
    appIcon: "/favicon.ico",
    sidebarTitle: brandSettings.name || "Order Management"
  });
  
  // URLs for direct input
  const [logoUrl, setLogoUrl] = useState(settings.appLogo);
  const [faviconUrl, setFaviconUrl] = useState(settings.appIcon);
  
  // Sync settings with brandSettings on mount
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      appLogo: brandSettings.logo || prev.appLogo,
      sidebarTitle: brandSettings.name || prev.sidebarTitle
    }));
    setLogoUrl(brandSettings.logo || settings.appLogo);
    setFaviconUrl(settings.appIcon);
  }, [brandSettings, setSettings, settings.appLogo, settings.appIcon]);
  
  // Handle input changes for app settings
  const handleInputChange = (field: keyof GeneralSettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Apply URL inputs to settings
  const applyLogoUrl = () => {
    if (logoUrl) {
      setSettings(prev => ({ ...prev, appLogo: logoUrl }));
      toast.success("URL logo berhasil diterapkan");
    }
  };
  
  const applyFaviconUrl = () => {
    if (faviconUrl) {
      setSettings(prev => ({ ...prev, appIcon: faviconUrl }));
      toast.success("URL favicon berhasil diterapkan");
    }
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
    
    // Update brandSettings context
    updateBrandSettings({
      name: settings.sidebarTitle,
      logo: settings.appLogo
    });
    
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
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="URL logo aplikasi"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                  />
                  <Button variant="outline" onClick={applyLogoUrl} className="shrink-0">
                    <Link className="mr-2 h-4 w-4" />
                    Terapkan
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Masukkan URL gambar logo yang ingin ditampilkan
                </p>
              </TabsContent>
              <TabsContent value="upload" className="space-y-2">
                <Button variant="outline" onClick={() => handleFileUpload("appLogo")} className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground">
                  Upload file logo dari perangkat Anda (.png, .jpg, max 2MB)
                </p>
              </TabsContent>
            </Tabs>
            <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden mt-2">
              {settings.appLogo ? (
                <img 
                  src={settings.appLogo} 
                  alt="App Logo" 
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg"; 
                  }}
                />
              ) : (
                <span className="text-gray-400">No Logo</span>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Favicon</Label>
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="URL favicon"
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                  />
                  <Button variant="outline" onClick={applyFaviconUrl} className="shrink-0">
                    <Link className="mr-2 h-4 w-4" />
                    Terapkan
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Masukkan URL gambar favicon untuk tab browser
                </p>
              </TabsContent>
              <TabsContent value="upload" className="space-y-2">
                <Button variant="outline" onClick={() => handleFileUpload("appIcon")} className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Favicon
                </Button>
                <p className="text-xs text-muted-foreground">
                  Upload file favicon dari perangkat Anda (.png, .jpg, max 1MB)
                </p>
              </TabsContent>
            </Tabs>
            <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden mt-2">
              {settings.appIcon ? (
                <img 
                  src={settings.appIcon} 
                  alt="App Icon" 
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/favicon.ico"; 
                  }}
                />
              ) : (
                <span className="text-gray-400">No Icon</span>
              )}
            </div>
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
