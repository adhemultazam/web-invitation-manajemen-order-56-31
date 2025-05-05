
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Pencil, 
  Trash, 
  Plus, 
  Search,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import { AddThemeModal } from "./AddThemeModal";
import { EditThemeModal } from "./EditThemeModal";
import { Theme, Package } from "@/types/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ThemeSettings() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  
  // Add search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Load packages for category synchronization
  useEffect(() => {
    const storedPackages = localStorage.getItem("packages");
    if (storedPackages) {
      try {
        setPackages(JSON.parse(storedPackages));
      } catch (error) {
        console.error("Error parsing stored packages:", error);
      }
    }
  }, []);

  // Get unique categories from themes and packages
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    
    // Add existing theme categories
    themes.forEach(theme => {
      if (theme.category) {
        uniqueCategories.add(theme.category);
      }
    });
    
    // Add package names as categories
    packages.forEach(pkg => {
      uniqueCategories.add(pkg.name);
    });
    
    return ["all", ...Array.from(uniqueCategories)];
  }, [themes, packages]);

  // Filter themes based on search and category
  const filteredThemes = useMemo(() => {
    return themes.filter(theme => {
      const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || theme.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [themes, searchQuery, categoryFilter]);

  useEffect(() => {
    const storedThemes = localStorage.getItem("themes");
    if (storedThemes) {
      try {
        setThemes(JSON.parse(storedThemes));
      } catch (error) {
        console.error("Error parsing stored themes:", error);
        setThemes([]);
      }
    } else {
      // Default themes if none exist
      const defaultThemes = [
        {
          id: "1",
          name: "Elegant Gold",
          thumbnail: "https://placehold.co/200x280/e9d985/ffffff?text=Elegant+Gold",
          category: "Premium"
        },
        {
          id: "2",
          name: "Floral Pink",
          thumbnail: "https://placehold.co/200x280/ffb6c1/ffffff?text=Floral+Pink",
          category: "Basic"
        },
        {
          id: "3",
          name: "Rustic Wood",
          thumbnail: "https://placehold.co/200x280/8b4513/ffffff?text=Rustic+Wood",
          category: "Premium"
        },
        {
          id: "4",
          name: "Minimalist",
          thumbnail: "https://placehold.co/200x280/f5f5f5/333333?text=Minimalist",
          category: "Basic"
        }
      ];
      setThemes(defaultThemes);
      localStorage.setItem("themes", JSON.stringify(defaultThemes));
    }
  }, []);

  const handleAddTheme = (newTheme: Omit<Theme, "id">) => {
    const themeWithId = {
      ...newTheme,
      id: Date.now().toString(),
    };
    const updatedThemes = [...themes, themeWithId];
    setThemes(updatedThemes);
    localStorage.setItem("themes", JSON.stringify(updatedThemes));
    toast.success("Tema berhasil ditambahkan", {
      description: `Tema "${newTheme.name}" telah ditambahkan.`
    });
  };

  const handleEditTheme = (updatedTheme: Theme) => {
    const updatedThemes = themes.map(theme =>
      theme.id === updatedTheme.id ? updatedTheme : theme
    );
    setThemes(updatedThemes);
    localStorage.setItem("themes", JSON.stringify(updatedThemes));
    setEditingTheme(null);
    toast.success("Tema berhasil diperbarui", {
      description: `Tema "${updatedTheme.name}" telah diperbarui.`
    });
  };

  const handleDeleteTheme = (id: string, name: string) => {
    if (window.confirm(`Hapus tema ${name}?`)) {
      const updatedThemes = themes.filter(theme => theme.id !== id);
      setThemes(updatedThemes);
      localStorage.setItem("themes", JSON.stringify(updatedThemes));
      toast.success("Tema berhasil dihapus", {
        description: `Tema "${name}" telah dihapus.`
      });
    }
  };

  const handleEditClick = (theme: Theme) => {
    setEditingTheme(theme);
    setShowEditModal(true);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold">Tema Undangan</h3>
          <p className="text-muted-foreground">
            Kelola tema-tema undangan digital yang tersedia.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="mt-4 md:mt-0">
          <Plus className="mr-2 h-4 w-4" /> Tambah Tema
        </Button>
      </div>

      {/* Filter and Search Area */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari tema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter Kategori" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "Semua Kategori" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredThemes.map((theme) => (
          <Card key={theme.id} className="overflow-hidden flex flex-col h-full">
            <div className="relative pt-[56.25%] overflow-hidden">
              <img
                src={theme.thumbnail}
                alt={theme.name}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-3 flex flex-col">
              <div className="mb-2 flex justify-between items-start">
                <h4 className="font-medium text-sm">{theme.name}</h4>
                {theme.category && (
                  <Badge variant={theme.category === "Premium" ? "default" : "outline"} className="text-xs">
                    {theme.category}
                  </Badge>
                )}
              </div>
              <div className="flex justify-end mt-auto pt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleEditClick(theme)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => handleDeleteTheme(theme.id, theme.name)}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredThemes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery || categoryFilter !== "all" 
              ? "Tidak ada tema yang sesuai dengan filter" 
              : "Belum ada tema tersedia. Tambahkan tema baru."}
          </p>
        </div>
      )}

      <AddThemeModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onAddTheme={handleAddTheme}
        existingCategories={categories.filter(cat => cat !== "all")}
      />
      
      {editingTheme && (
        <EditThemeModal 
          isOpen={showEditModal} 
          onClose={() => {
            setShowEditModal(false);
            setEditingTheme(null);
          }} 
          theme={editingTheme}
          onSave={handleEditTheme}
          existingCategories={categories.filter(cat => cat !== "all")}
        />
      )}
    </div>
  );
}
