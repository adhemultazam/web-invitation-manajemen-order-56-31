
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Save, Image } from "lucide-react";
import { toast } from "sonner";
import { Theme, Package } from "@/types/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ThemeSettings() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [newTheme, setNewTheme] = useState("");
  const [newThumbnail, setNewThumbnail] = useState("");
  const [newCategory, setNewCategory] = useState("");
  
  // Load themes and packages from localStorage on component mount
  useEffect(() => {
    // Load themes
    const savedThemes = localStorage.getItem("themes");
    
    if (savedThemes) {
      try {
        const parsedThemes = JSON.parse(savedThemes);
        
        // Ensure each theme has the correct structure
        const updatedThemes = parsedThemes.map((theme: any) => {
          if (typeof theme === 'string') {
            return {
              id: crypto.randomUUID(),
              name: theme,
              thumbnail: "",
              category: ""
            };
          } else if (typeof theme === 'object' && theme !== null) {
            return {
              id: theme.id || crypto.randomUUID(),
              name: theme.name || "",
              thumbnail: theme.thumbnail || "",
              category: theme.category || ""
            };
          }
          return theme;
        });
        
        setThemes(updatedThemes);
        localStorage.setItem("themes", JSON.stringify(updatedThemes));
      } catch (error) {
        console.error("Error parsing themes:", error);
        // Initialize with default themes if there's an error
        const defaultThemes = [
          { id: crypto.randomUUID(), name: "Rustic", thumbnail: "", category: "" },
          { id: crypto.randomUUID(), name: "Minimalist", thumbnail: "", category: "" },
          { id: crypto.randomUUID(), name: "Vintage", thumbnail: "", category: "" },
          { id: crypto.randomUUID(), name: "Modern", thumbnail: "", category: "" },
          { id: crypto.randomUUID(), name: "Floral", thumbnail: "", category: "" }
        ];
        setThemes(defaultThemes);
        localStorage.setItem("themes", JSON.stringify(defaultThemes));
      }
    } else {
      // Initialize with default themes if none exist
      const defaultThemes = [
        { id: crypto.randomUUID(), name: "Rustic", thumbnail: "", category: "" },
        { id: crypto.randomUUID(), name: "Minimalist", thumbnail: "", category: "" },
        { id: crypto.randomUUID(), name: "Vintage", thumbnail: "", category: "" },
        { id: crypto.randomUUID(), name: "Modern", thumbnail: "", category: "" },
        { id: crypto.randomUUID(), name: "Floral", thumbnail: "", category: "" }
      ];
      setThemes(defaultThemes);
      localStorage.setItem("themes", JSON.stringify(defaultThemes));
    }
    
    // Load packages
    const savedPackages = localStorage.getItem("packages");
    if (savedPackages) {
      try {
        const parsedPackages = JSON.parse(savedPackages);
        setPackages(parsedPackages);
      } catch (error) {
        console.error("Error parsing packages:", error);
        setPackages([]);
      }
    }
  }, []);

  // Save themes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("themes", JSON.stringify(themes));
  }, [themes]);

  // Add a new theme
  const handleAddTheme = () => {
    if (!newTheme.trim()) return;
    
    const newThemeItem: Theme = {
      id: crypto.randomUUID(),
      name: newTheme.trim(),
      thumbnail: newThumbnail.trim(),
      category: newCategory
    };
    
    setThemes([...themes, newThemeItem]);
    setNewTheme("");
    setNewThumbnail("");
    setNewCategory("");
    toast.success("Tema undangan berhasil ditambahkan");
  };

  // Delete a theme
  const handleDeleteTheme = (themeId: string) => {
    setThemes(themes.filter(theme => theme.id !== themeId));
    toast.success("Tema undangan berhasil dihapus");
  };

  // Handle theme field change
  const handleThemeChange = (themeId: string, field: string, value: string) => {
    setThemes(
      themes.map(theme => 
        theme.id === themeId ? { ...theme, [field]: value } : theme
      )
    );
  };

  // Save changes to a theme
  const handleSaveTheme = (themeId: string) => {
    const themeToSave = themes.find(theme => theme.id === themeId);
    if (themeToSave && themeToSave.name.trim()) {
      toast.success(`Tema ${themeToSave.name} berhasil disimpan`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="space-y-1">
          <label className="text-sm text-gray-500">Nama Tema</label>
          <Input
            placeholder="Nama tema baru"
            value={newTheme}
            onChange={e => setNewTheme(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-gray-500">URL Thumbnail</label>
          <Input
            placeholder="URL thumbnail"
            value={newThumbnail}
            onChange={e => setNewThumbnail(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-gray-500">Kategori Paket</label>
          <Select value={newCategory} onValueChange={setNewCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori paket" />
            </SelectTrigger>
            <SelectContent>
              {packages.map((pkg) => (
                <SelectItem key={pkg.id} value={pkg.name}>
                  {pkg.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button onClick={handleAddTheme} className="w-full">
        <Plus className="mr-1 h-4 w-4" />
        Tambah Tema
      </Button>

      <div className="space-y-2">
        {themes.map((theme) => (
          <div key={theme.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
            <div className="col-span-1">
              <Input
                value={theme.name}
                placeholder="Nama tema"
                onChange={e => handleThemeChange(theme.id, 'name', e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <Input
                value={theme.thumbnail || ""}
                placeholder="URL thumbnail"
                onChange={e => handleThemeChange(theme.id, 'thumbnail', e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <Select 
                value={theme.category || ""} 
                onValueChange={(value) => handleThemeChange(theme.id, 'category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori paket" />
                </SelectTrigger>
                <SelectContent>
                  {packages.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.name}>
                      {pkg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="col-span-1"
              onClick={() => handleSaveTheme(theme.id)}
            >
              <Save className="mr-1 h-4 w-4" />
              Simpan
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="col-span-1"
              onClick={() => handleDeleteTheme(theme.id)}
            >
              <Trash className="mr-1 h-4 w-4" />
              Hapus
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
