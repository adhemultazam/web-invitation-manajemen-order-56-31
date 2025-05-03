
import { useState } from "react";
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
  { id: "1", name: "Foto Pre-Wedding", color: "bg-pink-500" },
  { id: "2", name: "Undangan Fisik", color: "bg-blue-500" },
  { id: "3", name: "Background Music", color: "bg-purple-500" },
  { id: "4", name: "Video Opening", color: "bg-amber-500" },
  { id: "5", name: "Galeri 20 Foto", color: "bg-green-500" },
  { id: "6", name: "Quotes Islami", color: "bg-cyan-500" },
];

// Available colors for addons
const colorOptions = [
  { name: "Merah", value: "bg-red-500" },
  { name: "Biru", value: "bg-blue-500" },
  { name: "Hijau", value: "bg-green-500" },
  { name: "Kuning", value: "bg-yellow-500" },
  { name: "Ungu", value: "bg-purple-500" },
  { name: "Pink", value: "bg-pink-500" },
  { name: "Biru Langit", value: "bg-cyan-500" },
  { name: "Jingga", value: "bg-amber-500" },
  { name: "Abu-abu", value: "bg-gray-500" },
  { name: "Coklat", value: "bg-orange-500" },
];

export function AddonSettings() {
  const [addons, setAddons] = useState<Addon[]>(initialAddons);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAddon, setCurrentAddon] = useState<Addon | null>(null);
  const [formData, setFormData] = useState({ name: "", color: "bg-blue-500" });

  const handleOpenDialog = (addon?: Addon) => {
    if (addon) {
      setCurrentAddon(addon);
      setFormData({
        name: addon.name,
        color: addon.color,
      });
    } else {
      setCurrentAddon(null);
      setFormData({ name: "", color: "bg-blue-500" });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.name.trim() === "") {
      toast.error("Nama addon tidak boleh kosong");
      return;
    }
    
    if (currentAddon) {
      // Update existing addon
      setAddons((prev) =>
        prev.map((s) => (s.id === currentAddon.id ? { ...s, ...formData } : s))
      );
      toast.success("Addon berhasil diperbarui");
    } else {
      // Add new addon
      const newAddon: Addon = {
        id: Date.now().toString(),
        ...formData,
      };
      setAddons([...addons, newAddon]);
      toast.success("Addon baru berhasil ditambahkan");
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const addonToDelete = addons.find(addon => addon.id === id);
    setAddons(addons.filter((addon) => addon.id !== id));
    
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
                        className={`h-8 rounded-md transition-all ${color.value} ${
                          formData.color === color.value
                            ? "ring-2 ring-offset-2 ring-wedding-primary"
                            : ""
                        }`}
                        onClick={() => handleColorChange(color.value)}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className={`h-6 w-6 rounded-full ${formData.color}`} />
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
                    <div className={`w-3 h-3 rounded-full ${addon.color}`} />
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
                <div className={`px-2 py-1 text-xs rounded-full text-white ${addon.color}`}>
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
