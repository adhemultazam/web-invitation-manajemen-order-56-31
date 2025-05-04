
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import { InvoiceFilter } from "@/components/invoices/InvoiceFilter";
import { CreateInvoiceDialog } from "@/components/invoices/CreateInvoiceDialog";
import { Plus } from "lucide-react";
import { Invoice, Vendor, InvoiceFilter as InvoiceFilterType, Order } from "@/types/types";
import { toast } from "sonner";
import { 
  loadInvoices, 
  saveInvoices, 
  loadAllOrders, 
  markInvoiceAsPaid, 
  getVendorsWithUnpaidOrders 
} from "@/lib/invoiceUtils";

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vendorsWithOrders, setVendorsWithOrders] = useState<Record<string, number>>({});

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = () => {
    setIsLoading(true);
    
    try {
      // Load vendors from localStorage
      const storedVendors = localStorage.getItem("vendors");
      if (storedVendors) {
        const parsedVendors = JSON.parse(storedVendors);
        setVendors(parsedVendors);
        console.log("Loaded vendors:", parsedVendors.length);
      }
      
      // Load orders from all months
      const allOrders = loadAllOrders();
      setOrders(allOrders);
      console.log("Loaded all orders in Invoices page:", allOrders.length);
      
      // Load invoices
      const savedInvoices = loadInvoices();
      // Ensure the status property is correctly typed
      const typedInvoices: Invoice[] = savedInvoices.map(invoice => ({
        ...invoice,
        status: (invoice.status === "Paid" ? "Paid" : "Unpaid") as "Paid" | "Unpaid"
      }));
      
      setInvoices(typedInvoices);
      setFilteredInvoices(typedInvoices);
      
      // Calculate vendors with uninvoiced orders
      const vendorOrderCounts = getVendorsWithUnpaidOrders(allOrders, savedInvoices);
      setVendorsWithOrders(vendorOrderCounts);
      
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Gagal memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filters: InvoiceFilterType) => {
    let filtered = [...invoices];
    
    // Filter by vendor
    if (filters.vendor && filters.vendor !== "all") {
      filtered = filtered.filter((invoice) => invoice.vendorId === filters.vendor);
    }
    
    // Filter by status
    if (filters.status && filters.status !== "All") {
      filtered = filtered.filter((invoice) => invoice.status === filters.status);
    }
    
    // Sort
    if (filters.sortBy === "dueDate") {
      filtered.sort((a, b) => {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        return filters.sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      });
    } else if (filters.sortBy === "amount") {
      filtered.sort((a, b) => {
        return filters.sortDirection === "asc"
          ? a.totalAmount - b.totalAmount
          : b.totalAmount - a.totalAmount;
      });
    }
    
    setFilteredInvoices(filtered);
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    const success = markInvoiceAsPaid(invoiceId);
    if (success) {
      // Update local state after marking as paid
      const updatedInvoices = invoices.map((invoice) =>
        invoice.id === invoiceId ? { ...invoice, status: "Paid" as "Paid" } : invoice
      );
      setInvoices(updatedInvoices);
      setFilteredInvoices(
        filteredInvoices.map((invoice) =>
          invoice.id === invoiceId ? { ...invoice, status: "Paid" as "Paid" } : invoice
        )
      );
      toast.success("Invoice berhasil ditandai sebagai lunas");
    } else {
      toast.error("Gagal mengubah status invoice");
    }
  };

  const handleInvoiceCreated = () => {
    loadData(); // Reload all data after creating a new invoice
  };

  // Count vendors with available orders
  const vendorsWithAvailableOrders = Object.keys(vendorsWithOrders).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Invoice</h1>
          {vendorsWithAvailableOrders > 0 && (
            <p className="text-sm text-muted-foreground">
              {vendorsWithAvailableOrders} vendor memiliki pesanan yang belum dibuatkan invoice
            </p>
          )}
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Buat Invoice Baru
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
      />
      
      <CreateInvoiceDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        vendors={vendors}
        orders={orders}
        onInvoiceCreated={handleInvoiceCreated}
      />
    </div>
  );
}
