import { useState, useMemo, useEffect } from "react";
import { Invoice, Vendor, InvoiceFilter } from "@/types/types";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import { InvoiceFilter as InvoiceFilterComponent } from "@/components/invoices/InvoiceFilter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Mock data for vendors - We now use the same vendors as in VendorSettings
const mockVendors: Vendor[] = [
  { id: "v1", name: "Vendor Utama", code: "MAIN", commission: 10 },
  { id: "v2", name: "Reseller Premium", code: "PREM", commission: 15 },
];

// Mock orders with client names that match what's in the MonthlyOrders component
const mockOrders = [
  {
    id: "123",
    clientName: "Rizki & Putri",
    orderDate: "2025-04-15",
    amount: 350000,
    vendor: "Vendor Utama",
    vendorId: "v1",
  },
  {
    id: "124", 
    clientName: "Kartika & Rendra",
    orderDate: "2025-04-20",
    amount: 400000,
    vendor: "Vendor Utama",
    vendorId: "v1",
  },
  {
    id: "125",
    clientName: "Budi & Anisa",
    orderDate: "2025-04-10",
    amount: 250000,
    vendor: "Reseller Premium",
    vendorId: "v2",
  },
  {
    id: "126",
    clientName: "Ahmad & Wati",
    orderDate: "2025-04-12",
    amount: 300000,
    vendor: "Reseller Premium",
    vendorId: "v2",
  },
  {
    id: "127",
    clientName: "Andi & Sinta",
    orderDate: "2025-04-18",
    amount: 350000,
    vendor: "Reseller Premium",
    vendorId: "v2",
  },
  {
    id: "120",
    clientName: "Dewi & Rendi",
    orderDate: "2025-03-10",
    amount: 400000,
    vendor: "Vendor Utama",
    vendorId: "v1",
  },
];

// Mock data for invoices - Updated to match existing vendors and use client names from orders
const initialInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2025-001",
    vendor: "Vendor Utama",
    vendorId: "v1",
    dateIssued: "2025-04-25",
    dueDate: "2025-05-10",
    orders: [
      { orderId: "123", clientName: "Rizki & Putri", orderDate: "2025-04-15", amount: 350000 },
      { orderId: "124", clientName: "Kartika & Rendra", orderDate: "2025-04-20", amount: 400000 },
    ],
    status: "Unpaid",
    totalAmount: 750000,
  },
  {
    id: "2",
    invoiceNumber: "INV-2025-002",
    vendor: "Reseller Premium",
    vendorId: "v2",
    dateIssued: "2025-04-20",
    dueDate: "2025-05-05",
    orders: [
      { orderId: "125", clientName: "Budi & Anisa", orderDate: "2025-04-10", amount: 250000 },
      { orderId: "126", clientName: "Ahmad & Wati", orderDate: "2025-04-12", amount: 300000 },
      { orderId: "127", clientName: "Andi & Sinta", orderDate: "2025-04-18", amount: 350000 },
    ],
    status: "Unpaid",
    totalAmount: 900000,
  },
  {
    id: "3",
    invoiceNumber: "INV-2025-003",
    vendor: "Vendor Utama",
    vendorId: "v1",
    dateIssued: "2025-03-15",
    dueDate: "2025-03-30",
    orders: [
      { orderId: "120", clientName: "Dewi & Rendi", orderDate: "2025-03-10", amount: 400000 },
    ],
    status: "Paid",
    totalAmount: 400000,
  },
];

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filters, setFilters] = useState<InvoiceFilter>({
    vendor: undefined,
    status: 'All',
    sortBy: 'dueDate',
    sortDirection: 'asc'
  });
  
  // Load invoices from localStorage on component mount
  useEffect(() => {
    try {
      const savedInvoices = localStorage.getItem('invoices');
      if (savedInvoices) {
        setInvoices(JSON.parse(savedInvoices));
      } else {
        setInvoices(initialInvoices);
        localStorage.setItem('invoices', JSON.stringify(initialInvoices));
      }
    } catch (e) {
      console.error("Error loading invoices from localStorage:", e);
      setInvoices(initialInvoices);
    }
  }, []);

  // Save invoices to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);
  
  // Function to sync order changes with invoice data
  const syncOrderChanges = () => {
    // In a real application, this would fetch the latest order data
    // and update invoices accordingly
    console.log("Syncing order changes with invoice data");
    
    // For this mock implementation, we'll just show a toast message
    toast.success("Invoice data telah disinkronisasi dengan data pesanan terbaru");
    
    // Simulate synchronizing data by updating client names if needed
    const updatedInvoices = invoices.map(invoice => {
      const updatedOrders = invoice.orders.map(order => {
        // Find the corresponding order in mockOrders
        const matchingOrder = mockOrders.find(o => o.id === order.orderId);
        if (matchingOrder) {
          return {
            ...order,
            clientName: matchingOrder.clientName,
            orderDate: matchingOrder.orderDate,
            amount: matchingOrder.amount
          };
        }
        return order;
      });
      
      // Recalculate total based on possibly updated amounts
      const totalAmount = updatedOrders.reduce((sum, order) => sum + order.amount, 0);
      
      return {
        ...invoice,
        orders: updatedOrders,
        totalAmount
      };
    });
    
    setInvoices(updatedInvoices);
  };
  
  // Call syncOrderChanges when component mounts
  useEffect(() => {
    syncOrderChanges();
  }, []);
  
  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === invoiceId ? { ...invoice, status: "Paid" } : invoice
      )
    );
    
    toast.success("Invoice telah ditandai sebagai lunas", {
      description: `Invoice #${invoices.find(i => i.id === invoiceId)?.invoiceNumber} berhasil diperbarui`,
    });
    
    // In a real application, this would also update the payment status of associated orders
  };
  
  const filteredInvoices = useMemo(() => {
    return invoices
      .filter(invoice => {
        // Filter by vendor
        if (filters.vendor && filters.vendor !== 'all') {
          if (invoice.vendorId !== filters.vendor) return false;
        }
        
        // Filter by status
        if (filters.status && filters.status !== 'All') {
          if (invoice.status !== filters.status) return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sort by selected field
        if (filters.sortBy === 'dueDate') {
          const dateA = new Date(a.dueDate).getTime();
          const dateB = new Date(b.dueDate).getTime();
          return filters.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (filters.sortBy === 'amount') {
          return filters.sortDirection === 'asc' 
            ? a.totalAmount - b.totalAmount 
            : b.totalAmount - a.totalAmount;
        }
        return 0;
      });
  }, [invoices, filters]);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Invoice</h1>
        <p className="text-muted-foreground">
          Kelola invoice untuk vendor-vendor Anda
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button onClick={syncOrderChanges} variant="outline">
            Sinkronisasi dengan Data Pesanan
          </Button>
        </div>
        
        <InvoiceFilterComponent
          vendors={mockVendors}
          onFilterChange={setFilters}
        />
        
        <InvoiceTable
          invoices={filteredInvoices}
          vendors={mockVendors}
          onMarkAsPaid={handleMarkAsPaid}
        />
      </div>
    </div>
  );
}
