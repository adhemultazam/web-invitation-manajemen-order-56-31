import { useState, useEffect } from "react";
import { Order } from "@/types/types";
import { useOrdersState } from "./useOrdersState";
import { useOrderFiltering } from "./useOrderFiltering";
import { useOrderActions } from "./useOrderActions";
import { useOrderStyles } from "./useOrderStyles";

export const useMonthlyOrders = (month: string) => {
  // Load and manage order state
  const { orders, setOrders } = useOrdersState(month !== "Semua Data" ? month : undefined);
  
  // Filtering functionality
  const { 
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
  } = useOrderFiltering(orders);
  
  // State for add/edit modals
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  
  // State for UI updates
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  
  // Order styling
  const { vendorColors, addonStyles, updateVendorColors, updateAddonStyles } = useOrderStyles();

  // Order CRUD actions
  const { handleAddOrder, handleUpdateOrder, handleDeleteOrder } = useOrderActions(month !== "Semua Data" ? month : undefined);
  
  // Event handlers for order updates
  const togglePaymentStatus = (order: Order) => {
    const newStatus = order.paymentStatus === "Lunas" ? "Pending" : "Lunas";
    handleUpdateOrder(orders, setOrders, updatingOrders, setUpdatingOrders)(order.id, { paymentStatus: newStatus });
  };
  
  const handleWorkStatusChange = (orderId: string, status: string) => {
    handleUpdateOrder(orders, setOrders, updatingOrders, setUpdatingOrders)(orderId, { workStatus: status });
  };
  
  const handleVendorChange = (orderId: string, vendor: string) => {
    handleUpdateOrder(orders, setOrders, updatingOrders, setUpdatingOrders)(orderId, { vendor });
  };
  
  const handleThemeChange = (orderId: string, theme: string) => {
    handleUpdateOrder(orders, setOrders, updatingOrders, setUpdatingOrders)(orderId, { theme });
  };
  
  const handlePackageChange = (orderId: string, pkg: string) => {
    // Find the package to get its price
    const packages = localStorage.getItem("packages");
    if (packages) {
      const parsedPackages = JSON.parse(packages);
      const packageObj = parsedPackages.find((p: any) => p.name === pkg);
      
      if (packageObj) {
        // Ensure price is treated as a number
        const packagePrice = typeof packageObj.price === 'string' 
          ? parseFloat(packageObj.price.replace(/[^\d.-]/g, ''))
          : packageObj.price;
          
        handleUpdateOrder(orders, setOrders, updatingOrders, setUpdatingOrders)(orderId, { 
          package: pkg,
          paymentAmount: packagePrice 
        });
      } else {
        handleUpdateOrder(orders, setOrders, updatingOrders, setUpdatingOrders)(orderId, { package: pkg });
      }
    } else {
      handleUpdateOrder(orders, setOrders, updatingOrders, setUpdatingOrders)(orderId, { package: pkg });
    }
  };
  
  const handleViewOrderDetail = (order: Order) => {
    setViewingOrder(order);
  };
  
  const handleOpenEditDialog = (order: Order) => {
    setEditingOrder(order);
  };
  
  const handleSaveOrder = (orderId: string, data: Partial<Order>) => {
    // Ensure paymentAmount is a number if provided in data
    if (data.paymentAmount !== undefined) {
      // Fix: Explicitly cast to string or number before checking type
      const paymentAmount = data.paymentAmount as string | number;
      
      if (typeof paymentAmount === 'string') {
        data.paymentAmount = parseFloat(paymentAmount.replace(/[^\d.-]/g, ''));
      }
    }
    
    handleUpdateOrder(orders, setOrders, updatingOrders, setUpdatingOrders)(orderId, data);
  };

  return {
    // Order data
    orders,
    filteredOrders,
    // Modal state
    isAddOrderOpen,
    setIsAddOrderOpen,
    editingOrder,
    setEditingOrder,
    // UI state
    updatingOrders,
    vendorColors,
    addonStyles,
    // Filter state
    searchQuery,
    statusFilter,
    paymentStatusFilter,
    vendorFilter,
    // Actions
    handleAddOrder: handleAddOrder(orders, setOrders),
    handleUpdateOrder: handleUpdateOrder(orders, setOrders, updatingOrders, setUpdatingOrders),
    handleDeleteOrder: handleDeleteOrder(orders, setOrders),
    togglePaymentStatus,
    handleWorkStatusChange,
    handleVendorChange,
    handleThemeChange,
    handlePackageChange,
    handleViewOrderDetail,
    handleOpenEditDialog,
    handleSaveOrder,
    handleFilterChange,
    clearFilters,
    // Style updates
    updateVendorColors,
    updateAddonStyles
  };
};
