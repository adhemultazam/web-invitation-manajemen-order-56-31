
import { useState } from "react";
import { Order } from "@/types/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function useOrderActions(month: string) {
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
  const handleAddOrder = (orders: Order[], setOrders: React.Dispatch<React.SetStateAction<Order[]>>) => {
    return (orderData: Omit<Order, "id">) => {
      const newOrder: Order = {
        id: uuidv4(),
        ...orderData,
      };
      
      const updatedOrders = [...orders, newOrder];
      setOrders(updatedOrders);
      saveOrders(updatedOrders);
      
      toast.success("Pesanan berhasil ditambahkan");
      return newOrder;
    };
  };
  
  const handleUpdateOrder = (orders: Order[], setOrders: React.Dispatch<React.SetStateAction<Order[]>>, updatingOrders: Set<string>, setUpdatingOrders: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    return (orderId: string, data: Partial<Order>) => {
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
        
        return updatedOrders[orderIndex];
      }
      return null;
    };
  };
  
  const handleDeleteOrder = (orders: Order[], setOrders: React.Dispatch<React.SetStateAction<Order[]>>) => {
    return (order: Order) => {
      if (confirm(`Hapus pesanan "${order.clientName}"?`)) {
        const updatedOrders = orders.filter((o) => o.id !== order.id);
        setOrders(updatedOrders);
        saveOrders(updatedOrders);
        toast.success("Pesanan berhasil dihapus");
      }
    };
  };
  
  return {
    saveOrders,
    handleAddOrder,
    handleUpdateOrder,
    handleDeleteOrder
  };
}
