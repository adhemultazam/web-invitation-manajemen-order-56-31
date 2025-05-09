
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format, differenceInDays } from "date-fns";
import { Order, Addon, Package, Theme, Vendor } from "@/types/types";
import { CustomerInfoFields } from "./form/CustomerInfoFields";
import { OrderDetailsFields } from "./form/OrderDetailsFields";
import { useOrderForm } from "./form/useOrderForm";

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrder: (orderData: Omit<Order, "id">) => void;
  vendors: string[];
  workStatuses: string[];
  addons: Addon[];
  themes: Theme[];
  packages: Package[];
}

export function AddOrderModal({ 
  isOpen, 
  onClose, 
  onAddOrder, 
  vendors, 
  workStatuses, 
  addons: defaultAddons,
  themes: providedThemes,
  packages: providedPackages
}: AddOrderModalProps) {
  // Load packages and themes from props or localStorage
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
  } = useOrderForm();

  // Custom package change handler for this component
  const handlePackageChange = (packageName: string) => {
    console.log("Package changed to:", packageName);
    baseHandlePackageChange(packageName, packages);
    
    // Get appropriate themes for this package
    const packageCategory = packageName;
    const filteredThemes = themes.filter(theme => !packageCategory || theme.category === packageCategory);
    console.log("Filtered themes for category", packageCategory, ":", filteredThemes);
    
    // Reset theme if we have available themes for this package
    if (filteredThemes.length > 0) {
      setTheme(filteredThemes[0].name);
    } else {
      setTheme("");
    }
  };

  // Load data from localStorage when component mounts
  useEffect(() => {
    console.log("AddOrderModal - Initial load");
    
    // Only load packages and themes from localStorage if not provided via props
    if (!providedPackages || providedPackages.length === 0) {
      try {
        const savedPackages = localStorage.getItem("packages");
        if (savedPackages) {
          const parsedPackages = JSON.parse(savedPackages);
          if (Array.isArray(parsedPackages) && parsedPackages.length > 0) {
            setPackages(parsedPackages);
            // Set default package if available
            if (parsedPackages.length > 0 && !selectedPackage) {
              baseHandlePackageChange(parsedPackages[0].name, parsedPackages);
            }
          }
        }
      } catch (error) {
        console.error("Error loading packages:", error);
      }
    } else if (providedPackages.length > 0 && !selectedPackage) {
      // Set default package from props
      baseHandlePackageChange(providedPackages[0].name, providedPackages);
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
            console.log("AddOrderModal - Loaded weddingThemes:", parsedThemes);
            setThemes(parsedThemes);
          }
        } else {
          // Fall back to old "themes" key
          const savedThemes = localStorage.getItem("themes");
          if (savedThemes) {
            const parsedThemes = JSON.parse(savedThemes);
            if (Array.isArray(parsedThemes) && parsedThemes.length > 0) {
              console.log("AddOrderModal - Loaded old themes:", parsedThemes);
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
  }, [providedPackages, providedThemes, defaultAddons, selectedPackage]);

  const handleAddOrder = () => {
    // Get form data from hook
    const formData = getFormData();
    
    // Calculate countdown days based on current date and event date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDateObj = typeof formData.eventDate === 'string' 
      ? new Date(formData.eventDate) 
      : formData.eventDate as Date;
    const countdown = differenceInDays(eventDateObj, today);
    
    // Prepare order data
    const orderData = {
      ...formData,
      countdownDays: countdown
    };
    
    onAddOrder(orderData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Pesanan Baru</DialogTitle>
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
          <Button onClick={handleAddOrder}>Tambah Pesanan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
