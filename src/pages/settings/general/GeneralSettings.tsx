
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export function GeneralSettings() {
  const { brandSettings, updateBrandSettings } = useAuth();
  const [sidebarTitle, setSidebarTitle] = useState(brandSettings.name);
  const [appLogo, setAppLogo] = useState(brandSettings.logo);
  const [isLoading, setIsLoading] = useState(false);

  // Load current settings when component mounts
  useEffect(() => {
    setSidebarTitle(brandSettings.name);
    setAppLogo(brandSettings.logo);
  }, [brandSettings]);

  const handleSaveGeneralSettings = async () => {
    try {
      setIsLoading(true);
      
      // Update brand settings in context (which also updates localStorage)
      updateBrandSettings({
        name: sidebarTitle,
        logo: appLogo
      });

      toast.success("Pengaturan berhasil disimpan", {
        description: "Perubahan umum telah disimpan"
      });
    } catch (error) {
      console.error("Error saving general settings:", error);
      toast.error("Gagal menyimpan pengaturan", {
        description: "Terjadi kesalahan. Silakan coba lagi."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Umum</CardTitle>
        <CardDescription>
          Konfigurasi pengaturan umum aplikasi
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sidebarTitle">Nama Aplikasi/Brand</Label>
          <Input
            id="sidebarTitle"
            value={sidebarTitle}
            onChange={(e) => setSidebarTitle(e.target.value)}
            placeholder="Order Management"
          />
          <p className="text-xs text-muted-foreground">
            Nama ini akan ditampilkan di sidebar dan halaman login
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="appLogo">URL Logo</Label>
          <Input
            id="appLogo"
            value={appLogo}
            onChange={(e) => setAppLogo(e.target.value)}
            placeholder="/placeholder.svg"
          />
          <p className="text-xs text-muted-foreground">
            URL ke gambar logo yang akan digunakan di sidebar dan halaman login
          </p>
        </div>

        {appLogo && (
          <div className="mt-4">
            <Label>Preview Logo</Label>
            <div className="mt-2 p-4 border rounded-md flex items-center justify-center">
              <img
                src={appLogo}
                alt="Logo Preview"
                className="h-16 w-16 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                  toast.error("Gambar tidak dapat dimuat", {
                    description: "URL logo mungkin tidak valid"
                  });
                }}
              />
            </div>
          </div>
        )}

        <Button 
          onClick={handleSaveGeneralSettings} 
          className="mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Menyimpan..." : "Simpan Pengaturan"}
        </Button>
      </CardContent>
    </Card>
  );
}
