
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Vendor } from "@/types/types";
import { useState, useEffect } from "react";

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

interface VendorFormProps {
  currentVendor: Vendor | null;
  onSubmit: (vendor: Omit<Vendor, "id">) => void;
  onCancel: () => void;
}

export function VendorForm({ currentVendor, onSubmit, onCancel }: VendorFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    landingPageUrl: "",
    color: "#6366f1"
  });

  useEffect(() => {
    // Initialize form with current vendor data if editing
    if (currentVendor) {
      setFormData({
        name: currentVendor.name,
        code: currentVendor.code || "",
        landingPageUrl: currentVendor.landingPageUrl || "",
        color: currentVendor.color || "#6366f1"
      });
    } else {
      // Reset form for new vendor
      setFormData({
        name: "",
        code: "",
        landingPageUrl: "",
        color: "#6366f1"
      });
    }
  }, [currentVendor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
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
            <Label htmlFor="landingPageUrl">URL Landing Page</Label>
            <Input
              id="landingPageUrl"
              name="landingPageUrl"
              type="url"
              placeholder="https://example.com"
              value={formData.landingPageUrl}
              onChange={handleChange}
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit">Simpan</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
