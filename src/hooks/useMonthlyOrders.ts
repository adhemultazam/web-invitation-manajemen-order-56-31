
import { useState, useEffect } from "react";
import { Order, Vendor, WorkStatus, Theme, Package, Addon } from "@/types/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export const useMonthlyOrders = (month: string) => {
  // State for orders and UI
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | null>(null);
  const [vendorFilter, setVendorFilter] = useState<string | null>(null);
  
  // State for add/edit modals
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  
  // State for UI updates
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());
  const [vendorColors, setVendorColors] = useState<Record<string, string>>({});
  const [addonStyles, setAddonStyles] = useState<Record<string, { color: string }>>({});
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Load orders from localStorage
  useEffect(() => {
    const loadOrders = () => {
      try {
        const normalizedMonth = month.toLowerCase();
        const storageKey = `orders_${normalizedMonth}`;
        const storedOrders = localStorage.getItem(storageKey);
        
        if (storedOrders) {
          const parsedOrders = JSON.parse(storedOrders);
          setOrders(parsedOrders);
          setFilteredOrders(parsedOrders);
        } else {
          setOrders([]);
          setFilteredOrders([]);
        }
      } catch (error) {
        console.error("Error loading orders:", error);
        toast.error("Gagal memuat data pesanan");
      }
    };
    
    loadOrders();
  }, [month]);

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

  // Save orders to localStorage
  const saveOrders = (updatedOrders: Order[]) => {
    try {
      const normalizedMonth = month.toLowerCase();
      const storageKey = `orders_${normalizedMonth}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedOrders));
    } catch (error) {
      console.error("Error saving orders:", error);
      toast.error("Gagal menyimpan data pesanan");
    }
  };

  // Order actions
  const handleAddOrder = (orderData: Omit<Order, "id">) => {
    const newOrder: Order = {
      id: uuidv4(),
      ...orderData,
    };
    
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    saveOrders(updatedOrders);
    
    setIsAddOrderOpen(false);
    toast.success("Pesanan berhasil ditambahkan");
  };
  
  const handleUpdateOrder = (orderId: string, data: Partial<Order>) => {
    const orderIndex = orders.findIndex((order) => order.id === orderId);
    
    if (orderIndex !== -1) {
      setUpdatingOrders((prev) => new Set(prev).add(orderId));
      
      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = { ...updatedOrders[orderIndex], ...data };
      
      setOrders(updatedOrders);
      saveOrders(updatedOrders);
      
      setTimeout(() => {
        setUpdatingOrders((prev) => {
          const newSet = new Set(prev);
          newSet.delete(orderId);
          return newSet;
        });
      }, 500);
    }
  };
  
  const handleDeleteOrder = (order: Order) => {
    if (confirm(`Hapus pesanan "${order.clientName}"?`)) {
      const updatedOrders = orders.filter((o) => o.id !== order.id);
      setOrders(updatedOrders);
      saveOrders(updatedOrders);
      toast.success("Pesanan berhasil dihapus");
    }
  };
  
  // Event handlers
  const togglePaymentStatus = (order: Order) => {
    const newStatus = order.paymentStatus === "Lunas" ? "Pending" : "Lunas";
    handleUpdateOrder(order.id, { paymentStatus: newStatus });
  };
  
  const handleWorkStatusChange = (orderId: string, status: string) => {
    handleUpdateOrder(orderId, { workStatus: status });
  };
  
  const handleVendorChange = (orderId: string, vendor: string) => {
    handleUpdateOrder(orderId, { vendor });
  };
  
  const handleThemeChange = (orderId: string, theme: string) => {
    handleUpdateOrder(orderId, { theme });
  };
  
  const handlePackageChange = (orderId: string, pkg: string) => {
    // Find the package to get its price
    const packages = localStorage.getItem("packages");
    if (packages) {
      const parsedPackages = JSON.parse(packages);
      const packageObj = parsedPackages.find((p: Package) => p.name === pkg);
      
      if (packageObj) {
        handleUpdateOrder(orderId, { 
          package: pkg,
          paymentAmount: packageObj.price 
        });
      } else {
        handleUpdateOrder(orderId, { package: pkg });
      }
    } else {
      handleUpdateOrder(orderId, { package: pkg });
    }
  };
  
  const handleViewOrderDetail = (order: Order) => {
    setViewingOrder(order);
    toast.info(`Melihat detail pesanan: ${order.clientName}`);
  };
  
  const handleOpenEditDialog = (order: Order) => {
    setEditingOrder(order);
  };
  
  const handleSaveOrder = (orderId: string, data: Partial<Order>) => {
    handleUpdateOrder(orderId, data);
    toast.success("Pesanan berhasil diperbarui");
  };
  
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
    orders,
    filteredOrders,
    isAddOrderOpen,
    setIsAddOrderOpen,
    editingOrder,
    setEditingOrder,
    updatingOrders,
    vendorColors,
    addonStyles,
    handleAddOrder,
    handleUpdateOrder,
    handleDeleteOrder,
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
  };
};
