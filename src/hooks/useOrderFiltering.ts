
import { useState, useEffect } from "react";
import { Order } from "@/types/types";

export function useOrderFiltering(orders: Order[]) {
  // State for filtering
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | null>(null);
  const [vendorFilter, setVendorFilter] = useState<string | null>(null);

  // Apply filters when search query or filters change
  useEffect(() => {
    const applyFilters = () => {
      let result = [...orders];
      
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (order) =>
            order.clientName.toLowerCase().includes(query) ||
            order.customerName.toLowerCase().includes(query) ||
            order.id.toLowerCase().includes(query)
        );
      }
      
      // Apply status filter
      if (statusFilter) {
        result = result.filter((order) => order.workStatus === statusFilter);
      }
      
      // Apply payment status filter
      if (paymentStatusFilter) {
        result = result.filter((order) => order.paymentStatus === paymentStatusFilter);
      }
      
      // Apply vendor filter
      if (vendorFilter) {
        result = result.filter((order) => order.vendor === vendorFilter);
      }
      
      setFilteredOrders(result);
    };
    
    applyFilters();
  }, [orders, searchQuery, statusFilter, paymentStatusFilter, vendorFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter(null);
    setPaymentStatusFilter(null);
    setVendorFilter(null);
  };
  
  // Handle filter changes from OrderFilter component
  const handleFilterChange = (filters: {
    search: string;
    workStatus: string;
    paymentStatus: string;
    vendor: string;
  }) => {
    setSearchQuery(filters.search);
    setStatusFilter(filters.workStatus || null);
    setPaymentStatusFilter(filters.paymentStatus || null);
    setVendorFilter(filters.vendor || null);
  };

  return {
    filteredOrders,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    vendorFilter,
    setVendorFilter,
    clearFilters,
    handleFilterChange
  };
}
