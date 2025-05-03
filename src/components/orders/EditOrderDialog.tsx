
import React, { useState, useEffect } from "react";
import { Order, Theme, Addon } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface EditOrderDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<Order>) => void;
  vendors: string[];
  workStatuses: string[];
  themes: Theme[];
  addons: Addon[];
}

export function EditOrderDialog({
  order,
  isOpen,
  onClose,
  onSave,
  vendors,
  workStatuses,
  themes,
  addons,
}: EditOrderDialogProps) {
  const [formData, setFormData] = useState<Partial<Order>>({});
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([]);
  const [availableAddons, setAvailableAddons] = useState<Addon[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  useEffect(() => {
    if (order) {
      setFormData({
        customerName: order.customerName,
        clientName: order.clientName,
        vendor: order.vendor,
        workStatus: order.workStatus,
        theme: order.theme,
        paymentStatus: order.paymentStatus,
        paymentAmount: order.paymentAmount,
      });
      setSelectedAddons(order.addons || []);
    }
  }, [order]);

  useEffect(() => {
    // Load themes from localStorage
    try {
      const storedThemes = localStorage.getItem("themes");
      if (storedThemes) {
        setAvailableThemes(JSON.parse(storedThemes));
      } else {
        setAvailableThemes(themes);
      }
    } catch (e) {
      console.error("Error loading themes:", e);
      setAvailableThemes(themes);
    }

    // Load addons from localStorage
    try {
      const storedAddons = localStorage.getItem("addons");
      if (storedAddons) {
        setAvailableAddons(JSON.parse(storedAddons));
      } else {
        setAvailableAddons(addons);
      }
    } catch (e) {
      console.error("Error loading addons:", e);
      setAvailableAddons(addons);
    }
  }, [themes, addons]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (order && order.id) {
      // Update addons in form data
      const updatedData = {
        ...formData,
        addons: selectedAddons
      };
      
      onSave(order.id, updatedData);
      toast.success("Order berhasil diperbarui");
      onClose();
    }
  };

  const toggleAddon = (addonName: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonName)
        ? prev.filter((a) => a !== addonName)
        : [...prev, addonName]
    );
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pesanan</DialogTitle>
          <DialogDescription>
            Perbarui detail pesanan untuk {order.clientName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nama Pemesan</Label>
              <Input
                id="customerName"
                value={formData.customerName || ""}
                onChange={(e) => handleChange("customerName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientName">Nama Klien</Label>
              <Input
                id="clientName"
                value={formData.clientName || ""}
                onChange={(e) => handleChange("clientName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Select
                value={formData.vendor || ""}
                onValueChange={(value) => handleChange("vendor", value)}
              >
                <SelectTrigger id="vendor">
                  <SelectValue placeholder="Pilih vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor} value={vendor}>
                      {vendor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <Select
                value={formData.theme || ""}
                onValueChange={(value) => handleChange("theme", value)}
              >
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Pilih tema" />
                </SelectTrigger>
                <SelectContent>
                  {availableThemes.map((theme) => (
                    <SelectItem key={theme.id} value={theme.name}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workStatus">Status Pengerjaan</Label>
              <Select
                value={formData.workStatus || ""}
                onValueChange={(value) => handleChange("workStatus", value)}
              >
                <SelectTrigger id="workStatus">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {workStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Status Pembayaran</Label>
              <Select
                value={formData.paymentStatus || ""}
                onValueChange={(value) => handleChange("paymentStatus", value)}
              >
                <SelectTrigger id="paymentStatus">
                  <SelectValue placeholder="Pilih status pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lunas">Lunas</SelectItem>
                  <SelectItem value="Pending">Belum Lunas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentAmount">Jumlah Pembayaran</Label>
              <Input
                id="paymentAmount"
                type="number"
                value={formData.paymentAmount || 0}
                onChange={(e) => handleChange("paymentAmount", parseInt(e.target.value, 10))}
              />
            </div>

            <div className="space-y-2">
              <Label>Addons</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableAddons.map((addon) => (
                  <Button
                    key={addon.id}
                    type="button"
                    variant={selectedAddons.includes(addon.name) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAddon(addon.name)}
                    className="flex items-center gap-1"
                    style={{
                      backgroundColor: selectedAddons.includes(addon.name) ? addon.color : "",
                      color: selectedAddons.includes(addon.name) ? "#fff" : "",
                      borderColor: addon.color
                    }}
                  >
                    {addon.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan Perubahan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
