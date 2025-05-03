
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useState, useEffect } from "react";
import { Vendor } from "@/types/types";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mock data for vendors with colors
const initialVendors: Vendor[] = [
  {
    id: "1",
    name: "Vendor Utama",
    code: "MAIN",
    commission: 10,
    color: "#6366f1" // Default color - indigo
  },
  {
    id: "2",
    name: "Reseller Premium",
    code: "PREM",
    commission: 15,
    color: "#3b82f6" // Default color - blue
  }
];

// Color palette options
const colorOptions = [
  "#6366f1", // indigo
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#d946ef", // pink
  "#ec4899", // magenta
  "#f97316", // orange
  "#f59e0b", // amber
  "#10b981", // emerald
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#ef4444", // red
  "#84cc16", // lime
  "#64748b", // slate
];

export function VendorSettings() {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    commission: 0,
    color: "#6366f1"
  });

  useEffect(() => {
    // Load vendors from localStorage if available
    const storedVendors = localStorage.getItem('vendors');
    if (storedVendors) {
      try {
        setVendors(JSON.parse(storedVendors));
      } catch (e) {
        console.error("Error parsing vendors:", e);
      }
    }
  }, []);

  // Save vendors to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('vendors', JSON.stringify(vendors));
  }, [vendors]);

  const handleOpenDialog = (vendor?: Vendor) => {
    if (vendor) {
      setCurrentVendor(vendor);
      setFormData({
        name: vendor.name,
        code: vendor.code,
        commission: vendor.commission || 0,
        color: vendor.color || "#6366f1"
      });
    } else {
      setCurrentVendor(null);
      setFormData({
        name: "",
        code: "",
        commission: 0,
        color: "#6366f1"
      });
    }
    setIsDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'commission' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentVendor) {
      // Edit existing vendor
      setVendors((prev) =>
        prev.map((v) =>
          v.id === currentVendor.id
            ? { ...v, ...formData }
            : v
        )
      );
      toast.success(`Vendor ${formData.name} berhasil diperbarui`);
    } else {
      // Add new vendor
      const newVendor: Vendor = {
        id: Date.now().toString(),
        ...formData
      };
      setVendors((prev) => [...prev, newVendor]);
      toast.success(`Vendor ${formData.name} berhasil ditambahkan`);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const vendorToDelete = vendors.find(v => v.id === id);
    setVendors((prev) => prev.filter((vendor) => vendor.id !== id));
    if (vendorToDelete) {
      toast.success(`Vendor ${vendorToDelete.name} berhasil dihapus`);
    }
  };

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Vendor & Reseller</CardTitle>
          <CardDescription>
            Kelola daftar vendor dan reseller yang bekerja sama dengan Anda.
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Vendor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentVendor ? "Edit Vendor" : "Tambah Vendor Baru"}
              </DialogTitle>
              <DialogDescription>
                {currentVendor
                  ? "Ubah informasi vendor yang sudah ada."
                  : "Tambahkan vendor atau reseller baru ke sistem."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Vendor</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nama vendor"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="code">Kode</Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="Kode singkat (mis. MAIN)"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="commission">Komisi (%)</Label>
                  <Input
                    id="commission"
                    name="commission"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Persentase komisi"
                    value={formData.commission}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="color">Warna Label</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="color"
                      name="color"
                      type="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="w-16 h-10 p-1"
                      required
                    />
                    <Input
                      name="color"
                      type="text"
                      value={formData.color}
                      onChange={handleChange}
                      className="flex-1"
                      placeholder="#6366f1"
                      required
                    />
                    <Badge style={{ backgroundColor: formData.color, color: "#fff" }}>
                      Preview
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <Label className="mb-2 block text-sm">Pilihan warna cepat:</Label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`h-8 w-8 rounded-full transition-all ${
                            formData.color === color 
                              ? "ring-2 ring-offset-2 ring-wedding-primary" 
                              : ""
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleColorSelect(color)}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pilih warna untuk label vendor pada daftar pesanan
                  </p>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Vendor</TableHead>
              <TableHead>Kode</TableHead>
              <TableHead>Warna</TableHead>
              <TableHead>Komisi (%)</TableHead>
              <TableHead className="w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">
                  <Badge style={{
                    backgroundColor: vendor.color || "#6366f1", 
                    color: "#fff"
                  }}>
                    {vendor.name}
                  </Badge>
                </TableCell>
                <TableCell>{vendor.code}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-5 w-5 rounded-full" 
                      style={{ backgroundColor: vendor.color || "#6366f1" }}
                    ></div>
                    <span>{vendor.color || "#6366f1"}</span>
                  </div>
                </TableCell>
                <TableCell>{vendor.commission}%</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(vendor)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(vendor.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {vendors.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Belum ada vendor yang terdaftar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
