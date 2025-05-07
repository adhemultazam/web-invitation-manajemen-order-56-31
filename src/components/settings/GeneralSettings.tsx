
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface GeneralSettingsData {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  appName: string;
  appLogo: string;
  appIcon: string;
  sidebarTitle: string;
}

export function GeneralSettings() {
  // Use our useLocalStorage hook instead of manual localStorage handling
  const [settings, setSettings] = useLocalStorage<GeneralSettingsData>("generalSettings", {
    businessName: "Undangan Digital",
    businessEmail: "contact@undangandigital.com",
    businessPhone: "+62 812 3456 7890",
    businessAddress: "Jl. Pemuda No. 123, Surabaya",
    appName: "Order Management",
    appLogo: "/placeholder.svg",
    appIcon: "/favicon.ico",
    sidebarTitle: "Order Management"
  });

  // Handle input changes
  const handleInputChange = (field: keyof GeneralSettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
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

  // Save settings and update invoice settings
  const handleSaveSettings = () => {
    // Update invoice settings with the business information to keep them in sync
    const savedInvoiceSettings = localStorage.getItem("invoiceSettings");
    if (savedInvoiceSettings) {
      try {
        const invoiceSettings = JSON.parse(savedInvoiceSettings);
        const updatedInvoiceSettings = {
          ...invoiceSettings,
          brandName: settings.businessName,
          businessAddress: settings.businessAddress,
          contactEmail: settings.businessEmail,
          contactPhone: settings.businessPhone
        };
        localStorage.setItem("invoiceSettings", JSON.stringify(updatedInvoiceSettings));
      } catch (e) {
        console.error("Error updating invoice settings:", e);
      }
    }
    
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Bisnis</CardTitle>
          <CardDescription>
            Informasi dasar tentang bisnis Anda yang akan digunakan di seluruh aplikasi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nama Bisnis</Label>
              <Input
                id="businessName"
                value={settings.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessEmail">Email Bisnis</Label>
              <Input
                id="businessEmail"
                type="email"
                value={settings.businessEmail}
                onChange={(e) => handleInputChange("businessEmail", e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessPhone">Telepon</Label>
              <Input
                id="businessPhone"
                value={settings.businessPhone}
                onChange={(e) => handleInputChange("businessPhone", e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessAddress">Alamat Bisnis</Label>
            <Input
              id="businessAddress"
              value={settings.businessAddress}
              onChange={(e) => handleInputChange("businessAddress", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          <Save className="mr-2 h-4 w-4" />
          Simpan Pengaturan
        </Button>
      </div>
    </div>
  );
}
