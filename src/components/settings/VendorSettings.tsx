
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
import { useState } from "react";
import { Vendor } from "@/types/types";
import { Plus, Edit, Trash2 } from "lucide-react";

// Mock data for vendors
const initialVendors: Vendor[] = [
  {
    id: "1",
    name: "Vendor Utama",
    code: "MAIN",
    commission: 10
  },
  {
    id: "2",
    name: "Reseller Premium",
    code: "PREM",
    commission: 15
  }
];

export function VendorSettings() {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    commission: 0
  });

  const handleOpenDialog = (vendor?: Vendor) => {
    if (vendor) {
      setCurrentVendor(vendor);
      setFormData({
        name: vendor.name,
        code: vendor.code,
        commission: vendor.commission
      });
    } else {
      setCurrentVendor(null);
      setFormData({
        name: "",
        code: "",
        commission: 0
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
    } else {
      // Add new vendor
      const newVendor: Vendor = {
        id: Date.now().toString(),
        ...formData
      };
      setVendors((prev) => [...prev, newVendor]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setVendors((prev) => prev.filter((vendor) => vendor.id !== id));
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
              <TableHead>Komisi (%)</TableHead>
              <TableHead className="w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">{vendor.name}</TableCell>
                <TableCell>{vendor.code}</TableCell>
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
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
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
