
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  // Save settings to localStorage when they change
  const saveSettings = () => {
    setTheme(selectedTheme);
    localStorage.setItem('themeSettings', JSON.stringify({ theme: selectedTheme }));
    toast.success('Pengaturan tema berhasil disimpan');
  };

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('themeSettings');
    if (savedSettings) {
      try {
        const { theme } = JSON.parse(savedSettings);
        setSelectedTheme(theme);
      } catch (e) {
        console.error("Error parsing theme settings:", e);
      }
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Tema Undangan</CardTitle>
        <CardDescription>
          Pilih tema tampilan untuk undangan digital Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div
                className={`border-2 rounded-md p-4 cursor-pointer ${
                  selectedTheme === "light"
                    ? "border-primary"
                    : "border-border"
                }`}
                onClick={() => setSelectedTheme("light")}
              >
                <div className="h-24 bg-background rounded-md border flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary" />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Label className="font-medium">Terang</Label>
                  {selectedTheme === "light" && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div
                className={`border-2 rounded-md p-4 cursor-pointer ${
                  selectedTheme === "dark"
                    ? "border-primary"
                    : "border-border"
                }`}
                onClick={() => setSelectedTheme("dark")}
              >
                <div className="h-24 bg-slate-900 rounded-md border border-slate-800 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-slate-50" />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Label className="font-medium">Gelap</Label>
                  {selectedTheme === "dark" && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div
                className={`border-2 rounded-md p-4 cursor-pointer ${
                  selectedTheme === "system"
                    ? "border-primary"
                    : "border-border"
                }`}
                onClick={() => setSelectedTheme("system")}
              >
                <div className="h-24 bg-gradient-to-b from-background to-slate-900 rounded-md border flex items-center justify-center">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-slate-50" />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Label className="font-medium">Sistem</Label>
                  {selectedTheme === "system" && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={saveSettings}>Simpan Perubahan</Button>
      </CardFooter>
    </Card>
  );
}
