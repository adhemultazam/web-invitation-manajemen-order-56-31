
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Theme, Package } from "@/types/types";
import { Plus, Edit, Trash2 } from "lucide-react";

// Mock data for themes
const initialThemes: Theme[] = [
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

// Mock packages for category selection
const initialPackages: Package[] = [
  {
    id: "1",
    name: "Basic",
    price: 150000,
    description: "Paket basic untuk undangan digital sederhana.",
    features: ["1 halaman", "Maksimal 10 foto", "Durasi 1 bulan"]
  },
  {
    id: "2",
    name: "Premium",
    price: 250000,
    description: "Paket premium dengan fitur tambahan.",
    features: ["3 halaman", "Gallery foto tanpa batas", "Durasi 3 bulan", "Peta lokasi"]
  },
  {
    id: "3",
    name: "Gold",
    price: 350000,
    description: "Paket gold dengan semua fitur premium.",
    features: ["5 halaman", "Gallery foto tanpa batas", "Durasi 6 bulan", "Peta lokasi", "RSVP"]
  }
];

export function ThemeSettings() {
  const [themes, setThemes] = useState<Theme[]>(initialThemes);
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    thumbnail: "",
    category: ""
  });

  // Get unique package names for categories
  const packageCategories = packages.map(pkg => pkg.name);

  const handleOpenDialog = (theme?: Theme) => {
    if (theme) {
      setCurrentTheme(theme);
      setFormData({
        name: theme.name,
        thumbnail: theme.thumbnail,
        category: theme.category
      });
    } else {
      setCurrentTheme(null);
      setFormData({
        name: "",
        thumbnail: "",
        category: packageCategories[0] || ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | string,
    field?: string
  ) => {
    // Handle both input changes and select changes
    if (typeof e === "string" && field) {
      setFormData((prev) => ({
        ...prev,
        [field]: e
      }));
    } else if (typeof e !== "string") {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentTheme) {
      // Edit existing theme
      setThemes((prev) =>
        prev.map((t) =>
          t.id === currentTheme.id ? { ...t, ...formData } : t
        )
      );
    } else {
      // Add new theme
      const newTheme: Theme = {
        id: Date.now().toString(),
        ...formData
      };
      setThemes((prev) => [...prev, newTheme]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setThemes((prev) => prev.filter((theme) => theme.id !== id));
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Tema
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentTheme ? "Edit Tema" : "Tambah Tema Baru"}
              </DialogTitle>
              <DialogDescription>
                {currentTheme
                  ? "Ubah informasi tema yang sudah ada."
                  : "Tambahkan tema baru ke katalog."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Tema</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nama tema"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="thumbnail">URL Thumbnail</Label>
                  <Input
                    id="thumbnail"
                    name="thumbnail"
                    placeholder="https://example.com/image.jpg"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    required
                  />
                  {formData.thumbnail && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                      <img
                        src={formData.thumbnail}
                        alt="Thumbnail preview"
                        className="max-h-32 rounded-md object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Kategori Paket</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange(value, "category")}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Pilih kategori paket" />
                    </SelectTrigger>
                    <SelectContent>
                      {packageCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {themes.map((theme) => (
            <Card key={theme.id} className="overflow-hidden">
              <div className="relative h-40">
                <img
                  src={theme.thumbnail}
                  alt={theme.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleOpenDialog(theme)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDelete(theme.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium">{theme.name}</h3>
                <div className="mt-1">
                  <span className="text-xs px-2 py-1 rounded-full bg-wedding-light text-wedding-primary">
                    {theme.category}
                  </span>
                </div>
              </div>
            </Card>
          ))}
          
          {themes.length === 0 && (
            <div className="col-span-full flex items-center justify-center p-8 border rounded-lg border-dashed">
              <p className="text-muted-foreground">
                Belum ada tema yang terdaftar
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
