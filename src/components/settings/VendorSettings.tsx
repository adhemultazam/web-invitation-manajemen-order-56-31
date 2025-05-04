
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Vendor } from "@/types/types";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { VendorForm } from "./vendor/VendorForm";
import { VendorList } from "./vendor/VendorList";
import { loadVendors, saveVendors } from "./vendor/vendorUtils";

export function VendorSettings() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    // Load vendors from localStorage
    setVendors(loadVendors());
  }, []);

  // Save vendors to localStorage whenever they change
  useEffect(() => {
    saveVendors(vendors);
  }, [vendors]);

  const handleOpenDialog = (vendor?: Vendor) => {
    if (vendor) {
      setCurrentVendor(vendor);
    } else {
      setCurrentVendor(null);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (formData: Omit<Vendor, "id">) => {
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
          <VendorForm 
            currentVendor={currentVendor} 
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </Dialog>
      </CardHeader>
      <CardContent>
        <VendorList 
          vendors={vendors} 
          onEdit={handleOpenDialog} 
          onDelete={handleDelete} 
        />
      </CardContent>
    </Card>
  );
}
