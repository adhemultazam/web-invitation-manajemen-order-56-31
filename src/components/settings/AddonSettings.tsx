
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Addon } from "@/types/types";

// Initial addons for demo
const initialAddons: Addon[] = [
  { id: "1", name: "Express", color: "#3b82f6", price: 50000 },
  { id: "2", name: "Super Express", color: "#f97316", price: 100000 },
  { id: "3", name: "Custom Desain", color: "#8b5cf6", price: 150000 },
  { id: "4", name: "Custom Domain", color: "#16a34a", price: 200000 }
];

// Available colors for addons with hex values instead of Tailwind classes
const colorOptions = [
  { name: "Merah", value: "#ef4444" }, // red-500
  { name: "Biru", value: "#3b82f6" }, // blue-500
  { name: "Hijau", value: "#22c55e" }, // green-500
  { name: "Kuning", value: "#eab308" }, // yellow-500
  { name: "Ungu", value: "#8b5cf6" }, // purple-500
  { name: "Pink", value: "#ec4899" }, // pink-500
  { name: "Biru Langit", value: "#06b6d4" }, // cyan-500
  { name: "Jingga", value: "#f97316" }, // orange-500
  { name: "Abu-abu", value: "#6b7280" }, // gray-500
  { name: "Coklat", value: "#9a3412" }, // orange-800
];

export function AddonSettings() {
  const [addons, setAddons] = useState<Addon[]>(initialAddons);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAddon, setCurrentAddon] = useState<Addon | null>(null);
  const [formData, setFormData] = useState({ name: "", color: "#3b82f6", price: 0 });

  // Load saved addons or initialize with defaults
  useEffect(() => {
    const savedAddons = localStorage.getItem('addons');
    if (savedAddons) {
      try {
        const parsedAddons = JSON.parse(savedAddons);
        if (Array.isArray(parsedAddons)) {
          // Convert any bg-* classes to hex codes if needed
          const normalizedAddons = parsedAddons.map(addon => ({
            ...addon,
            color: addon.color.startsWith('#') ? addon.color : convertBgClassToHex(addon.color)
          }));
          setAddons(normalizedAddons);
        }
      } catch (e) {
        console.error("Error parsing addons:", e);
      }
    } else {
      // Save initial addons to localStorage
      localStorage.setItem('addons', JSON.stringify(initialAddons));
    }
  }, []);

  // Function to convert Tailwind bg-* class to hex color
  const convertBgClassToHex = (bgClass: string) => {
    // Map of Tailwind bg classes to hex colors
    const colorMap: Record<string, string> = {
      'bg-red-500': '#ef4444',
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#22c55e',
      'bg-yellow-500': '#eab308',
      'bg-purple-500': '#8b5cf6',
      'bg-pink-500': '#ec4899',
      'bg-cyan-500': '#06b6d4',
      'bg-orange-500': '#f97316',
      'bg-gray-500': '#6b7280',
      'bg-orange-800': '#9a3412',
    };

    return colorMap[bgClass] || '#3b82f6'; // Default to blue if not found
  };

  const handleOpenDialog = (addon?: Addon) => {
    if (addon) {
      setCurrentAddon(addon);
      setFormData({
        name: addon.name,
        color: addon.color,
        price: addon.price,
      });
    } else {
      setCurrentAddon(null);
      setFormData({ name: "", color: "#3b82f6", price: 0 });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.name.trim() === "") {
      toast.error("Nama addon tidak boleh kosong");
      return;
    }
    
    let updatedAddons: Addon[];
    
    if (currentAddon) {
      // Update existing addon
      updatedAddons = addons.map((s) => 
        (s.id === currentAddon.id ? { ...s, ...formData } : s)
      );
      toast.success("Addon berhasil diperbarui");
    } else {
      // Add new addon
      const newAddon: Addon = {
        id: Date.now().toString(),
        ...formData,
      };
      updatedAddons = [...addons, newAddon];
      toast.success("Addon baru berhasil ditambahkan");
    }

    setAddons(updatedAddons);
    localStorage.setItem('addons', JSON.stringify(updatedAddons));
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const addonToDelete = addons.find(addon => addon.id === id);
    const updatedAddons = addons.filter((addon) => addon.id !== id);
    
    setAddons(updatedAddons);
    localStorage.setItem('addons', JSON.stringify(updatedAddons));
    
    if (addonToDelete) {
      toast.success(`Addon "${addonToDelete.name}" berhasil dihapus`);
    }
  };

  const handleColorChange = (color: string) => {
    setFormData({ ...formData, color });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pengaturan Addons</CardTitle>
          <CardDescription>
            Kelola daftar addons untuk pesanan undangan
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Addon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentAddon ? "Edit Addon" : "Tambah Addon Baru"}
              </DialogTitle>
              <DialogDescription>
                {currentAddon
                  ? "Ubah nama dan warna addon"
                  : "Tambahkan addon baru ke daftar"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Addon</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Masukkan nama addon"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Warna Label</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className={`h-8 rounded-md transition-all ${
                          formData.color === color.value
                            ? "ring-2 ring-offset-2 ring-wedding-primary"
                            : ""
                        }`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => handleColorChange(color.value)}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div 
                      className="h-6 w-6 rounded-full" 
                      style={{ backgroundColor: formData.color }}
                    />
                    <span className="text-sm">Preview label</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addons.map((addon) => (
            <Card key={addon.id}>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: addon.color }}
                    />
                    <h3 className="font-medium">{addon.name}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(addon)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Addon</AlertDialogTitle>
                          <AlertDialogDescription>
                            Anda yakin ingin menghapus addon "{addon.name}"? Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(addon.id)}>
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <div 
                  className="px-2 py-1 text-xs rounded-full text-white"
                  style={{ backgroundColor: addon.color }}
                >
                  {addon.name}
                </div>
              </CardFooter>
            </Card>
          ))}

          {addons.length === 0 && (
            <div className="col-span-full p-8 text-center border rounded-md border-dashed">
              <p className="text-muted-foreground">
                Belum ada addon yang ditambahkan
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => handleOpenDialog()}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Addon
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
