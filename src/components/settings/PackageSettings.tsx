
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Save } from "lucide-react";
import { toast } from "sonner";
import { Package } from "@/types/types";

export function PackageSettings() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [newPackage, setNewPackage] = useState("");
  
  // Load packages from localStorage on component mount
  useEffect(() => {
    const savedPackages = localStorage.getItem("packages");
    
    if (savedPackages) {
      try {
        setPackages(JSON.parse(savedPackages));
      } catch (error) {
        console.error("Error parsing packages:", error);
        // Initialize with some default packages if there's an error
        const defaultPackages = ["Basic", "Standard", "Premium"];
        setPackages(defaultPackages.map(name => ({ id: crypto.randomUUID(), name })));
        localStorage.setItem("packages", JSON.stringify(defaultPackages));
      }
    } else {
      // Initialize with default packages if none exist
      const defaultPackages = [
        { id: crypto.randomUUID(), name: "Basic" },
        { id: crypto.randomUUID(), name: "Standard" },
        { id: crypto.randomUUID(), name: "Premium" }
      ];
      setPackages(defaultPackages);
      localStorage.setItem("packages", JSON.stringify(defaultPackages));
    }
  }, []);

  // Save packages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("packages", JSON.stringify(packages));
  }, [packages]);

  // Add a new package
  const handleAddPackage = () => {
    if (!newPackage.trim()) return;
    
    const newPackageItem = { id: crypto.randomUUID(), name: newPackage.trim() };
    setPackages([...packages, newPackageItem]);
    setNewPackage("");
    toast.success("Paket berhasil ditambahkan");
  };

  // Delete a package
  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
    toast.success("Paket berhasil dihapus");
  };

  // Handle package name change
  const handlePackageChange = (id: string, newName: string) => {
    setPackages(
      packages.map(pkg => 
        pkg.id === id ? { ...pkg, name: newName } : pkg
      )
    );
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
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Nama paket baru"
          value={newPackage}
          onChange={e => setNewPackage(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAddPackage()}
        />
        <Button onClick={handleAddPackage} className="shrink-0">
          <Plus className="mr-1 h-4 w-4" />
          Tambah
        </Button>
      </div>

      <div className="space-y-2">
        {packages.map(pkg => (
          <div key={pkg.id} className="flex items-center space-x-2">
            <Input
              value={pkg.name}
              onChange={e => handlePackageChange(pkg.id, e.target.value)}
            />
            <Button
              size="icon"
              variant="outline"
              className="shrink-0"
              onClick={() => handleSavePackage(pkg.id)}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="shrink-0"
              onClick={() => handleDeletePackage(pkg.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
