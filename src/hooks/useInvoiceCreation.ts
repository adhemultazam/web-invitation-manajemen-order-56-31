
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Order, Vendor } from "@/types/types";
import { 
  generateInvoice, 
  isOrderInvoiced, 
  loadInvoices, 
  saveInvoices, 
  getVendorsWithUnpaidOrders 
} from "@/lib/invoiceUtils";

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
  const [dueDate, setDueDate] = useState<Date>(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)); // 14 days from now
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [existingInvoices, setExistingInvoices] = useState([]);
  const [vendorOrderCounts, setVendorOrderCounts] = useState<Record<string, number>>({});

  // Load existing invoices to check for already invoiced orders
  useEffect(() => {
    if (open) {
      const invoices = loadInvoices();
      setExistingInvoices(invoices);
      
      // Calculate number of uninvoiced orders per vendor
      const orderCounts = getVendorsWithUnpaidOrders(orders, invoices);
      setVendorOrderCounts(orderCounts);
      
      // Reset selection when dialog opens
      setSelectedVendor("");
      setVendorOrders([]);
      setSelectedOrders([]);
    }
  }, [open, orders]);

  // Filter orders when vendor changes
  useEffect(() => {
    if (selectedVendor) {
      // Use proper filtering for vendor orders
      const filteredOrders = orders.filter(order => {
        return order.vendor === selectedVendor && 
               order.paymentStatus === 'Lunas' && 
               !isOrderInvoiced(order.id, existingInvoices);
      });
      
      setVendorOrders(filteredOrders);
      setSelectedOrders([]); // Reset selections when vendor changes
    } else {
      setVendorOrders([]);
    }
  }, [selectedVendor, orders, existingInvoices]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(vendorOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleOrderSelection = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  const handleCreateInvoice = () => {
    if (!selectedVendor || selectedOrders.length === 0 || !dueDate) {
      toast.error("Pilih vendor, pesanan, dan tanggal jatuh tempo");
      return;
    }

    setIsLoading(true);

    try {
      const selectedVendorObj = vendors.find(v => v.id === selectedVendor);
      if (!selectedVendorObj) {
        toast.error("Data vendor tidak valid");
        setIsLoading(false);
        return;
      }

      const ordersToInvoice = vendorOrders.filter(order => selectedOrders.includes(order.id));
      
      const invoice = generateInvoice(
        selectedVendorObj.id,
        selectedVendorObj.name,
        ordersToInvoice,
        dueDate.toISOString().split('T')[0]
      );

      // Save to local storage
      const existingInvoices = loadInvoices();
      saveInvoices([...existingInvoices, invoice]);

      toast.success("Invoice berhasil dibuat");
      onInvoiceCreated();
      onClose();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error("Gagal membuat invoice");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total amount from selected orders
  const totalSelectedAmount = vendorOrders
    .filter(order => selectedOrders.includes(order.id))
    .reduce((sum, order) => sum + order.paymentAmount, 0);

  return {
    selectedVendor,
    setSelectedVendor,
    vendorOrders,
    selectedOrders,
    dueDate,
    setDueDate,
    isLoading,
    vendorOrderCounts,
    handleSelectAll,
    handleOrderSelection,
    handleCreateInvoice,
    totalSelectedAmount
  };
}
