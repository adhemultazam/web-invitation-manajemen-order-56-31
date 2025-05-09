
import { useState, useEffect } from "react";
import { Theme, Package } from "@/types/types";
import { toast } from "sonner";

export function useThemeManager() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [themeToEdit, setThemeToEdit] = useState<Theme | null>(null);
  const [themeToDelete, setThemeToDelete] = useState<Theme | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Load themes and packages from localStorage on component mount
  useEffect(() => {
    // Load packages first to get categories
    const savedPackages = localStorage.getItem('packages');
    if (savedPackages) {
      try {
        const parsedPackages = JSON.parse(savedPackages);
        setPackages(parsedPackages);
        
        // Extract unique categories from packages
        if (parsedPackages && parsedPackages.length > 0) {
          const uniqueCategories = Array.from(
            new Set(parsedPackages.map((pkg: Package) => pkg.name).filter(Boolean))
          );
          setCategories(uniqueCategories as string[]);
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
      } catch (error) {
        console.error("Error parsing themes:", error);
      }
    } else {
      // If no themes exist, initialize with default data
      const defaultThemes = [
        { id: "1", name: "Elegant Gold", category: "Premium", thumbnail: "https://placehold.co/200x200/f5f5f5/333333?text=Elegant+Gold" },
        { id: "2", name: "Rustic Brown", category: "Classic", thumbnail: "https://placehold.co/200x200/f5f5f5/333333?text=Rustic+Brown" },
        { id: "3", name: "Modern Minimal", category: "Basic", thumbnail: "https://placehold.co/200x200/f5f5f5/333333?text=Modern+Minimal" },
        { id: "4", name: "Floral Garden", category: "Premium", thumbnail: "https://placehold.co/200x200/f5f5f5/333333?text=Floral+Garden" },
      ];
      setThemes(defaultThemes);
      
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

  return {
    themes,
    filteredThemes,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    themeToEdit,
    setThemeToEdit,
    themeToDelete,
    setThemeToDelete,
    showDeleteDialog,
    setShowDeleteDialog,
    handleAddTheme,
    handleEditTheme,
    handleDeleteTheme,
    handleEditClick,
    handleDeleteClick
  };
}
