
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
import { useState, useEffect } from "react";
import { Order, Theme } from "@/types/types";
import { toast } from "sonner";
import { Check } from "lucide-react";

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrder: (order: Omit<Order, "id">) => void;
  vendors: string[];
  workStatuses: string[];
}

// Mock themes data
const mockThemes = [
  {
    id: "1",
    name: "Elegant Gold",
    thumbnail: "https://placehold.co/200x280/e9d985/ffffff?text=Elegant+Gold",
    category: "Premium"
  },
  {
    id: "2",
    name: "Floral Pink",
    thumbnail: "https://placehold.co/200x280/ffb6c1/ffffff?text=Floral+Pink",
    category: "Basic"
  },
  {
    id: "3",
    name: "Rustic Wood",
    thumbnail: "https://placehold.co/200x280/8b4513/ffffff?text=Rustic+Wood",
    category: "Premium"
  },
  {
    id: "4",
    name: "Minimalist",
    thumbnail: "https://placehold.co/200x280/f5f5f5/333333?text=Minimalist",
    category: "Basic"
  }
];

export function AddOrderModal({ isOpen, onClose, onAddOrder, vendors, workStatuses }: AddOrderModalProps) {
  const [formData, setFormData] = useState({
    orderDate: new Date().toISOString().split("T")[0],
    eventDate: "",
    customerName: "",
    clientName: "",
    clientUrl: "",
    vendor: vendors[0] || "",
    package: "Basic",
    theme: mockThemes[0]?.name || "Minimalis",
    paymentStatus: "Pending" as "Lunas" | "Pending",
    paymentAmount: 0,
    workStatus: workStatuses[0] || "",
    postPermission: false,
    notes: "",
    addons: [] as string[],
    bonuses: [] as string[]
  });

  const [themes, setThemes] = useState<Theme[]>(mockThemes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFeature, setNewFeature] = useState("");

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

  const handleAddFeature = (type: 'addons' | 'bonuses') => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        [type]: [...prev[type], newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number, type: 'addons' | 'bonuses') => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
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
      clientUrl: "",
      vendor: vendors[0] || "",
      package: "Basic",
      theme: mockThemes[0]?.name || "",
      paymentStatus: "Pending",
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
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Pesanan Baru</DialogTitle>
          <DialogDescription>
            Masukkan detil pesanan baru di bawah ini
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <Select 
                value={formData.theme}
                onValueChange={(value) => handleSelectChange("theme", value)}
              >
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Pilih tema" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme.id} value={theme.name}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Status Pembayaran</Label>
              <Select 
                value={formData.paymentStatus}
                onValueChange={(value) => handleSelectChange("paymentStatus", value as "Lunas" | "Pending")}
              >
                <SelectTrigger id="paymentStatus">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lunas">Lunas</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
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
            <Label>Addons</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Tambahkan addon"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddFeature('addons')}
              >
                Tambah
              </Button>
            </div>
            <ul className="space-y-2 mt-2">
              {formData.addons.map((addon, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-muted p-2 rounded-md"
                >
                  <span>{addon}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFeature(index, 'addons')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </Button>
                </li>
              ))}
              {formData.addons.length === 0 && (
                <li className="text-muted-foreground text-sm">
                  Belum ada addons yang ditambahkan
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-2">
            <Label>Bonus</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Tambahkan bonus"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddFeature('bonuses')}
              >
                Tambah
              </Button>
            </div>
            <ul className="space-y-2 mt-2">
              {formData.bonuses.map((bonus, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-muted p-2 rounded-md"
                >
                  <span>{bonus}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFeature(index, 'bonuses')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </Button>
                </li>
              ))}
              {formData.bonuses.length === 0 && (
                <li className="text-muted-foreground text-sm">
                  Belum ada bonus yang ditambahkan
                </li>
              )}
            </ul>
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
          
          <div className="space-y-2">
            <Label htmlFor="clientUrl">URL Undangan</Label>
            <Input
              id="clientUrl"
              name="clientUrl"
              value={formData.clientUrl}
              onChange={handleChange}
              placeholder="Contoh: https://nikahdigital.com/budi-ani"
            />
            <p className="text-xs text-muted-foreground">
              URL ini akan digunakan ketika nama klien atau ikon mata diklik
            </p>
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
