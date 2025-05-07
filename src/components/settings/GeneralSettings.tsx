
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, Upload } from "lucide-react";
import { toast } from "sonner";

interface GeneralSettingsData {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  currency: string;
  language: string;
  appName: string;
  appLogo: string;
  appIcon: string;
  sidebarTitle: string;
}

export function GeneralSettings() {
  const [settings, setSettings] = useState<GeneralSettingsData>({
    businessName: "Undangan Digital",
    businessEmail: "contact@undangandigital.com",
    businessPhone: "+62 812 3456 7890",
    businessAddress: "Jl. Pemuda No. 123, Surabaya",
    currency: "IDR",
    language: "id-ID",
    appName: "Order Management",
    appLogo: "/placeholder.svg",
    appIcon: "/favicon.ico",
    sidebarTitle: "Order Management"
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("generalSettings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Error parsing general settings:", e);
      }
    }
  }, []);

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

  // Save settings to localStorage
  const handleSaveSettings = () => {
    localStorage.setItem("generalSettings", JSON.stringify(settings));
    
    // Also update invoice settings with the business information to keep them in sync
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
    
    toast.success("Pengaturan umum berhasil disimpan");
    
    // In a real application, we would need to update the sidebar and other app components
    // This would typically happen through a context or state management system
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

      <Card>
        <CardHeader>
          <CardTitle>Preferensi Regional</CardTitle>
          <CardDescription>
            Pengaturan mata uang dan bahasa untuk aplikasi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Mata Uang</Label>
              <Input
                id="currency"
                value={settings.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Kode mata uang seperti IDR, USD, dll.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Bahasa</Label>
              <Input
                id="language"
                value={settings.language}
                onChange={(e) => handleInputChange("language", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Format locale seperti id-ID, en-US, dll.
              </p>
            </div>
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
