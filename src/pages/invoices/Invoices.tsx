
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import { InvoiceFilter } from "@/components/invoices/InvoiceFilter";
import { CreateInvoiceDialog } from "@/components/invoices/CreateInvoiceDialog";
import { 
  Invoice, 
  Vendor, 
  Order, 
  InvoiceFilter as InvoiceFilterType 
} from "@/types/types";
import { toast } from "sonner";
import { monthsInIndonesian } from "@/lib/utils"; // Using correct import from lib/utils
import { markInvoiceAsPaid } from "@/lib/invoiceUtils";

export default function Invoices() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filters, setFilters] = useState<InvoiceFilterType>({
    vendor: undefined,
    status: 'All',
    sortBy: 'dueDate',
    sortDirection: 'asc'
  });

  // Load invoices from localStorage
  const loadInvoices = () => {
    try {
      const savedInvoices = localStorage.getItem('invoices');
      if (savedInvoices) {
        const parsedInvoices = JSON.parse(savedInvoices);
        // Make sure each invoice has a valid status type
        const typedInvoices = parsedInvoices.map((invoice: any) => ({
          ...invoice,
          status: (invoice.status === "Paid" ? "Paid" : "Unpaid") as "Paid" | "Unpaid"
        }));
        setInvoices(typedInvoices);
        applyFilters(typedInvoices, filters);
      }
    } catch (e) {
      console.error("Error loading invoices:", e);
      toast.error("Gagal memuat data invoice");
    }
  };
  
  // Load vendors from localStorage
  const loadVendors = () => {
    try {
      const savedVendors = localStorage.getItem('vendors');
      if (savedVendors) {
        setVendors(JSON.parse(savedVendors));
      } else {
        // Initialize with defaults if not found
        const defaultVendors: Vendor[] = [
          { id: "v1", name: "Rizki Design", code: "RD", color: "#3b82f6", commission: 10 },
          { id: "v2", name: "Putri Digital", code: "PD", color: "#8b5cf6", commission: 15 }
        ];
        localStorage.setItem('vendors', JSON.stringify(defaultVendors));
        setVendors(defaultVendors);
      }
    } catch (e) {
      console.error("Error loading vendors:", e);
    }
  };
  
  // Load orders from all months
  const loadAllOrders = () => {
    try {
      const allOrders: Order[] = [];
      
      // Load orders from each month
      monthsInIndonesian.forEach(month => {
        const monthKey = `orders_${month.toLowerCase()}`;
        const savedOrders = localStorage.getItem(monthKey);
        
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          if (Array.isArray(parsedOrders)) {
            // Map vendor name to vendorId if vendorId doesn't exist
            const processedOrders = parsedOrders.map(order => {
              // If order already has vendorId, use it
              if (order.vendorId) return order;
              
              // Otherwise, try to find vendorId by vendor name
              const vendor = vendors.find(v => v.name === order.vendor);
              if (vendor) {
                return { ...order, vendorId: vendor.id };
              }
              return order;
            });
            
            allOrders.push(...processedOrders);
          }
        }
      });
      
      console.log(`Loaded ${allOrders.length} orders from all months`);
      setOrders(allOrders);
    } catch (e) {
      console.error("Error loading orders:", e);
    }
  };
  
  // Apply filters to invoices
  const applyFilters = (invoiceList: Invoice[], currentFilters: InvoiceFilterType) => {
    let filtered = [...invoiceList];
    
    // Filter by vendor
    if (currentFilters.vendor && currentFilters.vendor !== 'all') {
      filtered = filtered.filter(invoice => invoice.vendorId === currentFilters.vendor);
    }
    
    // Filter by status
    if (currentFilters.status !== 'All') {
      filtered = filtered.filter(invoice => invoice.status === currentFilters.status);
    }
    
    // Sort by selected field
    filtered.sort((a, b) => {
      if (currentFilters.sortBy === 'dueDate') {
        return new Date(a.dateIssued).getTime() - new Date(b.dateIssued).getTime();
      } else {
        return a.totalAmount - b.totalAmount;
      }
    });
    
    // Apply sort direction
    if (currentFilters.sortDirection === 'desc') {
      filtered.reverse();
    }
    
    setFilteredInvoices(filtered);
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters: InvoiceFilterType) => {
    setFilters(newFilters);
    applyFilters(invoices, newFilters);
  };
  
  // Mark invoice as paid
  const handleMarkAsPaid = (invoiceId: string) => {
    if (markInvoiceAsPaid(invoiceId)) {
      loadInvoices(); // Reload all invoices after marking one as paid
      toast.success("Invoice berhasil ditandai sebagai lunas");
    } else {
      toast.error("Gagal menandai invoice sebagai lunas");
    }
  };

  // Delete invoice
  const handleDeleteInvoice = (invoiceId: string) => {
    try {
      // Filter out the invoice to be deleted
      const updatedInvoices = invoices.filter(invoice => invoice.id !== invoiceId);
      
      // Update state and localStorage
      setInvoices(updatedInvoices);
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
      
      // Update filtered list
      applyFilters(updatedInvoices, filters);
      
      toast.success("Invoice berhasil dihapus");
    } catch (e) {
      console.error("Error deleting invoice:", e);
      toast.error("Gagal menghapus invoice");
    }
  };
  
  // Load all data on component mount
  useEffect(() => {
    loadVendors();
  }, []);
  
  useEffect(() => {
    if (vendors.length > 0) {
      loadAllOrders();
      loadInvoices();
    }
  }, [vendors]);
  
  useEffect(() => {
    applyFilters(invoices, filters);
  }, [invoices, filters]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoice</h1>
          <p className="text-muted-foreground">
            Kelola semua invoice vendor
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="sm:w-auto w-full"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Buat Invoice
        </Button>
      </div>
      
      <InvoiceFilter 
        vendors={vendors} 
        onFilterChange={handleFilterChange} 
      />
      
      <InvoiceTable 
        invoices={filteredInvoices} 
        vendors={vendors} 
        onMarkAsPaid={handleMarkAsPaid}
        onDeleteInvoice={handleDeleteInvoice}
      />
      
      <CreateInvoiceDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        vendors={vendors}
        orders={orders}
        onInvoiceCreated={loadInvoices}
      />
    </div>
  );
}
