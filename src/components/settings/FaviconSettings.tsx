
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link, Upload } from "lucide-react";
import { handleFileUpload } from "./utils/settingsUtils";

interface FaviconSettingsProps {
  faviconUrl: string;
  setFaviconUrl: (url: string) => void;
  appIcon: string;
  onApplyFavicon: () => void;
}

export function FaviconSettings({ 
  faviconUrl, 
  setFaviconUrl, 
  appIcon,
  onApplyFavicon 
}: FaviconSettingsProps) {
  return (
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
            <Button variant="outline" onClick={onApplyFavicon} className="shrink-0">
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
        {appIcon ? (
          <img 
            src={appIcon} 
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
  );
}
