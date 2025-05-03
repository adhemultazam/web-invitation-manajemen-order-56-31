
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Theme } from "@/types/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function ThemeSettings() {
  const [themes, setThemes] = useState<Theme[]>([]);
  
  // Load themes from localStorage on component mount
  useEffect(() => {
    const storedThemes = localStorage.getItem('themes');
    
    if (storedThemes) {
      try {
        setThemes(JSON.parse(storedThemes));
      } catch (e) {
        console.error("Error parsing themes:", e);
        // Initialize with default themes if there's an error
        initializeDefaultThemes();
      }
    } else {
      // Initialize with default themes if none exist
      initializeDefaultThemes();
    }
  }, []);
  
  // Initialize default themes
  const initializeDefaultThemes = () => {
    const defaultThemes: Theme[] = [
      {
        id: uuidv4(),
        name: "Elegant Gold",
        thumbnail: "",
        category: "Premium",
        price: 250000,
        backgroundColor: "#FEF7CD"
      },
      {
        id: uuidv4(),
        name: "Floral Pink",
        thumbnail: "",
        category: "Basic",
        price: 150000,
        backgroundColor: "#FFDEE2"
      },
      {
        id: uuidv4(),
        name: "Rustic Wood",
        thumbnail: "",
        category: "Premium",
        price: 250000,
        backgroundColor: "#8B4513"
      },
      {
        id: uuidv4(),
        name: "Minimalist",
        thumbnail: "",
        category: "Basic",
        price: 150000,
        backgroundColor: "#F5F5F5"
      }
    ];
    
    setThemes(defaultThemes);
    saveThemes(defaultThemes);
  };
  
  // Save themes to localStorage
  const saveThemes = (updatedThemes: Theme[]) => {
    try {
      localStorage.setItem('themes', JSON.stringify(updatedThemes));
      toast.success("Pengaturan tema berhasil disimpan");
    } catch (e) {
      console.error("Error saving themes:", e);
      toast.error("Gagal menyimpan pengaturan tema");
    }
  };
  
  // Handle adding a new theme
  const handleAddTheme = () => {
    // Implementation for adding a new theme would go here
    toast.info("Fitur tambah tema akan segera tersedia");
  };
  
  // Handle editing a theme
  const handleEditTheme = (id: string) => {
    // Implementation for editing a theme would go here
    toast.info(`Mengedit tema dengan ID: ${id}`);
  };
  
  // Handle deleting a theme
  const handleDeleteTheme = (id: string) => {
    const updatedThemes = themes.filter(theme => theme.id !== id);
    setThemes(updatedThemes);
    saveThemes(updatedThemes);
    toast.success("Tema berhasil dihapus");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tema Undangan</CardTitle>
          <CardDescription>
            Kelola tema-tema undangan digital yang tersedia.
          </CardDescription>
        </div>
        <Button onClick={handleAddTheme}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Tambah Tema
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {themes.map((theme) => (
            <div key={theme.id} className="border rounded-lg overflow-hidden">
              <div 
                className="h-32 flex items-center justify-center text-white font-bold text-2xl" 
                style={{ backgroundColor: theme.backgroundColor }}
              >
                {theme.name}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{theme.name}</h3>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditTheme(theme.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteTheme(theme.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant={theme.category === "Premium" ? "default" : "secondary"}>
                    {theme.category}
                  </Badge>
                  <span className="text-sm">Rp {theme.price?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
