
import { useState, useEffect } from "react";
import { Order } from "@/types/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export const useOrdersData = (selectedYear?: string, selectedMonth?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Map of month names to lowercase for storage keys
  const months = [
    'januari', 'februari', 'maret', 'april', 'mei', 'juni',
    'juli', 'agustus', 'september', 'oktober', 'november', 'desember'
  ];

  useEffect(() => {
    const loadOrdersData = () => {
      setIsLoading(true);

      try {
        const allOrders: Order[] = [];

        // Jika bulan spesifik dipilih, hanya ambil data bulan tersebut
        if (selectedMonth && selectedMonth !== "Semua Data") {
          const monthIndex = months.findIndex(m => m.toLowerCase() === selectedMonth.toLowerCase());
          if (monthIndex !== -1) {
            const monthKey = `orders_${months[monthIndex]}`;
            const monthData = localStorage.getItem(monthKey);
            if (monthData) {
              const parsedData: Order[] = JSON.parse(monthData);

              // Filter berdasarkan tahun jika diperlukan
              const filteredData = selectedYear && selectedYear !== "Semua Data"
                ? parsedData.filter(order => {
                    const orderYear = new Date(order.orderDate).getFullYear().toString();
                    return orderYear === selectedYear;
                  })
                : parsedData;

              allOrders.push(...filteredData);
            }
          }
        } else {
          // Ambil data dari semua bulan
          months.forEach(month => {
            const monthKey = `orders_${month}`;
            const monthData = localStorage.getItem(monthKey);
            if (monthData) {
              const parsedData: Order[] = JSON.parse(monthData);

              // Filter berdasarkan tahun jika diperlukan
              const filteredData = selectedYear && selectedYear !== "Semua Data"
                ? parsedData.filter(order => {
                    const orderYear = new Date(order.orderDate).getFullYear().toString();
                    return orderYear === selectedYear;
                  })
                : parsedData;

              allOrders.push(...filteredData);
            }
          });
        }
        
        console.info(`Loaded ${allOrders.length} orders from ${selectedMonth || "all"} months`);
        setOrders(allOrders);
      } catch (error) {
        console.error("Error loading orders data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrdersData();
  }, [selectedYear, selectedMonth, months]);

  // Helper function to determine which month storage to use
  const getMonthKey = (date: string): string => {
    const orderMonth = new Date(date).getMonth();
    return `orders_${months[orderMonth]}`;
  };

  // Add a new order
  const addOrder = (orderData: Omit<Order, "id">) => {
    try {
      const newOrder: Order = {
        id: uuidv4(),
        ...orderData
      };
      
      // Add to state
      setOrders(prevOrders => [...prevOrders, newOrder]);
      
      // Save to localStorage
      const monthKey = getMonthKey(newOrder.orderDate);
      const existingData = localStorage.getItem(monthKey);
      let monthOrders: Order[] = existingData ? JSON.parse(existingData) : [];
      
      monthOrders.push(newOrder);
      localStorage.setItem(monthKey, JSON.stringify(monthOrders));
      
      toast.success("Pesanan berhasil ditambahkan");
      return newOrder;
    } catch (error) {
      console.error("Error adding order:", error);
      toast.error("Gagal menambahkan pesanan");
      return null;
    }
  };

  // Edit an existing order
  const editOrder = (orderId: string, updatedData: Partial<Order>) => {
    try {
      // Find the order
      const orderToUpdate = orders.find(o => o.id === orderId);
      if (!orderToUpdate) {
        toast.error("Pesanan tidak ditemukan");
        return false;
      }
      
      // Create updated order
      const updatedOrder = { ...orderToUpdate, ...updatedData };
      
      // Update in state
      setOrders(prevOrders => 
        prevOrders.map(o => o.id === orderId ? updatedOrder : o)
      );
      
      // Update in localStorage
      const monthKey = getMonthKey(updatedOrder.orderDate);
      const existingData = localStorage.getItem(monthKey);
      
      if (existingData) {
        let monthOrders: Order[] = JSON.parse(existingData);
        monthOrders = monthOrders.map(o => o.id === orderId ? updatedOrder : o);
        localStorage.setItem(monthKey, JSON.stringify(monthOrders));
      }
      
      toast.success("Pesanan berhasil diperbarui");
      return true;
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Gagal memperbarui pesanan");
      return false;
    }
  };

  // Delete an order
  const deleteOrder = (orderId: string) => {
    try {
      // Find the order to get its month key
      const orderToDelete = orders.find(o => o.id === orderId);
      if (!orderToDelete) {
        toast.error("Pesanan tidak ditemukan");
        return false;
      }
      
      // Remove from state
      setOrders(prevOrders => 
        prevOrders.filter(o => o.id !== orderId)
      );
      
      // Remove from localStorage
      const monthKey = getMonthKey(orderToDelete.orderDate);
      const existingData = localStorage.getItem(monthKey);
      
      if (existingData) {
        let monthOrders: Order[] = JSON.parse(existingData);
        monthOrders = monthOrders.filter(o => o.id !== orderId);
        localStorage.setItem(monthKey, JSON.stringify(monthOrders));
      }
      
      toast.success("Pesanan berhasil dihapus");
      return true;
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Gagal menghapus pesanan");
      return false;
    }
  };

  return { 
    orders, 
    isLoading,
    addOrder,
    editOrder,
    deleteOrder
  };
};
