import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, Pencil, Trash2, Image } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Theme, Package } from "@/types/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeSettings() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [formData, setFormData] = useState<Partial<Theme>>({
    name: "",
    category: "",
    thumbnail: ""
  });
  
  // Load themes from localStorage on component mount
  useEffect(() => {
    // Load packages first
    const storedPackages = localStorage.getItem('packages');
    if (storedPackages) {
      try {
        const parsedPackages = JSON.parse(storedPackages);
        setPackages(parsedPackages);
      } catch (e) {
        console.error("Error parsing packages:", e);
      }
    }
    
    // Then load themes
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
    // Get package names if packages exist
    const packageNames = packages.length > 0 ? packages.map(pkg => pkg.name) : ["Basic", "Premium"];
    const defaultCategory = packageNames[0] || "Basic";
    
    const defaultThemes: Theme[] = [
      {
        id: uuidv4(),
        name: "Elegant Gold",
        thumbnail: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=300",
        category: "Premium",
      },
      {
        id: uuidv4(),
        name: "Floral Pink",
        thumbnail: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=300",
        category: "Basic",
      },
      {
        id: uuidv4(),
        name: "Rustic Wood",
        thumbnail: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=300",
        category: "Premium",
      },
      {
        id: uuidv4(),
        name: "Minimalist",
        thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=300",
        category: "Basic",
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
    // Set default category to first package name if available, otherwise "Basic"
    const defaultCategory = packages.length > 0 ? packages[0].name : "Basic";
    
    setEditingTheme(null);
    setFormData({
      name: "",
      category: defaultCategory,
      thumbnail: ""
    });
    setIsDialogOpen(true);
  };
  
  // Handle editing a theme
  const handleEditTheme = (id: string) => {
    const theme = themes.find(t => t.id === id);
    if (theme) {
      setEditingTheme(theme);
      setFormData({
        name: theme.name,
        category: theme.category,
        price: theme.price,
        thumbnail: theme.thumbnail,
        description: theme.description
      });
      setIsDialogOpen(true);
    }
  };
  
  // Handle deleting a theme
  const handleDeleteTheme = (id: string) => {
    const updatedThemes = themes.filter(theme => theme.id !== id);
    setThemes(updatedThemes);
    saveThemes(updatedThemes);
    toast.success("Tema berhasil dihapus");
  };

  // Handle input change
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSaveTheme = () => {
    if (!formData.name) {
      toast.error("Nama tema tidak boleh kosong");
      return;
    }

    if (editingTheme) {
      // Update existing theme
      const updatedThemes = themes.map(theme => 
        theme.id === editingTheme.id 
          ? { ...theme, ...formData } 
          : theme
      );
      setThemes(updatedThemes);
      saveThemes(updatedThemes);
      toast.success(`Tema ${formData.name} berhasil diperbarui`);
    } else {
      // Add new theme
      const newTheme: Theme = {
        id: uuidv4(),
        name: formData.name || "Tema Baru",
        thumbnail: formData.thumbnail || "",
        category: formData.category || (packages.length > 0 ? packages[0].name : "Basic"),
        description: formData.description
      };
      
      const updatedThemes = [...themes, newTheme];
      setThemes(updatedThemes);
      saveThemes(updatedThemes);
      toast.success(`Tema ${newTheme.name} berhasil ditambahkan`);
    }
    
    setIsDialogOpen(false);
  };

  return (
    <>
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
                  className="h-32 relative flex items-center justify-center bg-gray-100"
                >
                  {theme.thumbnail ? (
                    <img 
                      src={theme.thumbnail} 
                      alt={theme.name} 
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center opacity-50">
                      <Image className="h-8 w-8 mb-2" />
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )}
                  {/* Removed the div with the black overlay and large title text */}
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
                    {theme.price && (
                      <span className="text-sm">Rp {theme.price?.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingTheme ? "Edit Tema" : "Tambah Tema Baru"}</DialogTitle>
            <DialogDescription>
              {editingTheme 
                ? "Perbarui informasi tema undangan" 
                : "Tambahkan tema undangan baru ke dalam sistem"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Tema</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Masukkan nama tema"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Kategori</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {/* Dynamic options based on loaded packages */}
                  {packages.length > 0 ? (
                    packages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.name}>
                        {pkg.name}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price?.toString() || "0"}
                onChange={(e) => handleInputChange("price", parseInt(e.target.value, 10))}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="thumbnail">URL Gambar Thumbnail</Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail || ""}
                onChange={(e) => handleInputChange("thumbnail", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi (opsional)</Label>
              <Input
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Deskripsi singkat tentang tema"
              />
            </div>

            <div className="mt-2">
              <div className="rounded-lg overflow-hidden border">
                <div 
                  className="h-24 relative flex items-center justify-center bg-gray-100"
                >
                  {formData.thumbnail ? (
                    <img 
                      src={formData.thumbnail} 
                      alt="Preview" 
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center opacity-50">
                      <Image className="h-6 w-6 mb-1" />
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                  )}
                  {/* Removed the div with the black overlay and large title text in the preview */}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveTheme}>
              {editingTheme ? "Perbarui" : "Tambah"} Tema
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
