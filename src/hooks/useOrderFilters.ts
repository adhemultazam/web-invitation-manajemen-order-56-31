
import { useState, useMemo } from "react";
import { Order } from "@/types/types";

interface FilterOptions {
  searchQuery?: string;
  vendorFilter?: string;
  workStatusFilter?: string;
  paymentStatusFilter?: string;
}

export function useOrderFilters(orders: Order[]) {
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVendor, setFilterVendor] = useState<string>("all");
  const [filterWorkStatus, setFilterWorkStatus] = useState<string>("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>("all");
  
  // Apply filters to orders
  const filteredOrders = useMemo(() => {
    return filterOrdersByOptions(orders, {
      searchQuery,
      vendorFilter: filterVendor,
      workStatusFilter: filterWorkStatus,
      paymentStatusFilter: filterPaymentStatus
    });
  }, [orders, searchQuery, filterVendor, filterWorkStatus, filterPaymentStatus]);

  // Reset all filters
  const clearFilters = () => {
    setSearchQuery("");
    setFilterVendor("all");
    setFilterWorkStatus("all");
    setFilterPaymentStatus("all");
  };

  return {
    searchQuery,
    setSearchQuery,
    filterVendor,
    setFilterVendor,
    filterWorkStatus,
    setFilterWorkStatus,
    filterPaymentStatus,
    setFilterPaymentStatus,
    filteredOrders,
    clearFilters
  };
}

// Separate pure function for filtering orders
export function filterOrdersByOptions(orders: Order[], options: FilterOptions): Order[] {
  const { searchQuery = "", vendorFilter = "all", workStatusFilter = "all", paymentStatusFilter = "all" } = options;

  return orders.filter(order => {
    // Search query filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      searchQuery === "" || 
      order.clientName.toLowerCase().includes(searchLower) ||
      (order.clientUrl && order.clientUrl.toLowerCase().includes(searchLower)) ||
      order.id.toLowerCase().includes(searchLower);
    
    // Vendor filter
    const matchesVendor = vendorFilter === "all" || order.vendor === vendorFilter;
    
    // Work status filter
    const matchesWorkStatus = workStatusFilter === "all" || order.workStatus === workStatusFilter;
    
    // Payment status filter
    const matchesPaymentStatus = paymentStatusFilter === "all" || order.paymentStatus === paymentStatusFilter;
    
    return matchesSearch && matchesVendor && matchesWorkStatus && matchesPaymentStatus;
  });
}
