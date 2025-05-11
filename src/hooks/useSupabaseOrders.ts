
import { useState, useEffect } from "react";
import { Order } from "@/types/types";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export function useSupabaseOrders(selectedYear?: string, selectedMonth?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Start building query
      let query = supabase.from('orders').select('*');

      // Apply month filter if specified
      if (selectedMonth && selectedMonth !== "Semua Data") {
        const normalizedMonth = selectedMonth.toLowerCase();
        query = query.eq('month', normalizedMonth);
      }

      // Get the results
      const { data, error } = await query;

      if (error) throw error;

      // Filter by year if needed (since year is part of the event_date)
      let filteredOrders = data || [];

      if (selectedYear && selectedYear !== "Semua Data") {
        filteredOrders = filteredOrders.filter(order => {
          if (!order.eventDate) return false;
          const orderYear = new Date(order.eventDate).getFullYear().toString();
          return orderYear === selectedYear;
        });
      }

      // Calculate countdown days for each order
      const ordersWithCountdown = filteredOrders.map(order => {
        let countdownDays = null;
        
        if (order.eventDate) {
          try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const eventDate = new Date(order.eventDate);
            countdownDays = differenceInDays(eventDate, today);
          } catch (err) {
            console.error("Error calculating countdown days:", err);
          }
        }
        
        return {
          ...order,
          countdownDays
        };
      });

      setOrders(ordersWithCountdown);
      console.info(`Loaded ${ordersWithCountdown.length} orders from Supabase`);
    } catch (err) {
      console.error("Error fetching orders from Supabase:", err);
      setError(err.message || "Failed to fetch orders");
      toast.error("Error loading orders", {
        description: err.message || "Please try again"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedYear, selectedMonth]);

  const addOrder = async (orderData: Omit<Order, "id">) => {
    try {
      // Make sure the month is set based on order date
      const orderMonth = new Date(orderData.orderDate).toLocaleString('id-ID', { month: 'long' }).toLowerCase();
      
      // Calculate countdown days
      let countdownDays = null;
      if (orderData.eventDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(orderData.eventDate);
        countdownDays = differenceInDays(eventDate, today);
      }
      
      // Type-safe approach: create an object that explicitly includes the month field
      const orderWithMonth = {
        ...orderData,
        month: orderMonth,
        countdownDays
      } as Omit<Order, "id"> & { month: string };
      
      // Insert the order with the month property
      const { data, error } = await supabase
        .from('orders')
        .insert(orderWithMonth)
        .select();

      if (error) throw error;

      // Update the local state
      setOrders(prev => [...prev, data[0]]);
      toast.success("Order added successfully");
      return data[0];
    } catch (err) {
      console.error("Error adding order:", err);
      toast.error("Failed to add order", {
        description: err.message || "Please try again"
      });
      return null;
    }
  };

  const editOrder = async (orderId: string, updatedData: Partial<Order>) => {
    try {
      // If order date changed, update the month
      let updateData = { ...updatedData };
      if (updatedData.orderDate) {
        updateData.month = new Date(updatedData.orderDate).toLocaleString('id-ID', { month: 'long' }).toLowerCase();
      }

      // Recalculate countdown days if event date changed
      if (updatedData.eventDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(updatedData.eventDate);
        updateData.countdownDays = differenceInDays(eventDate, today);
      }

      // Update in Supabase
      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select();

      if (error) throw error;

      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, ...updateData } : order
      ));

      toast.success("Order updated successfully");
      return true;
    } catch (err) {
      console.error("Error updating order:", err);
      toast.error("Failed to update order", {
        description: err.message || "Please try again"
      });
      return false;
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOrders(prev => prev.filter(order => order.id !== orderId));
      toast.success("Order deleted successfully");
      return true;
    } catch (err) {
      console.error("Error deleting order:", err);
      toast.error("Failed to delete order", {
        description: err.message || "Please try again"
      });
      return false;
    }
  };

  return {
    orders,
    isLoading,
    error,
    addOrder,
    editOrder,
    deleteOrder,
    refreshOrders: fetchOrders
  };
}
