
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { BrandLogo } from "@/components/auth/BrandLogo";
import { Upload, Image, Link } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function AccountSettings() {
  const { toast } = useToast();
  const { brandSettings, updateBrandSettings } = useAuth();
  
  const [name, setName] = useState(brandSettings.name || "");
  const [logo, setLogo] = useState(brandSettings.logo || "");
  const [favicon, setFavicon] = useState(brandSettings.favicon || "");
  const [isLoading, setIsLoading] = useState(false);
  
  // Update local state when brandSettings change
  useEffect(() => {
    setName(brandSettings.name || "");
    setLogo(brandSettings.logo || "");
    setFavicon(brandSettings.favicon || "");
  }, [brandSettings]);
  
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Update brand settings
      await updateBrandSettings({
        name,
        logo,
        favicon
      });
      
      // Update favicon in document if provided
      if (favicon) {
        const existingFavicon = document.querySelector("link[rel*='icon']");
        if (existingFavicon) {
          existingFavicon.setAttribute("href", favicon);
        } else {
          const newFavicon = document.createElement("link");
          newFavicon.rel = "icon";
          newFavicon.href = favicon;
          document.head.appendChild(newFavicon);
        }
      }
      
      toast({
        title: "Berhasil",
        description: "Pengaturan akun berhasil disimpan",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan pengaturan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <CardTitle>Pengaturan Akun</CardTitle>
        <CardDescription>
          Kelola informasi dan tampilan aplikasi Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="w-full md:w-2/3 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nama Bisnis</Label>
              <Input
                id="businessName"
                placeholder="Nama bisnis Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Logo Brand</Label>
              <Tabs defaultValue="url" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-2">
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      id="logoUrl"
                      placeholder="https://example.com/logo.png"
                      type="url"
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Masukkan URL gambar logo yang ingin ditampilkan
                  </p>
                </TabsContent>
                <TabsContent value="upload" className="space-y-2">
                  <div className="flex space-x-2">
                    <Button variant="outline" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload file logo dari perangkat Anda (.png, .jpg, max 2MB)
                  </p>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="space-y-2">
              <Label>Favicon</Label>
              <Tabs defaultValue="url" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-2">
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      id="faviconUrl"
                      placeholder="https://example.com/favicon.png"
                      type="url" 
                      value={favicon}
                      onChange={(e) => setFavicon(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Masukkan URL gambar favicon untuk tab browser (disarankan format PNG)
                  </p>
                </TabsContent>
                <TabsContent value="upload" className="space-y-2">
                  <div className="flex space-x-2">
                    <Button variant="outline" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Favicon
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload file favicon dari perangkat Anda (.png, .jpg, max 1MB)
                  </p>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="pt-2">
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan Pengaturan"}
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 bg-muted p-4 rounded-lg">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Preview Logo</h4>
                <div className="flex justify-center items-center p-4 bg-card border rounded-md h-32">
                  {logo ? (
                    <img 
                      src={logo} 
                      alt="Logo Preview" 
                      className="max-h-24 max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = ""; 
                        (e.target as HTMLImageElement).alt = "Invalid image URL";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Image className="h-8 w-8 mb-2" />
                      <span className="text-xs">Logo belum diatur</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Preview Favicon</h4>
                <div className="flex justify-center items-center p-4 bg-card border rounded-md h-20">
                  {favicon ? (
                    <img 
                      src={favicon} 
                      alt="Favicon Preview" 
                      className="max-h-12 max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = ""; 
                        (e.target as HTMLImageElement).alt = "Invalid image URL";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Image className="h-6 w-6 mb-1" />
                      <span className="text-xs">Favicon belum diatur</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 p-3 rounded-md text-xs">
                <strong>Tips:</strong> Untuk hasil terbaik, gunakan gambar dengan rasio aspek 1:1 (persegi) dan format PNG transparan.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
