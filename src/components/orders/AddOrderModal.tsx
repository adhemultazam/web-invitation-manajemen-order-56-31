
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Order } from "@/types/types";
import { toast } from "sonner";
import { Check } from "lucide-react";

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrder: (order: Omit<Order, "id">) => void;
  vendors: string[];
  workStatuses: string[];
}

export function AddOrderModal({ isOpen, onClose, onAddOrder, vendors, workStatuses }: AddOrderModalProps) {
  const [formData, setFormData] = useState({
    orderDate: new Date().toISOString().split("T")[0],
    eventDate: "",
    customerName: "",
    clientName: "",
    vendor: vendors[0] || "",
    package: "Basic",
    theme: "Minimalis",
    paymentStatus: "Belum Bayar" as "Lunas" | "Pending" | "Belum Bayar",
    paymentAmount: 0,
    workStatus: workStatuses[0] || "",
    postPermission: false,
    notes: "",
    addons: [] as string[],
    bonuses: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "number") {
      setFormData({
        ...formData,
        [name]: Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const calculateCountdownDays = () => {
    if (!formData.eventDate) return 0;
    
    const today = new Date();
    const eventDate = new Date(formData.eventDate);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const countdownDays = calculateCountdownDays();
    
    const newOrder: Omit<Order, "id"> = {
      ...formData,
      countdownDays
    };
    
    setTimeout(() => {
      onAddOrder(newOrder);
      setIsSubmitting(false);
      resetForm();
      toast.success("Pesanan berhasil ditambahkan", {
        icon: <Check className="h-4 w-4" />
      });
    }, 500);
  };

  const resetForm = () => {
    setFormData({
      orderDate: new Date().toISOString().split("T")[0],
      eventDate: "",
      customerName: "",
      clientName: "",
      vendor: vendors[0] || "",
      package: "Basic",
      theme: "Minimalis",
      paymentStatus: "Belum Bayar",
      paymentAmount: 0,
      workStatus: workStatuses[0] || "",
      postPermission: false,
      notes: "",
      addons: [],
      bonuses: []
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Tambah Pesanan Baru</DialogTitle>
          <DialogDescription>
            Masukkan detil pesanan baru di bawah ini
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderDate">Tanggal Pesan</Label>
              <Input
                id="orderDate"
                name="orderDate"
                type="date"
                value={formData.orderDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eventDate">Tanggal Acara</Label>
              <Input
                id="eventDate"
                name="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nama Pemesan</Label>
              <Input
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientName">Nama Klien</Label>
              <Input
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
                placeholder="Contoh: Budi & Ani"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Select 
                value={formData.vendor}
                onValueChange={(value) => handleSelectChange("vendor", value)}
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
              <Label htmlFor="package">Paket</Label>
              <Select 
                value={formData.package}
                onValueChange={(value) => handleSelectChange("package", value)}
              >
                <SelectTrigger id="package">
                  <SelectValue placeholder="Pilih paket" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <Input
                id="theme"
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                placeholder="Contoh: Floral Pink"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentAmount">Jumlah Pembayaran</Label>
              <Input
                id="paymentAmount"
                name="paymentAmount"
                type="number"
                value={formData.paymentAmount}
                onChange={handleChange}
                min={0}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Status Pembayaran</Label>
              <Select 
                value={formData.paymentStatus}
                onValueChange={(value) => handleSelectChange("paymentStatus", value as "Lunas" | "Pending" | "Belum Bayar")}
              >
                <SelectTrigger id="paymentStatus">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lunas">Lunas</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Belum Bayar">Belum Bayar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workStatus">Status Pengerjaan</Label>
              <Select 
                value={formData.workStatus}
                onValueChange={(value) => handleSelectChange("workStatus", value)}
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Input
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Catatan tambahan tentang pesanan ini"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={resetForm} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-1">
                  <span className="animate-pulse">Menyimpan...</span>
                </span>
              ) : (
                "Simpan Pesanan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
