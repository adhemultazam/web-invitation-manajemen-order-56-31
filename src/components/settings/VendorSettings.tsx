
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Save } from "lucide-react";
import { toast } from "sonner";
import { Vendor } from "@/types/types";
import { Label } from "@/components/ui/label";

export function VendorSettings() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [newVendorName, setNewVendorName] = useState("");
  const [newVendorCode, setNewVendorCode] = useState("");
  const [newVendorColor, setNewVendorColor] = useState("#9A84FF"); // Default color
  
  // Load vendors from localStorage on component mount
  useEffect(() => {
    const savedVendors = localStorage.getItem("vendors");
    
    if (savedVendors) {
      try {
        setVendors(JSON.parse(savedVendors));
      } catch (error) {
        console.error("Error parsing vendors:", error);
        // Initialize with default vendors if there's an error
        const defaultVendors = [
          { id: crypto.randomUUID(), name: "Vendor 1", code: "V001", color: "#9A84FF" },
          { id: crypto.randomUUID(), name: "Vendor 2", code: "V002", color: "#60A5FA" }
        ];
        setVendors(defaultVendors);
        localStorage.setItem("vendors", JSON.stringify(defaultVendors));
      }
    } else {
      // Initialize with default vendors if none exist
      const defaultVendors = [
        { id: crypto.randomUUID(), name: "Vendor 1", code: "V001", color: "#9A84FF" },
        { id: crypto.randomUUID(), name: "Vendor 2", code: "V002", color: "#60A5FA" }
      ];
      setVendors(defaultVendors);
      localStorage.setItem("vendors", JSON.stringify(defaultVendors));
    }
  }, []);

  // Save vendors to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("vendors", JSON.stringify(vendors));
  }, [vendors]);

  // Generate a unique vendor code
  const generateVendorCode = () => {
    const prefix = "V";
    const existingCodes = vendors.map(v => v.code);
    let counter = 1;
    let newCode = `${prefix}${String(counter).padStart(3, '0')}`;
    
    while (existingCodes.includes(newCode)) {
      counter++;
      newCode = `${prefix}${String(counter).padStart(3, '0')}`;
    }
    
    return newCode;
  };

  // Add a new vendor
  const handleAddVendor = () => {
    if (!newVendorName.trim()) return;
    
    const vendorCode = newVendorCode.trim() || generateVendorCode();
    
    const newVendorItem = { 
      id: crypto.randomUUID(),
      name: newVendorName.trim(),
      code: vendorCode,
      color: newVendorColor
    };
    
    setVendors([...vendors, newVendorItem]);
    setNewVendorName("");
    setNewVendorCode("");
    setNewVendorColor("#9A84FF"); // Reset to default
    toast.success("Vendor berhasil ditambahkan");
  };

  // Delete a vendor
  const handleDeleteVendor = (id: string) => {
    setVendors(vendors.filter(vendor => vendor.id !== id));
    toast.success("Vendor berhasil dihapus");
  };

  // Handle vendor field changes
  const handleVendorChange = (id: string, field: keyof Vendor, value: string) => {
    setVendors(
      vendors.map(vendor => 
        vendor.id === id ? { ...vendor, [field]: value } : vendor
      )
    );
  };

  // Save changes to a vendor
  const handleSaveVendor = (id: string) => {
    const vendorToSave = vendors.find(vendor => vendor.id === id);
    if (vendorToSave && vendorToSave.name.trim()) {
      toast.success(`Vendor ${vendorToSave.name} berhasil disimpan`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="new-vendor-name">Nama Vendor</Label>
            <Input
              id="new-vendor-name"
              placeholder="Nama vendor baru"
              value={newVendorName}
              onChange={e => setNewVendorName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="new-vendor-code">Kode Vendor</Label>
            <Input
              id="new-vendor-code"
              placeholder="Kode vendor (opsional)"
              value={newVendorCode}
              onChange={e => setNewVendorCode(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="new-vendor-color">Warna</Label>
            <Input
              id="new-vendor-color"
              type="color"
              value={newVendorColor}
              onChange={e => setNewVendorColor(e.target.value)}
              className="h-10 mt-1"
            />
          </div>
        </div>
        <Button onClick={handleAddVendor}>
          <Plus className="mr-1 h-4 w-4" />
          Tambah Vendor
        </Button>
      </div>

      <div className="space-y-2">
        {vendors.map(vendor => (
          <div key={vendor.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-2 items-center">
            <Input
              value={vendor.name}
              onChange={e => handleVendorChange(vendor.id, "name", e.target.value)}
              placeholder="Nama vendor"
            />
            <Input
              value={vendor.code}
              onChange={e => handleVendorChange(vendor.id, "code", e.target.value)}
              placeholder="Kode vendor"
            />
            <Input
              type="color"
              value={vendor.color}
              onChange={e => handleVendorChange(vendor.id, "color", e.target.value)}
              className="h-10"
            />
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                className="shrink-0"
                onClick={() => handleSaveVendor(vendor.id)}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                className="shrink-0"
                onClick={() => handleDeleteVendor(vendor.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
