
import { Order } from "@/types/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Helper function for saving orders
export const saveOrdersToLocalStorage = (month: string, updatedOrders: Order[]): void => {
  try {
    const normalizedMonth = month.toLowerCase();
    const storageKey = `orders_${normalizedMonth}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedOrders));
  } catch (error) {
    console.error("Error saving orders:", error);
    toast.error("Gagal menyimpan data pesanan");
  }
};

// Pure function to add an order
export const addOrder = (
  currentOrders: Order[],
  orderData: Omit<Order, "id">,
  month: string
): Order[] => {
  const newOrder: Order = {
    id: uuidv4(),
    ...orderData,
  };
  
  const updatedOrders = [...currentOrders, newOrder];
  saveOrdersToLocalStorage(month, updatedOrders);
  
  return updatedOrders;
};

// Pure function to update an order
export const updateOrder = (
  currentOrders: Order[],
  orderId: string,
  data: Partial<Order>,
  month: string
): Order[] => {
  const orderIndex = currentOrders.findIndex((order) => order.id === orderId);
  
  if (orderIndex === -1) {
    return currentOrders;
  }
  
  const updatedOrders = [...currentOrders];
  updatedOrders[orderIndex] = { ...updatedOrders[orderIndex], ...data };
  
  saveOrdersToLocalStorage(month, updatedOrders);
  
  return updatedOrders;
};

// Pure function to delete an order
export const deleteOrder = (
  currentOrders: Order[],
  orderId: string,
  month: string
): Order[] => {
  const updatedOrders = currentOrders.filter((o) => o.id !== orderId);
  saveOrdersToLocalStorage(month, updatedOrders);
  return updatedOrders;
};

// Hook for order actions
export function useOrderActions(month: string) {
  // Order actions with React state updates
  const handleAddOrder = (orders: Order[], setOrders: React.Dispatch<React.SetStateAction<Order[]>>) => {
    return (orderData: Omit<Order, "id">) => {
      const updatedOrders = addOrder(orders, orderData, month);
      setOrders(updatedOrders);
      
      toast.success("Pesanan berhasil ditambahkan");
      return updatedOrders[updatedOrders.length - 1]; // Return the new order
    };
  };
  
  const handleUpdateOrder = (orders: Order[], setOrders: React.Dispatch<React.SetStateAction<Order[]>>, updatingOrders: Set<string>, setUpdatingOrders: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    return (orderId: string, data: Partial<Order>) => {
      setUpdatingOrders((prev) => new Set(prev).add(orderId));
      
      const updatedOrders = updateOrder(orders, orderId, data, month);
      setOrders(updatedOrders);
      
      setTimeout(() => {
        setUpdatingOrders((prev) => {
          const newSet = new Set(prev);
          newSet.delete(orderId);
          return newSet;
        });
      }, 500);
      
      const updatedOrder = updatedOrders.find(order => order.id === orderId);
      return updatedOrder || null;
    };
  };
  
  const handleDeleteOrder = (orders: Order[], setOrders: React.Dispatch<React.SetStateAction<Order[]>>) => {
    return (order: Order) => {
      const updatedOrders = deleteOrder(orders, order.id, month);
      setOrders(updatedOrders);
      toast.success("Pesanan berhasil dihapus");
    };
  };
  
  return {
    handleAddOrder,
    handleUpdateOrder,
    handleDeleteOrder
  };
}
