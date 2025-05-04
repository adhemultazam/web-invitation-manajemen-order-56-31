
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Order, Vendor } from "@/types/types";
import { useInvoiceCreation } from "@/hooks/useInvoiceCreation";
import { OrderSelectionTable } from "./OrderSelectionTable";
import { VendorSelectionDropdown } from "./VendorSelectionDropdown";
import { InvoiceCurrency } from "./InvoiceCurrency";

interface CreateInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  vendors: Vendor[];
  orders: Order[];
  onInvoiceCreated: () => void;
}

export function CreateInvoiceDialog({
  open,
  onClose,
  vendors,
  orders,
  onInvoiceCreated,
}: CreateInvoiceDialogProps) {
  const {
    selectedVendor,
    setSelectedVendor,
    vendorOrders,
    selectedOrders,
    isLoading,
    vendorOrderCounts,
    handleSelectAll,
    handleOrderSelection,
    handleCreateInvoice,
    totalSelectedAmount
  } = useInvoiceCreation(vendors, orders, open, onInvoiceCreated, onClose);

  // Debug log to check if we have orders data
  useEffect(() => {
    if (open) {
      console.log("CreateInvoiceDialog orders:", orders.length);
      console.log("CreateInvoiceDialog vendors:", vendors.length);
    }
  }, [open, orders, vendors]);

  // Debug log to check vendor orders
  useEffect(() => {
    console.log("Selected vendor:", selectedVendor);
    console.log("Vendor orders count:", vendorOrders.length);
  }, [selectedVendor, vendorOrders]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat Invoice Baru</DialogTitle>
          <DialogDescription>
            Pilih vendor dan pesanan belum dibayar (Pending) untuk membuat invoice baru
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <VendorSelectionDropdown
            vendors={vendors}
            selectedVendor={selectedVendor}
            vendorOrderCounts={vendorOrderCounts}
            onVendorChange={setSelectedVendor}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Daftar Pesanan Belum Dibayar</Label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="selectAll" 
                  checked={selectedOrders.length === vendorOrders.length && vendorOrders.length > 0}
                  onCheckedChange={handleSelectAll}
                  disabled={vendorOrders.length === 0}
                />
                <Label htmlFor="selectAll" className="text-sm font-normal">
                  Pilih Semua
                </Label>
              </div>
            </div>
            
            {selectedVendor ? (
              vendorOrders.length > 0 ? (
                <OrderSelectionTable
                  orders={vendorOrders}
                  selectedOrders={selectedOrders}
                  onOrderSelection={handleOrderSelection}
                />
              ) : (
                <div className="border rounded-md p-4 text-center text-muted-foreground">
                  Tidak ada pesanan yang belum dibayar untuk vendor ini
                </div>
              )
            ) : (
              <div className="border rounded-md p-4 text-center text-muted-foreground">
                Pilih vendor terlebih dahulu
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Invoice:</span>
              <span className="font-bold text-lg">
                <InvoiceCurrency amount={totalSelectedAmount} />
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            onClick={handleCreateInvoice}
            disabled={selectedOrders.length === 0 || isLoading}
          >
            {isLoading ? "Membuat..." : "Buat Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
