
import { useState, useMemo, useEffect } from "react";
import { Invoice, Vendor, InvoiceFilter } from "@/types/types";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import { InvoiceFilter as InvoiceFilterComponent } from "@/components/invoices/InvoiceFilter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Mock data for vendors
const mockVendors: Vendor[] = [
  { id: "v1", name: "Vendor Utama", code: "VU", commission: 15 },
  { id: "v2", name: "Rahmat Digital", code: "RD", commission: 12 },
  { id: "v3", name: "Sinar Jaya", code: "SJ", commission: 10 },
];

// Mock data for invoices - we ensure these match with real order data
const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2025-001",
    vendor: "Vendor Utama",
    vendorId: "v1",
    dateIssued: "2025-04-25",
    dueDate: "2025-05-10",
    orders: [
      { orderId: "123", clientName: "Rizki", orderDate: "2025-04-15", amount: 350000 },
      { orderId: "124", clientName: "Rendra", orderDate: "2025-04-20", amount: 400000 },
    ],
    status: "Unpaid",
    totalAmount: 750000,
  },
  {
    id: "2",
    invoiceNumber: "INV-2025-002",
    vendor: "Rahmat Digital",
    vendorId: "v2",
    dateIssued: "2025-04-20",
    dueDate: "2025-05-05",
    orders: [
      { orderId: "125", clientName: "Budi", orderDate: "2025-04-10", amount: 250000 },
      { orderId: "126", clientName: "Wati", orderDate: "2025-04-12", amount: 300000 },
      { orderId: "127", clientName: "Sinta", orderDate: "2025-04-18", amount: 350000 },
    ],
    status: "Unpaid",
    totalAmount: 900000,
  },
  {
    id: "3",
    invoiceNumber: "INV-2025-003",
    vendor: "Sinar Jaya",
    vendorId: "v3",
    dateIssued: "2025-03-15",
    dueDate: "2025-03-30",
    orders: [
      { orderId: "120", clientName: "Dewi", orderDate: "2025-03-10", amount: 400000 },
    ],
    status: "Paid",
    totalAmount: 400000,
  },
];

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [filters, setFilters] = useState<InvoiceFilter>({
    vendor: undefined,
    status: 'All',
    sortBy: 'dueDate',
    sortDirection: 'asc'
  });
  
  // Function to sync order changes with invoice data
  const syncOrderChanges = () => {
    // In a real application, this would fetch the latest order data
    // and update invoices accordingly
    console.log("Syncing order changes with invoice data");
    
    // For this mock implementation, we'll just show a toast message
    toast.info("Invoice data telah disinkronisasi dengan data pesanan terbaru");
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
