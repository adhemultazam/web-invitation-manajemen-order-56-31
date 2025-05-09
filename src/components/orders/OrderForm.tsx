import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderFormData } from "@/types/types";
import { AddonField } from "./AddonField";
import { DatePickerField } from "./DatePickerField";
import { VendorDropdownField } from "./VendorDropdownField";

interface OrderFormProps {
  initialData?: Partial<OrderFormData>;
  onSubmit: (data: OrderFormData) => void;
  onCancel?: () => void;
  vendors: string[];
  workStatuses: string[];
  addons: string[];
  themes: string[];
  packages: string[];
}

export function OrderForm({
  initialData = {},
  onSubmit,
  onCancel,
  vendors,
  workStatuses,
  addons,
  themes,
  packages,
}: OrderFormProps) {
  // Form state
  const [clientName, setClientName] = useState(initialData.clientName || "");
  const [vendor, setVendor] = useState<string | null>(initialData.vendor || null);
  const [eventDate, setEventDate] = useState<Date | undefined>(
    initialData.eventDate ? new Date(initialData.eventDate) : undefined
  );
  const [orderDate, setOrderDate] = useState<Date | undefined>(
    initialData.orderDate ? new Date(initialData.orderDate) : new Date()
  );
  const [notes, setNotes] = useState(initialData.notes || "");
  const [workStatus, setWorkStatus] = useState(initialData.workStatus || "");
  const [selectedPackage, setSelectedPackage] = useState(initialData.package || "");
  const [theme, setTheme] = useState(initialData.theme || "");
  const [selectedAddons, setSelectedAddons] = useState<string[]>(
    Array.isArray(initialData.addons) ? initialData.addons : []
  );
  const [paymentStatus, setPaymentStatus] = useState<"Pending" | "Lunas">(
    initialData.paymentStatus || "Pending"
  );
  const [paymentAmount, setPaymentAmount] = useState(
    initialData.paymentAmount !== undefined ? initialData.paymentAmount : ""
  );

  // Load vendor data for additional information
  const [vendorMap, setVendorMap] = useState<Record<string, { name: string; color: string; landingPageUrl?: string }>>({});

  useEffect(() => {
    const loadVendorData = () => {
      try {
        const savedVendors = localStorage.getItem("vendors");
        if (savedVendors) {
          const parsedVendors = JSON.parse(savedVendors);
          const vendorData: Record<string, { name: string; color: string; landingPageUrl?: string }> = {};
          
          parsedVendors.forEach((v: any) => {
            vendorData[v.id] = {
              name: v.name,
              color: v.color || "#9A84FF",
              landingPageUrl: v.landingPageUrl
            };
          });
          
          setVendorMap(vendorData);
        }
      } catch (error) {
        console.error("Error loading vendor data:", error);
      }
    };

    loadVendorData();
  }, []);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!clientName || !orderDate) {
      alert("Nama client dan tanggal pesanan harus diisi!");
      return;
    }

    // Format payment amount as a number
    let amount = paymentAmount;
    if (typeof amount === 'string') {
      // Remove non-numeric characters except decimal point
      amount = amount.replace(/[^0-9.]/g, '');
    }

    // Format dates to ISO string
    const orderData: OrderFormData = {
      clientName,
      vendor: vendor || "",
      eventDate: eventDate?.toISOString() || "",
      orderDate: orderDate.toISOString(),
      notes,
      workStatus,
      package: selectedPackage,
      theme,
      addons: selectedAddons,
      paymentStatus,
      paymentAmount: amount,
    };

    onSubmit(orderData);
  };

  // Helper for formatting currency input - only used for display
  const formatCurrency = (value: string): string => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Format as currency with thousands separator
    if (numericValue) {
      return new Intl.NumberFormat('id-ID', {
        style: 'decimal',
        minimumFractionDigits: 0,
      }).format(Number(numericValue));
    }
    
    return '';
  };

  // Modified to fix manual input issues
  const handlePaymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Store raw input value to allow editing
    setPaymentAmount(value);
  };

  // Handle focus on payment amount input (select all text)
  const handlePaymentFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientName">Nama Client *</Label>
          <Input
            id="clientName"
            placeholder="Nama client"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vendor">Vendor</Label>
          <VendorDropdownField 
            selectedVendor={vendor}
            onVendorChange={setVendor}
            vendors={vendors}
            vendorData={vendorMap}
          />
          {vendor && vendorMap[vendor]?.landingPageUrl && (
            <div className="text-xs text-blue-600 mt-1">
              <a 
                href={vendorMap[vendor].landingPageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {vendorMap[vendor].landingPageUrl}
              </a>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="orderDate">Tanggal Pesanan *</Label>
          <DatePickerField
            date={orderDate}
            onDateChange={setOrderDate}
            id="orderDate"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventDate">Tanggal Acara</Label>
          <DatePickerField
            date={eventDate}
            onDateChange={setEventDate}
            id="eventDate"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="workStatus">Status Pengerjaan</Label>
          <Select
            value={workStatus}
            onValueChange={setWorkStatus}
          >
            <SelectTrigger id="workStatus">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">-- Pilih status --</SelectItem>
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
            value={paymentStatus}
            onValueChange={(value: "Lunas" | "Pending") => setPaymentStatus(value)}
          >
            <SelectTrigger id="paymentStatus">
              <SelectValue placeholder="Pilih status pembayaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Lunas">Lunas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="package">Paket</Label>
          <Select
            value={selectedPackage}
            onValueChange={setSelectedPackage}
          >
            <SelectTrigger id="package">
              <SelectValue placeholder="Pilih paket" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">-- Pilih paket --</SelectItem>
              {packages.map((pkg) => (
                <SelectItem key={pkg} value={pkg}>
                  {pkg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentAmount">Jumlah Pembayaran</Label>
          <Input
            id="paymentAmount"
            placeholder="0"
            value={paymentAmount}
            onChange={handlePaymentAmountChange}
            onFocus={handlePaymentFocus}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme">Tema</Label>
          <Select
            value={theme}
            onValueChange={setTheme}
          >
            <SelectTrigger id="theme">
              <SelectValue placeholder="Pilih tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">-- Pilih tema --</SelectItem>
              {themes.map((themeOption) => (
                <SelectItem key={themeOption} value={themeOption}>
                  {themeOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Addons</Label>
          <AddonField
            availableAddons={addons}
            selectedAddons={selectedAddons}
            onChange={setSelectedAddons}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Catatan</Label>
          <Input
            id="notes"
            placeholder="Catatan tambahan"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
        )}
        <Button type="submit">
          {initialData && "id" in initialData ? "Update Pesanan" : "Tambah Pesanan"}
        </Button>
      </div>
    </form>
  );
}
