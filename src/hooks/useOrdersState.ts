
import { useState, useEffect } from "react";
import { Order } from "@/types/types";
import { toast } from "sonner";

export function useOrdersState(month: string) {
  // State for orders
  const [orders, setOrders] = useState<Order[]>([]);
  
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
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error loading orders:", error);
        toast.error("Gagal memuat data pesanan");
      }
    };
    
    loadOrders();
  }, [month]);

  return {
    orders,
    setOrders
  };
}
