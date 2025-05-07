
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Image, Upload } from "lucide-react";

export function BrandSettings() {
  const { brandSettings, updateBrandSettings } = useAuth();
  const [name, setName] = useState(brandSettings.name || "");
  const [logo, setLogo] = useState(brandSettings.logo || "");
  const [logoPreview, setLogoPreview] = useState(brandSettings.logo || "");
  
  // Load saved settings initially
  useEffect(() => {
    setName(brandSettings.name || "");
    setLogo(brandSettings.logo || "");
    setLogoPreview(brandSettings.logo || "");
  }, [brandSettings]);
  
  // Handle logo upload
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setLogoPreview(result);
      setLogo(result);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle save
  const handleSave = () => {
    updateBrandSettings({
      name,
      logo
    });
    
    toast.success("Pengaturan brand berhasil disimpan");
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="brand-name">Nama Brand</Label>
            <Input
              id="brand-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama brand"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="brand-logo">Logo Brand</Label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-md border flex items-center justify-center bg-muted">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo Brand"
                    className="max-h-14 max-w-14 object-contain"
                  />
                ) : (
                  <Image className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="space-y-1 flex-1">
                <Input
                  id="brand-logo"
                  type="file"
                  accept="image/jpeg,image/png,image/svg+xml"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("brand-logo")?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground">
                  Format: JPG, PNG, SVG. Maks 500KB
                </p>
              </div>
            </div>
          </div>
          
          <Button onClick={handleSave}>Simpan Pengaturan</Button>
        </div>
      </CardContent>
    </Card>
  );
}
