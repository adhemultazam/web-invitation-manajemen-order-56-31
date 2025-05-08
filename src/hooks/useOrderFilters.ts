
import { useState, useMemo } from "react";
import { Order } from "@/types/types";

export function useOrderFilters(orders: Order[]) {
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVendor, setFilterVendor] = useState<string>("all");
  const [filterWorkStatus, setFilterWorkStatus] = useState<string>("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>("all");
  
  // Apply filters to orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search query filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        searchQuery === "" || 
        order.clientName.toLowerCase().includes(searchLower) ||
        (order.clientUrl && order.clientUrl.toLowerCase().includes(searchLower)) ||
        order.id.toLowerCase().includes(searchLower);
      
      // Vendor filter
      const matchesVendor = filterVendor === "all" || order.vendor === filterVendor;
      
      // Work status filter
      const matchesWorkStatus = filterWorkStatus === "all" || order.workStatus === filterWorkStatus;
      
      // Payment status filter
      const matchesPaymentStatus = filterPaymentStatus === "all" || order.paymentStatus === filterPaymentStatus;
      
      return matchesSearch && matchesVendor && matchesWorkStatus && matchesPaymentStatus;
    });
  }, [orders, searchQuery, filterVendor, filterWorkStatus, filterPaymentStatus]);

  return {
    searchQuery,
    setSearchQuery,
    filterVendor,
    setFilterVendor,
    filterWorkStatus,
    setFilterWorkStatus,
    filterPaymentStatus,
    setFilterPaymentStatus,
    filteredOrders
  };
}
