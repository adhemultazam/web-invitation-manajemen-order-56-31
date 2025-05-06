
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Package } from "@/types/types";

export function PackageSettings() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [newPackage, setNewPackage] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
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

  // Start editing a package
  const startEditing = (id: string) => {
    setEditingId(id);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
  };

  // Handle package name or price change
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

  // Save changes to a package
  const handleSavePackage = (id: string) => {
    const packageToSave = packages.find(pkg => pkg.id === id);
    if (packageToSave && packageToSave.name.trim()) {
      setEditingId(null);
      toast.success(`Paket ${packageToSave.name} berhasil disimpan`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Nama paket baru"
          value={newPackage}
          onChange={e => setNewPackage(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAddPackage()}
          className="flex-1"
        />
        <Input
          placeholder="Harga paket (Rp)"
          value={newPrice}
          onChange={e => setNewPrice(e.target.value.replace(/[^0-9]/g, ''))}
          onKeyDown={e => e.key === "Enter" && handleAddPackage()}
          type="text"
          className="flex-1"
        />
        <Button onClick={handleAddPackage} className="whitespace-nowrap">
          <Plus className="mr-1 h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Tambah</span>
        </Button>
      </div>

      <div className="space-y-2 mt-4">
        {packages.map(pkg => (
          <div key={pkg.id} className="border rounded-md p-2">
            {editingId === pkg.id ? (
              <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_auto] gap-2 items-center">
                <Input
                  value={pkg.name}
                  placeholder="Nama paket"
                  onChange={e => handlePackageChange(pkg.id, 'name', e.target.value)}
                  autoFocus
                />
                <Input
                  value={pkg.price === 0 ? '' : String(pkg.price)}
                  placeholder="Harga (Rp)"
                  onChange={e => handlePackageChange(pkg.id, 'price', e.target.value.replace(/[^0-9]/g, ''))}
                  type="text"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSavePackage(pkg.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={cancelEditing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{pkg.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Rp {pkg.price.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEditing(pkg.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeletePackage(pkg.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
