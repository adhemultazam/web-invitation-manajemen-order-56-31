
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format, differenceInDays } from "date-fns";
import { Order, Addon, Package, Theme, Vendor } from "@/types/types";
import { CustomerInfoFields } from "./form/CustomerInfoFields";
import { OrderDetailsFields } from "./form/OrderDetailsFields";
import { useOrderForm } from "./form/useOrderForm";

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
  // Initialize package and theme state
  const [packages, setPackages] = useState<Package[]>(providedPackages || []);
  const [addons, setAddons] = useState<Addon[]>(defaultAddons);
  const [themes, setThemes] = useState<Theme[]>(providedThemes || []);
  
  // Form state using the hook
  const {
    customerName, setCustomerName,
    clientName, setClientName,
    clientUrl, setClientUrl,
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
    handlePackageChange: baseHandlePackageChange,
    getFormData
  } = useOrderForm(order);

  // Update form with order data when it changes
  useEffect(() => {
    if (order && isOpen) {
      setCustomerName(order.customerName || "");
      setClientName(order.clientName || "");
      setClientUrl(order.clientUrl || "");
      setOrderDate(order.orderDate || new Date());
      setEventDate(order.eventDate || undefined);
      setVendor(order.vendor || "");
      baseHandlePackageChange(order.package || "", packages);
      setTheme(order.theme || "");
      setSelectedAddons(order.addons || []);
      setPaymentStatus(order.paymentStatus || "Pending");
      handlePaymentAmountChange(String(order.paymentAmount || 0));
      setWorkStatus(order.workStatus || "");
      setNotes(order.notes || "");
    }
  }, [order, isOpen]);

  // Custom package change handler for this component
  const handlePackageChange = (packageName: string) => {
    console.log("Package changed to:", packageName);
    baseHandlePackageChange(packageName, packages);
    
    // Check if current theme is appropriate for new package
    const packageCategory = packageName;
    const currentTheme = theme;
    const isThemeCompatible = themes.some(t => 
      t.name === currentTheme && (!packageCategory || t.category === packageCategory)
    );
    
    // If current theme is not compatible with new package, select the first compatible theme
    if (!isThemeCompatible) {
      const compatibleThemes = themes.filter(t => !packageCategory || t.category === packageCategory);
      console.log("Compatible themes for category", packageCategory, ":", compatibleThemes);
      if (compatibleThemes.length > 0) {
        setTheme(compatibleThemes[0].name);
      }
    }
  };

  // Load data from localStorage when component mounts
  useEffect(() => {
    console.log("EditOrderModal - Initial load");
    
    // Only load packages and themes from localStorage if not provided via props
    if (!providedPackages || providedPackages.length === 0) {
      try {
        const savedPackages = localStorage.getItem("packages");
        if (savedPackages) {
          const parsedPackages = JSON.parse(savedPackages);
          if (Array.isArray(parsedPackages) && parsedPackages.length > 0) {
            setPackages(parsedPackages);
          }
        }
      } catch (error) {
        console.error("Error loading packages:", error);
      }
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
        // First try to get weddingThemes (new format)
        const savedWeddingThemes = localStorage.getItem("weddingThemes");
        if (savedWeddingThemes) {
          const parsedThemes = JSON.parse(savedWeddingThemes);
          if (Array.isArray(parsedThemes) && parsedThemes.length > 0) {
            console.log("EditOrderModal - Loaded weddingThemes:", parsedThemes);
            setThemes(parsedThemes);
          }
        } else {
          // Fall back to old "themes" key
          const savedThemes = localStorage.getItem("themes");
          if (savedThemes) {
            const parsedThemes = JSON.parse(savedThemes);
            if (Array.isArray(parsedThemes) && parsedThemes.length > 0) {
              console.log("EditOrderModal - Loaded old themes:", parsedThemes);
              // Convert string themes to object themes if necessary
              const processedThemes = parsedThemes.map((theme: any) => {
                if (typeof theme === 'string') {
                  return { id: crypto.randomUUID(), name: theme, thumbnail: "", category: "" };
                }
                return theme;
              });
              setThemes(processedThemes);
            }
          }
        }
      } catch (error) {
        console.error("Error loading themes:", error);
      }
    }
  }, [providedPackages, providedThemes, defaultAddons]);

  const handleSubmit = () => {
    // Get form data
    const formData = getFormData();
    
    // Calculate countdown days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDateObj = typeof formData.eventDate === 'string' 
      ? new Date(formData.eventDate) 
      : formData.eventDate as Date;
    const countdown = differenceInDays(eventDateObj, today);
    
    // Ensure we have the original ID
    const updatedOrder: Order = {
      ...formData,
      id: order.id, 
      countdownDays: countdown
    };
    
    onEditOrder(updatedOrder);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pesanan</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Customer Information Side */}
          <div className="space-y-4">
            <CustomerInfoFields 
              customerName={customerName}
              onCustomerNameChange={setCustomerName}
              clientName={clientName}
              onClientNameChange={setClientName}
              clientUrl={clientUrl}
              onClientUrlChange={setClientUrl}
              orderDate={orderDate}
              onOrderDateChange={setOrderDate}
              eventDate={eventDate}
              onEventDateChange={setEventDate}
            />
          </div>
          
          {/* Order Details Side */}
          <div className="space-y-4">
            <OrderDetailsFields 
              vendor={vendor}
              onVendorChange={setVendor}
              selectedPackage={selectedPackage}
              onPackageChange={handlePackageChange}
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
              packages={packages}
              themes={themes}
              availableAddons={addons}
              vendors={vendors}
              workStatuses={workStatuses}
            />
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
