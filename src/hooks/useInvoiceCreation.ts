
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Order, Vendor } from "@/types/types";

export const useInvoiceCreation = (
  vendors: Vendor[],
  orders: Order[],
  isOpen: boolean,
  onInvoiceCreated: () => void,
  onClose: () => void
) => {
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter orders to only include those with Pending payment status
  const pendingOrders = orders.filter(order => order.paymentStatus === "Pending");
  
  // Get vendor orders based on the selected vendor, but only pending payments
  const vendorOrders = pendingOrders.filter(
    (order) => order.vendor === selectedVendor
  );
  
  // Calculate order counts per vendor (only pending orders)
  const vendorOrderCounts: Record<string, number> = {};
  pendingOrders.forEach((order) => {
    vendorOrderCounts[order.vendor] = (vendorOrderCounts[order.vendor] || 0) + 1;
  });
  
  // Calculate the total amount of selected orders
  const totalSelectedAmount = selectedOrders.reduce((sum, orderId) => {
    const order = vendorOrders.find((o) => o.id === orderId);
    return sum + (order?.paymentAmount || 0);
  }, 0);
  
  // Reset selected orders when the dialog is opened or when a different vendor is selected
  useEffect(() => {
    setSelectedOrders([]);
  }, [isOpen, selectedVendor]);
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(vendorOrders.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
  };
  
  const handleOrderSelection = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    }
  };
  
  const handleCreateInvoice = () => {
    if (!selectedVendor || selectedOrders.length === 0) {
      toast.error("Pilih vendor dan minimal satu pesanan");
      return;
    }
    
    setIsLoading(true);
    
    // Get selected orders with details
    const orderDetails = vendorOrders
      .filter((order) => selectedOrders.includes(order.id))
      .map((order) => ({
        orderId: order.id,
        clientName: order.clientName,
        orderDate: order.orderDate,
        amount: order.paymentAmount,
      }));
    
    // Generate a new invoice
    const vendor = vendors.find((v) => v.id === selectedVendor);
    
    // Generate current date
    const currentDate = new Date();
    
    // Generate due date (30 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    
    // Create invoice object
    const newInvoice = {
      id: uuidv4(),
      invoiceNumber: `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      vendorId: selectedVendor,
      vendor: vendor?.name || "Unknown Vendor",
      orders: orderDetails,
      totalAmount: totalSelectedAmount,
      status: "Unpaid", // Default status
      dateIssued: currentDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
    };
    
    // Save to localStorage
    try {
      // Get existing invoices
      const existingInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
      
      // Add new invoice
      const updatedInvoices = [...existingInvoices, newInvoice];
      
      // Save back to localStorage
      localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
      
      // Update orders to mark them as invoiced
      const allOrders = JSON.parse(localStorage.getItem("orders_all") || "[]");
      const updatedOrders = allOrders.map((order: Order) => {
        if (selectedOrders.includes(order.id)) {
          return { ...order, invoiced: true };
        }
        return order;
      });
      
      // Save updated orders
      localStorage.setItem("orders_all", JSON.stringify(updatedOrders));
      
      // For monthly orders, we need to update each month's orders
      const months = [
        "januari", "februari", "maret", "april", "mei", "juni",
        "juli", "agustus", "september", "oktober", "november", "desember"
      ];
      
      months.forEach(month => {
        const key = `orders_${month}`;
        const monthlyOrders = JSON.parse(localStorage.getItem(key) || "[]");
        if (monthlyOrders.length > 0) {
          const updatedMonthlyOrders = monthlyOrders.map((order: Order) => {
            if (selectedOrders.includes(order.id)) {
              return { ...order, invoiced: true };
            }
            return order;
          });
          localStorage.setItem(key, JSON.stringify(updatedMonthlyOrders));
        }
      });
      
      // Show success message
      toast.success("Invoice berhasil dibuat", {
        description: `Invoice untuk ${orderDetails.length} pesanan telah dibuat`
      });
      
      // Notify parent component
      onInvoiceCreated();
      
      // Close dialog
      onClose();
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Gagal membuat invoice");
    } finally {
      setIsLoading(false);
    }
  };
  
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
    totalSelectedAmount,
  };
};
