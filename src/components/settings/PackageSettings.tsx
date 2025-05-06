
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Save } from "lucide-react";
import { toast } from "sonner";
import { Package } from "@/types/types";

export function PackageSettings() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [newPackage, setNewPackage] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const isMounted = useRef(true);
  
  // Load packages from localStorage on component mount
  useEffect(() => {
    const loadPackages = () => {
      const savedPackages = localStorage.getItem("packages");
      
      if (savedPackages && isMounted.current) {
        try {
          setPackages(JSON.parse(savedPackages));
        } catch (error) {
          console.error("Error parsing packages:", error);
          // Initialize with some default packages if there's an error
          const defaultPackages = [
            { id: crypto.randomUUID(), name: "Basic", price: 500000 },
            { id: crypto.randomUUID(), name: "Standard", price: 1000000 },
            { id: crypto.randomUUID(), name: "Premium", price: 2000000 }
          ];
          setPackages(defaultPackages);
          localStorage.setItem("packages", JSON.stringify(defaultPackages));
        }
      } else if (isMounted.current) {
        // Initialize with default packages if none exist
        const defaultPackages = [
          { id: crypto.randomUUID(), name: "Basic", price: 500000 },
          { id: crypto.randomUUID(), name: "Standard", price: 1000000 },
          { id: crypto.randomUUID(), name: "Premium", price: 2000000 }
        ];
        setPackages(defaultPackages);
        localStorage.setItem("packages", JSON.stringify(defaultPackages));
      }
    };
    
    loadPackages();
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Save packages to localStorage whenever they change
  useEffect(() => {
    if (isMounted.current) {
      localStorage.setItem("packages", JSON.stringify(packages));
    }
  }, [packages]);

  // Add a new package
  const handleAddPackage = () => {
    if (!newPackage.trim()) return;
    
    const price = newPrice ? parseFloat(newPrice) : 0;
    const newPackageItem = { 
      id: crypto.randomUUID(), 
      name: newPackage.trim(),
      price: price
    };

    setPackages([...packages, newPackageItem]);
    setNewPackage("");
    setNewPrice("");
    toast.success("Paket berhasil ditambahkan");
  };

  // Delete a package
  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
    toast.success("Paket berhasil dihapus");
  };

  // Handle package name change
  const handlePackageChange = (id: string, field: string, value: any) => {
    setPackages(
      packages.map(pkg => {
        if (pkg.id === id) {
          if (field === 'price') {
            return { ...pkg, [field]: parseFloat(value) || 0 };
          }
          return { ...pkg, [field]: value };
        }
        return pkg;
      })
    );
  };

  // Format price to IDR
  const formatPrice = (price: number | string | undefined) => {
    if (price === undefined) return "0";
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toLocaleString('id-ID');
  };

  // Save changes to a package
  const handleSavePackage = (id: string) => {
    const packageToSave = packages.find(pkg => pkg.id === id);
    if (packageToSave && packageToSave.name.trim()) {
      toast.success(`Paket ${packageToSave.name} berhasil disimpan`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="space-y-2">
          <Input
            placeholder="Nama paket baru"
            value={newPackage}
            onChange={e => setNewPackage(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAddPackage()}
          />
        </div>
        <div className="space-y-2">
          <Input
            placeholder="Harga paket (Rp)"
            value={newPrice}
            onChange={e => setNewPrice(e.target.value.replace(/[^0-9]/g, ''))}
            onKeyDown={e => e.key === "Enter" && handleAddPackage()}
            type="text"
          />
        </div>
      </div>

      <Button onClick={handleAddPackage} className="w-full">
        <Plus className="mr-1 h-4 w-4" />
        Tambah Paket
      </Button>

      <div className="space-y-2">
        {packages.map(pkg => (
          <div key={pkg.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
            <div className="col-span-2">
              <Input
                value={pkg.name}
                placeholder="Nama paket"
                onChange={e => handlePackageChange(pkg.id, 'name', e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <Input
                value={pkg.price === 0 ? '' : String(pkg.price)}
                placeholder="Harga (Rp)"
                onChange={e => handlePackageChange(pkg.id, 'price', e.target.value.replace(/[^0-9]/g, ''))}
                type="text"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              className="col-span-1"
              onClick={() => handleSavePackage(pkg.id)}
            >
              <Save className="mr-1 h-4 w-4" />
              Simpan
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="col-span-1"
              onClick={() => handleDeletePackage(pkg.id)}
            >
              <Trash className="mr-1 h-4 w-4" />
              Hapus
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
