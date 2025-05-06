
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Save } from "lucide-react";
import { toast } from "sonner";

export function ThemeSettings() {
  const [themes, setThemes] = useState<string[]>([]);
  const [newTheme, setNewTheme] = useState("");
  
  // Load themes from localStorage on component mount
  useEffect(() => {
    const savedThemes = localStorage.getItem("themes");
    
    if (savedThemes) {
      try {
        setThemes(JSON.parse(savedThemes));
      } catch (error) {
        console.error("Error parsing themes:", error);
        // Initialize with default themes if there's an error
        const defaultThemes = ["Rustic", "Minimalist", "Vintage", "Modern", "Floral"];
        setThemes(defaultThemes);
        localStorage.setItem("themes", JSON.stringify(defaultThemes));
      }
    } else {
      // Initialize with default themes if none exist
      const defaultThemes = ["Rustic", "Minimalist", "Vintage", "Modern", "Floral"];
      setThemes(defaultThemes);
      localStorage.setItem("themes", JSON.stringify(defaultThemes));
    }
  }, []);

  // Save themes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("themes", JSON.stringify(themes));
  }, [themes]);

  // Add a new theme
  const handleAddTheme = () => {
    if (!newTheme.trim()) return;
    
    setThemes([...themes, newTheme.trim()]);
    setNewTheme("");
    toast.success("Tema undangan berhasil ditambahkan");
  };

  // Delete a theme
  const handleDeleteTheme = (themeToDelete: string) => {
    setThemes(themes.filter(theme => theme !== themeToDelete));
    toast.success("Tema undangan berhasil dihapus");
  };

  // Handle theme name change
  const handleThemeChange = (oldTheme: string, newTheme: string) => {
    setThemes(
      themes.map(theme => 
        theme === oldTheme ? newTheme : theme
      )
    );
  };

  // Save changes to a theme
  const handleSaveTheme = (theme: string) => {
    if (theme.trim()) {
      toast.success(`Tema ${theme} berhasil disimpan`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Nama tema baru"
          value={newTheme}
          onChange={e => setNewTheme(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAddTheme()}
        />
        <Button onClick={handleAddTheme} className="shrink-0">
          <Plus className="mr-1 h-4 w-4" />
          Tambah
        </Button>
      </div>

      <div className="space-y-2">
        {themes.map((theme, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={theme}
              onChange={e => handleThemeChange(theme, e.target.value)}
            />
            <Button
              size="icon"
              variant="outline"
              className="shrink-0"
              onClick={() => handleSaveTheme(theme)}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="shrink-0"
              onClick={() => handleDeleteTheme(theme)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
