
import { useState, useEffect, useCallback } from "react";
import { Order, Vendor } from "@/types/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function useInvoiceCreation(
  vendors: Vendor[],
  orders: Order[],
  open: boolean,
  onInvoiceCreated: () => void,
  onClose: () => void
) {
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [vendorOrders, setVendorOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [vendorOrderCounts, setVendorOrderCounts] = useState<Record<string, number>>({});
  const [totalSelectedAmount, setTotalSelectedAmount] = useState<number>(0);

  // Reset state when modal is opened
  useEffect(() => {
    if (open) {
      setSelectedVendor("");
      setVendorOrders([]);
      setSelectedOrders([]);
      
      // Calculate order counts per vendor for all pending payments
      const counts: Record<string, number> = {};
      vendors.forEach(vendor => {
        counts[vendor.id] = orders.filter(order => 
          order.vendor === vendor.id && 
          order.paymentStatus === "Pending"
        ).length;
      });
      setVendorOrderCounts(counts);
    }
  }, [open, orders, vendors]);

  // Update vendor orders when vendor selection changes
  useEffect(() => {
    if (selectedVendor) {
      const filteredOrders = orders.filter(
        (order) => order.vendor === selectedVendor && order.paymentStatus === "Pending"
      );
      setVendorOrders(filteredOrders);
      setSelectedOrders([]);
      console.log("Filtered vendor orders:", filteredOrders.length);
    } else {
      setVendorOrders([]);
    }
  }, [selectedVendor, orders]);

  // Calculate total amount as orders are selected
  useEffect(() => {
    const total = vendorOrders
      .filter(order => selectedOrders.includes(order.id))
      .reduce((sum, order) => sum + order.paymentAmount, 0);
    
    setTotalSelectedAmount(total);
  }, [selectedOrders, vendorOrders]);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedOrders(vendorOrders.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
  }, [vendorOrders]);

  const handleOrderSelection = useCallback((orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    }
  }, []);

  const handleCreateInvoice = useCallback(async () => {
    if (!selectedVendor || selectedOrders.length === 0) {
      toast.error("Pilih vendor dan minimal satu pesanan");
      return;
    }

    setIsLoading(true);

    try {
      // Get selected orders details
      const orderDetails = vendorOrders
        .filter((order) => selectedOrders.includes(order.id))
        .map((order) => ({
          orderId: order.id,
          clientName: order.clientName,
          orderDate: order.orderDate,
          amount: order.paymentAmount,
        }));

      // Calculate total amount
      const totalAmount = orderDetails.reduce((sum, order) => sum + order.amount, 0);

      // Create invoice
      const vendor = vendors.find((v) => v.id === selectedVendor);
      
      // Generate invoice number: INV-vendorcode-date-random
      const today = new Date();
      const dateStr = today.getFullYear().toString().substring(2) + 
                     (today.getMonth() + 1).toString().padStart(2, '0');
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const invoiceNumber = `INV-${vendor?.code || 'XXX'}-${dateStr}-${randomNum}`;
      
      // Set due date to 7 days from now
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      const newInvoice = {
        id: uuidv4(),
        invoiceNumber,
        vendor: vendor?.name || "",
        vendorId: selectedVendor,
        dateIssued: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        status: "Unpaid" as const,
        totalAmount,
        orders: orderDetails,
      };

      // Save to localStorage
      const existingInvoices = localStorage.getItem("invoices");
      const invoicesArray = existingInvoices ? JSON.parse(existingInvoices) : [];
      localStorage.setItem("invoices", JSON.stringify([...invoicesArray, newInvoice]));

      toast.success("Invoice berhasil dibuat", {
        description: `Invoice #${invoiceNumber} untuk ${vendor?.name} telah dibuat`
      });

      // Notify parent component
      onInvoiceCreated();
      onClose();
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Gagal membuat invoice", {
        description: "Terjadi kesalahan saat membuat invoice"
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedVendor, selectedOrders, vendorOrders, vendors, onInvoiceCreated, onClose]);

  return {
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
  };
}
