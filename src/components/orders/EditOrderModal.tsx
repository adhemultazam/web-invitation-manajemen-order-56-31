
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
import { format, parseISO, differenceInDays } from "date-fns";
import { Order, Addon, Package, Theme, Vendor } from "@/types/types";
import ThemeSelect from "./ThemeSelect";

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onEditOrder: (orderData: Order) => void;
  vendors: string[];
  workStatuses: string[];
  addons: Addon[];
  themes: Theme[];
  packages: Package[];
}

export function EditOrderModal({ 
  isOpen, 
  onClose, 
  order, 
  onEditOrder, 
  vendors, 
  workStatuses, 
  addons: defaultAddons,
  themes: providedThemes,
  packages: providedPackages
}: EditOrderModalProps) {
  // Load packages and themes from props
  const [packages, setPackages] = useState<Package[]>(providedPackages || []);
  const [addons, setAddons] = useState<Addon[]>(defaultAddons);
  const [themes, setThemes] = useState<Theme[]>(providedThemes || []);
  const [vendorList, setVendorList] = useState<Vendor[]>([]);
  const [themeOpen, setThemeOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(order.package || "");
  
  // Initialize form data with order values
  const [formData, setFormData] = useState<Order>({
    ...order,
    orderDate: typeof order.orderDate === 'string' ? order.orderDate : format(new Date(order.orderDate), 'yyyy-MM-dd'),
    eventDate: typeof order.eventDate === 'string' ? order.eventDate : format(new Date(order.eventDate), 'yyyy-MM-dd'),
  });

  // Load data from localStorage when component mounts
  useEffect(() => {
    const loadVendors = () => {
      try {
        const savedVendors = localStorage.getItem("vendors");
        if (savedVendors) {
          const parsedVendors = JSON.parse(savedVendors);
          if (Array.isArray(parsedVendors) && parsedVendors.length > 0) {
            setVendorList(parsedVendors);
          }
        }
      } catch (error) {
        console.error("Error loading vendors:", error);
      }
    };
    
    // Only load packages and themes from localStorage if not provided via props
    if (!providedPackages || providedPackages.length === 0) {
      try {
        const savedPackages = localStorage.getItem("packages");
        if (savedPackages) {
          const parsedPackages = JSON.parse(savedPackages);
          if (Array.isArray(parsedPackages) && parsedPackages.length > 0) {
            setPackages(parsedPackages);
            // Set selected package
            setSelectedPackage(order.package || parsedPackages[0].name);
          }
        }
      } catch (error) {
        console.error("Error loading packages:", error);
      }
    } else {
      // Set selected package from order
      setSelectedPackage(order.package || "");
    }
    
    if (!defaultAddons || defaultAddons.length === 0) {
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
    }
    
    if (!providedThemes || providedThemes.length === 0) {
      try {
        const savedThemes = localStorage.getItem("themes");
        if (savedThemes) {
          const parsedThemes = JSON.parse(savedThemes);
          if (Array.isArray(parsedThemes) && parsedThemes.length > 0) {
            setThemes(parsedThemes);
          }
        }
      } catch (error) {
        console.error("Error loading themes:", error);
      }
    }
    
    loadVendors();
  }, [order, providedPackages, providedThemes, defaultAddons]);

  const handleInputChange = (field: keyof Order, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Calculate countdown days based on current date and event date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = typeof formData.eventDate === 'string' 
      ? new Date(formData.eventDate) 
      : formData.eventDate as Date;
    const countdown = differenceInDays(eventDate, today);
    
    // Ensure dates are properly formatted as strings
    const updatedOrder = {
      ...formData,
      orderDate: typeof formData.orderDate === 'object' 
        ? format(formData.orderDate as Date, 'yyyy-MM-dd')
        : formData.orderDate,
      eventDate: typeof formData.eventDate === 'object'
        ? format(formData.eventDate as Date, 'yyyy-MM-dd')
        : formData.eventDate,
      countdownDays: countdown
    };
    
    onEditOrder(updatedOrder);
  };

  // Get filtered themes based on selected package
  const getFilteredThemes = (): Theme[] => {
    if (!selectedPackage) return themes;
    
    const packageObj = packages.find(pkg => pkg.name === selectedPackage);
    if (!packageObj || !packageObj.themes || packageObj.themes.length === 0) {
      return themes;
    }
    
    return themes.filter(theme => packageObj.themes?.includes(theme.name));
  };

  const handlePackageChange = (packageName: string) => {
    setSelectedPackage(packageName);
    handleInputChange('package', packageName);
    
    // Reset theme if current theme is not available for new package
    const filteredThemes = getFilteredThemes();
    const themeIsAvailable = filteredThemes.some(theme => theme.name === formData.theme);
    
    if (!themeIsAvailable && filteredThemes.length > 0) {
      handleInputChange('theme', filteredThemes[0].name);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pesanan</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Customer Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Informasi Pelanggan</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Nama Pemesan</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nama Mempelai</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientUrl">URL Undangan</Label>
                  <Input
                    id="clientUrl"
                    value={formData.clientUrl || ''}
                    onChange={(e) => handleInputChange('clientUrl', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Dates */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Tanggal</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tanggal Pesanan</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.orderDate
                          ? (typeof formData.orderDate === 'string' 
                            ? format(parseISO(formData.orderDate), "PPP")
                            : format(formData.orderDate as Date, "PPP"))
                          : "Pilih tanggal"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={typeof formData.orderDate === 'string' 
                          ? parseISO(formData.orderDate) 
                          : formData.orderDate as Date}
                        onSelect={(date) => date && handleInputChange('orderDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Acara</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.eventDate
                          ? (typeof formData.eventDate === 'string' 
                            ? format(parseISO(formData.eventDate), "PPP")
                            : format(formData.eventDate as Date, "PPP"))
                          : "Pilih tanggal"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={typeof formData.eventDate === 'string' 
                          ? parseISO(formData.eventDate) 
                          : formData.eventDate as Date}
                        onSelect={(date) => date && handleInputChange('eventDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Detail Pesanan</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Select 
                    value={formData.vendor} 
                    onValueChange={(value) => handleInputChange('vendor', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendorList.length > 0 ? (
                        vendorList.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="default">Vendor Default</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="package">Paket</Label>
                  <Select 
                    value={selectedPackage} 
                    onValueChange={(value) => handlePackageChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih paket" />
                    </SelectTrigger>
                    <SelectContent>
                      {packages.length > 0 ? (
                        packages.map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.name}>
                            {pkg.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="standard">Paket Standard</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select 
                    value={formData.theme} 
                    onValueChange={(value) => handleInputChange('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tema" />
                    </SelectTrigger>
                    <SelectContent>
                      {getFilteredThemes().length > 0 ? (
                        getFilteredThemes().map((theme) => (
                          <SelectItem key={theme.id} value={theme.name}>
                            {theme.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="elegant">Tema Elegant</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Status Pembayaran</Label>
                  <RadioGroup
                    value={formData.paymentStatus}
                    onValueChange={(value: "Lunas" | "Pending") => handleInputChange('paymentStatus', value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Lunas" id="lunas" />
                      <Label htmlFor="lunas">Lunas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Pending" id="pending" />
                      <Label htmlFor="pending">Pending</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentAmount">Jumlah Pembayaran</Label>
                  <Input
                    id="paymentAmount"
                    value={formData.paymentAmount}
                    onChange={(e) => handleInputChange('paymentAmount', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workStatus">Status Pengerjaan</Label>
                  <Select 
                    value={formData.workStatus} 
                    onValueChange={(value) => handleInputChange('workStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      {workStatuses.length > 0 ? (
                        workStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="Belum">Belum</SelectItem>
                          <SelectItem value="Proses">Proses</SelectItem>
                          <SelectItem value="Selesai">Selesai</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="postPermission"
                    checked={formData.postPermission}
                    onCheckedChange={(checked) => handleInputChange('postPermission', checked)}
                  />
                  <Label htmlFor="postPermission" className="text-sm">
                    Izin posting portfolio
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit}>Simpan Perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
