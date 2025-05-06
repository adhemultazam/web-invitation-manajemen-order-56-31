
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Theme } from "@/types/types";
import { AddThemeModal } from "./AddThemeModal";
import { EditThemeModal } from "./EditThemeModal";
import { Plus, Pencil, Trash2 } from "lucide-react";
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

  // Load themes from localStorage on component mount
  useEffect(() => {
    const savedThemes = localStorage.getItem('weddingThemes');
    if (savedThemes) {
      try {
        const parsedThemes = JSON.parse(savedThemes);
        setThemes(parsedThemes);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(parsedThemes.map((theme: Theme) => theme.category).filter(Boolean))
        );
        setCategories(uniqueCategories as string[]);
      } catch (error) {
        console.error("Error parsing themes:", error);
      }
    } else {
      // If no themes exist, initialize with default data
      const defaultThemes = [
        { id: "1", name: "Elegant Gold", category: "Premium", thumbnail: "https://placehold.co/200x280/f5f5f5/333333?text=Elegant+Gold" },
        { id: "2", name: "Rustic Brown", category: "Classic", thumbnail: "https://placehold.co/200x280/f5f5f5/333333?text=Rustic+Brown" },
        { id: "3", name: "Modern Minimal", category: "Simple", thumbnail: "https://placehold.co/200x280/f5f5f5/333333?text=Modern+Minimal" },
        { id: "4", name: "Floral Garden", category: "Premium", thumbnail: "https://placehold.co/200x280/f5f5f5/333333?text=Floral+Garden" },
      ];
      setThemes(defaultThemes);
      
      // Extract unique categories from default themes
      const uniqueCategories = Array.from(
        new Set(defaultThemes.map((theme: Theme) => theme.category).filter(Boolean))
      );
      setCategories(uniqueCategories as string[]);
      
      // Save default themes to localStorage
      localStorage.setItem('weddingThemes', JSON.stringify(defaultThemes));
    }
  }, []);

  // Filter themes based on selected category
  const filteredThemes = selectedCategory === "all"
    ? themes
    : themes.filter(theme => theme.category === selectedCategory);

  // Handle add new theme
  const handleAddTheme = (newTheme: Omit<Theme, "id">) => {
    const themeWithId = {
      ...newTheme,
      id: `theme-${Date.now()}`
    };
    
    const updatedThemes = [...themes, themeWithId];
    setThemes(updatedThemes);
    
    // Update categories if new category
    if (newTheme.category && !categories.includes(newTheme.category)) {
      setCategories([...categories, newTheme.category]);
    }
    
    // Save to localStorage
    localStorage.setItem('weddingThemes', JSON.stringify(updatedThemes));
    
    toast.success("Tema baru berhasil ditambahkan");
  };

  // Handle edit theme
  const handleEditTheme = (editedTheme: Theme) => {
    const updatedThemes = themes.map(theme => 
      theme.id === editedTheme.id ? editedTheme : theme
    );
    
    setThemes(updatedThemes);
    
    // Update categories if needed
    if (editedTheme.category && !categories.includes(editedTheme.category)) {
      setCategories([...categories, editedTheme.category]);
    }
    
    // Save to localStorage
    localStorage.setItem('weddingThemes', JSON.stringify(updatedThemes));
    
    toast.success("Tema berhasil diperbarui");
  };

  // Handle delete theme
  const handleDeleteTheme = () => {
    if (!themeToDelete) return;
    
    const updatedThemes = themes.filter(theme => theme.id !== themeToDelete.id);
    setThemes(updatedThemes);
    
    // Save to localStorage
    localStorage.setItem('weddingThemes', JSON.stringify(updatedThemes));
    
    // Close dialog
    setShowDeleteDialog(false);
    setThemeToDelete(null);
    
    toast.success("Tema berhasil dihapus");
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
        {/* Category Filter & Add Button */}
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="w-64">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
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
          
          <Button onClick={() => setIsAddModalOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Tambah Tema
          </Button>
        </div>
        
        {/* Themes Grid */}
        {filteredThemes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredThemes.map((theme) => (
              <div key={theme.id} className="border rounded-md overflow-hidden">
                <div className="relative aspect-[3/4] bg-gray-100">
                  <img 
                    src={theme.thumbnail || `https://placehold.co/200x280/f5f5f5/333333?text=${encodeURIComponent(theme.name)}`}
                    alt={theme.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button size="icon" variant="outline" className="h-7 w-7 bg-white" onClick={() => handleEditClick(theme)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-7 w-7 bg-white" onClick={() => handleDeleteClick(theme)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium">{theme.name}</h3>
                  {theme.category && (
                    <p className="text-xs text-muted-foreground">{theme.category}</p>
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
