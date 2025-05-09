
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { OrderFormData } from "@/types/types";
import { DateSelectionField } from "./form/DateSelectionField";
import { CustomerInfoFields } from "./form/CustomerInfoFields";
import { OrderDetailsFields } from "./form/OrderDetailsFields";
import { useOrderForm } from "./form/useOrderForm";

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
  // Form state using our custom hook
  const {
    clientName, setClientName,
    orderDate, setOrderDate,
    eventDate, setEventDate,
    vendor, setVendor,
    selectedPackage,
    theme, setTheme,
    addons: selectedAddons, setAddons: setSelectedAddons,
    paymentStatus, setPaymentStatus,
    paymentAmount,
    workStatus, setWorkStatus,
    notes, setNotes,
    handlePaymentAmountChange,
    handlePackageChange,
    getFormData
  } = useOrderForm(initialData);

  // Format addons for the component
  const formattedAddons = addons.map(addon => ({
    id: addon,
    name: addon,
    color: "#9A84FF" // Default color
  }));

  // Format packages for the component
  const formattedPackages = packages.map(pkg => ({
    id: pkg,
    name: pkg,
    price: 0
  }));

  // Format themes for the component
  const formattedThemes = themes.map(theme => ({
    id: theme,
    name: theme,
    thumbnail: "",
    category: ""
  }));

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

    // Get the form data and submit
    const formData = getFormData();
    onSubmit(formData as OrderFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column - customer info */}
        <div>
          <div className="space-y-2 mb-4">
            <CustomerInfoFields
              customerName={""}
              onCustomerNameChange={() => {}}
              clientName={clientName}
              onClientNameChange={setClientName}
              orderDate={orderDate}
              onOrderDateChange={setOrderDate}
              eventDate={eventDate}
              onEventDateChange={setEventDate}
              showClientUrl={false}
            />
          </div>
          
          <div className="space-y-2">
            <OrderDetailsFields
              vendor={vendor}
              onVendorChange={setVendor}
              selectedPackage={selectedPackage}
              onPackageChange={(pkg) => handlePackageChange(pkg, formattedPackages)}
              theme={theme}
              onThemeChange={setTheme}
              addons={selectedAddons}
              onAddonsChange={setSelectedAddons}
              paymentStatus={paymentStatus}
              onPaymentStatusChange={setPaymentStatus}
              paymentAmount={paymentAmount}
              onPaymentAmountChange={handlePaymentAmountChange}
              workStatus={workStatus}
              onWorkStatusChange={setWorkStatus}
              notes={notes}
              onNotesChange={setNotes}
              packages={formattedPackages}
              themes={formattedThemes}
              availableAddons={formattedAddons}
              vendors={vendors}
              workStatuses={workStatuses}
            />
          </div>
        </div>

        {/* Vendor landing page URL display */}
        <div>
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
