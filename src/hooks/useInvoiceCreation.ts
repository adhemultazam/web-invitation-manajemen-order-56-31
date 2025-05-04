
import { useState, useEffect } from "react";
import { Order, Vendor, Invoice } from "@/types/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function useInvoiceCreation(
  vendors: Vendor[],
  orders: Order[],
  isOpen: boolean,
  onInvoiceCreated: () => void,
  onClose: () => void
) {
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [vendorOrders, setVendorOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [vendorOrderCounts, setVendorOrderCounts] = useState<Record<string, number>>({});

  // Reset state when the dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedVendor("");
      setSelectedOrders([]);
      calculateVendorOrderCounts();
    }
  }, [isOpen, orders]);
  
  // Calculate vendor order counts
  const calculateVendorOrderCounts = () => {
    const counts: Record<string, number> = {};
    
    // Initialize counts for all vendors
    vendors.forEach(vendor => {
      counts[vendor.id] = 0;
    });
    
    // Count orders for each vendor
    orders.forEach(order => {
      // Check if vendor exists in the order and in our vendors list
      const vendorExists = vendors.some(v => v.id === order.vendorId || v.name === order.vendor);
      if (vendorExists) {
        // Use vendorId if available, otherwise use vendor name to find the vendor
        const vendorId = order.vendorId || vendors.find(v => v.name === order.vendor)?.id;
        if (vendorId) {
          counts[vendorId] = (counts[vendorId] || 0) + 1;
        }
      }
    });
    
    setVendorOrderCounts(counts);
  };

  // Update vendorOrders when selectedVendor changes
  useEffect(() => {
    if (selectedVendor) {
      const vendor = vendors.find(v => v.id === selectedVendor);
      
      if (vendor) {
        // Filter orders by vendor
        const filteredOrders = orders.filter(order => {
          // Match either by vendorId or vendor name
          return order.vendorId === vendor.id || order.vendor === vendor.name;
        });
        
        console.log(`Found ${filteredOrders.length} orders for vendor ${vendor.name}`);
        setVendorOrders(filteredOrders);
      } else {
        setVendorOrders([]);
      }
    } else {
      setVendorOrders([]);
    }
  }, [selectedVendor, orders, vendors]);

  // Handle select all orders
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(vendorOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  // Handle individual order selection
  const handleOrderSelection = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  // Calculate total amount
  const totalSelectedAmount = vendorOrders
    .filter(order => selectedOrders.includes(order.id))
    .reduce((sum, order) => sum + order.paymentAmount, 0);

  // Create invoice
  const handleCreateInvoice = async () => {
    if (!selectedVendor || selectedOrders.length === 0) {
      toast.error("Pilih vendor dan minimal satu pesanan");
      return;
    }

    setIsLoading(true);

    try {
      // Get vendor details
      const vendor = vendors.find(v => v.id === selectedVendor);
      if (!vendor) {
        throw new Error("Vendor tidak ditemukan");
      }

      // Get selected orders
      const ordersForInvoice = vendorOrders.filter(order => selectedOrders.includes(order.id));
      
      // Generate invoice number: INV-VENDORCODE-YYYYMMDD-XX
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "").substring(2); // YYMMDD format
      const randomNum = Math.floor(100 + Math.random() * 900); // Random 3-digit number
      
      const invoiceNumber = `INV-${vendor.code || "VDR"}-${dateStr}-${randomNum}`;
      
      // Create invoice object
      const newInvoice: Invoice = {
        id: uuidv4(),
        invoiceNumber,
        vendorId: vendor.id,
        vendor: vendor.name,
        dateIssued: today.toISOString().split('T')[0],
        dueDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Due in 14 days
        totalAmount: totalSelectedAmount,
        status: "Unpaid",
        orders: ordersForInvoice.map(order => ({
          orderId: order.id,
          clientName: order.clientName,
          orderDate: order.orderDate,
          amount: order.paymentAmount
        }))
      };
      
      // Save to localStorage
      const existingInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      const typedInvoices = existingInvoices.map((invoice: any) => ({
        ...invoice,
        status: (invoice.status === "Paid" ? "Paid" : "Unpaid") as "Paid" | "Unpaid"
      }));
      localStorage.setItem('invoices', JSON.stringify([...typedInvoices, newInvoice]));
      
      toast.success(`Invoice #${invoiceNumber} berhasil dibuat`, {
        description: `Total invoice: ${new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(totalSelectedAmount)}`
      });
      
      onInvoiceCreated();
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
    totalSelectedAmount
  };
}
