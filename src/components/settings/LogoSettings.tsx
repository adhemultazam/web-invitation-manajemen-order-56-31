
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link, Upload } from "lucide-react";
import { toast } from "sonner";
import { handleFileUpload } from "./utils/settingsUtils";

interface LogoSettingsProps {
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  appLogo: string;
  onApplyLogo: () => void;
}

export function LogoSettings({ 
  logoUrl, 
  setLogoUrl, 
  appLogo,
  onApplyLogo 
}: LogoSettingsProps) {
  return (
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
            <Button variant="outline" onClick={onApplyLogo} className="shrink-0">
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
        {appLogo ? (
          <img 
            src={appLogo} 
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
  );
}
