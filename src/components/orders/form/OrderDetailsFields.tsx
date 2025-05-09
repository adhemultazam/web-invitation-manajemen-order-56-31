
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Addon, Package, Theme, Vendor } from "@/types/types";
import ThemeSelect from "../ThemeSelect";
import { useState, useEffect } from "react";

interface OrderDetailsFieldsProps {
  vendor: string;
  onVendorChange: (value: string) => void;
  selectedPackage: string;
  onPackageChange: (value: string) => void;
  theme: string;
  onThemeChange: (value: string) => void;
  addons: string[];
  onAddonsChange: (addons: string[]) => void;
  paymentStatus: "Lunas" | "Pending";
  onPaymentStatusChange: (value: "Lunas" | "Pending") => void;
  paymentAmount: number | string;
  onPaymentAmountChange: (value: string) => void;
  workStatus: string;
  onWorkStatusChange: (value: string) => void;
  notes?: string;
  onNotesChange?: (value: string) => void;
  packages: Package[];
  themes: Theme[];
  availableAddons: Addon[];
  vendors: Vendor[] | string[];
  workStatuses: string[];
}

export function OrderDetailsFields({
  vendor,
  onVendorChange,
  selectedPackage,
  onPackageChange,
  theme,
  onThemeChange,
  addons,
  onAddonsChange,
  paymentStatus,
  onPaymentStatusChange,
  paymentAmount,
  onPaymentAmountChange,
  workStatus,
  onWorkStatusChange,
  notes = "",
  onNotesChange,
  packages,
  themes,
  availableAddons,
  vendors,
  workStatuses,
}: OrderDetailsFieldsProps) {
  // Handle focus on payment amount input (select all)
  const handlePaymentFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  // Get current package's category for theme filtering
  const getCurrentPackageCategory = (): string | undefined => {
    if (!selectedPackage) return undefined;
    const packageObj = packages.find(pkg => pkg.name === selectedPackage);
    return packageObj?.name;
  };

  const handleAddonToggle = (addonName: string) => {
    const currentAddons = [...addons];
    const addonIndex = currentAddons.indexOf(addonName);
    
    if (addonIndex === -1) {
      // Add the addon
      currentAddons.push(addonName);
    } else {
      // Remove the addon
      currentAddons.splice(addonIndex, 1);
    }
    
    onAddonsChange(currentAddons);
  };

  // Format payment amount with thousands separators
  const formatAmount = (value: string | number) => {
    if (value === '') return '';
    
    // Convert to string and remove non-numeric characters
    const numStr = String(value).replace(/[^0-9.]/g, '');
    if (!numStr) return '';
    
    // Format with thousands separator
    return new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(Number(numStr));
  };

  const handlePaymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onPaymentAmountChange(value);
  };

  // Transform vendor list to array of objects if needed
  const [vendorList, setVendorList] = useState<Vendor[]>([]);
  
  useEffect(() => {
    // If vendors is an array of strings, try to load from localStorage
    if (vendors.length > 0 && typeof vendors[0] === 'string') {
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
    } else if (Array.isArray(vendors) && typeof vendors[0] !== 'string') {
      // If already vendor objects, use them directly
      setVendorList(vendors as Vendor[]);
    }
  }, [vendors]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Detail Pesanan</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vendor">Vendor</Label>
          <Select 
            value={vendor} 
            onValueChange={onVendorChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih vendor" />
            </SelectTrigger>
            <SelectContent>
              {vendorList.length > 0 ? (
                vendorList.map((vendorItem) => (
                  <SelectItem key={typeof vendorItem === 'string' ? vendorItem : vendorItem.id} 
                   value={typeof vendorItem === 'string' ? vendorItem : vendorItem.id}>
                    {typeof vendorItem === 'string' ? vendorItem : vendorItem.name}
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
            onValueChange={onPackageChange}
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
          <ThemeSelect
            value={theme}
            themes={themes}
            onChange={onThemeChange}
            packageCategory={getCurrentPackageCategory()}
          />
        </div>
        
        {/* Addons Section */}
        <div className="space-y-2">
          <Label>Addons</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {availableAddons.map((addon) => (
              <div key={addon.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`addon-${addon.id}`} 
                  checked={addons.includes(addon.name)}
                  onCheckedChange={() => handleAddonToggle(addon.name)}
                />
                <Label 
                  htmlFor={`addon-${addon.id}`} 
                  className="text-sm font-normal"
                  style={{ color: addon.color }}
                >
                  {addon.name}
                </Label>
              </div>
            ))}
            {availableAddons.length === 0 && (
              <div className="col-span-2 text-sm text-muted-foreground">
                Tidak ada addon tersedia
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Status Pembayaran</Label>
          <RadioGroup
            value={paymentStatus}
            onValueChange={(value: "Lunas" | "Pending") => onPaymentStatusChange(value)}
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
            value={typeof paymentAmount === 'number' ? 
              formatAmount(paymentAmount) : 
              paymentAmount}
            onChange={handlePaymentAmountChange}
            onFocus={handlePaymentFocus}
            placeholder="0"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="workStatus">Status Pengerjaan</Label>
          <Select 
            value={workStatus} 
            onValueChange={onWorkStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              {workStatuses.length > 0 ? (
                workStatuses.map((status, index) => (
                  <SelectItem key={typeof status === 'string' ? status : status.id} 
                   value={typeof status === 'string' ? status : status.name}>
                    {typeof status === 'string' ? status : status.name}
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
        
        {onNotesChange && (
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Catatan tambahan"
              rows={3}
            />
          </div>
        )}
      </div>
    </div>
  );
}
