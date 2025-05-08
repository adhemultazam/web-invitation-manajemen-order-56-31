
import { useState } from "react";
import { Order, Package } from "@/types/types";

export function useOrderUpdates(
  editOrderFn: (orderId: string, data: Partial<Order>) => void,
) {
  // Track orders being updated for UI feedback
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());

  const handleWorkStatusChange = (orderId: string, status: string) => {
    setUpdatingOrders(prev => new Set(prev).add(orderId));
    
    editOrderFn(orderId, { workStatus: status });
    
    // Remove visual indicator after a delay
    setTimeout(() => {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }, 500);
  };
  
  const handleVendorChange = (orderId: string, vendor: string) => {
    setUpdatingOrders(prev => new Set(prev).add(orderId));
    
    editOrderFn(orderId, { vendor });
    
    setTimeout(() => {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }, 500);
  };
  
  const handleThemeChange = (orderId: string, theme: string) => {
    setUpdatingOrders(prev => new Set(prev).add(orderId));
    
    editOrderFn(orderId, { theme });
    
    setTimeout(() => {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }, 500);
  };
  
  // Modified handlePackageChange to not require packages as a parameter
  const handlePackageChange = (orderId: string, pkg: string) => {
    setUpdatingOrders(prev => new Set(prev).add(orderId));
    
    // Try to find package price from localStorage
    try {
      const packagesStr = localStorage.getItem('packages');
      if (packagesStr) {
        const packages = JSON.parse(packagesStr);
        const packageObj = packages.find((p: Package) => p.name === pkg);
        
        if (packageObj) {
          editOrderFn(orderId, { 
            package: pkg,
            paymentAmount: typeof packageObj.price === 'number' ? packageObj.price : 0
          });
        } else {
          editOrderFn(orderId, { package: pkg });
        }
      } else {
        editOrderFn(orderId, { package: pkg });
      }
    } catch (error) {
      console.error("Error parsing packages from localStorage:", error);
      editOrderFn(orderId, { package: pkg });
    }
    
    setTimeout(() => {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }, 500);
  };
  
  const togglePaymentStatus = (order: Order) => {
    setUpdatingOrders(prev => new Set(prev).add(order.id));
    
    const newStatus = order.paymentStatus === "Lunas" ? "Pending" : "Lunas";
    editOrderFn(order.id, { paymentStatus: newStatus });
    
    setTimeout(() => {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(order.id);
        return newSet;
      });
    }, 500);
  };

  return {
    updatingOrders,
    handleWorkStatusChange,
    handleVendorChange,
    handleThemeChange,
    handlePackageChange,
    togglePaymentStatus
  };
}
