
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Order, Theme, Addon, Vendor, WorkStatus, Package } from "@/types/types";
import ThemeSelect from "./ThemeSelect";

interface EditOrderDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<Order>) => void;
  vendors: Vendor[];
  workStatuses: WorkStatus[];
  themes: Theme[];
  addons: Addon[];
  packages: Package[];
}

interface FormDataState {
  customerName: string;
  clientName: string;
  clientUrl?: string;
  orderDate: string | Date;
  eventDate: string | Date;
  vendor: string;
  package: string;
  theme: string;
  paymentStatus: "Lunas" | "Pending";
  paymentAmount: number | string;
  workStatus: string;
  postPermission: boolean;
  notes?: string;
  addons: string[];
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
  packages = []
}: EditOrderDialogProps) {
  const [formData, setFormData] = useState<FormDataState>({
    customerName: "",
    clientName: "",
    clientUrl: "",
    orderDate: "",
    eventDate: "",
    vendor: "",
    package: "",
    theme: "",
    paymentStatus: "Pending",
    paymentAmount: 0,
    workStatus: "",
    postPermission: false,
    notes: "",
    addons: [],
  });
  
  // Get the current package's category
  const [currentPackageCategory, setCurrentPackageCategory] = useState<string | undefined>(undefined);
  
  // Initialize form data when order changes or dialog opens
  useEffect(() => {
    if (order && isOpen) {
      setFormData({
        customerName: order.customerName || "",
        clientName: order.clientName || "",
        clientUrl: order.clientUrl || "",
        orderDate: order.orderDate ? order.orderDate : "",
        eventDate: order.eventDate ? order.eventDate : "",
        vendor: order.vendor || "",
        package: order.package || "",
        theme: order.theme || "",
        paymentStatus: order.paymentStatus || "Pending",
        paymentAmount: order.paymentAmount || 0,
        workStatus: order.workStatus || "",
        postPermission: order.postPermission || false,
        notes: order.notes || "",
        addons: order.addons || [],
      });
      
      // Update the package category based on the selected package
      updatePackageCategory(order.package);
    }
  }, [order, isOpen, packages]);

  // Function to update the package category
  const updatePackageCategory = (packageName: string) => {
    const selectedPackage = packages.find(pkg => pkg.name === packageName);
    setCurrentPackageCategory(selectedPackage?.name);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
    
    // If package changes, update the payment amount and category
    if (name === "package") {
      const selectedPackage = packages.find(pkg => pkg.name === value);
      if (selectedPackage) {
        setFormData(prevState => ({ 
          ...prevState, 
          [name]: value,
          paymentAmount: selectedPackage.price || 0
        }));
        
        // Update the package category
        updatePackageCategory(value);
        
        // If theme selection needs to be updated based on new package
        const compatibleThemes = themes.filter(theme => theme.category === selectedPackage.name);
        if (compatibleThemes.length > 0 && 
            (!prevState.theme || !compatibleThemes.some(t => t.name === prevState.theme))) {
          setFormData(prevState => ({ ...prevState, theme: compatibleThemes[0].name }));
        }
      }
    }
  };

  const handleCheckboxChange = (checked: boolean, name: string) => {
    setFormData(prevState => ({ ...prevState, [name]: checked }));
  };

  const handleAddonToggle = (addonName: string, checked: boolean) => {
    setFormData(prevState => {
      const currentAddons = prevState.addons || [];
      if (checked) {
        return { ...prevState, addons: [...currentAddons, addonName] };
      } else {
        return { ...prevState, addons: currentAddons.filter(name => name !== addonName) };
      }
    });
  };
  
  // Helper function to safely handle date changes without type errors
  const handleDateChange = (date: Date | undefined, fieldName: 'orderDate' | 'eventDate') => {
    if (date) {
      // Convert Date to string when storing in state to avoid type issues
      const dateStr = format(date, 'yyyy-MM-dd');
      setFormData(prevState => ({ ...prevState, [fieldName]: dateStr }));
    }
  };
  
  const getVendorName = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor ? vendor.name : vendorId;
  };

  const getVendorColor = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor ? vendor.color : '#6E6E6E';
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    
    const updatedData: Partial<Order> = {
      ...formData,
      orderDate: typeof formData.orderDate === 'object' 
        ? format(formData.orderDate as Date, 'yyyy-MM-dd')
        : typeof formData.orderDate === 'string'
          ? formData.orderDate
          : format(new Date(), 'yyyy-MM-dd'),
      eventDate: typeof formData.eventDate === 'object'
        ? format(formData.eventDate as Date, 'yyyy-MM-dd')
        : typeof formData.eventDate === 'string'
          ? formData.eventDate
          : format(new Date(), 'yyyy-MM-dd'),
    };

    onSave(order.id, updatedData);
    onClose();
  };

  if (!order) return null;

  // Function to safely format currency values
  const formatCurrency = (value: number | string) => {
    // Convert to number if it's a string
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    // Check if it's a valid number
    if (isNaN(numericValue)) return '';
    
    return new Intl.NumberFormat("id-ID", {
      style: "currency", 
      currency: "IDR", 
      minimumFractionDigits: 0
    }).format(numericValue);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pesanan</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
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
                      {typeof formData.orderDate === 'object' 
                        ? format(formData.orderDate as Date, "PPP") 
                        : typeof formData.orderDate === 'string' && formData.orderDate
                          ? format(parseISO(formData.orderDate), "PPP")
                          : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={typeof formData.orderDate === 'object' 
                        ? formData.orderDate as Date
                        : typeof formData.orderDate === 'string' && formData.orderDate
                          ? parseISO(formData.orderDate)
                          : undefined}
                      onSelect={(date) => handleDateChange(date, 'orderDate')}
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
                      {typeof formData.eventDate === 'object'
                        ? format(formData.eventDate as Date, "PPP") 
                        : typeof formData.eventDate === 'string' && formData.eventDate
                          ? format(parseISO(formData.eventDate), "PPP")
                          : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={typeof formData.eventDate === 'object' 
                        ? formData.eventDate as Date
                        : typeof formData.eventDate === 'string' && formData.eventDate
                          ? parseISO(formData.eventDate)
                          : undefined}
                      onSelect={(date) => handleDateChange(date, 'eventDate')}
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
                    <SelectValue>
                      <div className="flex items-center">
                        {formData.vendor && (
                          <div
                            className="w-2 h-2 mr-2 rounded-full"
                            style={{ backgroundColor: getVendorColor(formData.vendor) }}
                          />
                        )}
                        {formData.vendor ? getVendorName(formData.vendor) : "Pilih vendor"}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        <div className="flex items-center">
                          <div
                            className="w-2 h-2 mr-2 rounded-full"
                            style={{ backgroundColor: vendor.color }}
                          />
                          {vendor.name}
                        </div>
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
                          {pkg.name} - {typeof pkg.price === 'number' ? new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR", minimumFractionDigits: 0}).format(pkg.price) : 'Price not available'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <ThemeSelect
                    value={formData.theme || ""}
                    themes={themes}
                    isDisabled={false}
                    onChange={(value) => handleSelectChange(value, "theme")}
                    packageCategory={currentPackageCategory}
                  />
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
                      checked={formData.addons?.includes(addon.name)}
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
                    setFormData(prevState => ({ ...prevState, paymentStatus: value as "Lunas" | "Pending" }))
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
                      <SelectItem key={status.id} value={status.name}>
                        <div className="flex items-center">
                          <div
                            className="w-2 h-2 mr-2 rounded-full"
                            style={{ backgroundColor: status.color }}
                          />
                          {status.name}
                        </div>
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
