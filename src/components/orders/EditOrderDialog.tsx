
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Order, Theme, Addon, Vendor, WorkStatus, Package } from "@/types/types";
import { CustomerInfoFields } from "./form/CustomerInfoFields";
import { OrderDetailsFields } from "./form/OrderDetailsFields";
import { useOrderForm } from "./form/useOrderForm";

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
  // Form state using our custom hook
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

  // Initialize form data when order changes or dialog opens
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
      
      // Update the package category based on the selected package
      updatePackageCategory(order.package);
    }
  }, [order, isOpen, packages]);

  // State for the current package category
  const [currentPackageCategory, setCurrentPackageCategory] = useState<string | undefined>(undefined);
  
  // Function to update the package category
  const updatePackageCategory = (packageName: string) => {
    const selectedPackage = packages.find(pkg => pkg.name === packageName);
    setCurrentPackageCategory(selectedPackage?.name);
  };

  // Custom package change handler
  const handlePackageChange = (packageName: string) => {
    baseHandlePackageChange(packageName, packages);
    updatePackageCategory(packageName);
    
    // If theme selection needs to be updated based on new package
    const compatibleThemes = themes.filter(theme => theme.category === packageName);
    if (compatibleThemes.length > 0 && 
        (!theme || !compatibleThemes.some(t => t.name === theme))) {
      setTheme(compatibleThemes[0].name);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    
    // Get form data from hook
    const formData = getFormData();
    
    onSave(order.id, formData);
    onClose();
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pesanan</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
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
                  showClientUrl={false}
                />
              </div>
            </div>
            
            {/* Order Details */}
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
