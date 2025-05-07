
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VendorList } from "./vendor/VendorList";
import { VendorForm } from "./vendor/VendorForm";
import { Vendor } from "@/types/types";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function VendorSettings() {
  // Use our custom hook for localStorage
  const [vendors, setVendors] = useLocalStorage<Vendor[]>("vendors", []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null);

  // Open dialog for adding a new vendor
  const handleAddVendor = () => {
    setCurrentVendor(null);
    setIsDialogOpen(true);
  };

  // Open dialog for editing a vendor
  const handleEditVendor = (vendor: Vendor) => {
    setCurrentVendor(vendor);
    setIsDialogOpen(true);
  };

  // Delete a vendor
  const handleDeleteVendor = (id: string) => {
    const updatedVendors = vendors.filter(vendor => vendor.id !== id);
    setVendors(updatedVendors);
    toast.success("Vendor berhasil dihapus");
  };

  // Save new or updated vendor
  const handleSaveVendor = (vendorData: Omit<Vendor, "id">) => {
    if (currentVendor) {
      // Update existing vendor
      const updatedVendors = vendors.map(vendor => 
        vendor.id === currentVendor.id ? { ...vendor, ...vendorData } : vendor
      );
      setVendors(updatedVendors);
      toast.success("Vendor berhasil diperbarui");
    } else {
      // Add new vendor
      const newVendor = {
        ...vendorData,
        id: crypto.randomUUID()
      };
      setVendors([...vendors, newVendor]);
      toast.success("Vendor baru berhasil ditambahkan");
    }
    setIsDialogOpen(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Vendor</CardTitle>
          <CardDescription>
            Kelola daftar vendor dan reseller Anda
          </CardDescription>
        </div>
        <Button onClick={handleAddVendor} className="ml-auto">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Vendor
        </Button>
      </CardHeader>
      <CardContent>
        <VendorList 
          vendors={vendors} 
          onEdit={handleEditVendor} 
          onDelete={handleDeleteVendor}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <VendorForm
            currentVendor={currentVendor}
            onSubmit={handleSaveVendor}
            onCancel={() => setIsDialogOpen(false)}
          />
        </Dialog>
      </CardContent>
    </Card>
  );
}
