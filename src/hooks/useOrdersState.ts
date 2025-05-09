
import { useState, useEffect } from "react";
import { Order } from "@/types/types";
import { toast } from "sonner";

export function useOrdersState(month: string | undefined) {
  // State for orders
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Load orders from localStorage
  useEffect(() => {
    const loadOrders = () => {
      try {
        // If month is undefined, load orders from all months
        if (!month) {
          const allOrders: Order[] = [];
          const months = [
            'januari', 'februari', 'maret', 'april', 'mei', 'juni',
            'juli', 'agustus', 'september', 'oktober', 'november', 'desember'
          ];
          
          // Load from all monthly storage keys
          months.forEach(monthKey => {
            const storageKey = `orders_${monthKey}`;
            const storedMonthOrders = localStorage.getItem(storageKey);
            
            if (storedMonthOrders) {
              const parsedMonthOrders = JSON.parse(storedMonthOrders);
              allOrders.push(...parsedMonthOrders);
            }
          });
          
          setOrders(allOrders);
        }
        // Load orders for specific month
        else {
          const normalizedMonth = month.toLowerCase();
          const storageKey = `orders_${normalizedMonth}`;
          const storedOrders = localStorage.getItem(storageKey);
          
          if (storedOrders) {
            const parsedOrders = JSON.parse(storedOrders);
            setOrders(parsedOrders);
          } else {
            setOrders([]);
          }
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
