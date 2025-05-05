
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Order, Addon, Package, Theme } from "@/types/types";

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrder: (orderData: Omit<Order, "id">) => void;
  vendors: string[];
  workStatuses: string[];
  addons: Addon[];
}

export function AddOrderModal({ isOpen, onClose, onAddOrder, vendors, workStatuses, addons: defaultAddons }: AddOrderModalProps) {
  // Load packages and themes from local storage
  const [packages, setPackages] = useState<Package[]>([]);
  const [addons, setAddons] = useState<Addon[]>(defaultAddons);
  const [themes, setThemes] = useState<Theme[]>([]);
  
  const [formData, setFormData] = useState({
    customerName: "",
    clientName: "",
    clientUrl: "",
    orderDate: new Date(),
    eventDate: new Date(),
    countdownDays: 30,
    vendor: vendors[0] || "",
    package: "",
    theme: "",
    addons: [] as string[],
    bonuses: [] as string[],
    paymentStatus: "Pending" as "Lunas" | "Pending",
    paymentAmount: 0,
    workStatus: workStatuses[0] || "",
    postPermission: false,
    notes: "",
  });

  // Load data from localStorage when component mounts
  useEffect(() => {
    const loadPackages = () => {
      try {
        const savedPackages = localStorage.getItem("packages");
        if (savedPackages) {
          const parsedPackages = JSON.parse(savedPackages);
          if (Array.isArray(parsedPackages) && parsedPackages.length > 0) {
            setPackages(parsedPackages);
            // Set default package if available
            if (parsedPackages.length > 0 && !formData.package) {
              setFormData(prev => ({...prev, package: parsedPackages[0].name}));
            }
          }
        }
      } catch (error) {
        console.error("Error loading packages:", error);
      }
    };
    
    const loadAddons = () => {
      try {
        const savedAddons = localStorage.getItem("addons");
        if (savedAddons) {
          const parsedAddons = JSON.parse(savedAddons);
          if (Array.isArray(parsedAddons) && parsedAddons.length > 0) {
            setAddons(parsedAddons);
          }
        }
      } catch (error) {
        console.error("Error loading addons:", error);
      }
    };
    
    const loadThemes = () => {
      try {
        const savedThemes = localStorage.getItem("themes");
        if (savedThemes) {
          const parsedThemes = JSON.parse(savedThemes);
          if (Array.isArray(parsedThemes) && parsedThemes.length > 0) {
            setThemes(parsedThemes);
            // Set default theme if available
            if (parsedThemes.length > 0 && !formData.theme) {
              setFormData(prev => ({...prev, theme: parsedThemes[0].name}));
            }
          }
        } else {
          // Load themes from ThemeSettings (initial themes) if not found in localStorage
          const initialThemes = [
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
          setThemes(initialThemes);
          if (initialThemes.length > 0 && !formData.theme) {
            setFormData(prev => ({...prev, theme: initialThemes[0].name}));
          }
        }
      } catch (error) {
        console.error("Error loading themes:", error);
      }
    };
    
    loadPackages();
    loadAddons();
    loadThemes();
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value });
    
    // If package changes, update the payment amount
    if (name === "package") {
      const selectedPackage = packages.find(pkg => pkg.name === value);
      if (selectedPackage) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          paymentAmount: selectedPackage.price
        }));
      }
    }
  };

  const handleCheckboxChange = (checked: boolean, name: string) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleAddonToggle = (addonName: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        addons: [...formData.addons, addonName]
      });
    } else {
      setFormData({
        ...formData,
        addons: formData.addons.filter(name => name !== addonName)
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate countdown days based on eventDate
    const today = new Date();
    const eventDate = new Date(formData.eventDate);
    const countdownDays = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    onAddOrder({
      ...formData,
      orderDate: formData.orderDate.toISOString().split('T')[0],
      eventDate: formData.eventDate.toISOString().split('T')[0],
      countdownDays,
    });
    
    // Reset form
    setFormData({
      customerName: "",
      clientName: "",
      clientUrl: "",
      orderDate: new Date(),
      eventDate: new Date(),
      countdownDays: 30,
      vendor: vendors[0] || "",
      package: packages[0]?.name || "",
      theme: themes[0]?.name || "",
      addons: [],
      bonuses: [],
      paymentStatus: "Pending",
      paymentAmount: 0,
      workStatus: workStatuses[0] || "",
      postPermission: false,
      notes: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Pesanan Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nama Pemesan</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Nama pemesan"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientName">Client</Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder="Contoh: Rizki & Putri"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orderDate">Tanggal Pemesanan</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.orderDate ? format(formData.orderDate, "PPP") : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.orderDate}
                      onSelect={(date) => date && setFormData({...formData, orderDate: date})}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventDate">Tanggal Acara</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.eventDate ? format(formData.eventDate, "PPP") : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.eventDate}
                      onSelect={(date) => date && setFormData({...formData, eventDate: date})}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Select 
                  value={formData.vendor} 
                  onValueChange={(value) => handleSelectChange(value, "vendor")}
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
                <Label htmlFor="package">Paket & Tema</Label>
                <div className="space-y-2">
                  <Select 
                    value={formData.package} 
                    onValueChange={(value) => handleSelectChange(value, "package")}
                  >
                    <SelectTrigger id="package">
                      <SelectValue placeholder="Pilih paket" />
                    </SelectTrigger>
                    <SelectContent>
                      {packages.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.name}>
                          {pkg.name} - {new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR", minimumFractionDigits: 0}).format(pkg.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select 
                    value={formData.theme}
                    onValueChange={(value) => handleSelectChange(value, "theme")}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Pilih tema" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.id} value={theme.name}>
                          {theme.name} ({theme.category})
                        </SelectItem>
                      ))}
                      {themes.length === 0 && (
                        <SelectItem value="default" disabled>
                          Tidak ada tema tersedia
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Addons</Label>
              <div className="grid grid-cols-2 gap-2">
                {addons.map((addon) => (
                  <div key={addon.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`addon-${addon.id}`}
                      checked={formData.addons.includes(addon.name)}
                      onCheckedChange={(checked) => 
                        handleAddonToggle(addon.name, checked === true)
                      }
                    />
                    <Label 
                      htmlFor={`addon-${addon.id}`}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: addon.color }}></div>
                      <span>{addon.name}</span>
                    </Label>
                  </div>
                ))}
                {addons.length === 0 && (
                  <p className="text-sm text-muted-foreground col-span-2">
                    Tidak ada addon yang tersedia. Tambahkan addon di pengaturan.
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Status Pembayaran</Label>
                <RadioGroup
                  value={formData.paymentStatus}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentStatus: value as "Lunas" | "Pending" })
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Lunas" id="payment-lunas" />
                    <Label htmlFor="payment-lunas">Lunas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Pending" id="payment-pending" />
                    <Label htmlFor="payment-pending">Pending</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Jumlah Pembayaran (Rp)</Label>
                <Input
                  id="paymentAmount"
                  name="paymentAmount"
                  type="number"
                  value={formData.paymentAmount}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workStatus">Status Pengerjaan</Label>
                <Select 
                  value={formData.workStatus} 
                  onValueChange={(value) => handleSelectChange(value, "workStatus")}
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
              <Label htmlFor="clientUrl">URL Undangan</Label>
              <Input
                id="clientUrl"
                name="clientUrl"
                value={formData.clientUrl}
                onChange={handleInputChange}
                placeholder="https://undangandigital.com/nama-mempelai"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="postPermission"
                  checked={formData.postPermission}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(!!checked, "postPermission")
                  }
                />
                <Label htmlFor="postPermission">Izin posting sebagai portfolio</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Catatan tambahan"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
