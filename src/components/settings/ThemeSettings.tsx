
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Check, X, Image } from "lucide-react";
import { toast } from "sonner";
import { Theme, Package } from "@/types/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ThemeSettings() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [newTheme, setNewTheme] = useState("");
  const [newThumbnail, setNewThumbnail] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  
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

  // Start editing
  const startEditing = (id: string) => {
    setEditingId(id);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
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
      setEditingId(null);
      toast.success(`Tema ${themeToSave.name} berhasil disimpan`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="space-y-2">
          <Input
            placeholder="Nama tema baru"
            value={newTheme}
            onChange={e => setNewTheme(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Input
            placeholder="URL thumbnail"
            value={newThumbnail}
            onChange={e => setNewThumbnail(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <Select value={newCategory} onValueChange={setNewCategory} className="flex-1">
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
        
        <Button onClick={handleAddTheme}>
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Tambah</span>
        </Button>
      </div>

      <div className="space-y-2 mt-4">
        {themes.map((theme) => (
          <div 
            key={theme.id} 
            className="border rounded-md p-2"
          >
            {editingId === theme.id ? (
              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    value={theme.name}
                    placeholder="Nama tema"
                    onChange={e => handleThemeChange(theme.id, 'name', e.target.value)}
                    autoFocus
                  />
                  <Input
                    value={theme.thumbnail || ""}
                    placeholder="URL thumbnail"
                    onChange={e => handleThemeChange(theme.id, 'thumbnail', e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select 
                    value={theme.category || ""} 
                    onValueChange={(value) => handleThemeChange(theme.id, 'category', value)}
                    className="flex-1"
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
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSaveTheme(theme.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={cancelEditing}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="font-medium">{theme.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    {theme.category && <span>Kategori: {theme.category}</span>}
                    {theme.thumbnail && <Image className="h-3 w-3" />}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEditing(theme.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteTheme(theme.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
