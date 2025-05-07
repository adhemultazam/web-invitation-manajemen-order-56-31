import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface GeneralSettingsData {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  currency: string;
  language: string;
}

export function GeneralSettings() {
  const [settings, setSettings] = useState<GeneralSettingsData>({
    businessName: "Undangan Digital",
    businessEmail: "contact@undangandigital.com",
    businessPhone: "+62 812 3456 7890",
    businessAddress: "Jl. Pemuda No. 123, Surabaya",
    currency: "IDR",
    language: "id-ID"
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
  };

  return (
    <div className="space-y-6">
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
