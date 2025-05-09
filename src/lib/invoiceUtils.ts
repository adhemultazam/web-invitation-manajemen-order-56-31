
import { v4 as uuidv4 } from 'uuid';
import { Invoice, Order } from '@/types/types';
import { toast } from 'sonner';

// Load all orders from all months in local storage
export const loadAllOrders = (): Order[] => {
  const months = [
    'januari', 'februari', 'maret', 'april', 'mei', 'juni',
    'juli', 'agustus', 'september', 'oktober', 'november', 'desember'
  ];
  
  let allOrders: Order[] = [];
  
  months.forEach(month => {
    try {
      const storageKey = `orders_${month}`;
      const monthOrders = localStorage.getItem(storageKey);
      if (monthOrders) {
        const parsedOrders = JSON.parse(monthOrders);
        if (Array.isArray(parsedOrders)) {
          allOrders = [...allOrders, ...parsedOrders];
        }
      }
    } catch (error) {
      console.error(`Error loading orders for ${month}:`, error);
    }
  });
  
  console.log("All orders loaded:", allOrders.length);
  return allOrders;
};

// Get all invoices from local storage
export const loadInvoices = (): Invoice[] => {
  try {
    const savedInvoices = localStorage.getItem('invoices');
    if (savedInvoices) {
      const parsedInvoices = JSON.parse(savedInvoices);
      // Ensure each invoice has the correct status type
      const typedInvoices = parsedInvoices.map((invoice: any) => ({
        ...invoice,
        status: (invoice.status === "Paid" ? "Paid" : "Unpaid") as "Paid" | "Unpaid"
      }));
      console.log("Loaded invoices:", typedInvoices.length);
      return typedInvoices;
    }
  } catch (error) {
    console.error('Error loading invoices:', error);
  }
  return [];
};

// Save invoices to local storage
export const saveInvoices = (invoices: Invoice[]) => {
  try {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  } catch (error) {
    console.error('Error saving invoices:', error);
    toast.error('Gagal menyimpan data invoice');
  }
};

// Filter orders by vendor and payment status
export const filterOrdersByVendor = (orders: Order[], vendorId: string): Order[] => {
  return orders.filter(order => order.vendor === vendorId && order.paymentStatus === 'Lunas');
};

// Get orders that haven't been invoiced yet
export const getUninvoicedOrders = (orders: Order[], invoices: Invoice[]): Order[] => {
  return orders.filter(order => !isOrderInvoiced(order.id, invoices));
};

// Generate a new invoice from orders
export const generateInvoice = (
  vendorId: string,
  vendorName: string,
  orders: Order[],
  dueDate: string
): Invoice => {
  // Calculate total amount from orders
  const totalAmount = orders.reduce((sum, order) => {
    const amount = typeof order.paymentAmount === 'number' ? 
      order.paymentAmount : 
      parseFloat(order.paymentAmount.toString()) || 0;
    return sum + amount;
  }, 0);
  
  // Generate invoice number (format: INV-YYYYMMDD-XXXX)
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  const invoiceNumber = `INV-${dateStr}-${randomPart}`;
  
  // Map orders to include orderId and amount fields for invoices
  const invoiceOrders = orders.map(order => {
    // Ensure amount is a number
    const numericAmount = typeof order.paymentAmount === 'number' ? 
      order.paymentAmount : 
      parseFloat(order.paymentAmount.toString()) || 0;
      
    // Create a complete Order object with required fields
    const invoiceOrder: Order = {
      ...order,
      orderId: order.id, // Copy id to orderId for reference
      amount: numericAmount // Set the amount field from paymentAmount
    };
    
    return invoiceOrder;
  });
  
  return {
    id: uuidv4(),
    invoiceNumber,
    vendorId,
    vendor: vendorName,
    dateIssued: today.toISOString().split('T')[0],
    dueDate: dueDate,
    orders: invoiceOrders,
    totalAmount,
    status: "Unpaid"
  };
};

// Mark an invoice as paid
export const markInvoiceAsPaid = (invoiceId: string): boolean => {
  try {
    const invoices = loadInvoices();
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === invoiceId 
        ? { ...invoice, status: "Paid" as "Paid" } 
        : invoice
    );
    
    saveInvoices(updatedInvoices);
    return true;
  } catch (error) {
    console.error('Error marking invoice as paid:', error);
    return false;
  }
};

// Check if an order is already included in any invoice
export const isOrderInvoiced = (orderId: string, invoices: Invoice[]): boolean => {
  if (!invoices || invoices.length === 0) return false;
  
  return invoices.some(invoice => 
    invoice.orders && invoice.orders.some(order => 
      // Check both id and orderId to ensure compatibility
      (order.id === orderId || order.orderId === orderId)
    )
  );
};

// Get available vendors with unpaid orders
export const getVendorsWithUnpaidOrders = (orders: Order[], invoices: Invoice[]) => {
  // Find paid (Lunas) orders that haven't been invoiced yet
  const uninvoicedOrders = getUninvoicedOrders(orders, invoices);
  
  // Group paid orders by vendor ID
  const vendorOrderCount: Record<string, number> = {};
  
  uninvoicedOrders
    .filter(order => order.paymentStatus === 'Lunas') // Only include paid orders
    .forEach(order => {
      if (!vendorOrderCount[order.vendor]) {
        vendorOrderCount[order.vendor] = 0;
      }
      vendorOrderCount[order.vendor]++;
    });
  
  console.log("Vendor order counts:", vendorOrderCount);
  return vendorOrderCount;
};

// Get vendor names from vendor IDs
export const getVendorNames = (vendorIds: string[], vendors: any[]): Record<string, string> => {
  const vendorNames: Record<string, string> = {};
  
  vendorIds.forEach(id => {
    const vendor = vendors.find(v => v.id === id);
    if (vendor) {
      vendorNames[id] = vendor.name;
    } else {
      vendorNames[id] = 'Unknown Vendor';
    }
  });
  
  return vendorNames;
};
