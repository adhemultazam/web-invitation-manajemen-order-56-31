
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { ColorPicker } from "./ColorPicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FontSettings } from "./FontSettings";
import { SelectGroup, SelectLabel } from "@/components/ui/select";
import { toast } from "sonner";

export function ThemeSettings() {
  // State for theme settings
  const [primaryColor, setPrimaryColor] = useState("#9c84ff");
  const [accentColor, setAccentColor] = useState("#8371e0");
  const [fontHeading, setFontHeading] = useState("Inter");
  const [fontBody, setFontBody] = useState("Inter");
  const [roundedCorners, setRoundedCorners] = useState("md");
  const [isCustom, setIsCustom] = useState(false);
  const [presetTheme, setPresetTheme] = useState("purple");
  
  // Load settings from localStorage when component mounts
  useEffect(() => {
    const savedSettings = localStorage.getItem('themeSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setPrimaryColor(settings.primaryColor || "#9c84ff");
        setAccentColor(settings.accentColor || "#8371e0");
        setFontHeading(settings.fontHeading || "Inter");
        setFontBody(settings.fontBody || "Inter");
        setRoundedCorners(settings.roundedCorners || "md");
        setIsCustom(settings.isCustom || false);
        setPresetTheme(settings.presetTheme || "purple");
      } catch (error) {
        console.error("Failed to parse theme settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    // Only save if component has mounted
    if (primaryColor) {
      const settings = {
        primaryColor,
        accentColor,
        fontHeading,
        fontBody,
        roundedCorners,
        isCustom,
        presetTheme
      };
      localStorage.setItem('themeSettings', JSON.stringify(settings));
      
      // Apply CSS variables
      document.documentElement.style.setProperty('--wedding-primary', primaryColor);
      document.documentElement.style.setProperty('--wedding-accent', accentColor);
      document.documentElement.style.setProperty('--wedding-light', isCustom ? adjustBrightness(primaryColor, 80) : "#f4f1fe");
      document.documentElement.style.setProperty('--wedding-muted', isCustom ? adjustBrightness(primaryColor, 40) : "#e9e4fd");
    }
  }, [primaryColor, accentColor, fontHeading, fontBody, roundedCorners, isCustom, presetTheme]);

  // Handle preset theme changes
  const handlePresetChange = (value: string) => {
    setPresetTheme(value);
    setIsCustom(false);
    
    // Set colors based on preset
    switch (value) {
      case "purple":
        setPrimaryColor("#9c84ff");
        setAccentColor("#8371e0");
        break;
      case "blue":
        setPrimaryColor("#60a5fa");
        setAccentColor("#3b82f6");
        break;
      case "green":
        setPrimaryColor("#4ade80");
        setAccentColor("#22c55e");
        break;
      case "rose":
        setPrimaryColor("#fb7185");
        setAccentColor("#e11d48");
        break;
      case "amber":
        setPrimaryColor("#fbbf24");
        setAccentColor("#d97706");
        break;
    }
  };

  // Handle save button click
  const handleSave = () => {
    // Save to localStorage
    const settings = {
      primaryColor,
      accentColor,
      fontHeading,
      fontBody,
      roundedCorners,
      isCustom,
      presetTheme
    };
    localStorage.setItem('themeSettings', JSON.stringify(settings));
    
    // Show success message
    toast.success("Tema berhasil disimpan!", {
      description: "Perubahan tema telah diterapkan ke aplikasi."
    });
  };

  // Function to adjust color brightness
  const adjustBrightness = (hex: string, percent: number) => {
    hex = hex.replace(/^\s*#|\s*$/g, '');
    
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Increase brightness
    const adjustR = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
    const adjustG = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
    const adjustB = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
    
    // Convert back to hex
    return "#" + ((1 << 24) + (adjustR << 16) + (adjustG << 8) + adjustB).toString(16).slice(1);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pengaturan Tema</CardTitle>
        <CardDescription>
          Kustomisasi tampilan aplikasi sesuai dengan preferensi Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preset Theme Selection */}
        <div className="space-y-1.5">
          <Label htmlFor="preset">Tema</Label>
          <Select
            value={presetTheme}
            onValueChange={handlePresetChange}
          >
            <SelectTrigger id="preset" className="w-full">
              <SelectValue placeholder="Pilih tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tema</SelectLabel>
                <SelectItem value="purple">Ungu (Default)</SelectItem>
                <SelectItem value="blue">Biru</SelectItem>
                <SelectItem value="green">Hijau</SelectItem>
                <SelectItem value="rose">Merah Muda</SelectItem>
                <SelectItem value="amber">Amber</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {/* Custom Colors Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="custom-color"
            checked={isCustom}
            onCheckedChange={setIsCustom}
          />
          <Label htmlFor="custom-color">Gunakan warna kustom</Label>
        </div>
        
        {/* Custom Color Pickers - Only show if custom is enabled */}
        {isCustom && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="primary-color">Warna Utama</Label>
              <div className="flex space-x-2">
                <ColorPicker
                  color={primaryColor}
                  onChange={setPrimaryColor}
                  id="primary-color"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="accent-color">Warna Aksen</Label>
              <div className="flex space-x-2">
                <ColorPicker
                  color={accentColor}
                  onChange={setAccentColor}
                  id="accent-color"
                />
                <Input
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Font Settings */}
        <FontSettings
          headingFont={fontHeading}
          bodyFont={fontBody}
          onHeadingFontChange={setFontHeading}
          onBodyFontChange={setFontBody}
        />
        
        {/* Border Radius Settings */}
        <div className="space-y-1.5">
          <Label htmlFor="rounded">Sudut Elemen</Label>
          <Select
            value={roundedCorners}
            onValueChange={(value) => setRoundedCorners(value)}
          >
            <SelectTrigger id="rounded" className="w-full">
              <SelectValue placeholder="Pilih jenis sudut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Persegi (Tanpa Sudut)</SelectItem>
              <SelectItem value="sm">Kecil</SelectItem>
              <SelectItem value="md">Sedang</SelectItem>
              <SelectItem value="lg">Besar</SelectItem>
              <SelectItem value="full">Penuh (Bulat)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Preview */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold">Preview</h3>
          <div className="flex flex-wrap gap-4">
            <div 
              className="w-20 h-20 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              Utama
            </div>
            <div 
              className="w-20 h-20 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: accentColor }}
            >
              Aksen
            </div>
            <div 
              className="w-20 h-20 rounded-lg flex items-center justify-center text-gray-800"
              style={{ backgroundColor: isCustom ? adjustBrightness(primaryColor, 80) : "#f4f1fe" }}
            >
              Terang
            </div>
            <div 
              className="w-20 h-20 rounded-lg flex items-center justify-center text-gray-800"
              style={{ backgroundColor: isCustom ? adjustBrightness(primaryColor, 40) : "#e9e4fd" }}
            >
              Muted
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 style={{ fontFamily: fontHeading }}>Heading Font: {fontHeading}</h4>
            <p style={{ fontFamily: fontBody }}>Body Font: {fontBody}. This is how your body text will appear throughout the application.</p>
          </div>
          
          <div className="flex gap-2">
            <div 
              className={`w-16 h-8 bg-gray-200 rounded-none flex items-center justify-center`}
            >
              None
            </div>
            <div 
              className={`w-16 h-8 bg-gray-200 rounded-sm flex items-center justify-center`}
            >
              Small
            </div>
            <div 
              className={`w-16 h-8 bg-gray-200 rounded-md flex items-center justify-center`}
            >
              Medium
            </div>
            <div 
              className={`w-16 h-8 bg-gray-200 rounded-lg flex items-center justify-center`}
            >
              Large
            </div>
            <div 
              className={`w-16 h-8 bg-gray-200 rounded-full flex items-center justify-center`}
            >
              Full
            </div>
          </div>
          
          <div>
            <Button
              style={{ 
                backgroundColor: primaryColor,
                borderRadius: roundedCorners === "none" ? "0" : 
                             roundedCorners === "sm" ? "0.125rem" : 
                             roundedCorners === "md" ? "0.375rem" : 
                             roundedCorners === "lg" ? "0.5rem" : "9999px"
              }}
            >
              Sample Button
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Simpan Pengaturan</Button>
      </CardFooter>
    </Card>
  );
}
