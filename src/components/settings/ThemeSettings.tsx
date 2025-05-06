
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Theme, Package } from "@/types/types";
import { AddThemeModal } from "./AddThemeModal";
import { EditThemeModal } from "./EditThemeModal";
import { Plus, Pencil, Trash2, Search, LayoutGrid, LayoutList } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ThemeSettings() {
  // State for theme management
  const [themes, setThemes] = useState<Theme[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [themeToEdit, setThemeToEdit] = useState<Theme | null>(null);
  const [themeToDelete, setThemeToDelete] = useState<Theme | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [packages, setPackages] = useState<Package[]>([]);

  // Load themes and packages from localStorage on component mount
  useEffect(() => {
    // Load packages first to get categories
    const savedPackages = localStorage.getItem('packages');
    if (savedPackages) {
      try {
        const parsedPackages = JSON.parse(savedPackages);
        setPackages(parsedPackages);
        console.log("ThemeSettings - Loaded packages:", parsedPackages);
        
        // Extract unique categories from packages
        if (parsedPackages && parsedPackages.length > 0) {
          const uniqueCategories = Array.from(
            new Set(parsedPackages.map((pkg: Package) => pkg.name).filter(Boolean))
          );
          setCategories(uniqueCategories as string[]);
          console.log("ThemeSettings - Extracted categories:", uniqueCategories);
        }
      } catch (error) {
        console.error("Error parsing packages:", error);
      }
    }

    const savedThemes = localStorage.getItem('weddingThemes');
    if (savedThemes) {
      try {
        const parsedThemes = JSON.parse(savedThemes);
        setThemes(parsedThemes);
        console.log("ThemeSettings - Loaded themes:", parsedThemes);
      } catch (error) {
        console.error("Error parsing themes:", error);
      }
    } else {
      // If no themes exist, initialize with default data
      const defaultThemes = [
        { id: "1", name: "Elegant Gold", category: "Premium", thumbnail: "https://placehold.co/200x280/f5f5f5/333333?text=Elegant+Gold" },
        { id: "2", name: "Rustic Brown", category: "Classic", thumbnail: "https://placehold.co/200x280/f5f5f5/333333?text=Rustic+Brown" },
        { id: "3", name: "Modern Minimal", category: "Basic", thumbnail: "https://placehold.co/200x280/f5f5f5/333333?text=Modern+Minimal" },
        { id: "4", name: "Floral Garden", category: "Premium", thumbnail: "https://placehold.co/200x280/f5f5f5/333333?text=Floral+Garden" },
      ];
      setThemes(defaultThemes);
      console.log("ThemeSettings - Created default themes:", defaultThemes);
      
      // Save default themes to localStorage
      localStorage.setItem('weddingThemes', JSON.stringify(defaultThemes));
      
      // Also ensure themes is available under the old key for backward compatibility
      localStorage.setItem('themes', JSON.stringify(defaultThemes.map(theme => theme.name)));
    }
  }, []);

  // Update categories when packages change
  useEffect(() => {
    if (packages && packages.length > 0) {
      const uniqueCategories = Array.from(
        new Set(packages.map((pkg: Package) => pkg.name).filter(Boolean))
      );
      setCategories(uniqueCategories as string[]);
      console.log("ThemeSettings - Updated categories from packages:", uniqueCategories);
    }
  }, [packages]);

  // Filter themes based on selected category and search query
  const filteredThemes = themes.filter(theme => {
    // Filter by category
    const categoryMatch = selectedCategory === "all" || theme.category === selectedCategory;
    
    // Filter by search query
    const searchMatch = theme.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  // Handle add new theme
  const handleAddTheme = (newTheme: Omit<Theme, "id">) => {
    const themeWithId = {
      ...newTheme,
      id: `theme-${Date.now()}`
    };
    
    const updatedThemes = [...themes, themeWithId];
    setThemes(updatedThemes);
    
    // Save to localStorage - both new and old format for compatibility
    localStorage.setItem('weddingThemes', JSON.stringify(updatedThemes));
    localStorage.setItem('themes', JSON.stringify(updatedThemes.map(theme => theme.name)));
    
    toast.success("Tema baru berhasil ditambahkan");
    console.log("ThemeSettings - Theme added:", themeWithId);
  };

  // Handle edit theme
  const handleEditTheme = (editedTheme: Theme) => {
    const updatedThemes = themes.map(theme => 
      theme.id === editedTheme.id ? editedTheme : theme
    );
    
    setThemes(updatedThemes);
    
    // Save to localStorage - both new and old format for compatibility
    localStorage.setItem('weddingThemes', JSON.stringify(updatedThemes));
    localStorage.setItem('themes', JSON.stringify(updatedThemes.map(theme => theme.name)));
    
    toast.success("Tema berhasil diperbarui");
    console.log("ThemeSettings - Theme edited:", editedTheme);
  };

  // Handle delete theme
  const handleDeleteTheme = () => {
    if (!themeToDelete) return;
    
    const updatedThemes = themes.filter(theme => theme.id !== themeToDelete.id);
    setThemes(updatedThemes);
    
    // Save to localStorage - both new and old format for compatibility
    localStorage.setItem('weddingThemes', JSON.stringify(updatedThemes));
    localStorage.setItem('themes', JSON.stringify(updatedThemes.map(theme => theme.name)));
    
    // Close dialog
    setShowDeleteDialog(false);
    setThemeToDelete(null);
    
    toast.success("Tema berhasil dihapus");
    console.log("ThemeSettings - Theme deleted:", themeToDelete);
  };

  // Handler for edit button click
  const handleEditClick = (theme: Theme) => {
    setThemeToEdit(theme);
    setIsEditModalOpen(true);
  };

  // Handler for delete button click
  const handleDeleteClick = (theme: Theme) => {
    setThemeToDelete(theme);
    setShowDeleteDialog(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tema Undangan</CardTitle>
        <CardDescription>
          Kelola tema undangan untuk klien Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search & Filter Controls */}
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex flex-grow gap-2 max-w-full sm:max-w-[70%]">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cari tema..." 
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full max-w-[180px]">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex border rounded-md overflow-hidden">
              <Button 
                variant={viewMode === "grid" ? "default" : "outline"} 
                size="icon" 
                className="h-8 w-8 rounded-none" 
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === "compact" ? "default" : "outline"} 
                size="icon" 
                className="h-8 w-8 rounded-none" 
                onClick={() => setViewMode("compact")}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Tambah Tema
            </Button>
          </div>
        </div>
        
        {/* Themes Grid */}
        {filteredThemes.length > 0 ? (
          <div className={`grid gap-4 ${viewMode === "grid" 
            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" 
            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"}`}
          >
            {filteredThemes.map((theme) => (
              <div key={theme.id} className="border rounded-md overflow-hidden group">
                <div className="relative aspect-[3/4] bg-gray-100">
                  <img 
                    src={theme.thumbnail || `https://placehold.co/200x280/f5f5f5/333333?text=${encodeURIComponent(theme.name)}`}
                    alt={theme.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-1">
                      <Button size="icon" variant="outline" className="h-7 w-7 bg-white" onClick={() => handleEditClick(theme)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="outline" className="h-7 w-7 bg-white" onClick={() => handleDeleteClick(theme)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className={`p-2 ${viewMode === "compact" ? "text-xs" : "p-3"}`}>
                  <h3 className={`font-medium truncate ${viewMode === "compact" ? "text-xs" : ""}`}>{theme.name}</h3>
                  {theme.category && (
                    <p className={`text-muted-foreground truncate ${viewMode === "compact" ? "text-[10px]" : "text-xs"}`}>
                      {theme.category}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Tidak ada tema dalam kategori ini</p>
          </div>
        )}
      </CardContent>
      
      {/* Add Theme Modal */}
      <AddThemeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTheme={handleAddTheme}
        existingCategories={categories}
      />
      
      {/* Edit Theme Modal */}
      {themeToEdit && (
        <EditThemeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          theme={themeToEdit}
          onSave={handleEditTheme}
          existingCategories={categories}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tema</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus tema "{themeToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTheme}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
