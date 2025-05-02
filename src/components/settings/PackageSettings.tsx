
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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Package } from "@/types/types";
import { Plus, Edit, Trash2, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Mock data for packages
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
  }
];

export function PackageSettings() {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    features: [] as string[]
  });
  const [newFeature, setNewFeature] = useState("");
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleOpenDialog = (pkg?: Package) => {
    if (pkg) {
      setCurrentPackage(pkg);
      setFormData({
        name: pkg.name,
        price: pkg.price,
        description: pkg.description,
        features: [...pkg.features]
      });
    } else {
      setCurrentPackage(null);
      setFormData({
        name: "",
        price: 0,
        description: "",
        features: []
      });
    }
    setNewFeature("");
    setIsDialogOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentPackage) {
      // Edit existing package
      setPackages((prev) =>
        prev.map((p) =>
          p.id === currentPackage.id ? { ...p, ...formData } : p
        )
      );
    } else {
      // Add new package
      const newPackage: Package = {
        id: Date.now().toString(),
        ...formData
      };
      setPackages((prev) => [...prev, newPackage]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
  };

  const toggleRow = (id: string) => {
    setOpenRows((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Paket & Harga</CardTitle>
          <CardDescription>
            Kelola daftar paket dan harga untuk undangan digital.
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Paket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {currentPackage ? "Edit Paket" : "Tambah Paket Baru"}
              </DialogTitle>
              <DialogDescription>
                {currentPackage
                  ? "Ubah informasi paket yang sudah ada."
                  : "Tambahkan paket baru ke sistem."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Paket</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nama paket"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Harga (Rp)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    placeholder="Harga paket"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Deskripsi singkat paket"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Fitur-fitur</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tambahkan fitur"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddFeature}
                    >
                      Tambah
                    </Button>
                  </div>
                  <ul className="space-y-2 mt-2">
                    {formData.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-muted p-2 rounded-md"
                      >
                        <span>{feature}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFeature(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                    {formData.features.length === 0 && (
                      <li className="text-muted-foreground text-sm">
                        Belum ada fitur yang ditambahkan
                      </li>
                    )}
                  </ul>
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
              <TableHead className="w-[180px]">Nama Paket</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg) => (
              <Collapsible
                key={pkg.id}
                open={openRows[pkg.id]}
                onOpenChange={() => toggleRow(pkg.id)}
                asChild
              >
                <>
                  <TableRow>
                    <TableCell className="font-medium">{pkg.name}</TableCell>
                    <TableCell>{formatPrice(pkg.price)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {pkg.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(pkg)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(pkg.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <ChevronDown
                              className={`h-4 w-4 transform transition-transform ${
                                openRows[pkg.id] ? "rotate-180" : ""
                              }`}
                            />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={4} className="p-4">
                        <div>
                          <h4 className="font-medium mb-2">Fitur-fitur:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {pkg.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </>
              </Collapsible>
            ))}
            {packages.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  Belum ada paket yang terdaftar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
